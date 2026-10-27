# Teknikel — yerel canonical 0.4.0 kurulumu

Eski site depo kökünde korunur. Bu dizinin üstündeki `canonical/public/`, yeni
PHP document root'udur. Eski köke veya backend/data/media alanlarına taşıma yapılmadı.

Depo kökünden:

```bash
php -S 127.0.0.1:8099 -t canonical/public
```

API origin'i ayarlanmadan tema güvenli “yayın okunamıyor” durumuyla açılır. Gerçek
kurulumda `YA_SITE_API_ORIGIN`, ayrı çalışan mevcut public HTTP API origin'idir.
Tarayıcı için `/yardimci-asistan/` aynı origin'de mevcut modül sahibine bağlanmalıdır;
yalnız uzak SSR origin'i hesap, medya, widget ve sepeti bağlamaz. Tek PHP worker'ının
kendi API isteğini beklemesine yol açmayın. Secret, müşteri verisi veya test verisi
bu kuruluma eklenmez.

Teknikel ayrışması yalnız `site/`, `locales/tr.json`, `public/assets/site/`
altındadır. Layout, core, widget, portal ve storefront dağıtım kopyası byte-identical
canonical kaynaklardır. `README.md` üstteki ortak şablon belgesidir; bu belge site sahibine aittir.

```bash
node canonical/tools/manifest.mjs
node tests/canonical-theme.mjs
node tests/canonical-commerce.mjs
```

İkinci komut izole TEST HTTP fixture'ı, gerçek PHP ve yerel Chromium/Brave kullanır;
canlı veriye gitmez. Tarayıcı bulunamazsa `PLAYWRIGHT_CHROMIUM_EXECUTABLE` ile yolu
belirtin. Fixture sunucuları test bitince kapanır; görüntüler
`.test-artifacts/canonical/` altına yazılır. Fixture ürün görsellerinde kullanılan
logo yalnız görüntü çözümleme testi içindir, gerçek ürün fotoğrafı değildir.

İkinci turda tek Hesabım/profil, ortak sipariş liste/detayı, filtreli tek katalog,
ürün detayı ve tek sepet/checkout bağlandı. Bayi fiyatı backend'in yetkili katalog
cevabından gelir; ziyaretçi mod seçmez. Özel fiyatlar storage'a yazılmaz; sepet
taslağı yalnız hesap kapsamında ürün kimliği/miktar tutar ve her açılışta doğrulanır.
Hesap backend'inde yeni `api/account/receipt.php` salt okunur sonucu kurtarır;
canonical kopya API modülünü içermez, gerçek kurulumda bu endpoint de mevcut olmalıdır.

Eski `/urun/`, `/sepet/`, `/magaza/`, `/katalog/`, `/markalar/`, `/hesabim/` ve
`/bayi/` bağlantıları sabit hedefli canonical alias'ları kullanır; filtre/dil/action
parametreleri korunur. Production sunucuda bu yollar index fallback'ine bağlanmalıdır.
Eski sitenin kendisinde hiçbir route değişmedi. Katalog içi iki ürün karşılaştırması,
yakınlaştırma/sürükleme/döndürme ve cihaz fotoğrafını tarayıcıda açma vardır; eski
overlay/pinch/bağlı hareket/filtre araçlarının tamamı taşınmış sayılmaz.

Ana depodaki güncel teslim: `artifacts/site-redesign-plan/teknikel-ikinci-tur.md`.
Gerçek backend/medya/hesap callback ve HTTPS kurulumu henüz canlı doğrulanmadı.
