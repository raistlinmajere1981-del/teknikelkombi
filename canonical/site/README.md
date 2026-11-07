# Teknikel — canonical 0.8.0 local commerce candidate

Repository root `index.php` is the hosting adapter for `canonical/public/index.php`.
Document root is the repository root. `canonical/` remains HTTP-private; PHP includes
it locally. Existing business route wrappers enter common `core/legacy.php`, which
redirects to the canonical query page and evaluates publication gates there.

Site-owned: `site/config.php`, `site/views/**`, `locales/tr.json`, and
`public/assets/site/**`. Common files are installed only by the explicit updater:

```sh
node scripts/update-canonical.mjs --check /home/raistlin/YardimciWorkspace/YardimciAsistan/web-site-template
node scripts/update-canonical.mjs --apply /home/raistlin/YardimciWorkspace/YardimciAsistan/web-site-template
node scripts/sync-public-assets.mjs --apply
node scripts/sync-public-assets.mjs --check
```

Run these from the repository root. Neither builds nor verification repair assets.
The updater checks the unmodified upstream three-way planner, stages all changes,
preserves site-owned bytes, validates the manifest and swaps directories with
rollback. Previous installations remain in ignored `.test-artifacts/canonical-updates`.
The asset installer stages and renames the three explicit public namespaces with
rollback; a multi-directory crash-atomic exchange is not claimed.

`YA_SITE_API_ORIGIN` selects a separate public API fixture for host tests and disables
the production same-host CLI transport. Without that override, the existing explicit
hosting public-GET transport remains configured. Browser mutations/media still use
same-origin `/yardimci-asistan`; no backend source is packaged or changed.

`/demo-icerik/` redirects to the site-owned `demo-content` editorial extension. Its
existing ZIP and all original source photos remain intact. Its text and the previous
site phrase catalog are preserved in the single Turkish canonical catalog, ID
`teknikel-site`; only Desktop publication supplies target languages.

Product detail adds a presentation-only canonical `request.general` trigger for an
already published public product ID. The common widget owns validation, transport,
idempotency and dates (none for general_info), independently of AI. Private product
request hooks and the old advanced overlay/pinch/filter comparison have not been
ported. Site-owned catalog detail, gallery and comparison use the authorized products
from the common headless controller.

`site/views/pages/catalog.php` owns catalog HTML; `public/assets/site/catalog.js`
owns filters, pagination, comparison and product detail. The separate home cart and
catalog sidebar/order form are removed. Both pages use `YaCommerce.shared()`;
`public/assets/site/product-card.js` remains the one card builder. The header opens
the common mini cart. `cart` and the five `checkout-*` routes use common
`core/shopping.js` and the existing account/cart controller, without a site order
transport or database. Source/core release 0.8.0 is a local V2 candidate, not final
V2 acceptance. Red/white/navy styling, brand assets and Image Inspector remain.

Home comparison selection is transferred to the existing catalog comparison
panel via an ephemeral URL fragment, never a second comparison implementation.
The site has no second order transport or database; shared API/schema/publication changes are coordinated in the parent commerce contract.

See the root README and milestone handoff for exact local/host acceptance commands.
Not live-ready: browser, real backend callback/session/receipt and HTTPS checks remain.

## Ürün vitrini

`home-catalog.js`, `YaCommerce`'un güvenilir katalog görünümünden `is_featured=true`
olarak işaretlenmiş ürünleri `featured_order` ile sıralar (eşitlikte yayın sırası ve kimlik).
Seçili ürün yoksa eski ilk dört ürüne geri döner. Vitrin sırası kategorileri, bayi
fiyatlarını, sepeti ya da mağaza ürün kartı bileşenini değiştirmez. Vitrin bayrağı
yalnız masaüstündeki online ürün yayınında yönetilir; bu site onu yalnız yorumlar.

## Ana sayfa duyuru slider’ı

`views/components/home-announcement-slider.php`, mevcut `publication.announcements`
listesini yayın sırasıyla işler. Her geçerli/yayınlanmış görsel ayrı slayttır;
metin aynı duyurunun her görseline eşlik eder. Görseli olmayan başlık/metin de bir
slayttır. Başlıksız görsellere ek metin üretilmez. Boş bölüm ve tek slaytın kontrolleri
gizlenir. Ortak publication modeli ve Duyurular sayfası değişmez.

`public/assets/site/announcement-slider.js` yalnız bu sunumun etkileşimidir.
6 saniyelik geçiş; fare, odak, sekme görünürlüğü ve kullanıcı duraklatmasıyla durur.
Reduced-motion otomatik geçişi ve animasyonu kapatır. Oklar, konum düğmeleri,
klavye ve yatay dokunma hareketi çalışır. Pasif slaytlar `inert`/`aria-hidden` ile
odak ve erişilebilirlik ağacından çıkarılır. JavaScript olmadan ilk slayt SSR görünür.
`theme.css` görselleri `contain` ile bütünüyle gösterir; ortak grid alanı geçişlerde
en uzun içeriğin yüksekliğini korur. UI metinleri mevcut yayınlanan çeviri kataloğunu kullanır.

Yerel dar doğrulama (canlı yayın veya veri mutasyonu yok):

```sh
php -l canonical/site/views/components/home-announcement-slider.php
php -l canonical/site/views/pages/home.php
node --check canonical/public/assets/site/announcement-slider.js
node tests/check.mjs
node tests/canonical-theme.mjs
node tests/canonical-live-entry.mjs
node --test tests/publication-model.test.mjs
node --test --test-name-pattern='deploy package includes' tests/canonical-cutover.test.mjs
node scripts/sync-public-assets.mjs --check
node scripts/package-site.mjs --check
git diff --check
```

Sadece slider senaryoları için `TEST_FILTER='announcement slider'` kullanılabilir.
Varsayılan test medyası, orijinal iki afişin 1177×588 ve 1183×527 oranlarında yerel
sentetik görsellerdir. Gerçek afişlerle aynı testleri çalıştırmak için bunları
Git dışında `campaign-1.png` ve `campaign-2.png` adlarıyla bir dizine koyup
`TEKNIKEL_CAMPAIGN_DIR=/mutlak/dizin` verin. Testler bu görselleri yerelde sunar;
canlı API’ye bağlanmaz, yayın verisi üretmez. Ekran görüntüleri
`.test-artifacts/canonical/announcement-{390,1440}-{1,2}.png`,
`announcement-home-{390,1440}.png` ve `announcement-mixed-390.png` altındadır.

2026-11-07 yerel kabulü: gerçek iki kampanya afişiyle slider senaryoları **8/8**,
tüm canonical tema/responsive senaryoları **46/46**, publication model testleri
**11/11**, gerçek kök/yönlendirme testi **390 ve 1440 px**, paket sözleşmesi **1/1**,
syntax/katalog kontrolü **67 PASS**, asset mirror **57 hash** ve paket ön kontrolü
**186 dosya** geçti. Mobil gerçek touch olayı, klavye/odak, 6 saniyelik zamanlama,
duraklatma, gizli sekme, reduced-motion, yayınlanmış İngilizce UI ve no-JS dahildir.
Gerçek afişlerin iki boyutta da tamamı görüldü; görsel kabulü yereldir. Push/deploy yok.


The shared bank/quote/status API and Desktop contracts changed with this candidate.
Bank details are published business settings, not PHP constants. Guest checkout and
payment notice work without SMTP; password registration/reset remain gated by SMTP
and the server-side token encryption key. Campaign artwork is marked DEMO/passive;
no visual promise becomes a discount, installment, points or free-shipping rule.
See `../YardimciAsistan/docs/commerce/ECOMMERCE_V2.md` in the adjacent source repo
for the passing bank/refund, real Electron, account browser and V2 restore evidence,
remaining Android/template/Windows work, and coordinated installation requirements.
Linux AppImage and local API/site/common review archives exist in the adjacent repo;
no Windows installer, push or live deployment was produced.
