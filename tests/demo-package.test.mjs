import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { DatabaseSync } from "node:sqlite";
import { spawnSync } from "node:child_process";

const root = path.resolve(import.meta.dirname, "..");
const zipFile = path.join(root, "assets/downloads/teknikel-demo-verileri.zip");
const archiveRoot = "yardimci-asistan-demo-d-teknikel/";

test("Teknikel demo ZIP is a safe, downloadable current backup-v2 package", () => {
  const page = fs.readFileSync(path.join(root, "demo-icerik/index.php"), "utf8");
  const footer = fs.readFileSync(path.join(root, "inc/layout.php"), "utf8");
  assert.match(footer, /href="\/demo-icerik\//);
  assert.match(page, /href="\/assets\/downloads\/teknikel-demo-verileri\.zip"/);
  assert.match(page, /Web sitesi verileri ve kullanıcı giriş hesapları otomatik oluşturulmaz/);
  assert.ok(fs.statSync(zipFile).size > 5_000_000);
  const listing = spawnSync("unzip", ["-Z1", zipFile], { encoding: "utf8" });
  assert.equal(listing.status, 0, listing.stderr);
  const entries = listing.stdout.split("\n").filter(Boolean);
  assert.ok(entries.every(name => name.startsWith(archiveRoot) && !name.includes("..") && !path.isAbsolute(name)));
  for (const name of ["backup.json", "yardimci-asistan.sqlite", "assets/TEKNIKEL_SOURCE_MANIFEST.json"]) {
    assert.ok(entries.includes(archiveRoot + name), name);
  }
  assert.equal(entries.filter(name => /^yardimci-asistan-demo-d-teknikel\/assets\/products\/[^/]+\/[^/]+\.(?:png|jpe?g|webp)$/i.test(name)).length, 68);
  const backup = spawnSync("unzip", ["-p", zipFile, archiveRoot + "backup.json"], { encoding: "utf8" });
  assert.equal(backup.status, 0);
  const manifest = JSON.parse(backup.stdout);
  assert.equal(manifest.format, "yardimci-asistan-backup-v2");
  assert.equal(manifest.databaseFile, "yardimci-asistan.sqlite");
  assert.equal(manifest.assets.fileCount, entries.filter(name => name.startsWith(archiveRoot + "assets/") && !name.endsWith("/")).length);
  // Never publish an example backup with a carrier enabled and no credentials:
  // that state blocks unrelated Settings saves after import.
  const sqlite = spawnSync("unzip", ["-p", zipFile, archiveRoot + "yardimci-asistan.sqlite"], { maxBuffer: 16 * 1024 * 1024 });
  assert.equal(sqlite.status, 0, sqlite.stderr?.toString());
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "teknikel-zip-assert-"));
  try {
    const dbPath = path.join(scratch, "backup.sqlite");
    fs.writeFileSync(dbPath, sqlite.stdout);
    const db = new DatabaseSync(dbPath, { readOnly: true });
    try {
      const shipping = db.prepare("SELECT online_sales_delivery_enabled AS delivery, online_sales_pickup_enabled AS pickup, online_sales_shipping_enabled AS shipping FROM settings").get();
      assert.deepEqual({ ...shipping }, { delivery: 1, pickup: 1, shipping: 0 });
      assert.equal(Object.values(db.prepare("PRAGMA quick_check").get())[0], "ok");
    } finally { db.close(); }
  } finally { fs.rmSync(scratch, { recursive: true, force: true }); }
  const verify = spawnSync("unzip", ["-tqq", zipFile], { encoding: "utf8" });
  assert.equal(verify.status, 0, verify.stderr);
});
