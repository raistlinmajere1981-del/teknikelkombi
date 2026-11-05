#!/usr/bin/env bash
# Site-only package. --dry-run is entirely local; this script never syncs the API.
set -Eeuo pipefail

[[ $# -eq 1 ]] || { echo "Exactly one explicit mode is required." >&2; exit 2; }
case "${1:-}" in
  --dry-run) dry=true ;;
  --yes) dry=false ;;
  *) echo 'Usage: bash scripts/deploy-site.sh --dry-run | --yes' >&2; exit 2 ;;
esac
repo="$(cd -- "$(dirname -- "$0")/.." && pwd)"
cd "$repo"
node scripts/sync-public-assets.mjs --check
node tests/canonical-cutover.test.mjs
php tests/canonical-entry.php
unzip -tqq assets/downloads/teknikel-demo-verileri.zip
package="$(node scripts/package-site.mjs --stage)"
while IFS= read -r -d '' file; do php -l "$file" >/dev/null; done < <(find "$package" -type f -name '*.php' -print0)
if [[ "$dry" == true ]]; then
  echo "LOCAL_ONLY_DRY_RUN_PASS $package (no remote reads or writes; browser/HTTPS acceptance still required)"
  exit 0
fi
# Presentation-only activation. The remote must already be free of retired legacy
# code, with a plan exactly matching the locally hashed retirement manifest.
# Nothing in yardimci-asistan/ is changed by this script.
host='yardimciasistantoptanci@ssh-yardimciasistantoptanci.alwaysdata.net'
root='/home/yardimciasistantoptanci/www'
backup='/home/yardimciasistantoptanci/backups'
url='https://yardimciasistantoptanci.alwaysdata.net'
ssh_opts=(-o BatchMode=yes -o ConnectTimeout=12 -o StrictHostKeyChecking=yes)
ssh_rsync='ssh -o BatchMode=yes -o ConnectTimeout=12 -o StrictHostKeyChecking=yes'
for bin in ssh rsync curl; do command -v "$bin" >/dev/null; done
# Strict independent equality to the current central product policy; no fixed version.
version="$(curl --proto '=https' -fsS --max-time 15 "$url/yardimci-asistan/api/version.php" | node ../YardimciAsistan/scripts/site-release-target.mjs --verify-backend)"
stamp="$(date -u +%Y%m%dT%H%M%SZ)-$$"
retired_sha="$(sha256sum "$package/retired-paths.json" | cut -d' ' -f1)"
ssh "${ssh_opts[@]}" "$host" bash -s -- "$root" "$backup" "$stamp" "$retired_sha" 'teknikel-site' <<'REMOTE_PREP'
set -Eeuo pipefail
root="$1"; backup="$2"; stamp="$3"; retired_sha="$4"; identity="$5"
[[ "$retired_sha" =~ ^[a-f0-9]{64}$ ]]
[[ -f "$root/retired-paths.json" && ! -L "$root/retired-paths.json" ]]
[[ "$(sha256sum "$root/retired-paths.json" | cut -d' ' -f1)" == "$retired_sha" ]]
php -r '
$plan=json_decode(file_get_contents($argv[1]),true,512,JSON_THROW_ON_ERROR);
if(($plan["format"]??null)!==1 || ($plan["identity"]??"")!==$argv[2]) exit(2);
$root=$argv[3];
foreach(array_keys($plan["files"]) as $path) {
  if(file_exists("$root/$path") || is_link("$root/$path")) {
    fwrite(STDERR,"Retired legacy path still present: $path\n");exit(3);
  }
}' "$root/retired-paths.json" "$identity" "$root"
for path in /home/yardimciasistantoptanci "$root" "$backup" "$root/yardimci-asistan"; do [[ -d "$path" && ! -L "$path" ]]; done
[[ "$stamp" =~ ^20[0-9]{6}T[0-9]{6}Z-[0-9]+$ ]]
[[ -f "$root/index.php" && ! -L "$root/index.php" && -f "$root/.htaccess" && ! -L "$root/.htaccess" ]]
if grep -Fq 'teknikel-site' "$root/index.php"; then
  grep -Fq '# teknikel-site' "$root/.htaccess"
else
  [[ "$(sha256sum "$root/index.php" | cut -d' ' -f1)" == 'a290a964d3399e51fdcf033c05bae7760bf8878396ee57a40bcd95375a856fea' ]]
  [[ "$(sha256sum "$root/.htaccess" | cut -d' ' -f1)" == '9fc4c75b0fd55205d5ce7a34dc5d803bfd5ed92aa4eeb8730758d3c977c0a0b0' ]]
  grep -Fq 'https://yardimciasistantoptanci.alwaysdata.net' "$root/site/config.php"
fi
# Require the current account recovery endpoint before changing presentation.
[[ -f "$root/yardimci-asistan/api/account/receipt.php" ]]
mkdir -m 700 "$root/.teknikel-stage-$stamp"
REMOTE_PREP
rsync -az --chmod=D755,F644 -e "$ssh_rsync" "$package/" "$host:$root/.teknikel-stage-$stamp/"
ssh "${ssh_opts[@]}" "$host" bash -s -- "$root" "$backup" "$stamp" <<'REMOTE_ACTIVATE'
set -Eeuo pipefail
root="$1"; backup="$2"; stamp="$3"; stage="$root/.teknikel-stage-$stamp"; slot="$backup/teknikel-site-$stamp"
cd "$stage"
sha256sum -c SHA256SUMS >/dev/null
while IFS= read -r -d '' file; do php -l "$file" >/dev/null; done < <(find . -type f -name '*.php' -print0)
# Refuse symlink ancestors, unknown paths, API/private files and foreign manifests.
php -r '
$target=json_decode(file_get_contents("canonical/template-manifest.json"),true,512,JSON_THROW_ON_ERROR);
$r=json_decode(file_get_contents("teknikel-release.json"),true,512,JSON_THROW_ON_ERROR);
if(($r["identity"]??null)!=="teknikel-site" || ($r["template_version"]??null)!==($target["template_version"]??null)) exit(2);
$root=$argv[1];
foreach(array_keys($r["files"]) as $p) {
 if($p!=="retired-paths.json" && (!preg_match("~^(?:index\\.php|\\.htaccess|canonical/(?:README\\.md|template-manifest\\.json|public/|core/|site/|locales/tr\\.json|tools/)|assets/(?:core/|site/|vendor/effect-engine/|downloads/teknikel-demo-verileri\\.zip)|(?:magaza|katalog|urun|sepet|hesabim|bayi|markalar|galeri|odalar(?:/oda)?|restoran|qr-menu|iletisim|yorumlar|duyurular|hakkimizda|demo-icerik)/index\\.php)~D",$p) || str_contains($p,".."))) exit(3);
 $cursor=$root; foreach(explode("/",$p) as $part) { $cursor.="/".$part; if(is_link($cursor)) exit(4); }
}
$m="$root/canonical/template-manifest.json";
if(is_dir("$root/canonical")) {
 if(!is_file($m)) exit(5); $old=json_decode(file_get_contents($m),true);
 if(($old["format"]??null)!==1 || !preg_match("~^\\d+\\.\\d+\\.\\d+$~D",$old["template_version"]??"")) exit(6);
 foreach($old["common"] as $p=>$h) if(!is_file("$root/canonical/$p") || hash_file("sha256","$root/canonical/$p")!==$h) exit(7);
}
' "$root"
mkdir -m 700 "$slot"
# Preserve complete previous namespace trees; no deletion or pruning of backups.
for name in canonical assets/core assets/site assets/vendor/effect-engine; do
  if [[ -e "$root/$name" ]]; then mkdir -p "$slot/$(dirname "$name")"; cp -a "$root/$name" "$slot/$name"; fi
done
# Per-file atomic activation, entry and access policy last. No global --delete.
# Full cross-directory atomicity/automatic health rollback is not claimed.
while IFS= read -r line; do
  path="${line#*  }"
  case "$path" in index.php|.htaccess|teknikel-release.json) continue ;; esac
  mkdir -p "$root/$(dirname "$path")"
  if [[ -f "$root/$path" ]]; then mkdir -p "$slot/$(dirname "$path")"; cp -p "$root/$path" "$slot/$path"; fi
  mv -f "$stage/$path" "$root/$path"
done < SHA256SUMS
cp -p "$root/index.php" "$root/.htaccess" "$slot/"
mv -f "$stage/.htaccess" "$root/.htaccess"
mv -f "$stage/index.php" "$root/index.php"
mv -f "$stage/teknikel-release.json" "$root/teknikel-release.json"
printf 'Backup: %s\n' "$slot"
REMOTE_ACTIVATE
# Publication-closed pages correctly return 404; static/source/root must succeed.
for path in / '/?resource=translation-source' /assets/core/site.mjs /assets/core/widget.js /assets/site/theme.css /assets/site/brand/logo.webp /assets/vendor/effect-engine/provenance.json /demo-icerik/; do
  curl -fLsS --max-time 20 "$url$path" >/dev/null
done
for path in /magaza/ /urun/ /sepet/ /hesabim/ /galeri/ /odalar/ /restoran/ /qr-menu/ /iletisim/ /yorumlar/ /duyurular/ /hakkimizda/; do
  status="$(curl -LsS --max-time 20 -o /dev/null -w '%{http_code}' "$url$path")"
  [[ "$status" == 200 || "$status" == 404 ]] || { echo "Health failed HTTP $status: $path (backup retained)" >&2; exit 1; }
done
for path in /canonical/site/config.php /assets/assistant/widget.js /inc/layout.php; do
  status="$(curl -sS --max-time 20 -o /dev/null -w '%{http_code}' "$url$path")"
  [[ "$status" == 403 || "$status" == 404 ]] || exit 1
done
curl -fsS --max-time 15 "$url/?resource=translation-source" | php -r '$j=json_decode(stream_get_contents(STDIN),true);if(($j["id"]??null)!=="teknikel-site" || ($j["source_language"]??null)!=="tr")exit(1);'
echo "TEKNIKEL_SITE_DEPLOY_PASS $url (API untouched; backup retained)"
