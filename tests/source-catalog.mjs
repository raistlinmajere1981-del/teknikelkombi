import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {existsSync} from 'node:fs';

const sha = value => createHash('sha256').update(value).digest('hex');
export async function validateSourceCatalog(catalog) {
  assert.equal(catalog.version,1);
  assert.equal(catalog.id,'teknikel-site');
  assert.equal(catalog.source_language,'tr');
  assert.ok(catalog.entries && !Array.isArray(catalog.entries));
  const entries = Object.entries(catalog.entries);
  assert.ok(entries.length > 0 && entries.length <= 2048);
  assert.ok(Buffer.byteLength(JSON.stringify(catalog)) <= 512 * 1024);
  for (const [key,entry] of entries) {
    assert.equal(typeof entry.text,'string');
    assert.ok(entry.text.trim() && entry.text.length <= 12000);
    assert.doesNotMatch(entry.text,/[<>\u0000-\u0008]/u);
    assert.equal(entry.hash,sha(entry.text));
    // Canonical site catalogs use stable semantic keys (e.g. nav.main), not legacy phrase hashes.
    assert.match(key, /^[A-Za-z0-9_.-]{1,120}$/);
    assert.notEqual(key, '_meta');
  }
  entries.sort(([a],[b]) => a < b ? -1 : a > b ? 1 : 0);
  assert.equal(catalog.revision,sha(entries.map(([key,entry]) => `${key}:${entry.hash}\n`).join('')));
  // Exercise the actual Desktop importer when working beside its owning repo.
  const desktop = new URL('../../YardimciAsistan/apps/desktop-app/electron/public-site-catalog.ts',import.meta.url);
  if (existsSync(desktop)) {
    const {validateSiteCatalog} = await import(desktop.href);
    assert.deepEqual(validateSiteCatalog(catalog),catalog);
    console.log('PASS Desktop validateSiteCatalog');
  }
  return catalog;
}
