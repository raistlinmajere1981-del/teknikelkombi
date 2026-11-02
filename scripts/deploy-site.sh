#!/usr/bin/env bash
set -Eeuo pipefail
case "${1:-}" in
  --dry-run) dry=true ;;
  --yes) dry=false ;;
  *) echo 'Usage: bash scripts/deploy-site.sh --dry-run | --yes' >&2; exit 2 ;;
esac
repo="$(cd -- "$(dirname -- "$0")/.." && pwd)"
host='yardimciasistantoptanci@ssh-yardimciasistantoptanci.alwaysdata.net'
owner='yardimciasistantoptanci'
root="/home/$owner/www"
backup="/home/$owner/backups"
url='https://yardimciasistantoptanci.alwaysdata.net'
ssh_opts=(-o BatchMode=yes -o ConnectTimeout=12 -o StrictHostKeyChecking=yes)
ssh_rsync='ssh -o BatchMode=yes -o ConnectTimeout=12 -o StrictHostKeyChecking=yes'
for bin in ssh rsync curl php; do command -v "$bin" >/dev/null; done
[[ -f "$repo/index.php" && -f "$repo/.htaccess" ]]
grep -Fq 'teknikel-site' "$repo/index.php"
grep -Fq '# teknikel-site' "$repo/.htaccess"
site_dirs=(assets inc katalog urun bayi sepet restoran qr-menu odalar iletisim hakkimizda galeri yorumlar duyurular magaza hesabim markalar)
for name in "${site_dirs[@]}"; do
  [[ -d "$repo/$name" && ! -L "$repo/$name" ]]
done
[[ -z "$(find "$repo/assets" "$repo/inc" -type l -print -quit)" ]]
for file in "$repo/index.php" "$repo"/*/index.php "$repo/inc"/*.php; do [[ ! -f "$file" ]] || php -l "$file" >/dev/null; done
# This account previously served the shared canonical adapter. The adapter's
# exact known hash + domain-bound config is the only eligible takeover state.
remote_identity="$(ssh "${ssh_opts[@]}" "$host" bash -s -- "$root" "$backup" <<'REMOTE_PREP'
set -Eeuo pipefail
root="$1"; backup="$2"
[[ -d "$root" && ! -L "$root" && -d "$backup" && ! -L "$backup" ]]
[[ -d "$root/yardimci-asistan" && ! -L "$root/yardimci-asistan" ]]
if [[ -f "$root/index.php" ]] && grep -Fq 'teknikel-site' "$root/index.php"; then
  [[ -f "$root/.htaccess" ]] && grep -Fq '# teknikel-site' "$root/.htaccess"
  printf 'owned\n'
elif [[ -f "$root/index.php" && -f "$root/site/config.php" && -f "$root/.htaccess" ]] \
  && [[ "$(sha256sum "$root/index.php" | cut -d' ' -f1)" == 'a290a964d3399e51fdcf033c05bae7760bf8878396ee57a40bcd95375a856fea' ]] \
  && [[ "$(sha256sum "$root/.htaccess" | cut -d' ' -f1)" == '9fc4c75b0fd55205d5ce7a34dc5d803bfd5ed92aa4eeb8730758d3c977c0a0b0' ]] \
  && grep -Fq 'https://yardimciasistantoptanci.alwaysdata.net' "$root/site/config.php"; then
  printf 'canonical-owned\n'
else
  echo 'Unrecognized Teknikel site root; refusing to overwrite.' >&2; exit 2
fi
REMOTE_PREP
)"
[[ "$remote_identity" == 'owned' || "$remote_identity" == 'canonical-owned' ]]
version="$(curl -fsS --max-time 15 "$url/yardimci-asistan/api/version.php" | php -r '$j=json_decode(stream_get_contents(STDIN),true);if(($j["product_version"]??"")!=="2.2.0" || ($j["web_module_version"]??"")!=="2.2.0") exit(3);echo $j["product_version"];')"
[[ "$version" == '2.2.0' ]]
echo "Teknikel site ownership=$remote_identity, Web 2.2.0 verified"
for name in "${site_dirs[@]}"; do
  if [[ "$dry" == true ]]; then flags='-azni'; else flags='-azi'; fi
  rsync "$flags" --omit-dir-times --chmod=D755,F644 -e "$ssh_rsync" "$repo/$name/" "$host:$root/$name/"
done
if [[ "$dry" == true ]]; then
  rsync -azni -e "$ssh_rsync" "$repo/index.php" "$repo/.htaccess" "$host:$root/"
  echo 'Teknikel site dry-run PASS; no remote writes.'
  exit 0
fi
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
ssh "${ssh_opts[@]}" "$host" bash -s -- "$root" "$backup" "$stamp" <<'REMOTE_BACKUP'
set -Eeuo pipefail
root="$1"; backup="$2"; stamp="$3"
[[ "$stamp" =~ ^20[0-9]{6}T[0-9]{6}Z$ && -d "$backup" && ! -L "$backup" ]]
slot="$backup/teknikel-site-$stamp";mkdir -m 700 -- "$slot"
cp -p "$root/index.php" "$root/.htaccess" "$slot/"
REMOTE_BACKUP
stage="$root/.teknikel-site-$stamp-$$"
rsync -az --chmod=F644 -e "$ssh_rsync" "$repo/index.php" "$host:$stage.index.php"
rsync -az --chmod=F644 -e "$ssh_rsync" "$repo/.htaccess" "$host:$stage.htaccess"
ssh "${ssh_opts[@]}" "$host" bash -s -- "$root" "$stage" <<'REMOTE_ACTIVATE'
set -Eeuo pipefail
root="$1"; stage="$2"
[[ -s "$stage.index.php" && -s "$stage.htaccess" && ! -L "$root/index.php" && ! -L "$root/.htaccess" ]]
grep -Fq 'teknikel-site' "$stage.index.php"
grep -Fq '# teknikel-site' "$stage.htaccess"
php -l "$stage.index.php" >/dev/null
mv -f -- "$stage.htaccess" "$root/.htaccess"
mv -f -- "$stage.index.php" "$root/index.php"
REMOTE_ACTIVATE
for path in / /magaza/ /hesabim/ /sepet/ /urun/;do
  status="$(curl -LsS --max-time 20 -o /dev/null -w '%{http_code}' "$url$path")"
  [[ "$status" == 200 ]] || { echo "Site health HTTP $status ($path)" >&2; exit 1; }
done
ssh "${ssh_opts[@]}" "$host" bash -s -- "$backup" <<'REMOTE_PRUNE'
set -Eeuo pipefail
backup="$1"
[[ -d "$backup" && ! -L "$backup" ]]
find "$backup" -mindepth 1 -maxdepth 1 -type d -name 'teknikel-site-20??????T??????Z' -printf '%f\n' | LC_ALL=C sort -r | tail -n +2 | while IFS= read -r name; do
  [[ "$name" =~ ^teknikel-site-20[0-9]{6}T[0-9]{6}Z$ && ! -L "$backup/$name" ]] || exit 2
  rm -rf -- "$backup/$name"
done
REMOTE_PRUNE
echo "TEKNIKEL_SITE_DEPLOY_PASS $url (API untouched, one site entry backup)"
