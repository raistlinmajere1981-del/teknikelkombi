# Teknikel — Perakende satış ve bayi portalı

Mevcut lacivert/kırmızı/beyaz PHP tasarımını kullanan e-ticaret pilotu. Veri ve fiyat otoritesi Yardımcı Asistan Desktop'tır; site yalnız aynı origin üzerindeki `/yardimci-asistan/api/` yayınlarını ve sipariş uç noktalarını tüketir. Ödeme alınmaz; talepler işletmenin onayını bekler.

## Çalışan akışlar

- `/`, `/katalog/`, `/urun/?id=...`: public ürünler, kategori/stok kodu/metin araması, ürün detayı, fotoğraf ve sepete ekleme.
- `/sepet/`: çok ürünlü perakende sepeti, miktar, iletişim, elden teslim veya yayın izin veriyorsa adrese gönderim, not, sipariş kabul numarası.
- `/bayi/#invite=...`: mevcut tek kullanımlık davetle giriş; sunucunun HttpOnly çereziyle oturum. Katalog, Sepet, Siparişler, Hesabım; özel fiyatlar, gerçek kategori/marka filtreleri, favoriler, sipariş durumları ve güncel katalogla yeniden sepete ekleme.
- Public satış yüzeyi veya katalog yayını kapalıysa yeni public satışlar kapanır. Bayi yayını kendi yetkisiyle değerlendirilir. Hatalar gerçek boş katalog veya başarılı sipariş gibi gösterilmez.

Public katalog sözleşmesi şu anda ayrı `brand` alanı yayınlamıyor. Public marka araması mevcut ürün adı/açıklamasında çalışır; marka seçicisi yalnız API gerçekten marka verirse görünür. Bayi kataloğundaki `brand` ve `category_name` kullanılır. Stok adedi uydurulmaz; sepet miktarı stok garantisi değildir.

## API sözleşmesi

| İşlem | Uç noktalar |
| --- | --- |
| Public yayın | GET `business.php`, `catalog.php` |
| Perakende talebi | POST `order.php` |
| Bayi erişimi | POST `dealer/claim.php`, GET `dealer/session.php`, POST `dealer/logout.php` |
| Bayi alışverişi | GET `dealer/catalog.php`, POST `dealer/order.php` |
| Bayi takip/kurtarma | GET `dealer/orders.php`, POST `dealer/receipt.php` |

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

Bu çalışma deploy yapmaz. Site için yalnız `index.php`, `inc/`, `katalog/`, `urun/`, `sepet/`, `bayi/`, `assets/` aktarılmalıdır. `data-import/`, `.deploy/`, anahtarlar, `tests/`, `node_modules/`, `.test-artifacts/`, yerel ekran görüntüleri ve npm dosyaları site yayınına dahil edilmez. API web modülü, sırlar ve veritabanı ayrı sahiplikte kalır; mevcut IdeaSoft sitesine dokunulmaz.

Yayın öncesinde uyumlu web modülünde yukarıdaki endpoint'lerin, özellikle `dealer/orders.php` ve `dealer/receipt.php` uçlarının kurulu olduğu doğrulanmalıdır. Gerçek HTTPS test sunucusunda şu kontroller kalır:

1. Masaüstünden gerçek public/bayi yayını ve iki farklı bayi daveti oluşturma; Secure/HttpOnly çerez, davet tüketimi ve fiyat izolasyonu.
2. Perakende ve bayi siparişi; sunucu kabul numarası, yetkili fiyat, masaüstüne tek aktarım, doğrudan tahsilat/stok hareketi oluşmaması.
3. Ağ kesintisinde belirsiz gönderim, aynı kimlikle kurtarma, sepetin korunması; bayi oturumu yenilenince makbuz kurtarma.
4. Masaüstünde onay/tamamlama/iptal sonrası bayi geçmişini yenileme; erişim iptali, çoklu sekme ve çıkışın özel fiyatları kaldırması.
5. Gerçek telefonlarda 320/390 px kullanım, ürün fotoğrafları, yayın kapatma ve sunucu hata yanıtları.

Gerçek HTTPS test sunucusu ve fiziksel cihaz doğrulaması bu yerel çalışmada yapılmadı. Dekoratif ana sayfa fotoğrafları satış kataloğu veya stok beyanı değildir.
