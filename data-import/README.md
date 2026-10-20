# Teknikel — Yardımcı Asistan import paketi

Bu klasör, Teknikel'in mevcut IdeaSoft sitesindeki **30 ürünlük pilot örnekleminden** ve kategori/marka özetinden oluşur. Canlı siteye veya Yardımcı Asistan veritabanına dokunmaz.

- Kaynak: https://www.teknikelkombiyedekparca.com.tr
- Paket oluşturma: 2026-10-19T12:14:33+00:00
- Örnek 30 ürün çekimi: 2026-10-19T11:39:18+00:00 – 2026-10-19T11:41:45+00:00
- Sitemap-only 151 ürün çekimi: 2026-10-19T11:41:43+00:00 – 2026-10-19T11:53:59+00:00
- Kapsam: 30 örnek ürün, 24 kategori, 850 kategorili ürün, 151 sitemap-only ürün
- Para birimi: TRY
- Ayrıntılı kalite bulguları: `data-quality-report.md`

## Hızlı başlangıç

1. `products.csv` veya `products.json` dosyasını pilot import için kullanın.
2. `categories.csv` ile hedef sistemdeki kategori kimliklerini eşleyin.
3. `brands.csv` içindeki `normalized_brand` değerlerini marka eşlemesi için kullanın.
4. `uncategorized-products.csv` kayıtlarını **import etmeyin**; önce manuel inceleyin.
5. `duplicate-stock-codes.csv` boşsa stok kodu tekrarı yoktur.

> Çekim notu: Public sayfa çekimi tek seferliktir. Site `robots.txt` içinde `Crawl-delay: 30` ister; bu çalışmada istekler arasında 1,2 sn beklenmiştir. Paketi yeniden çekmek yerine güncellemeler için IdeaSoft panel çıktısını kullanın.

## CSV biçimi

- Kodlama: **UTF-8 BOM** (`utf-8-sig`), Türkçe Excel uyumlu.
- Ayırıcı: **noktalı virgül `;`**.
- Ondalık ayırıcı: **nokta** (`2631.58`), binlik ayırıcı yok.
- Excel TR'de ondalık nokta metin olarak görünebilir; sayısal işlem için sütunu sayı biçimine alın veya `products.json` kullanın.
- Boş alan: bilinmiyor / null. `0` ile karıştırılmamalı.
- Çoklu değer ayırıcı: ` | ` (görsel URL'leri, örnek stok kodları).
- `data_quality_flags`: noktalı virgülle ayrılmış makine bayrakları.
- Tarihler ISO 8601 / UTC.

`products.json` aynı veriyi tipli olarak taşır; `null` değerler CSV'de boş hücredir.

## Önerilen IdeaSoft dışa aktarımı

Web kazıma yalnızca örnek/doğrulama içindir. Tam katalog için yönetim panelinden resmî çıktı alın:

1. IdeaSoft yönetim paneline giriş yapın.
2. **Entegrasyonlar > ideaOutput** bölümünü açın.
3. **26 — Standart Katalog Çıktısı v3 (EXCEL)** çıktısını seçin.
4. Kategori/marka kapsamını ve aktif/pasif ürün filtresini ihtiyaca göre seçin; import öncesi pasifleri ayıklayın.
5. Dosyayı bu klasöre `ideasoft-katalog.xlsx` adıyla koyun; alan eşlemesi için bu README'yi kullanın.
6. Tekrarlı/otomatik güncelleme gerekiyorsa IdeaSoft destekten **25 — XML katalog çıktısı**nın açılmasını isteyin.

Resmî doküman: <https://www.ideasoft.com.tr/yardim/idea-output-cikti-sistemi/>

> Panel çıktısı; stok adedi, KDV, pasif ürün, varyant ve gerçek marka/kategori kimlikleri için public sayfalardan daha güvenilirdir. Bu paketteki 30 ürün, panel çıktısı alınana kadar pilot import ve alan doğrulaması içindir.

## Alan eşlemesi

| CSV alanı | Yardımcı Asistan karşılığı | Not |
| --- | --- | --- |
| `source_product_id` | dış kaynak kimliği | IdeaSoft ürün `id`; kaynak izlenebilirliği |
| `sku` | `sku` | Stok kodu |
| `name` | `name` | Ürün adı, kaynaktan |
| `brand` | `brand` | Kullanılabilir marka; placeholder/boş ise boş |
| `source_brand` | — | Ham kaynak marka; denetim için |
| `brand_status` | — | `ok`, `placeholder`, `missing` |
| `category` | `categoryId` eşlemesi | Hedef kategori kimliği ayrıca eşlenmeli |
| `source_category_id` | — | IdeaSoft kategori kimliği |
| `description` | `description` | Düz metin |
| `compatible_boiler_models` | ürün açıklaması/özel alan | Çoğu üründe boş |
| `compatible_models_source` | — | `explicit_section` / `explicit_sentence` |
| `sale_price` | `salePrice` | KDV dahil web vitrin fiyatı, TRY |
| `currency` | `currency` | `TRY` |
| `dealer_price_a` | `dealerPriceA` | **Boş**; tahmin edilmedi |
| `dealer_price_b` | `dealerPriceB` | **Boş**; tahmin edilmedi |
| `tax_rate` | `taxRate` | Ayrı import alanına yazılmadı; sayfadaki `tax` 29 üründe %20, 1 üründe %30 |
| `primary_image_url` | `imageSourceUrl` | İlk görsel |
| `image_urls` | galeri | Dikey çizgi (&#124;) ile ayrılmış |
| `source_url` | `sourceProductUrl` | Kaynak ürün sayfası |
| `availability_observed` | — | `InStock` / `OutOfStock`, gözlem anı |
| `condition_note` | — | `2. el`, `çıkma`, `tamirli` vb. |
| `price_global_percentile` | — | Kategorili katalog içindeki yüzdelik |
| `price_outlier_global` | — | IQR çitine göre aykırılık taraması |
| `data_quality_flags` | — | Denetim bayrakları |
| `selection` | — | Örneklem seçim nedeni |
| `fetched_at` | `sourceFetchedAt` | ISO 8601 UTC |

### Boş bırakılan alanlar

- `barcode`: kaynakta yok.
- `purchase_price`: kaynakta yok.
- `stock_quantity`: stok adedi yayınlanmıyor; yalnızca `availability_observed` var.
- `tax_rate`: ayrı import alanına yazılmadı; sayfadaki `tax` değeri 29 üründe %20, 1 üründe %30 olarak göründü. Gerekiyorsa muhasebe doğrulamasıyla kullanılabilir.
- `dealer_price_a` / `dealer_price_b`: bayi fiyatı yayınlanmıyor; tahmin edilmedi.
- `unit`: kaynakta açık birim alanı yok.

## Kalite kuralları

- `brand` alanında `DİĞER`, `Diğer`, `TÜRKİYE` gibi placeholder değerler **boş** bırakıldı; ham değer `source_brand` alanında.
- `WİLO` / `Wilo` aynı marka altında birleştirildi. Diğer marka yazımları kaynaktan korundu.
- `brand`, kaynak sitedeki parça üreticisi/marka atamasıdır; ürün adındaki kombi markasıyla aynı olmayabilir. Marka ürün adından otomatik türetilmedi.
- 151 sitemap-only ürün kategori listelerinde yok; tamamı `exclude_until_review` veya `manual_review_possible_valid` olarak işaretlendi.
- `products.csv` içindeki 30 örnekten 2'si denetim amaçlı sitemap-only kayıttır; temiz pilot import için `selection` alanına göre filtreleyin.
- Kategorili katalog kartlarının 154'ünde kaynak ürün kimliği listeleme HTML'inde yok; 30 örnekte kimlik ürün sayfasından okundu.
- Stok kodu tekrarı yok; ancak 7 kayıtta stok kodu 11 haneli değil ve biri `111111` placeholder'ı. Aynı adlı 2 ürün çifti farklı stok kodlarıyla kayıtlı.
- 30 örnekteki fiyatlar KDV dahil web vitrin fiyatıdır (`salePrice`). Bayi/maliyet hesaplaması yapılmadı; hedef sistem KDV hariç fiyat bekliyorsa dönüştürme gerekir.
- Uyumlu kombi modeli yalnızca açıkça yazılan üründe dolu; marka/model uyumluluğu teknik doğrulama gerektirir.

## Dosyalar

| Dosya | İçerik |
| --- | --- |
| `products.csv` / `products.json` | 30 örnek ürün, import alanları |
| `categories.csv` / `categories.json` | 24 kategori, resmî/listelenen/örnek sayıları |
| `brands.csv` | Ham ve normalize marka, durum, adet |
| `catalog-summary.json` | Katalog, fiyat, marka, görsel ve örnek özeti |
| `uncategorized-products.csv` | 151 sitemap-only ürün ve inceleme kovası |
| `duplicate-stock-codes.csv` | Tekrarlı stok kodu listesi (şu an yalnızca başlık) |
| `data-quality-report.md` | Ayrıntılı bulgular ve import kararları |
