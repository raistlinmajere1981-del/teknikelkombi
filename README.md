# Teknikel — Perakende satış ve bayi portalı

## Active entry — Chunk 4A, local checkpoint (2026-11-04)

The root now includes `canonical/public/index.php`. All existing business routes enter
common canonical aliases and publication gates. Teknikel logo/theme and the demo ZIP
remain. The old root JS/widget/request implementation is retained locally for review,
blocked by `.htaccess`, and excluded from the new explicit deployment package. The
historical implementation notes below describe that retained code, not the active path.

Common update and public installation are explicit; checks do not repair files:

```sh
node scripts/update-canonical.mjs --check /home/raistlin/YardimciWorkspace/YardimciAsistan/web-site-template
node scripts/update-canonical.mjs --apply /home/raistlin/YardimciWorkspace/YardimciAsistan/web-site-template
node scripts/sync-public-assets.mjs --apply
node scripts/sync-public-assets.mjs --check
node --test --test-isolation=none tests/canonical-cutover.test.mjs
php tests/canonical-entry.php
bash scripts/deploy-site.sh --dry-run
```

`--dry-run` is now entirely local: it verifies and stages a 164-file allowlisted site
package with hashes/identity/version receipt under `.test-artifacts/`; it never opens
SSH or HTTP. `--yes` is a separate remote deployment, not authorized or run in Chunk 4A.
It does not ship the API, data, keys, original legacy JS or private import fixtures.
No build or test silently updates canonical or mirrored assets.

Run these browser checks on the host, from this repository (they create isolated local
PHP/API fixtures; they do not use the live API):

```sh
node tests/canonical-live-entry.mjs
node tests/canonical-theme.mjs
CANONICAL_DOCUMENT_ROOT=. TEST_FILTER='one canonical catalog' node tests/canonical-commerce.mjs
CANONICAL_DOCUMENT_ROOT=. TEST_FILTER='authenticated reload recovers' node tests/canonical-commerce.mjs
CANONICAL_DOCUMENT_ROOT=. TEST_FILTER='guest uncertain retry' node tests/canonical-commerce.mjs
CANONICAL_DOCUMENT_ROOT=. TEST_FILTER='logout and cross-account' node tests/canonical-commerce.mjs
CANONICAL_DOCUMENT_ROOT=. TEST_FILTER='legacy aliases' node tests/canonical-commerce.mjs
```

Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE=/path/to/chromium` if `/usr/bin/brave` is unavailable.
The new live-entry smoke proves the actual root, 16 business aliases, query validation,
OFF gates, AI-OFF product requests, one widget, source-only language discovery, demo
and asset URLs at 390/1440px. It does not prove Apache `.htaccess` behavior or real
Secure cookies/backend integration. Original customer tests are retained; broad legacy
`npm test`/`npm run check` have not been migrated to the new active DOM/source catalog.
No browser suite was run in the sandbox, which cannot bind localhost.

**Not live-ready.** Chunk 4B must run the host checks above; reconcile original legacy
tests with the active canonical DOM and strict query rejection; verify real API account
callback/session/private-price isolation/checkout/receipt behavior and Apache private
path denial; review 320/768px and the advanced legacy comparison gap. Keep old source
until that equivalence review is complete. No staging data was reset and no deployment,
commit, push, broad npm test or full verification was run.


Mevcut lacivert/kırmızı/beyaz PHP tasarımını kullanan e-ticaret pilotu. Veri ve fiyat otoritesi Yardımcı Asistan Desktop'tır; site yalnız aynı origin üzerindeki `/yardimci-asistan/api/` yayınlarını ve sipariş uç noktalarını tüketir. Ödeme alınmaz; talepler işletmenin onayını bekler.

## Ortak publication/view-model

`assets/publication-model.js` saf yayın projection'ıdır. `assets/storefront.js` aynı belge için API yanıtlarını bir kez okur; şablonlar, ana sayfa, doğrudan sayfalar ve widget aynı projection sonucunu kullanır. Bayi özel kataloğu bu ortak public snapshot'a girmez. Profil adı sektör izni vermez; canonical `business.public_surfaces`, endpoint `enabled` durumu, `published/is_active/visible` ve veri varlığı belirleyicidir. Veri yoksa ana sayfa bölümü ve navigasyon bağlantısı görünmez. Kampanya/yorum/iletişim/görsel için örnek veya eski işletme bilgisi yedeği yoktur.

| Yayın | Ortak görünüm |
| --- | --- |
| `business.php` | Ad/açıklama, iletişim/sosyal bağlantılar, koordinat veya doğrulanmış Google embed, galeri, hakkımızda/koşullar/olanaklar/diller |
| `catalog.php` + tam `store` yüzeyi | Katalog, ürün grupları, gerçekten yayınlanan markalar, ana sayfa ürünleri, karşılaştırma |
| `rooms.php` + `rooms` | Oda özeti, liste, detay ve aktifse rezervasyon talebi |
| `tables.php` + `restaurant` | Restoran özeti, masalar ve aktifse masa talebi |
| `menu.php` + `qr_menu` | QR menü ve ana sayfa menü özeti |
| `marketing.php` | Yayınlanmış `website / homepage_feature` kampanyaları ve duyurular |
| `google-reviews.php` + `google_reviews_enabled` | Yayınlanan gerçek Google yorumları, puan ve değerlendirme sayısı |
| `ai_enabled`, `requests_enabled`, `dealer_application_enabled` | Genel sohbet, sektöre uygun bilgi/talep/bayi kartları |

Projection, API gelecekte `business.publication_visibility` ile `store`, `featured`, `categories`, `brands`, `rooms`, `restaurant`, `qr_menu`, `campaigns`, `reviews`, `gallery`, `about`, `contact`, `dealer`, `assistant` alanlarından biri için `false` veya `{visible:false}` yayımlarsa bunu ek bir **kapatma** kuralı olarak uygular. Bu alan yetki açamaz. Mevcut canonical business API bu alanı dışa aktarmıyorsa mevcut yayın/endpoint/record izinleri kullanılır; bu web çalışması Desktop'a yeni görünürlük ayarı veya API alanı eklemez.

Teknikel sunumu `assets/publication.css` içindedir. Ana sayfa hero'su yayınlanan işletme metni ve gerçek galeri/katalog görsellerini kullanır. Kategoriler tek açılır menüdedir; kategori bağlantıları ana navigasyona tekrar dizilmez. `/markalar/` yalnız gerçek public marka verisi varsa açılır. Footer ve meta açıklaması publication'dan gelir. Marka logosu Teknikel şablon varlığı olarak korunur.

Widget'ın orijinal avatarı, AI/talep/özel belge upload ve idempotency sahipleri korunur. `assets/assistant/presentation.js` aynı projection ile kart/sekme/form sunumunu düzenler; `presentation.css` yalnız görünümü değiştirir. `widget.js` içindeki küçük `setPublication` / `openRequest` köprüsü ve `data-publication-managed` seçeneği public verinin ikinci kez okunmasını ve eski profil varsayımlarını önler. Canonical widget yeniden kopyalanırsa bu köprü korunmalı ve widget deneyim testleri çalıştırılmalıdır.

## Web ürün ve görsel karşılaştırma

Ürün kartı ve detayındaki Karşılaştır işlemi aynı sayfada native dialog açar. Ürün listesinin arama, kategori, marka, sayfa ve scroll durumu korunur. İlk seçim kapatıldığında geçici bir seçim çubuğu kalır; başka karttan veya modal içindeki katalog aramasından ikinci ürün seçilebilir. Ayrı veritabanı/ürün listesi/medya servisi yoktur.

- Ürün ↔ ürün veya ürün ↔ cihaz fotoğrafı; iki katalog ürününün tüm yayınlanmış görselleri (en fazla 12) arasından seçim.
- Yan yana/bindirme, bağımsız pan/zoom, bağlı zoom seçeneği, hizalama çizgileri, katman/şeffaflık, döndürme/çevirme, negatif/gri/kontrast ve tek adımda sıfırlama.
- Mouse, klavye, tek parmak pan ve iki parmak pinch. Mobilde yan yana modu dikey düzenlenir; bindirme ortak çalışma alanını korur.
- Yayınlanmış ad/marka/SKU/üretici parça kodu/model/kategori/birim/fiyat/teknik açıklama satırları; farklar metin etiketiyle de belirtilir. Eksik bilgi türetilmez. Görsel benzerlik otomatik uyumluluk onayı vermez.
- Public sayfalarda public fiyat, bayi çalışma alanında yetkili endpoint'in bayi fiyatı kullanılır. Fiyat hesaplanmaz veya depolanmaz.
- Açılışta, Yenile'de, sekmeye dönüşte ve görünür açık modalde 30 saniyede bir yayın/oturum tekrar doğrulanır. Ürün geri çekilirse seçim/arama/görsel/fiyat temizlenir. Oturum kapanması, başka sekmeden çıkış ve pagehide özel DOM'u temizler. Offline/başarısız doğrulamada eski özel fiyat korunmaz.
- JPEG/PNG/WebP/AVIF cihaz fotoğrafı en fazla 20 MB kabul edilir. Görüntüleme kopyası bellekte en fazla 2048 px kenara küçültülür; asıl dosyaya dokunulmaz. Fotoğraf otomatik upload edilmez; Object URL kapanınca veya değiştirilince iptal edilir. SVG/desteklenmeyen/bozuk/aşırı büyük dosya ve eksik katalog görseli için açık durum mesajı vardır.

`assets/comparison-model.js` kimlik seçimi, bilgi satırları ve görsel dönüşümlerini DOM'dan ayırır; `assets/compare.js` web etkileşimlerini yönetir. Android yeniden yazılmadı. İncelenen `DealerPhotoViewer` katalog ürünü ↔ kişisel fotoğraf karşılaştırıyor; iki farklı katalog ürününü doğrudan seçme sonraki Android turu için açık iş olarak kalır.

## Katalog hazırlık kararı

Pilot inceleme arşivi: `/home/raistlin/teknikel_catalog_prep`. 179 kayıt/68 dosya, ancak sadece **28 kategorili örnek kayıt** ilk ürün seçkisi için güvenli adaydır. 151 "Diğer" kaydının 144'ünde görsel bulunmuyor; birçoğunda alışılmadık fiyatlar var. Bu kayıtlar topluca satışa açılmamalıdır. Kaynak uygulamada KDV, stok takibi, birim ve bayi fiyatı doğrulanmadan ürünler aktarımdan sonra taslak kalmalıdır. Yayın mekanizması Desktop'ın canonical ürün/kategori/medya sahibidir; canlı siteye hardcoded ürün eklenmez.

## Çalışan akışlar

- `/`, `/katalog/`, `/urun/?id=...`: public ürünler, kategori/stok kodu/metin araması, ürün detayı, fotoğraf ve sepete ekleme.
- `/sepet/`: çok ürünlü perakende sepeti, miktar, iletişim, elden teslim veya yayın izin veriyorsa adrese gönderim, not, sipariş kabul numarası.
- `/hesabim/` (eski `/bayi/` buraya yönlenir): mevcut ortak hesap/aktivasyon/giriş akışı ve sunucunun HttpOnly çereziyle oturum. Bayi yetkisi varsa Katalog, Sepet, Siparişler, Hesabım; özel fiyatlar, gerçek kategori/marka filtreleri, favoriler, sipariş durumları ve güncel katalogla yeniden sepete ekleme.
- Public satış yüzeyi veya katalog yayını kapalıysa yeni public satışlar kapanır. Bayi yayını kendi yetkisiyle değerlendirilir. Hatalar gerçek boş katalog veya başarılı sipariş gibi gösterilmez.

Public katalog sözleşmesi şu anda ayrı `brand` alanı yayınlamıyor. Public marka araması mevcut ürün adı/açıklamasında çalışır; marka seçicisi yalnız API gerçekten marka verirse görünür. Bayi kataloğundaki `brand` ve `category_name` kullanılır. Stok adedi uydurulmaz; sepet miktarı stok garantisi değildir.

## API sözleşmesi

| İşlem | Uç noktalar |
| --- | --- |
| Public yayın | GET `business.php`, `catalog.php` |
| Perakende talebi | POST `order.php` |
| Ortak hesap | Mevcut `account/config`, `session`, `register`, `verify`, `login`, `refresh`, `logout`, `logout-all` uçları |
| Bayi erişimi | GET `dealer/session.php`, POST `dealer/logout.php` |
| Bayi alışverişi | GET `dealer/catalog.php`, POST `dealer/order.php` |
| Bayi takip/kurtarma | GET `dealer/orders.php`, POST `dealer/receipt.php` |

## Dinamik vitrin yayınları

Başlık ve footer bütün sayfalarda (bayi alanı dahil) tek ortak `business.php` yanıtını kullanır. Yayınlanmış işletme adı, telefon, e-posta, adres, web sitesi ve sosyal bağlantılar gösterilir; boş/geçersiz alanlar ve bağlantı hatasında iletişim alanı gizlenir. Sabit iletişim yedeği yoktur.

| Yüzey | Gerekli yayın |
| --- | --- |
| Genel katalog, kategori menüsü, arama ve perakende sepet bağlantısı | `business.public_surfaces` içinde tam `store` ve `catalog.php.enabled === true` (Online Satış yayını) |
| `/restoran/` | Tam `restaurant` (masa kataloğu yayını); GET `tables.php` içindeki `enabled` ve `tables` |
| `/qr-menu/` | Tam `qr_menu` (menü yayını); GET `menu.php` içindeki aktif `categories` ve `items` |

Profil adı, `food_service` veya eski `menu` yüzeyi bu izinlerin yerine geçmez. Genel kategori bağlantıları yalnız public `catalog.php.categories` kimliklerini kullanır; özel bayi kategorileri ortak menüye aktarılmaz. Boş/kapalı/erişilemeyen yayında örnek kategori, masa, menü ürünü veya fiyat oluşturulmaz. Menü salt görüntülemedir; fiyat `price` veya yayınlanmış `unit_price` ve para birimiyle, masa kapasitesi `capacity` ile gösterilir. Sayfa yenilenince (katalogda ayrıca **Yenile** ile) güncel yayın okunur.

`npm run check` ve `npm test` yeni sayfaları da kapsar. `tests/storefront.mjs` sentetik API ile iletişim değişimini, izinleri, boş/hata durumlarını, özel kategori ayrımını, HTML enjeksiyonunu ve 320/390/768/1440 px görünümü kontrol eder. Yalnız yeni mobil/yayın akışlarını çalıştırmak için `TEST_FILTER='yayın vitrinleri' node tests/smoke.mjs` kullanılabilir. Gerçek veri, bayi token'ı veya canlı API isteği kullanılmaz.

JSON POST'larında mevcut bayi `X-YA-Dealer: 1` başlığı ve aynı origin çerezi kullanılır. Tarayıcı fiyat, bayi kimliği veya fiyat grubu göndermez. Public siparişte `buyer`, her iki siparişte `items`, `delivery`, `note`, `idempotencyKey`; bayi siparişinde ayrıca `catalogRevision` gönderilir. Tahmini toplam katalog fiyatlarından gösterilir; sunucu kabulündeki bayi toplamı ayrıca belirtilir. Masaüstüne aktarım bekleyen talep ile canonical placed/confirmed/fulfilled/cancelled durumları ayrıdır.

Perakende API'sinde geçmiş veya makbuz sorgulama endpoint'i yoktur; kabul numarası gösterilir. Bayi geçmişi ve makbuz kurtarma mevcut endpoint'leri kullanır. Backend PHP kaynakları bu projeye kopyalanmaz ve değiştirilmez.

## Sepet, gizlilik ve belirsiz gönderim

Tarayıcı depolamasında public ve her bayi hesabı için ayrı ürün kimlikleri, miktarlar, favori kimlikleri ve son kabul numarası bulunur. Özel fiyatlar, ürün adları, davet/oturum token'ları, iletişim/adres/not kaydedilmez. Çıkış, 401, sekmeler arası hesap değişimi ve sayfa önbelleğine geçiş özel DOM'u temizler. Başarısız sunucu çıkışı açıkça belirtilir; yeniden denenebilir.

Gönderimden önce aynı siparişin kimliği ve gövde özeti kaydedilir. Belirsiz ağ/503/bozuk yanıt durumunda sepet kilitlenir; aynı gövde ve kimlikle yeniden denenir. Kabul doğrulanmadan sepet silinmez. Yeniden yüklemeden sonra public siparişi kurtarmak için aynı iletişim, teslimat ve not bilgileri yeniden girilmelidir; farklı bilgilerle ikinci kimlik oluşturulmaz. Bayi, yenilenmiş oturumda önce `receipt.php` üzerinden önceki kabulü sorgular. Depolama kullanılamıyorsa gönderim başlatılmaz.

## Teknikel pilot verileri

Ürün görselli arşiv yerel makinede `/home/raistlin/teknikel_catalog_prep/teknikel-179-urun-68-gorsel-pilot.zip` altında bulunur. 179 ürün, 68 orijinal görsel, 24 kaynak kategorisi ve kategorisiz 151 ürün için **Diğer** içerir. Aktarımda kategoriler etkin kullanılabilir şekilde oluşturulur; ürünler varsayılan olarak **pasif ve yayınlanmamış taslak** kalır. KDV, stok ve maliyet değerleri tahmin edilmez.

Müşteri test dosyası: `data-import/teknikel-demo-musteriler-30.csv`. Türkçe UTF-8 BOM ve noktalı virgül ayracıyla hazırlandı; 10 perakende, 10 pasif bayi, 10 aktif bayi kaydı içerir. Kişiler, şirketler, telefonlar ve adresler **tamamen sentetiktir**; gerçek mesaj/arama/davet gönderiminde kullanılmamalıdır. Ayrı bir Excel kopyası sohbetten indirilebilir. İlk aktarımda 30 yeni, tekrar aktarımda 30 atlanan kayıt beklenir.

Bu klasör yerel test içindir; siteye deploy edilmez.

## Yerel çalıştırma ve test

PHP, Node.js ve Chromium tabanlı bir tarayıcı gerekir. Runtime npm bağımlılığı yoktur.

```sh
php -S 127.0.0.1:8093 -t .
npm ci --ignore-scripts
npm run check
npm test
```

Tarayıcı testleri varsayılan `/usr/bin/brave` kullanır; alternatif:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/path/to/chromium npm test
```

`tests/fixtures/api.mjs` yalnız test örnekleridir; üretim kodunca import edilmez. Playwright API ve harici ağ isteklerini yerel örneklerle karşılar; gerçek sunucuya sipariş veya oturum işlemi yapmaz. `npm run check` PHP lint ve JavaScript sözdizimini; `npm test` davranış testlerini ve 320/390/768/1440 px tarayıcı akışlarını çalıştırır. Sonuçlar ve örnek ekran görüntüleri ignored `.test-artifacts/` altındadır. Bu kontroller gerçek PHP backend entegrasyonu veya HTTPS cihaz doğrulaması sayılmaz.

## Nexa için yayın ve HTTPS doğrulaması

Site güncellemeleri yalnız Teknikel web kaynaklarında yapılır; Yardımcı Asistan web modülü, veri deposu ve bayi oturumları korunur. Site için `index.php`, `inc/`, `katalog/`, `urun/`, `sepet/`, `bayi/`, `assets/`, `markalar/` ve aşağıdaki yayına bağlı sayfa dizinleri aktarılır. `data-import/`, `.deploy/`, anahtarlar, `tests/`, `node_modules/`, `.test-artifacts/`, `.superdesign/`, yerel ekran görüntüleri ve npm dosyaları site yayınına dahil edilmez. API web modülü, sırlar ve veritabanı ayrı sahiplikte kalır; mevcut IdeaSoft sitesine dokunulmaz.

Yayın öncesinde uyumlu web modülünde yukarıdaki endpoint'lerin, özellikle `dealer/orders.php` ve `dealer/receipt.php` uçlarının kurulu olduğu doğrulanmalıdır. Gerçek HTTPS test sunucusunda şu kontroller kalır:

1. Masaüstünden gerçek public/bayi yayını ve iki farklı bayi daveti oluşturma; Secure/HttpOnly çerez, davet tüketimi ve fiyat izolasyonu.
2. Perakende ve bayi siparişi; sunucu kabul numarası, yetkili fiyat, masaüstüne tek aktarım, doğrudan tahsilat/stok hareketi oluşmaması.
3. Ağ kesintisinde belirsiz gönderim, aynı kimlikle kurtarma, sepetin korunması; bayi oturumu yenilenince makbuz kurtarma.
4. Masaüstünde onay/tamamlama/iptal sonrası bayi geçmişini yenileme; erişim iptali, çoklu sekme ve çıkışın özel fiyatları kaldırması.
5. Gerçek telefonlarda 320/390 px kullanım, ürün fotoğrafları, yayın kapatma ve sunucu hata yanıtları.

Gerçek HTTPS test sunucusu ve fiziksel cihaz doğrulaması bu yerel çalışmada yapılmadı. Ana sayfa görselleri yayınlanan galeri/katalog verilerinden gelir.


## Yayına bağlı web sayfaları

Teknikel sabit bir sektör şablonu değildir. Herkese açık sayfaların içeriğini ve görünürlüğünü aynı sunucudaki Yardımcı Asistan yayını belirler. Toptancı/bayi oturumları kendi özel akışını kullanmaya devam eder.

| Yayın kaynağı | Teknikel sayfası |
| --- | --- |
| business.php (telefon/e-posta/adres/sosyal bağlantılar) | Her sayfanın üstü/altı ve /iletisim/ |
| business.php (about_text, features, policy) | /hakkimizda/ |
| business.php (gallery, title, sort_order) | /galeri/ |
| rooms.php (enabled, odalar, medya) | /odalar/ ve /odalar/oda/?id=... |
| tables.php (enabled, masalar) | /restoran/ |
| menu.php (yayınlanan QR menü) | /qr-menu/ |
| catalog.php + business.public_surfaces store | /magaza/ (mevcut /katalog/ kataloğu), /urun/, /sepet/ |
| marketing.php (yayınlanmış website kampanyaları) | /duyurular/ ve ana sayfa kampanyaları |
| google-reviews.php + business.google_reviews_enabled | /yorumlar/ |
| dealer erişimi ve davet | /bayi/ (bağımsız, özel bayi kataloğu) |

Ürün kategorileri yalnız herkese açık katalog yayını üzerinden gelir; bayi özel kategorileri üst menüye taşınmaz. Restoran/oda/mağaza ve QR menü sayfaları iş profilinden değil ilgili gerçek yayının etkinliğinden açılır. Hakkımızda, galeri, yorumlar, duyurular ve iletişim yalnız yayınlanmış içerik veya gerçek bağlantı varsa görünür. Yayın kapalıyken eski hardcoded bilgiler veya örnek ürünler gösterilmez.

Site değişiklikleri yayına çıkmadan önce npm run check ve npm test ile doğrulanır. Gerçek HTTPS üzerinde bayi daveti/siparişi daha sonra ayrıca test edilir.

## TR / EN ve canlı Teknikel arayüzü

Site ilk HTML yanıtını daima Türkçe verir; Çoklu Dil uygulamada kapalıysa dil seçicisi gizlidir. Türkçe kaynak ifadeler `assets/i18n/tr.json` üzerinden `GET /?resource=translation-source` ile masaüstüne sunulur. Dil seçenekleri yalnız public `business.localization.target_languages` yayınından açılır. Türkçe kaynak, hash ve yer tutucuları eşleşen `site_text` alanları yayınlanmışsa çeviri uygulanır; sabit İngilizce sözlük yoktur. Ziyaretçinin tercihleri yalnız izinli diller için `teknikel_site_language` istemci çerezinde saklanır, eski `teknikel_language` HttpOnly çerezi temizlenir. Ürün, kategori, oda, restoran, galeri ve kampanya yayınlarının çevirileri aynı localization sözleşmesinden gelir. Eksik çeviriler Türkçe kalır; ürün kimliği, fiyat, stok ve bayi özel sipariş alanları değişmez. Web'e bağlandıktan sonra site kaynak metinlerini Dil Yönetimi'ne almak için gerekirse yeniden Bağlan yapılır.

Mağaza tek public katalog sayfasıdır: /magaza/. Eski /katalog/ adresi arama, kategori, marka ve dil parametrelerini koruyarak Mağaza'ya geçer. Bağımsız bayi girişi ve siparişler korunur.

İletişim, uygulamanın yayınladığı telefon, e-posta, adres, koordinat ve sosyal URL'leri kullanır. Sosyal bağlantılar HTTPS ve ikonlarla sunulur; koordinatlar geçerliyse OpenStreetMap haritası gösterilir. Sabit telefon veya örnek iletişim bilgisi kullanılmaz.

Site ortak Yardımcı Asistan widget dosyasını assets/assistant/widget.js içinde barındırır. Orijinal Yardımcı Asistan demo widget runtime ve avatarı korunur; AI, talep ve WhatsApp durumları public business API tarafından belirlenir. Widget sitenin html lang alanını kullanarak TR / EN dilini takip eder. Yeni widget yayınlarında yukarıdaki publication köprüsü de korunarak kanonik demo kaynağıyla eşlenmelidir.

Widget **İşlemler** sekmesindeki **Bilgi talebi oluştur**, `business.requests_enabled === true` ve yayınlanmış `request_types` içinde `general_info` gerektirir. **Ürün / stok sor** ayrıca açık public mağaza ve gerçek yayınlanmış ürün gerektirir; `price_question` varsa bu türle, yalnız `general_info` varsa o türle gönderir. İki işlem AI kapalıyken de çalışır. AI sohbet/teknik destek kartları ayrı **Sohbet** sekmesindedir ve yalnız AI açıkken görünür. Bayi ve rezervasyon kartları da kendi talep türlerinin yayın iznini gerektirir; eksik veya hatalı tür listesi izin vermez. Widget `requestsEnabled` değeri bayi kartından değil yayınlanmış müşteri talebi bayrağından alınır.

Tarihsiz genel/ürün formları `assets/assistant/customer-request.js` içinde siteye aittir ve mevcut widget panelinde açılır. Ad soyad, geçerli telefon ve soru zorunludur; ürün talebinde yayınlanmış ürün seçimi de zorunludur. Seçilen ürün kimliği/adı `context` içinde, ürün adı/stok kodu ayrıca `message` içinde gönderilir. Formlar aynı origin `/yardimci-asistan/api/request.php` adresine resmi JSON şemasıyla (`source: web_form`, şemanın gerektirdiği `guest_count: 1`) POST eder; tarih/saat alanı ve AI çağrısı içermez. Gönderim yalnız geçerli `ok: true` ve `request_id` yanıtıyla başarılı sayılır. Hata/zaman aşımı sonrası aynı içerikle tekrar gönderim aynı `idempotency_key` kullanır; değişen içerik yeni anahtar alır. Başarıdan sonra yeni talep yeni anahtar kullanır. Kişisel bilgiler ve anahtarlar browser storage'a yazılmaz. Yenileme başlarken eski yayın temizlenir, açık form kaldırılır; 403 yanıtı açık formdaki tekrar gönderimi durdurur. Sunucu her gönderimde yetkiyi ayrıca doğrular.

Yeni site formları bundle'ın rezervasyon gönderim işaretçisi `data-ya-form` kullanmaz; eski adaptörün yanlış tür/tarih işlemesine girmez. `widget.js` ve mevcut bayi belge yükleme akışı değiştirilmemiştir. Geri, Tamam, başlıktaki kapatma düğmesi ve Escape ile gezinilir. Kontroller 390 px ve masaüstü için düzenlenmiştir.

Kontrol: npm run check, npm test, gerçek HTTPS site rotaları, tarayıcı TR/EN, sosyal ikon, harita ve widget. Bu web dosyası yayını web modülü verilerini veya bayi oturumlarını sıfırlamaz.

## Bu tur doğrulama kapsamı

`npm run check` PHP ve tüm site/widget JavaScript sözdizimini kontrol eder. `npm test` birim testleri ve fixture API ile 320/390/768/1440 px tarayıcı regresyonlarını çalıştırır. `tests/experience.mjs` ürün/fotoğraf ve ürün/ürün, iki galeriden seçim, zoom/pan/pinch, bindirme/şeffaflık/filtre/sıfırlama, yayın kaldırma, fiyat yetkisi, kaynak/bellek temizliği, upload yapılmaması, widget sekmeleri/orijinal avatar ve tüm ana sayfa modüllerini kapsar.

`tests/customer-request.test.mjs` AI kapalı izinlerini, fiyat türünü ve genel bilgiye dönüşü, eksik işletme/izin kaldırmayı, şema/doğrulama ve idempotency tekrarlarını kapsar. `tests/customer-requests.mjs` mevcut 80 tarayıcı senaryosuna 6 yerel mock senaryosu ekler: 390/1440 px gerçek form açma, zorunlu alanlar, JSON POST gövdesi/ürün bağlamı, 503 ve kesilen bağlantı sonrası aynı anahtarla tekrar, başarı, sekmeler/klavye gezinmesi, bekleyen yayın yenilemesinde eski formun kaldırılması, AI bağımsızlığı ve 403. Yalnız bu testler için `TEST_FILTER='no-AI requests' node tests/smoke.mjs` kullanılabilir. Testler canlı HTTPS talebi göndermez; canlı dağıtım ayrı onaylanmalıdır.

`npm run test:accounts` komşu canonical repo'nun izole fixture'ında gerçek PHP/API/yerel SMTP kullanarak hesap/EN/mobil, oturum yenileme, bayi yetkisi ve Online Satış kapatma/açmayı kontrol eder. Canlı sunucuya istek/sipariş göndermez; gerçek production e-posta sağlayıcısı, Android cihazdan oturum düşmesi veya canlı HTTPS kanıtı değildir.

## Teknikel demo ZIP (2026-11-04)

Staging sitesinde `/demo-icerik/` bağlantısı footer'da yer alır; ZIP dosyası `/assets/downloads/teknikel-demo-verileri.zip` üzerinden indirilir. Kaynak, Yardımcı Asistan'ın isteğe bağlı `d-teknikel` backup-v2 paketidir. 179 Teknikel katalog ürünü, 68 orijinal ürün fotoğrafı (35 fotoğraflı ürün), 25 kategori, 30 sentetik müşteri/bayi, 28 ilk yayına hazır ürün, 4 test siparişi, stok, tedarikçi ve veresiye örnekleri içerir. Gerçek ürün adları/SKU'lar ve kaynak fiyat anlık görüntüsü korunur; stok, satın alma maliyeti, bayi fiyatı ve vergi oranı sentetik test değerleridir. Orijinal fotoğraflar açık lisanslı varsayılmaz. Demo başlangıcında teslimat açık ve işletmeden teslim etkin, ancak Aras Kargo kimlik bilgisi olmadığı için **kargo ile gönderim kapalıdır**. Bu ayar testi tamamlanmadan etkinleştirilmez.

Yeniden üretim: Yardımcı Asistan depo kökünde `node scripts/demo-data/generate-demo-data.mjs --only d`, ardından `node scripts/demo-data/verify-demo-data.mjs`. Oluşan geçerli ZIP'i aynı site indirme yoluna kopyalayıp `node --test tests/demo-package.test.mjs` ve `bash scripts/deploy-site.sh --dry-run` doğrulamasından sonra yalnız staging site deploy'u yapılır. Site yayını `/yardimci-asistan` modülüne veya mevcut uygulama verisine müdahale etmez; ZIP indirmek web veritabanını beslemez. Desktop'ta **Ayarlar → Veri Yönetimi → ZIP İçe Aktar**, ardından yedeği **Geri Yükle** gerekir. Gerçek bayi web hesapları/davetler bu ZIP'te bulunmaz; ayrı doğrulanır.
