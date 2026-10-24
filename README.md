# Teknikel — Perakende satış ve bayi portalı

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

Teknikel sitesinin üstündeki TR / EN seçiminden sonra tercih, aynı sitenin teknikel_language çerezinde tutulur. Siteye ait Türkçe/İngilizce metinler assets/i18n/en.json kaynağındadır. Uygulamadan İngilizce çevirisi yayınlanan ürün, kategori, oda, restoran, galeri ve kampanya metinleri public API localization kaydından gösterilir. Çevrilmemiş alanlar özgün dilde kalır; ürün kimliği, fiyat, stok ve bayi özel sipariş alanları değişmez.

Mağaza tek public katalog sayfasıdır: /magaza/. Eski /katalog/ adresi arama, kategori, marka ve dil parametrelerini koruyarak Mağaza'ya geçer. Bağımsız bayi girişi ve siparişler korunur.

İletişim, uygulamanın yayınladığı telefon, e-posta, adres, koordinat ve sosyal URL'leri kullanır. Sosyal bağlantılar HTTPS ve ikonlarla sunulur; koordinatlar geçerliyse OpenStreetMap haritası gösterilir. Sabit telefon veya örnek iletişim bilgisi kullanılmaz.

Site ortak Yardımcı Asistan widget dosyasını assets/assistant/widget.js içinde barındırır. Orijinal Yardımcı Asistan demo widget runtime ve avatarı korunur; AI, talep ve WhatsApp durumları public business API tarafından belirlenir. Widget sitenin html lang alanını kullanarak TR / EN dilini takip eder. Yeni widget yayınlarında yukarıdaki publication köprüsü de korunarak kanonik demo kaynağıyla eşlenmelidir.

Kontrol: npm run check, npm test, gerçek HTTPS site rotaları, tarayıcı TR/EN, sosyal ikon, harita ve widget. Bu web dosyası yayını web modülü verilerini veya bayi oturumlarını sıfırlamaz.

## Bu tur doğrulama kapsamı

`npm run check` PHP ve tüm site/widget JavaScript sözdizimini kontrol eder. `npm test` birim testleri ve fixture API ile 320/390/768/1440 px tarayıcı regresyonlarını çalıştırır. `tests/experience.mjs` ürün/fotoğraf ve ürün/ürün, iki galeriden seçim, zoom/pan/pinch, bindirme/şeffaflık/filtre/sıfırlama, yayın kaldırma, fiyat yetkisi, kaynak/bellek temizliği, upload yapılmaması, widget sekmeleri/orijinal avatar ve tüm ana sayfa modüllerini kapsar.

`npm run test:accounts` komşu canonical repo'nun izole fixture'ında gerçek PHP/API/yerel SMTP kullanarak hesap/EN/mobil, oturum yenileme, bayi yetkisi ve Online Satış kapatma/açmayı kontrol eder. Canlı sunucuya istek/sipariş göndermez; gerçek production e-posta sağlayıcısı, Android cihazdan oturum düşmesi veya canlı HTTPS kanıtı değildir.
