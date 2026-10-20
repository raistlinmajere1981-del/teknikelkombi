# Teknikel katalog verisi — veri kalitesi raporu

- **Kaynak:** https://www.teknikelkombiyedekparca.com.tr
- **Rapor oluşturma:** 2026-10-19T12:14:33+00:00
- **Örnek 30 ürün çekimi:** 2026-10-19T11:39:18+00:00 – 2026-10-19T11:41:45+00:00
- **Sitemap-only 151 ürün çekimi:** 2026-10-19T11:41:43+00:00 – 2026-10-19T11:53:59+00:00
- **Kapsam:** 24 kategori, 850 kategorili ürün, 151 yalnızca sitemap'te bulunan ürün (toplam 1.001 ürün URL'si), 30 ürünlük örneklem
- **Yöntem:** Yalnızca herkese açık kategori ve ürün sayfaları; yönetim paneline erişim yok.
- **Canlı site / veritabanı:** Değiştirilmedi. Bu klasördeki dosyalar yalnızca import adayıdır.

## 1. Yönetici özeti

1. 24 kategori sayfasının tamamı çekildi; kategori ürün sayıları sitenin resmî "Toplam N ürün" değerleriyle **birebir eşleşiyor** (850/850).
2. 850 kategorili üründe **tekrarlı stok kodu yok**; tümünde stok kodu, fiyat ve en az bir görsel var. Bununla birlikte 154 ürün kartında kaynak ürün kimliği listeleme HTML'inde bulunmuyor; örnek 30 ürünün tamamında ürün sayfasından kimlik okundu.
3. 151 ürün sitemap'te olmasına rağmen kategori listelerinde yok. Bu ürünlerin **tamamında kategori boş**, 144'ünde görsel yok, 148'inde marka yok, 145'inde açıklama yok. Fiyat medyanı 56.503,36 TRY; kategorili katalog medyanı 789,47 TRY. Bu grup **toplu import için uygun değil**.
4. 30 ürünlük örneklemde alanların önemli bölümü dolu, ancak **uyumlu kombi modeli yalnızca 1 üründe** açıkça yazılı. Açıklamaların 17'si boş, 8'i çok kısa, 2'si mağaza genel metniyle dolu.
5. Örneklemde 8 placeholder marka (`DİĞER`, `Diğer`, `TÜRKİYE`) ve 3 boş marka var. Importta bu 11 kayıt marka açısından **boş** kabul edilmeli.
6. Tüm örnek fiyatlar TRY ve **KDV dahil vitrin fiyatıdır** (`salePrice`). Bayi A/B fiyatı, stok adedi ve alış fiyatı kaynakta güvenilir biçimde bulunmadığı için **boş bırakıldı**. Sayfadaki `tax` değeri 29 üründe %20, 1 üründe %30; `tax_rate` ayrı import alanına yazılmadı.
7. Örnekteki 53 görsel URL'sinin tamamı HTTP 200 döndü. Buna karşın 2 üründe hiç görsel yok, 3 üründe yalnızca tek görsel var.
8. Stok kodu tekrarı yok; ancak 7 kayıtta stok kodu 11 haneli değil ve bunlardan biri `111111` placeholder'ı. Ayrıca aynı adı taşıyan 2 ürün çifti farklı stok kodlarıyla kayıtlı.

## 2. Kategori özeti

- 24 kategori, resmî toplam **850** ürün.
- Her kategoride `official_product_count == listed_product_count`.
- En büyük kategoriler:

| # | Kategori | Ürün | Örnek |
| --- | --- | ---: | ---: |
| 1. | Sirkülasyon Pompa | 72 | 2 |
| 2. | Plaka Eşanjör | 60 | 2 |
| 3. | Tamir Takımı | 57 | 2 |
| 4. | 3 Yollu Hidroblok | 55 | 2 |
| 5. | Akış Türbini | 49 | 1 |

Tam liste: `categories.csv` / `categories.json`.

## 3. Marka kalitesi

| Gösterge | Kategorili 850 | Sitemap-only 151 | Toplam 1.001 |
| --- | ---: | ---: | ---: |
| Kullanılabilir marka | 572 | 3 | 575 |
| Placeholder (`DİĞER`, `Diğer`, `TÜRKİYE`) | 261 | 0 | 261 |
| Boş marka | 17 | 148 | 165 |
| Ham farklı marka değeri | 89 | 4 | 90 (birleşik) |

- Ham farklı marka değeri satırındaki 89 ve 4, her kapsamın kendi içindeki farklı değerlerdir; ortak değerler nedeniyle birleşik toplam 90'dır.

- Ham değerlerde `DİĞER` (147), `Diğer` (4) ve `TÜRKİYE` (110) marka değil, "marka yok" anlamına gelen placeholder'lardır.
- `WİLO` (6) ve `Wilo` (4) aynı markadır; `brands.csv` içinde `Wilo` altında birleştirildi. `RESİDEO` için de `Resideo` normalizasyonu tanımlı.
- Diğer markaların yazım biçimi kaynaktan korundu; tam marka sözlüğü için IdeaSoft yönetim panelindeki marka tanımları esas alınmalı.
- `brand`, kaynak sitedeki parça üreticisi/marka atamasıdır; ürün adındaki kombi markasıyla aynı olmak zorunda değildir (örn. "VİESMAN SU AKIŞ ŞALTERİ" kaynağında `G-FORCE`). Marka ürün adından otomatik türetilmedi.
- Örneklemde marka durumu: **19 kullanılabilir, 8 placeholder, 3 boş**.

Placeholder veya boş markalı örnek ürünler:

- DEMİRDÖKÜM ATROMİX BUJİ (53250100440) — kaynak marka: TÜRKİYE
- VİESMAN VİTODENS ÖN AMYANT V TİP (53250100444) — kaynak marka: DİĞER
- BAYMAK MAİN DÜĞME (77890024006) — kaynak marka: TÜRKİYE
- PLAKALI EŞANJÖR CONTA ORİNG (53250100135) — kaynak marka: DİĞER
- VAİLLANT ECOFİT PURE ANA EŞANJÖR CONTASI (53251101174) — kaynak marka: DİĞER
- VİESMAN NTC KISA YERLİ (53250100559) — kaynak marka: TÜRKİYE
- BAYMAK KMP BAXİ KMP LUNA KMP (77890064039) — kaynak marka: TÜRKİYE
- BAYMAK LAMBERT ECO4 TÜRBİN OKUYUCU YERLİ (77890006036) — kaynak marka: Diğer
- TOTALİNE POMPA GRUNDFOS UYUMLU (77890054055) — kaynak marka: (boş)
- NİTROMİX EKRAN KARTI (53250100375) — kaynak marka: (boş)
- FERROLİ 3/8 KANCASIZ GENLEŞME TANKI ÖNAYSAN (53250100558) — kaynak marka: (boş)

## 4. Örnek 30 ürün — alan doluluk ve kalite

| Alan | Durum |
| --- | --- |
| Ürün adı | 30/30 |
| Stok kodu | 30/30, tamamı 11 haneli |
| Kaynak ürün kimliği | 30/30 |
| Kategori | 28/30 (2 sitemap-only üründe boş) |
| Kullanılabilir marka | 19/30 |
| Açıklama | 13/30 dolu; 17 boş; 8 tanesi 40 karakterden kısa |
| Mağaza genel metni içeren açıklama | 2/30 |
| Uyumlu kombi modeli | 1/30 (açık cümle) |
| Perakende fiyat | 30/30, tümü TRY ve KDV dahil vitrin fiyatı |
| Görsel | 28/30 en az bir görsel; 2/30 görselsiz; 3/30 tek görselli |
| Görsel URL kontrolü | 53/53 HTTP 200 |
| Listeleme kartı ile karşılaştırma | 28/28 eşleşti (SKU, ad, marka, fiyat, ürün kimliği) |
| Stok durumu | 24 InStock, 6 OutOfStock (gözlem anı) |
| Tekrarlı stok kodu (örnek 30) | 0 |
| Standart dışı stok kodu (örnek 30) | 0; katalog genelinde 7 (bkz. bölüm 6) |

### Örnek bayraklar

| Bayrak | Adet |
| --- | ---: |
| `missing_compatible_models` | 29 |
| `missing_description` | 17 |
| `short_description` | 8 |
| `placeholder_brand` | 8 |
| `out_of_stock_observed` | 6 |
| `price_outlier_global` | 3 |
| `single_image` | 3 |
| `missing_brand` | 3 |
| `description_generic_boilerplate` | 2 |
| `missing_category` | 2 |
| `missing_image` | 2 |
| `uncategorized` | 2 |

### Uyumlu kombi modeli

Yalnızca **ECO5 PLAKALI EŞANJÖR 12 PLAKA 160MM. (ERA)** ürününde açık ifade var:

> "Baymak Eco5 ve Airfel Digifel kombi modelleri ile tam uyumludur."

Çıkarım `explicit_sentence` olarak işaretlendi. Diğer 29 üründe uyumluluk, ürün adından veya açıklamadan **çıkarılmadı**. Bu alan import sırasında boş bırakılmalı; marka/model uyumluluğu teknik ekip tarafından doğrulanmalı.

### Stokta olmayan örnekler

- DEMİRDÖKÜM ATROMİX BUJİ (53250100440) — OutOfStock
- BAYMAK MAİN DÜĞME (77890024006) — OutOfStock
- ARİSTON CLAS DOLDURMA MUSLUĞU OTOMATİK (77890022002) — OutOfStock
- BOSCH CONDENSE SOL BLOK MAVİ MUSLUKLU (53250100296) — OutOfStock
- NİTROMİX EKRAN KARTI (53250100375) — OutOfStock
- FERROLİ 3/8 KANCASIZ GENLEŞME TANKI ÖNAYSAN (53250100558) — OutOfStock

### Tek görselli örnekler

- VİESMAN VİTODENS ÖN AMYANT V TİP (53250100444)
- PLAKALI EŞANJÖR CONTA ORİNG (53250100135)
- ADEN TAMİR TAKIMI (77890064045)

### Fiyat aykırılığı taraması

Kategorili 850 ürünün fiyat dağılımı: Q1 **290,79**, medyan **789,47**, Q3 **1.947,37**, üst çit **4.432,24** TRY. Bu çit dışındaki örnekler:

- ECA CALORA ANA EŞANJÖR 22 CM (77890008012) — 4736.84 TRY, global yüzdelik: 94.5, kategori: Ana Eşanjör
- NİTROMİX EKRAN KARTI (53250100375) — 56503.36 TRY, global yüzdelik: 100.0, kategori: (yok)
- FERROLİ 3/8 KANCASIZ GENLEŞME TANKI ÖNAYSAN (53250100558) — 35220.35 TRY, global yüzdelik: 100.0, kategori: (yok)

- ECA CALORA ANA EŞANJÖR 22 CM kategorili ve stokta; yüksek fiyatı iş kuralı olarak doğru olabilir, yine de kontrol edilmeli.
- NİTROMİX EKRAN KARTI ve FERROLİ 3/8 KANCASIZ GENLEŞME TANKI ÖNAYSAN sitemap-only, görselsiz, markasız, açıklamasız ve stok dışı. Fiyatları katalog medyanının onlarca katı; **hatalı/test kaydı olma riski yüksek**.

## 5. Sitemap-only 151 ürün

Bu ürünler sitemap'te var ve ürün sayfaları açılıyor, ancak kategori listelerinde hiç görünmüyor. Tamamı 151/151 kategori boş.

| Gösterge | Değer |
| --- | ---: |
| Kayıt | 151 |
| Fetch hatası | 0 |
| Kategori boş | 151 |
| Görsel yok | 144 |
| Marka yok | 148 |
| Açıklama yok | 145 |
| InStock / OutOfStock | 72 / 79 |
| Fiyat medyanı | 56.503,36 TRY |
| Kategorili katalog üst çitinin üzerinde | 132 |

En yüksek fiyatlı 5 kayıt:

- TURBOTECH ANAKART 3 ROLE (53250100374) — 188344.29 TRY, 0 görsel, InStock
- VİESMAN VİTODENS YOĞUŞMALI ANAKART WB1C (53250100999) — 188344.29 TRY, 0 görsel, OutOfStock
- TURBOTECH ANAKART 2 ROLE (53250100373) — 177043.61 TRY, 0 görsel, InStock
- ALARKO SERADENS ANAKART 4 YILDIZ (53250100981) — 150675.50 TRY, 0 görsel, InStock
- ARİSTON EGİS PREMİUM ANAKART YOĞ (53250100323) — 150675.50 TRY, 0 görsel, OutOfStock

Görseli olan ve fiyatı kategorili katalog aralığında kalan **7 kayıt** manuel inceleme için aday:

- ECA PROTEUS PLUS KART (53250100332) — 2736.84 TRY, 2 görsel, InStock
- ECA CONFEO PREMİX FAN TAMİRLİ (53250100367) — 4105.26 TRY, 2 görsel, InStock
- AİRFEL ÜÇ YOLLU VANA ALARKO SERADENS ÜÇ YOLLU VANA (53251101119) — 2842.11 TRY, 2 görsel, InStock
- VAİLLANT ECOTEC GAZ VALFİ (53251101141) — 2526.32 TRY, 2 görsel, InStock
- BAYMAK NOVADENS EXTRA BUJİ G-FORCE (53251101176) — 894.74 TRY, 3 görsel, InStock
- BAYMAK ALARKO TRENDY WARMHAUS MANOMETRE BAKIR BORU WİKA (77890034037) — 473.68 TRY, 2 görsel, InStock
- VİESMAN TRED MANOMETRE VİKA (77890034047) — 526.32 TRY, 2 görsel, InStock

Öneri: 151 kaydın tamamı **şimdilik import dışında tutulmalı**. 7 aday kayıt, görselleri ve fiyatları doğrulandıktan sonra kategori atanarak eklenebilir. Kalan 144 kayıt; görsel, marka, açıklama ve fiyat düzeltilmeden import edilmemeli. Detay: `uncategorized-products.csv`.

## 6. Tekrarlı stok kodları ve kimlikler

- Kategorili 850 üründe: **0 tekrarlı stok kodu**. Bilinen 696 ürün kimliğinde 0 tekrar var; 154 kartta kaynak ürün kimliği listeleme HTML'inde yok.
- Sitemap-only 151 ürünün tamamında ürün kimliği var; 0 tekrar.
- Sitemap-only 151 ürün dahil 1.001 üründe: **0 tekrarlı stok kodu**; bilinen 847 ürün kimliğinde 0 tekrar, 154 eksik kimlik.
- 1.001 stok kodunun tamamı benzersiz.
- `duplicate-stock-codes.csv` bu nedenle yalnızca başlık satırı içerir.

### Standart dışı stok kodları

11 haneli olmayan 7 kayıt:

- `778900026006` — 1/2 DIŞ DİŞLİ EMNİYET VENTİLİ PAKKENS (categorized) — https://www.teknikelkombiyedekparca.com.tr/urun/1-2-dis-disli-emniyet-ventil
- `7789006050` — TERMODİNAMİK ŞOFBEN AKIŞ TÜRBİNİ (categorized) — https://www.teknikelkombiyedekparca.com.tr/urun/termodinamik-sofben-akis-turbini
- `7789008144` — VİESMAN 050W ANA EŞAJÖR ÇIKIŞ HORTUMU ORJİNAL (categorized) — https://www.teknikelkombiyedekparca.com.tr/urun/viesman-050w-ana-esajor-cikis-hortumu-orjinal
- `7789008154` — ECA PROTEUS PREMİX YOĞUŞMA SİFON (categorized) — https://www.teknikelkombiyedekparca.com.tr/urun/eca-proteus-premix-yogusma-sifon
- `7789008155` — ECA PROTEUS PREMİX ÖN TAŞ AMYANT (categorized) — https://www.teknikelkombiyedekparca.com.tr/urun/eca-proteus-premix-on-tas-amyant
- `111111` — MAXİ CONDENS BASINÇ SONDASI (sitemap_only) — https://www.teknikelkombiyedekparca.com.tr/urun/maxi-condens-basinc-sondasi
- `23004021` — REKORLU ŞOFBEN AKIŞ ŞALTERİPLASTİK (sitemap_only) — https://www.teknikelkombiyedekparca.com.tr/urun/rekorlu-sofben-akis-salteri-plastik

`111111` açık bir placeholder/test kodudur; `MAXİ CONDENS BASINÇ SONDASI` kaydı aynı zamanda kategori, marka, görsel ve açıklama taşımıyor. Bu kayıt import edilmemeli.

### Aynı adlı ürünler

Stok kodu tekrarı olmasa da aynı adı taşıyan 2 ürün çifti var:

- **ARİSTON CARES MANOMETRE**
  - `53250100211` — 526.32 TRY — categorized — marka: BDR
  - `53250100238` — 263.16 TRY — categorized — marka: DİĞER
- **ARİSTON CLAS ONE ANAKART**
  - `53250101222` — 139374.83 TRY — sitemap_only — marka: (boş)
  - `53251101101` — 139374.83 TRY — sitemap_only — marka: (boş)

Bu kayıtlar farklı stok kodlarına sahip; biri gerçek duplikasyon, diğeri farklı tedarikçi/versiyon olabilir. Import öncesi manuel karşılaştırma gerekir.

Not: Tekrarlılık kontrolü yalnızca stok kodunun birebir aynı olmasına dayanır; farklı yazımla girilmiş aynı ürünü tespit etmez. Yakın/fuzzy ad benzerliği ayrıca incelenmedi.

## 7. Import kararları

1. **Tam katalog için IdeaSoft resmî çıktısı kullanılmalı.** Önerilen: `Entegrasyonlar > ideaOutput > 26 — Standart Katalog Çıktısı v3 (EXCEL)`. Bu çıktı; pasif ürünler, KDV, stok, varyant ve gerçek kategori/marka kimlikleri için web kazımadan daha güvenilirdir.
2. **30 ürünlük örnek** pilot import için kullanılabilir. `products.csv` / `products.json` bu amaçla hazırlandı.
3. **151 sitemap-only ürün** import edilmemeli; 7 aday manuel incelenmeli.
4. **Placeholder markalar** (`DİĞER`, `Diğer`, `TÜRKİYE`) ve boş markalar, `brand` alanında boş bırakıldı; kaynak değer `source_brand` alanında korundu.
5. **Bayi A/B fiyatı, stok adedi, alış fiyatı ve barkod** boş/null. KDV oranı ayrı import alanına yazılmadı; sayfadaki `tax` gözlemi raporlandı. Bu alanlar tahmin edilmedi.
6. **Uyumlu kombi modelleri** yalnızca açıkça yazılan 1 üründe dolu; diğerlerinde boş.
7. **Açıklamalar** düz metin olarak verildi. 2 üründeki mağaza genel metni temizlenmedi; import öncesi pazarlama/teknik metin olarak ayrıştırılmalı.
8. **Görseller:** ilk görsel `primary_image_url`, tümü `image_urls` alanında. Yardımcı Asistan ürün başına tek görsel kullanıyorsa `primary_image_url` seçilmeli.
9. **Kategori eşlemesi:** kaynak kategori adı ve IdeaSoft kategori kimliği ayrı alanlarda. Hedef sistemdeki kategori kimlikleriyle eşleme import sırasında yapılmalı.
10. **Fiyatlar** KDV dahil web vitrin fiyatıdır (`salePrice`). Sayfadaki `tax` değeri 29 üründe %20, 1 üründe %30; `tax_rate` ayrı import alanına yazılmadı. KDV oranı gerekiyorsa bu gözlem değerleri muhasebe doğrulamasıyla kullanılabilir; hedef sistem KDV hariç fiyat bekliyorsa dönüştürme ayrıca yapılmalı.

## 8. Sınırlamalar

- Yönetim paneline erişim yok; gerçek stok, maliyet, bayi fiyatı ve pasif ürün bilgisi alınamadı. KDV oranı yalnızca sayfadaki `tax` alanından gözlendi.
- Web fiyatı KDV dahil vitrin fiyatıdır; bayi fiyatı değildir. Bayi fiyatı tahmin edilmedi.
- `availability_observed` yalnızca sayfanın schema.org stok durumudur; stok adedi değildir.
- Ürün açıklamaları ve uyumluluk bilgileri eksik veya genel metin olabilir; teknik doğruluk garantisi yoktur.
- Görsel URL'leri 30 örnekte kontrol edildi; 151 sitemap-only kaydın görselleri ayrıca kontrol edilmedi.
- Kategori listeleri ile sitemap arasındaki 151 fark, sitenin kendi yapısından kaynaklanıyor; bu kayıtların pasif mi, test mi yoksa kategori ataması eksik mi olduğu panelden doğrulanmalı.
- Site `robots.txt` değeri `Crawl-delay: 30` ister. Bu tek seferlik çalışmada istekler arasında 1,2 sn beklenmiştir; paket tekrar çekim için kullanılmamalı, güncellemeler IdeaSoft panel çıktısından alınmalıdır.
- Veriler 2026-10-19T11:39:18+00:00 – 2026-10-19T11:53:59+00:00 aralığında public sayfalardan alınmıştır; fiyat ve stok zamanla değişebilir.

## 9. Dosyalar

- `products.csv` / `products.json` — 30 örnek ürün
- `categories.csv` / `categories.json` — 24 kategori ve sayıları
- `brands.csv` — marka normalizasyonu ve sayıları
- `catalog-summary.json` — makine okunur katalog özeti
- `uncategorized-products.csv` — 151 sitemap-only ürün
- `duplicate-stock-codes.csv` — tekrarlı stok kodu yok (yalnızca başlık)
- `README.md` — import kullanımı ve IdeaSoft çıktı adımları
