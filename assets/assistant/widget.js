var YardimciAsistanWidget=(function(e){Object.defineProperty(e,Symbol.toStringTag,{value:`Module`});var t={"Ana Sayfa":`Home`,"Öne çıkanlar":`Highlights`,Odalar:`Rooms`,Restoran:`Restaurant`,"QR Menü":`Menu`,Mağaza:`Shop`,Kampanyalar:`Offers`,Yorumlar:`Reviews`,Hakkımızda:`About`,Galeri:`Gallery`,İletişim:`Contact`,Kurulum:`Setup`,"Kullanım Kılavuzu":`Guide`,Dil:`Language`,"Site dili":`Site language`,"Site menüsü":`Site navigation`,Menü:`Menu`,Uygula:`Apply`,"Keşfet ve dene":`Explore and try`,"Restoran ve masalar":`Restaurant and tables`,"Güncel ürünler ve fiyatlar":`Products and prices`,"Kampanyalar ve duyurular":`Offers and announcements`,"İşletme fotoğrafı":`Business photo`,"İçeriğe geç":`Skip to content`,"Yardımcı Asistan ana sayfa":`Yardımcı Asistan home`,"Günlük işlerinize yardımcı":`Help with your daily work`,"Desktop, web ve Android.":`Desktop, web and Android.`,"Aynı işin farklı yüzleri.":`Different sides of the same business.`,"Desktop, web ve Android. Aynı işin farklı yüzleri.":`Desktop, web and Android. Different sides of the same business.`,Keşfedin:`Explore`,"İletişim ve konum →":`Contact and location →`,"İletişim bilgileri eklendiğinde burada görünecek.":`Contact details will appear here when published.`,"Birlikte deneyelim.":`Let's try it together.`,"Sosyal bağlantılar":`Social links`,"Yardımcı Asistan · Keşfet ve dene":`Yardımcı Asistan · Explore and try`,"İşinizin her günü,":`Every working day,`,"biraz daha kolay.":`a little easier.`,"Müşteriler, odalar, masalar ve satışlar. Günlük işlerinizi bir araya getiren Yardımcı Asistan’ı canlı örnekleriyle keşfedin.":`Customers, rooms, tables and sales. Explore live examples of Yardımcı Asistan bringing your daily work together.`,"Kurulumu Gör ↗":`View setup ↗`,"Canlı Yüzeyleri İncele":`Explore live demos`,"Yardımcı Asistan günlük çalışma ekranı":`Yardımcı Asistan daily workspace`,"Şu anda yayında":`Published now`,"Tüm kampanyalar →":`All offers →`,"Uygulamadan web’e":`From the app to the web`,"Canlı yüzeyleri inceleyin":`Explore the live demos`,"Yardımcı Asistan ile hazırlanan sayfaların ziyaretçi deneyimini keşfedin.":`Explore the visitor experience on pages powered by Yardımcı Asistan.`,"Yeni örnekler paylaşıldıkça burada yer alacak.":`New examples will appear here when published.`,"Örneği aç →":`Open demo →`,"Tüm odalar →":`All rooms →`,"Odalar hazırlanıyor…":`Loading rooms…`,Deneyimler:`Experiences`,"Google yorumları":`Google reviews`,"Tüm yorumlar →":`All reviews →`,"Birlikte çalışan araçlar":`Tools that work together`,"Yardımcı Asistan neler yapıyor?":`What can Yardımcı Asistan do?`,"İşletmenizin ihtiyacına göre açabileceğiniz çalışma alanları.":`Workspaces you can enable to suit your business.`,"Bağlantıda kalalım":`Stay in touch`,"İletişim ve konum":`Contact and location`,"İletişim sayfasını aç →":`Open contact page →`,"Konaklama seçenekleri, oda fotoğrafları ve olanaklar.":`Accommodation, room photos and amenities.`,"Oturma alanları, masa özellikleri ve fotoğraflar.":`Seating areas, table features and photos.`,"Kategoriler, lezzetler ve güncel fiyatlar.":`Categories, dishes and current prices.`,"Ürünleri inceleyin ve alışveriş deneyimini keşfedin.":`Browse products and explore the shopping experience.`,"Müşteri yönetimi":`Customer management`,"Müşteri bilgilerini, talepleri ve görüşmeleri bir arada tutun.":`Keep customer details, requests and conversations together.`,Pansiyon:`Accommodation`,"Odaları, rezervasyonları ve konaklamaları takip edin.":`Track rooms, reservations and stays.`,"Masaları, siparişleri ve günlük servisi yönetin.":`Manage tables, orders and daily service.`,"Market / satış":`Retail / sales`,"Ürün, stok ve satış işlemlerini bir araya getirin.":`Bring products, inventory and sales together.`,"Online satış":`Online sales`,"Ürünlerinizi web’de sunun, gelen siparişleri takip edin.":`Show your products online and track incoming orders.`,"Bayi sistemi":`Dealer management`,"Bayilerinizle ürün ve sipariş akışını düzenleyin.":`Manage products and orders with your dealers.`,Kargo:`Shipping`,"Siparişlerin gönderim sürecini takip edin.":`Track order shipments.`,Pazarlama:`Marketing`,"İçeriklerinizi ve kampanyalarınızı hazırlayıp paylaşın.":`Prepare and share your content and offers.`,"Müşteri iletişimini günlük işinize bağlayın.":`Connect customer communication to your daily work.`,"Android companion":`Android companion`,"Kendi bilgisayarında dene":`Try it on your computer`,"Deneme kurulumu":`Demo setup`,"Uygulamaları indirin, demo bağlantısını ekleyin ve keşfetmeye başlayın.":`Download the apps, add the demo connection and start exploring.`,"Kurulum adımları →":`Setup steps →`,indir:`download`,"Web modül adresi":`Web module URL`,Kopyala:`Copy`,"Bu bilgiler Yardımcı Asistan demo kurulumu içindir.":`These details are for the Yardımcı Asistan demo setup.`,"Bağlantı anahtarı henüz hazır değil.":`The connection key is not ready yet.`,"Kopyalandı.":`Copied.`,"Seçilen bilgiyi kopyalayabilirsiniz.":`You can copy the selected value.`,Oda:`Room`,Masa:`Table`,Ürün:`Product`,Kategori:`Category`,Telefon:`Phone`,Hazırlanıyor:`Loading`,Kapat:`Close`,"Kapak fotoğrafı yok":`No cover photo`,"Masaüstünden kapak medyası yayınlandığında burada görünür.":`A cover photo will appear here when published from Desktop.`,"Oda bilgileri hazırlanıyor…":`Loading room details…`,"Masa bilgileri hazırlanıyor…":`Loading table details…`,"Oda özellikleri":`Room details`,"Oda olanakları":`Room amenities`,"Masa özellikleri":`Table details`,"Özellikler hazırlanıyor…":`Loading features…`,"Rezervasyon / Bilgi Al":`Reservation / Information`,"Fotoğraflar ve videolar":`Photos and videos`,"Yayınlanmış medya":`Published media`,"Fotoğraf, video ve panoramik görünüm":`Photos, videos and panoramic views`,"360° görünüm":`360° view`,"180° görünüm":`180° view`,"Serbest bakış":`Look around`,"Geniş açı":`Wide angle`,"Oda videosu":`Room video`,"Masa videosu":`Table video`,"Yayınlanmış video":`Published video`,"Panoramik görünüm":`Panoramic view`,"Masalar hazırlanıyor…":`Loading tables…`,"Menü hazırlanıyor.":`Preparing the menu.`,"Menü yükleniyor...":`Loading the menu…`,"Menü kategorileri":`Menu categories`,"Henüz yayınlanmış galeri fotoğrafı bulunmuyor.":`No gallery photos have been published yet.`,"İşletme hakkında henüz yayınlanmış bilgi bulunmuyor.":`No information about the business has been published yet.`,"Henüz paylaşılmış bir kampanya yok. Yeni duyurular burada yer alacak.":`No offers have been published yet. New announcements will appear here.`,İşletmemiz:`Our business`,"İşletme fotoğraf galerisi.":`Business photo gallery.`,"İşletme hakkında bilgiler.":`Information about the business.`,Konaklama:`Accommodation`,"Odaları keşfedin":`Explore the rooms`,"Konaklama seçeneklerini, fotoğrafları ve oda olanaklarını inceleyin.":`Browse accommodation, photos and room amenities.`,"Odaları ve yayınlanmış oda bilgilerini inceleyin.":`Browse rooms and their published details.`,"Masaları ve oturma alanlarını keşfedin.":`Explore tables and seating areas.`,"Masaları inceleyin, size uygun alanı seçin.":`Browse the tables and find the right space for you.`,"Güncel menüyü, ürünleri ve fiyatları inceleyin.":`Browse the latest menu, products and prices.`,"Kategorileri keşfedin, ürünleri ve güncel fiyatları inceleyin.":`Explore categories, products and current prices.`,"Paylaşılan güncel haberleri ve kampanyaları inceleyin.":`Explore the latest published news and offers.`,"Ürünleri inceleyin ve siparişinizi bize iletin.":`Browse products and send us your order.`,"Yardımcı Asistan’ı keşfedin, canlı örneklerini inceleyin ve kendi bilgisayarınızda deneyin.":`Discover Yardımcı Asistan, explore live demos and try it on your own computer.`,"Yardımcı Asistan | Keşfet ve Dene":`Yardımcı Asistan | Explore and try`,"Odalar | Yardımcı Asistan":`Rooms | Yardımcı Asistan`,"Oda | Yardımcı Asistan":`Room | Yardımcı Asistan`,"Restoran | Yardımcı Asistan":`Restaurant | Yardımcı Asistan`,"Masa | Yardımcı Asistan":`Table | Yardımcı Asistan`,"QR Menü | Yardımcı Asistan":`Menu | Yardımcı Asistan`,"Galeri | Yardımcı Asistan":`Gallery | Yardımcı Asistan`,"Hakkımızda | Yardımcı Asistan":`About | Yardımcı Asistan`,"Mağaza | Yardımcı Asistan":`Shop | Yardımcı Asistan`,"Kampanyalar ve Duyurular | Yardımcı Asistan":`Offers and announcements | Yardımcı Asistan`,"Ürünlere geç":`Skip to products`,"Online sipariş":`Online ordering`,"Ürünleri seçin, siparişinizi bize iletin.":`Choose products and send us your order.`,Sepetim:`My cart`,"Teşekkür ederiz":`Thank you`,"Siparişiniz alındı":`Your order has been received`,"Sipariş referansı:":`Order reference:`,"Yeni sipariş başlat":`Start a new order`,Ürünler:`Products`,"Ürünleri yenile":`Refresh products`,"Ürünler yükleniyor…":`Loading products…`,Temizle:`Clear`,"İletişim bilgilerini gir":`Enter contact details`,"Sipariş bilgileri":`Order details`,"Adınızı ve ulaşabileceğimiz telefonu yazın.":`Enter your name and a phone number we can reach you on.`,"Ad / ad-soyad":`Name / full name`,"(zorunlu)":`(required)`,"(isteğe bağlı)":`(optional)`,"E-posta":`Email`,"Sipariş notu":`Order note`,Teslimat:`Delivery`,"Teslimat yöntemi":`Delivery method`,"İşletmeden teslim":`Collect from the business`,"Kargo ile gönderim":`Shipping`,"Teslimat adresi":`Delivery address`,"Teslim alacak kişi":`Recipient name`,Adres:`Address`,"Adres devamı (isteğe bağlı)":`Address line 2 (optional)`,İlçe:`District`,"İl / şehir":`City`,"Posta kodu (isteğe bağlı)":`Postal code (optional)`,"Ülke kodu (TR, GB, DE gibi)":`Country code (e.g. TR, GB, DE)`,"Teslimat notu (isteğe bağlı)":`Delivery note (optional)`,"Kargo ücreti ayrıca belirlenecektir.":`Shipping costs will be confirmed separately.`,"Siparişi gönder":`Send order`,"Mağazayı kullanmak için tarayıcınızda JavaScript'i etkinleştirin.":`Enable JavaScript in your browser to use the shop.`,"Önceki gönderimin sonucu belirsiz. Aynı iletişim ve teslimat bilgileriyle tekrar deneyin. Yeni sipariş göndermeyin.":`The previous submission could not be confirmed. Retry with the same contact and delivery details. Do not send a new order.`,"Görsel yok":`No image`,Satışta:`Available`,"Sepete ekle":`Add to cart`,"Gönderiliyor…":`Sending…`,"Aynı siparişi tekrar dene":`Retry the same order`,"Sepetiniz henüz boş.":`Your cart is empty.`,"Ürün kontrol ediliyor…":`Checking product…`,"Artık satışta değil veya katalog doğrulanamadı. Satırı kaldırın ya da ürünleri yenileyin.":`This product is no longer available or the catalog could not be verified. Remove it or refresh the products.`,"Bu ürünün birimi değişti. Miktarı güncelleyin.":`The product unit has changed. Update the quantity.`,Kaldır:`Remove`,"Satır miktarı en fazla 1000, toplam miktar en fazla 10000 olabilir.":`Each line can contain up to 1,000 units, with a total of 10,000 units.`,"Sepete en fazla 50 farklı ürün ve toplam 10000 birim ekleyebilirsiniz.":`You can add up to 50 different products and 10,000 units in total.`,"Mağazamız şu anda online sipariş almıyor.":`Our shop is not accepting online orders at the moment.`,"Şu anda satışta ürün bulunmuyor.":`There are no products available at the moment.`,"Ürünler şu anda yüklenemiyor. Ürünleri yenile düğmesiyle tekrar deneyin.":`Products could not be loaded. Use Refresh products to try again.`,"Teslimat yöntemleri katalogla birlikte yüklenir.":`Delivery methods will load with the catalog.`,"Teslimat yöntemini kontrol edin.":`Check the delivery method.`,"İki harfli ülke kodunu yazın (TR, GB gibi).":`Enter a two-letter country code (e.g. TR or GB).`,"Adınızı yazın (en fazla 160 karakter).":`Enter your name (up to 160 characters).`,"7–15 rakam içeren geçerli bir telefon yazın. Uluslararası numaralar kabul edilir.":`Enter a valid phone number with 7–15 digits. International numbers are accepted.`,"Geçerli bir e-posta yazın veya alanı boş bırakın.":`Enter a valid email address or leave the field empty.`,"Not en fazla 2000 karakter olabilir.":`The note can contain up to 2,000 characters.`,"Sepetteki ürünleri ve miktarları kontrol edin.":`Check the products and quantities in your cart.`,"Sipariş bilgileri çok uzun. Notu veya sepeti kısaltın.":`The order details are too long. Shorten the note or reduce the cart.`,"Güvenli sipariş kimliği üretilemedi. Güncel bir tarayıcı ve güvenli bağlantı kullanın.":`A secure order ID could not be created. Use an up-to-date browser and a secure connection.`,"Tekrar deneme bilgileri önceki siparişle eşleşmiyor. Yeni sipariş göndermeyin; önceki bilgileri kontrol edin veya işletmeyle iletişime geçin.":`The retry details do not match the previous order. Do not send a new order; check the original details or contact the business.`,"Mağaza sipariş almayı durdurdu. Sepetiniz korunuyor.":`The shop has stopped accepting orders. Your cart has been kept.`,"Mağaza şu anda online sipariş almıyor. Sepetiniz korunuyor.":`The shop is not accepting online orders at the moment. Your cart has been kept.`,"Ürünlerden biri artık satışta değil. Sepetinizi kontrol edip ilgili satırı kaldırın.":`One of the products is no longer available. Check your cart and remove it.`,"Seçilen teslimat yöntemi artık sunulmuyor. Güncel yöntemle siparişinizi tekrar gönderebilirsiniz.":`The selected delivery method is no longer available. You can retry your order using an available method.`,"Bekleme süresi doldu. Aynı siparişi tekrar deneyebilirsiniz.":`The wait is over. You can retry the same order.`,"Sipariş gönderilemedi. Ürünleri, iletişim ve teslimat bilgilerini kontrol edin.":`The order could not be sent. Check the products, contact and delivery details.`,"Siparişin sonucu doğrulanamadı. Bilgileriniz ve sepetiniz korunuyor. Aynı siparişi tekrar deneyin; yeni bir sipariş başlatmayın.":`The order could not be confirmed. Your details and cart have been kept. Retry the same order; do not start a new one.`," (tam sayı)":` (whole number)`," (en fazla 4 ondalık)":` (up to 4 decimal places)`,"Tüm Ürünler":`All products`,"Menü ürünü":`Menu item`,"Bu kategori için aktif ürün bulunmuyor.":`There are no available products in this category.`,"Güncelleme: ":`Updated: `,"Güncelleme bekleniyor.":`Waiting for an update.`,"Menü şu anda okunamadı.":`The menu could not be loaded. Please try again.`,"Odayı incele":`View room`,"Masayı incele":`View table`,"Rezervasyon sor":`Ask about a reservation`,"Duyurular / Kampanyalar":`News / Offers`,Tümü:`All`,Klima:`Air conditioning`,"Özel banyo":`Private bathroom`,Balkon:`Balcony`,Teras:`Terrace`,"Deniz manzarası":`Sea view`,"Bahçe manzarası":`Garden view`,"Dağ manzarası":`Mountain view`,"Mini buzdolabı":`Mini fridge`,Isıtma:`Heating`,"Çalışma masası":`Work desk`,"Mini mutfak":`Kitchenette`,"Basamaksız erişim":`Step-free access`,"Tekerlekli sandalye erişimine uygun":`Wheelchair accessible`,"Sigara içilmeyen oda":`Non-smoking room`," fotoğrafı":` photo`,"Oda fotoğrafı hazırlanıyor":`Room photo coming soon`,"Masa fotoğrafı hazırlanıyor":`Table photo coming soon`," / gece":` / night`,"Yayınlanmış aktif oda bulunmuyor.":`No active rooms have been published.`,"Yayınlanmış aktif masa bulunmuyor.":`No active tables have been published.`,"Oda özellikleri henüz yayınlanmadı.":`Room features have not been published yet.`,"Masa özellikleri henüz yayınlanmadı.":`Table features have not been published yet.`,"360° oda görünümü":`360° room view`,"360° masa görünümü":`360° table view`,"180° masa görünümü":`180° table view`,"Bu oda artık yayında değil veya bulunamadı.":`This room is no longer published or could not be found.`,"Bu masa artık yayında değil veya bulunamadı.":`This table is no longer published or could not be found.`,"Gösterilecek oda seçilmedi.":`No room has been selected.`,"Gösterilecek masa seçilmedi.":`No table has been selected.`,"Yardımcı Asistan canlı demo oda detayları.":`Live demo room details from Yardımcı Asistan.`,"Yardımcı Asistan canlı demo masa detayları.":`Live demo table details from Yardımcı Asistan.`,"Oda detayları ve konaklama bilgileri.":`Room details and accommodation information.`,"Masa özellikleri ve yayınlanmış müşteri bilgileri.":`Table features and published visitor information.`,"Odalar okunamadı.":`Rooms could not be loaded.`,"Masalar okunamadı.":`Tables could not be loaded.`,"Oda bilgilerine şu anda ulaşılamıyor.":`Room information is currently unavailable.`,"Oda bilgilerine ulaşılamıyor.":`Room information is unavailable.`,"Masa bilgilerine şu anda ulaşılamıyor.":`Table information is currently unavailable.`,"İç mekân":`Indoor seating`,"Açık alan":`Outdoor seating`,"Teras / veranda":`Terrace / patio`,"Cam kenarı":`By the window`,"Sakin bölüm":`Quiet area`,"Sigara içilmez":`No smoking`,"Sigara içilebilir":`Smoking allowed`,"Yalnız açık alanda sigara içilebilir":`Smoking allowed outdoors only`,"Restoran / masa web yayını masaüstünden kapalı.":`The restaurant / table publication is disabled on Desktop.`,"Yayın kapalı":`Publication disabled`,"Bölüm belirtilmedi":`Area not specified`,"Evcil hayvan kabul edilir":`Pets welcome`,"Çocuklu ailelere uygun":`Family friendly`,Bahçe:`Garden`,"Bagaj emaneti":`Luggage storage`,"Havalimanı transferi":`Airport transfer`,"İşletme olanakları henüz yayınlanmadı.":`Business amenities have not been published yet.`,"Google Maps puanı bağlı.":`Google Maps rating connected.`,"Gösterilebilecek yorum metni bulunamadı.":`No review text is available to display.`,"Google Maps kullanıcısı":`Google Maps user`,"Oda fotoğrafı":`Room photo`,"İşletme konumu":`Business location`,"Canlı müsaitlik kontrol ediliyor...":`Checking live availability…`,"Canlı Müsaitlik":`Live availability`,"Müsaitlik Kontrolü":`Availability check`,"Müsaitlik sorgusu rezervasyon oluşturmaz; son onay işletmeye aittir.":`Checking availability does not create a reservation; final confirmation rests with the business.`,"Müsaitlik kontrol ediliyor":`Checking availability`,"AI Yardımcıya Sor":`Ask the AI assistant`,"Talep türü geçerli değil. Lütfen yeniden deneyin.":`The request type is invalid. Please try again.`,"Lütfen gerekli alanları kontrol edin.":`Please check the required fields.`,İşletme:`Business`,"Web talep bağlantısı bu sitede etkin değil. İsterseniz WhatsApp üzerinden yazabilirsiniz.":`Web requests are not enabled on this site. You can contact us on WhatsApp instead.`,"Talep işletmeye iletilemedi.":`The request could not be sent to the business.`,"Talep işletmeye iletilemedi. İnternet bağlantınızı kontrol edip tekrar deneyin.":`The request could not be sent. Check your internet connection and try again.`,"İlgili oda":`Room`,"İlgili masa":`Table`,"İlgili ürün":`Product`,"İlgili kayıt":`Related item`,"Lütfen giriş ve çıkış tarihlerini seçin.":`Please choose your check-in and check-out dates.`,"Çıkış tarihi giriş tarihinden sonra olmalı.":`Check-out must be after check-in.`,"Lütfen rezervasyon tarihini seçin.":`Please choose a reservation date.`,"Lütfen rezervasyon saatini seçin.":`Please choose a reservation time.`,"Talebiniz işletmeye iletildi":`Your request has been sent to the business`,"İşletme talebinizi inceleyip sizinle iletişime geçecek.":`The business will review your request and contact you.`,"Talebiniz kaydedildi.":`Your request has been saved.`,"WhatsApp'tan da yaz":`Also send via WhatsApp`,"WhatsApp'tan Yaz":`Message on WhatsApp`,"WhatsApp'ta Aç":`Open in WhatsApp`,Tamam:`Done`,"Talebi Gönder":`Send request`,"Talep gönderiliyor…":`Sending request…`,"Yardımcı Asistan'ı aç":`Open Yardımcı Asistan`,"Asistanı kapat":`Close assistant`,Yardımcı:`Helper`,Asistan:`Assistant`,"İşletme yardımcısı":`Business assistant`,"Merhaba, ben Nexa.":`Hi, I'm Nexa.`,"İşlemi seçin; gerekli alanı doğrudan açayım.":`Choose an action and I'll open the right form for you.`,"Hızlı asistan seçenekleri":`Quick assistant actions`,"Rezervasyon yap":`Make a reservation`,"Tarih ve kişi bilgilerini iletin":`Send your dates and guest details`,"Masa sor":`Ask about a table`,"Tarih, saat ve kişi sayısını seçin":`Choose a date, time and party size`,"Ürün / stok sor":`Ask about products / stock`,"Ürün ve stok bilgisini hızlıca öğrenin":`Find product and stock information quickly`,"Asistana sor":`Ask the assistant`,"İşletme hakkında kısa bir soru sorun":`Ask a quick question about the business`,"Yol tarifi":`Directions`,"Konumu açın veya ulaşımı sorun":`Open the location or ask how to get here`,"Hazır bir mesaj oluşturun":`Prepare a message`,"Masa talebi":`Table request`,"Rezervasyon talebi":`Reservation request`,"Masa talebinizi hazırlayalım":`Let's prepare your table request`,"Rezervasyonunuzu hazırlayalım":`Let's prepare your reservation`,"Tarih ve iletişim bilgilerinizi ekleyin.":`Add your dates and contact details.`,"Ad soyad":`Full name`,"Adınız soyadınız":`Your full name`,"Kısa not":`Short note`,"Tercihiniz veya eklemek istediğiniz kısa not":`Your preferences or a short note`,"Konaklama tarihleri":`Dates of stay`,Giriş:`Check-in`,"Giriş tarihi":`Check-in date`,Çıkış:`Check-out`,"Çıkış tarihi":`Check-out date`,"Tarih ve saat":`Date and time`,Tarih:`Date`,"Tarih seç":`Choose a date`,Saat:`Time`,"Saat seç":`Choose a time`,"Kişi sayısı":`Number of guests`,"Kişi sayısını azalt":`Fewer guests`,"Kişi sayısını artır":`More guests`,"Bilgi al":`Information`,"Merak ettiğiniz şeyi sorun":`What would you like to know?`,"Kısa sorunuzu yazın veya sık sorulanlardan birini seçin.":`Write a short question or choose one below.`,"Sık sorulan sorular":`Frequently asked questions`,"Kısa soru":`Short question`,"Örn. Bu akşam 4 kişilik masa var mı?":`E.g. Is there a table for 4 this evening?`,"Yanıt hazırlanıyor…":`Preparing an answer…`,"AI Yardımcı":`AI assistant`,"Mesajınızı birlikte hazırlayalım":`Let's prepare your message`,"Konuyu seçin; metni isterseniz göndermeden önce düzenleyin.":`Choose a topic; you can edit the message before sending it.`,"WhatsApp mesaj konusu":`WhatsApp message topic`,Mesajınız:`Your message`,"Kısa mesajınızı yazın":`Write a short message`,"Hazır mesaj":`Prepared message`,"Bir konu seçtiğinizde mesajınız burada görünecek.":`Your message will appear here when you choose a topic.`,"Bize nasıl ulaşabilirsiniz?":`How can you find us?`,"Konumu açabilir veya ulaşım hakkında kısa bir soru sorabilirsiniz.":`Open the location or ask a quick question about getting here.`,"Adres bilgisi site tarafından iletilmedi.":`The site has not provided an address.`,"Haritada Aç":`Open map`,"Yol Tarifi Sor":`Ask for directions`,"Seçili oda":`Selected room`,"Seçili masa":`Selected table`,"Seçili ürün":`Selected product`,"Sayfa bağlamı":`Page context`,Geri:`Back`,"Bu işlem işletmenin etkin web seçeneklerinde kullanılamıyor.":`This action is not available with the business's current web settings.`,"1 gün":`1 day`,"2 gün":`2 days`,"7 gün":`7 days`,"10 gün":`10 days`,Bugün:`Today`,Yarın:`Tomorrow`,"Önceki ay":`Previous month`,"Sonraki ay":`Next month`,"Takvimi kapat":`Close calendar`,Pzt:`Mon`,Sal:`Tue`,Çar:`Wed`,Per:`Thu`,Cum:`Fri`,Cmt:`Sat`,Paz:`Sun`,"Saat seçimi":`Choose a time`,"Saat seçimini kapat":`Close time picker`,Saatler:`Hours`,Dakikalar:`Minutes`,Dakika:`Minute`,"Bilgi almak istiyorum.":`I'd like some information.`,"İşletmenize nasıl gelebilirim?":`How can I get to your business?`,"Mesajınızı yazdığınızda burada görünecek.":`Your message will appear here as you type.`,"Lütfen kısa sorunuzu yazın.":`Please write a short question.`,"AI bağlantısı bu sitede etkin değil. Sorunuzu WhatsApp'tan iletebilirsiniz.":`AI is not enabled on this site. You can send your question on WhatsApp.`,"AI servisine ulaşılamadı. İnternet veya sunucu bağlantısını kontrol edin. Hata kodu: widget_connection_failed.":`The AI service could not be reached. Check your internet or server connection. Error code: widget_connection_failed.`,"Lütfen bir konu seçin veya kısa mesajınızı yazın.":`Please choose a topic or write a short message.`,"AI yanıtı alınamadı.":`No AI answer could be retrieved.`," Biraz sonra yeniden deneyebilirsiniz.":` You can try again shortly.`,"Rezervasyon, masa ve bilgi taleplerinizi hızlıca hazırlayayım.":`Let me help you prepare reservation, table and information requests.`,"Oda, rezervasyon ve konaklama sorularınızda yardımcı olayım.":`Let me help with rooms, reservations and accommodation.`,"Masa, menü ve restoran sorularınızda yardımcı olayım.":`Let me help with tables, menus and restaurant information.`,"Ürün, stok ve işletme bilgileri için yardımcı olayım.":`Let me help with products, stock and business information.`,"İşletme hakkında bilgi ve iletişim taleplerinizde yardımcı olayım.":`Let me help with business information and contact requests.`,"AI Asistanı":`AI assistant`,Yardımcısı:`Assistant`,"Oda fiyatları":`Room prices`,"Oda müsaitliği":`Room availability`,"Kahvaltı saatleri":`Breakfast hours`,"Masa var mı?":`Is a table available?`,"Menü hakkında bilgi":`Menu information`,"Çocuklar için uygun mu?":`Is it suitable for children?`,"Ürün stokta mı?":`Is the product in stock?`,"Ürün fiyatı":`Product price`,"Çalışma saatleri":`Opening hours`,"Konum ve yol tarifi":`Location and directions`,Konum:`Location`,"Rezervasyon soracağım":`Ask about a reservation`,"Masa soracağım":`Ask about a table`,"Menü hakkında soracağım":`Ask about the menu`,"Ürün / stok soracağım":`Ask about products / stock`,"Kendi mesajımı yazacağım":`Write my own message`,"{0} kişi":`{0} guests`,"{0} oda":`{0} rooms`,"{0} masa":`{0} tables`,"{0}. kat":`Floor {0}`,"{0} fotoğrafı":`Photo of {0}`,"{0} fotoğrafı {1} büyüt":`Enlarge photo {1} of {0}`,"{0} fotoğrafı {1}":`Photo {1} of {0}`,"{0} / gece":`{0} / night`,"{0} görselleri":`Images for {0}`,"{0} Google Maps değerlendirmesi":`{0} Google Maps reviews`,"{0}: miktarı azalt":`{0}: decrease quantity`,"{0}: miktarı artır":`{0}: increase quantity`,"{0}: miktar ({1})":`{0}: quantity ({1})`,"{0}: satırı kaldır":`{0}: remove item`,"Ara toplam: {0}":`Subtotal: {0}`,"{0} sepetinizde.":`{0} is in your cart.`,"Bu alanı kontrol edin (en fazla {0} karakter).":`Check this field (up to {0} characters).`,"Pozitif, en fazla 1000 {0} girin{1}. Toplam miktar 10000'i aşamaz.":`Enter a positive quantity of up to 1,000 {0}{1}. The total cannot exceed 10,000 units.`,"Çok kısa sürede fazla istek gönderildi. {0} saniye sonra aynı siparişi tekrar deneyebilirsiniz.":`Too many requests were sent. Retry the same order in {0} seconds.`,"Bugün, {0}":`Today, {0}`,"Yarın, {0}":`Tomorrow, {0}`,"{0} hakkında bilgi almak istiyorum.":`I'd like information about {0}.`,"Merhaba, {0} hakkında bilgi almak istiyorum. Sorum: {1}":`Hello, I'd like information about {0}. My question: {1}`,"{0} adresine nasıl gelebilirim?":`How can I get to {0}?`,"Merhaba, {0} için oda müsaitliği ve rezervasyon hakkında bilgi almak istiyorum.":`Hello, I'd like information about room availability and reservations at {0}.`,"Merhaba, {0} için masa müsaitliği hakkında bilgi almak istiyorum.":`Hello, I'd like information about table availability at {0}.`,"Merhaba, {0} menüsü hakkında bilgi almak istiyorum.":`Hello, I'd like information about the menu at {0}.`,"Merhaba, {0} için ürün ve stok bilgisi almak istiyorum.":`Hello, I'd like information about products and stock at {0}.`,"{0} Hata kodu: {1}{2}.{3}":`{0} Error code: {1}{2}.{3}`,adet:`item`,paket:`pack`,kutu:`box`,metre:`metre`,birim:`unit`,"Yardımcı Asistan’a Sor":`Ask Yardımcı Asistan`,"Yardımcı Asistan’a sor":`Ask Yardımcı Asistan`,"Geçerli bir telefon numarası girin. Örnek: +90 532 123 45 67 veya +44 20 7946 0958.":`Enter a valid phone number. For example: +90 532 123 45 67 or +44 20 7946 0958.`,"Telefon numarası boş olamaz.":`Enter a phone number.`,"İşlerinizi telefonunuzdan da takip edin.":`Keep track of your work on your phone too.`,"Web sitesi entegrasyonu":`Website integration`,"Odalarınızı, menünüzü ve duyurularınızı ziyaretçilerle paylaşın.":`Share your rooms, menu and announcements with visitors.`,"Odaları ve olanakları keşfedin.":`Explore rooms and amenities.`,"Odaları inceleyin, size uygun olanı seçin.":`Browse the rooms and find the right one for you.`,"Yayınlanmış oda bilgileri ve medya örneği.":`Published room details and media.`,"Oda detayları":`Room details`,"Odanın özelliklerini, fotoğraflarını ve konaklama bilgilerini inceleyin.":`Explore room features, photos and accommodation details.`,"Yayınlanmış masa bilgileri ve medya örneği.":`Published table details and media.`,"Masa detayları":`Table details`,"Masanın kapasitesini, özelliklerini ve fotoğraflarını inceleyin.":`Explore table capacity, features and photos.`,"64 bit Windows":`64-bit Windows`,"32 bit Windows":`32-bit Windows`,değerlendirme:`reviews`,"Telefon numarası geçerli formatta olmalı. Yurt dışı numaralarında ülke kodunu ekleyin. Örnek: +90 532 123 45 67 veya +44 7911 123456":`Enter a valid phone number. Include the country code for international numbers. For example: +90 532 123 45 67 or +44 7911 123456`,"Yorumu Google Maps'te gör ↗":`View review on Google Maps ↗`,"{0} değerlendirme":`{0} reviews`,"{0} üzerinden 5 yıldız":`{0} out of 5 stars`,"İstek işlenemedi. Lütfen bilgileri kontrol edip tekrar deneyin.":`Your request could not be processed. Check the details and try again.`,"Çok fazla istek gönderildi. Biraz sonra aynı talebi tekrar deneyin.":`Too many requests were sent. Retry the same request shortly.`,"AI hizmeti şu anda kullanılamıyor. Lütfen tekrar deneyin.":`The AI service is currently unavailable. Please try again.`,"Merhaba, {0} için talep oluşturmak istiyorum.":`Hello, I would like to send a request to {0}.`,"Talep türü: {0}":`Request type: {0}`,"Ad soyad: {0}":`Full name: {0}`,"Telefon: {0}":`Phone: {0}`,"Tarih: {0}":`Date: {0}`,"Saat: {0}":`Time: {0}`,"Kişi sayısı: {0}":`Guests: {0}`,"Not: {0}":`Note: {0}`,"Lütfen bilgileri kontrol edip gönder tuşuna basın.":`Please check the details and press send.`,"İletişim | Yardımcı Asistan":`Contact | Yardımcı Asistan`,"İletişim ve konum bilgileri.":`Contact and location details.`,"Bize ulaşın":`Get in touch`,"İletişim bilgilerini, sosyal bağlantıları ve konumu burada bulabilirsiniz.":`Find contact details, social links and our location here.`,"Henüz paylaşılmadı":`Not published yet`,"Mesaj hazırla":`Prepare a message`,"Web talebi":`Web request`,"Talep oluştur":`Create a request`,"Yol tarifi al":`Get directions`,"Haritada aç ↗":`Open map ↗`,"Konum henüz paylaşılmadı":`Location not published yet`,"Konum bilgisi eklendiğinde harita burada görünecek.":`The map will appear here when the location is published.`,"© OpenStreetMap katkıda bulunanlar":`© OpenStreetMap contributors`,"Google Yorumları | Yardımcı Asistan":`Google reviews | Yardımcı Asistan`,"Google değerlendirmeleri.":`Google reviews.`,"Google Yorumları":`Google reviews`,"Google Maps üzerindeki deneyimleri ve değerlendirmeleri okuyun.":`Read experiences and reviews on Google Maps.`,"Güncel değerlendirmeler":`Recent reviews`,"Google Maps yorumları":`Google Maps reviews`,"Canlı bilgiler yükleniyor…":`Loading live information…`,"Google yorumları yükleniyor…":`Loading Google reviews…`,"Google Maps değerlendirmeleri":`Google Maps reviews`,"Google Maps'te aç ↗":`Open in Google Maps ↗`,"Kullanım Kılavuzu | Yardımcı Asistan":`Guide | Yardımcı Asistan`,"Yardım ve öğrenme":`Help and learning`,"Kullanım kılavuzu":`User guide`,"Yardımcı Asistan ile çalışırken ihtiyaç duyacağınız rehberler.":`Guides to help you work with Yardımcı Asistan.`,"Kılavuz bölümleri":`Guide sections`,Başlangıç:`Getting started`,Yakında:`Coming soon`,"Kullanım kılavuzu hazırlanıyor":`The user guide is being prepared`,"Ekran görüntüleri ve kısa adımlarla anlatılan bölümler burada yer alacak.":`Guides with screenshots and short steps will appear here.`,"Kurulum adımlarını gör →":`View setup steps →`,"Kurulum | Yardımcı Asistan":`Setup | Yardımcı Asistan`,Başlayalım:`Let's get started`,"Yardımcı Asistan’ı deneyin":`Try Yardımcı Asistan`,"Desktop’u kurun, demo bağlantısını ekleyin ve kendi çalışma alanınızı keşfedin.":`Install Desktop, add the demo connection and explore your workspace.`,"Dört kısa adım":`Four short steps`,"İlk kurulum":`Initial setup`,"Desktop’u kur":`Install Desktop`,"Bilgisayarınıza uygun Windows paketini indirin ve kurulumu tamamlayın.":`Download the Windows package for your computer and complete the installation.`,"İşletme profilini seç":`Choose a business profile`,"Başlangıç ekranında denemek istediğiniz çalışma alanını seçin.":`Choose the workspace you want to try on the welcome screen.`,"Web bağlantısını ekle":`Add the web connection`,"Ayarlar → Servisler → Website bölümünde yukarıdaki web adresini ve demo anahtarını kullanın.":`In Settings → Services → Website, use the web address and demo key above.`,"Android’i bağla":`Connect Android`,"İhtiyaç duyarsanız Android companion’ı kurun ve Desktop üzerinden cihazınızı bağlayın.":`If needed, install the Android companion and connect your device through Desktop.`,"İndir, bağlan, dene":`Download, connect, explore`,"Kurulum yardımı →":`Setup help →`,"Linux Desktop":`Linux Desktop`,"Linux paketi henüz yayınlanmadı.":`The Linux package has not been published yet.`,"Android Companion":`Android Companion`,"Masaüstüne bağlı telefon uygulaması":`Phone app connected to Desktop`,"İndirilebilir paket henüz yayınlanmadı.":`No download package has been published yet.`,Sürüm:`Version`,"Uygulamayı indir":`Download the app`,"Bilgisayarınıza uygun yayınlanmış paketi seçin ve kurulumu tamamlayın.":`Choose a published package for your computer and complete the installation.`,"Demo bağlantısını kur":`Connect to the demo`,"Ayarlar → Web bağlantısı alanına aşağıdaki adresi ve anahtarı girip Bağlan düğmesine basın.":`In Settings → Web connection, enter the address and key below, then select Connect.`,"Özellikleri keşfet":`Explore the features`,"İşletme profilinizi seçin; örnek ekranları ve canlı sayfaları inceleyin.":`Select your business profile, then explore the sample screens and live pages.`,"Bir işi tamamlamak için kısa adımlar ve uygulamadan gerçek ekranlar.":`Short steps and real app screens to help you complete a task.`,"Rezervasyon oluştur":`Create a reservation`,"Pansiyon ekranında rezervasyonlar ve odalar":`Reservations and rooms in the accommodation screen`,"Pansiyon alanında Rezervasyonlar bölümünden yeni rezervasyon formunu açın.":`In Accommodation, open the new reservation form from Reservations.`,"Müşteriyi, giriş ve çıkış tarihlerini, kişi sayısını ve iletişim bilgilerini girin.":`Enter the customer, arrival and departure dates, guest count and contact details.`,"Kaydı kontrol edip kaydedin; oda atamasını uygun odayı seçerek tamamlayın.":`Review and save the record, then assign an available room.`,"Ürün ve stok ekle":`Add products and inventory`,"Satış ekranındaki ürünler ve kategoriler":`Products and categories in the sales screen`,"Satış → Ürünler alanında Yeni ürün düğmesini seçin; ad, birim, fiyat ve varsa barkodu girin.":`In Sales → Products, select New product and enter its name, unit, price and barcode if available.`,"Stok takibini etkinleştirip ürünü kaydedin.":`Enable inventory tracking and save the product.`,"Stok alanında ürünü seçin, mevcut fiziksel miktarı yazıp Sayımı Kaydet düğmesine basın. Yeni alımları Tedarikçiler / Alım alanından kaydedin.":`In Inventory, select the product, enter the physical quantity and select Save count. Record new purchases in Suppliers / Purchasing.`,"Android Companion eşleştir":`Pair Android Companion`,"Desktop Ayarlar sayfasında Android servisinin Ayarlar düğmesini açın, servisi etkinleştirip kaydedin.":`In Desktop Settings, open the Android service settings, enable the service and save.`,"Telefonda USB hata ayıklamasını açın, bilgisayara bağlayın ve bağlantı iznini onaylayın.":`Enable USB debugging on your phone, connect it to the computer and allow the connection.`,"Telefonlar alanında Yenile ile cihazı bulun; gerekiyorsa Uygulamayı Kur, ardından Kurulumu Tamamla düğmesini kullanın. Cihaz rolünü ve izinlerini kontrol edin.":`In Phones, select Refresh to find the device. If needed, select Install app, then Complete setup. Review its role and permissions.`,"Müşteri kaydı oluştur":`Create a customer record`,"Müşteri İşleri ekranında müşteriler ve kayıtlar":`Customers and records in Customer Operations`,"Müşteri İşleri alanında yeni müşteri çalışma alanını açın.":`In Customer Operations, open the new customer workspace.`,"Ad ve iletişim bilgilerini girip kaydedin.":`Enter the name and contact details, then save.`,"Müşteri kaydından geçmiş işlemleri inceleyin; yalnız gerekli bilgileri ekleyin.":`Review past transactions in the customer record and add only the information you need.`,"İlk bağlantı":`First connection`,"Desktop ve demo bağlantısı":`Desktop and the demo connection`,"İndir ve Kur":`Download and set up`,"İndir ve Kur bölümünden bilgisayarınıza uygun yayınlanmış paketi indirin. İlk açılışta işletme profilinizi seçin.":`Download a published package for your computer from Download and set up. Choose your business profile on first launch.`,"Ayarlar → Web bağlantısı alanına demo adresini ve anahtarını girip Bağlan düğmesine basın. Bağlantı doğrulandıktan sonra otomatik eşitlemeyi açıp kaydedin.":`In Settings → Web connection, enter the demo address and key and select Connect. Once verified, enable automatic sync and save.`,"Görünür alanlar seçilen işletme yeteneklerine ve cihaz izinlerine göre değişir.":`Available screens depend on enabled business capabilities and device permissions.`,"Paketler ve demo bağlantısı →":`Packages and demo connection →`,"Görüntüyü büyüt":`Enlarge image`,"Gerçek uygulama ekranı · örnek veriler":`Real application screen · sample data`,"Desktop Android servis ayarları ve kayıtlı telefonlar":`Desktop Android service settings and registered phones`,"Merhaba!":`Hello!`,"Düşünüyorum…":`Thinking…`,"Dinliyorum…":`Listening…`,"Yanıt hazır.":`Answer ready.`,"Tamamlandı.":`Completed.`,"Bir sorun oldu.":`Something went wrong.`,"Akıllı yardımcı ve servisler":`A smart assistant and connected services`,Android:`Android`,"Açık masaları ve siparişleri takip edin, hesabı mevcut satış akışıyla kapatın.":`Track open tables and orders, then close the bill through the sales flow.`,"Bayi Android":`Dealer Android`,"Bayi Android · Pilot":`Dealer Android · Pilot`,"Bayi Android · Pilot giriş ekranı":`Dealer Android · Pilot sign-in screen`,"Bir profil seçin, çalışma alanlarına bakın.":`Choose a profile and explore its workspaces.`,"Bu profilde":`In this profile`,Canlı:`Live`,"Canlı Sayfalar":`Live Pages`,"Canlı · Uygulamaya bağlı":`Live · Connected to the app`,"Canlı örneği aç":`Open live example`,"Daha az dağınıklık, daha çok iş":`Less clutter, more progress`,"Davetli bayi girişi, katalog ve sipariş akışını pilot uygulamada deneyin.":`Explore invited dealer sign-in, catalogue and orders in the pilot app.`,"Desktop eşleştirme ekranı":`Desktop pairing screen`,"Desktop’tan yayınlanan sayfalar":`Pages published from Desktop`,"Desteklenen seslerle metni dinleyin veya kaydettiğiniz sesi inceleyerek metne dönüştürün.":`Listen with supported voices or review a transcription of your recording.`,"Doğrulama gerekir":`Verification required`,"Ekranları keşfet":`Explore the screens`,"Etkin ve yayınlanmış örnekler burada görünür.":`Enabled, published examples appear here.`,"Finans ve raporlar":`Finance and reports`,"Gelir, gider ve ödeme hareketlerini tarih aralığına göre inceleyin.":`Review income, expenses and payments by date range.`,"Gerçek uygulama ekranları. Örnek verilerle, yakından inceleyin.":`Real application screens. Explore them with sample data.`,"Görseli büyüt":`Enlarge image`,"Görseli kapat":`Close image`,"Günlük iş":`Daily work`,"Günlük işlerini tek yerden yönet":`Manage your daily work in one place`,"Günlük çalışma ekranı":`Daily workspace`,"Hesap ve izin gerektirir":`Account and permissions required`,"Hızlı satış ve kasa":`Quick sale and checkout`,"KBS hazırlığı ve takip":`KBS preparation and tracking`,"Konaklama bildirimlerini hazırlayıp durumlarını izleyin; gerçek gönderim ayrıca sağlayıcı doğrulaması gerektirir.":`Prepare accommodation notifications and track their status; submission requires separate provider verification.`,"Konaklama ve servis":`Accommodation and service`,"Konaklama ve servis, aynı işletmede.":`Accommodation and food service in one business.`,"Kullanıcı kontrolünde":`You control sending`,"Market müşterilerinin hesap hareketlerini ve tahsilatlarını takip edin.":`Track retail customer accounts and collections.`,"Market profilinde bayi müşterilerini ve fiyat gruplarını isteğe bağlı açın.":`Optionally enable dealer customers and price groups in the retail profile.`,"Market/Perakende":`Market/Retail`,"Masa ve sipariş":`Tables and orders`,"Masadan siparişe, menüden kasaya.":`From tables to orders, from menu to checkout.`,"Menü · oda · ürün · duyuru":`Menu · room · product · announcement`,"Mesaj taslağını hazırlayın; WhatsApp Web gönderimini siz yönetin.":`Prepare a message draft and control sending in WhatsApp Web.`,"Metin, değerlendirme ve görsel hazırlığı için yapılandırdığınız AI sağlayıcısıyla çalışın.":`Work with your configured AI provider to prepare text, insights and images.`,"Müşteri kartlarını, talepleri ve iletişim geçmişini bir arada tutun.":`Keep customer records, requests and communication history together.`,"Müşteriler, odalar, masalar ve satışlar. İşinize uygun bir çalışma alanı; Desktop, Android ve web ile birlikte.":`Customers, rooms, tables and sales. A workspace that fits your business across Desktop, Android and the web.`,"Nasıl yapılır?":`How does it work?`,"Oda durumundan giriş, çıkış ve konaklama hesabına aynı yerden ulaşın.":`Reach room status, check-in, check-out and stay accounts in one place.`,"Odalar, misafirler ve günlük takip.":`Rooms, guests and daily operations.`,"Pansiyon + Restoran/Kafe":`Guesthouse + Restaurant/Café`,"Pazarlama ve Instagram":`Marketing and Instagram`,Pilot:`Pilot`,"Profil detayını kapat":`Close profile details`,"Restoran/Kafe":`Restaurant/Café`,"Rezervasyon talebi · müşteri talebi · sipariş":`Booking request · customer request · order`,"Rezervasyon ve konaklama":`Bookings and stays`,"Rezervasyonları ve günlük görevleri aynı takvimden açın.":`Open bookings and daily tasks from the same calendar.`,"SMS ve WhatsApp Business":`SMS and WhatsApp Business`,"Satış ve stok":`Sales and stock`,"Sağ alttaki yardımcıya sorun veya canlı örneklerden birini açın.":`Ask the assistant at the bottom right or open a live example.`,"Sağlayıcı bağlantısı":`Provider connection required`,"Servisler kendi hesaplarınız, bağlantılarınız ve izinlerinizle etkinleşir.":`Services use your own accounts, connections and permissions.`,"Ses ve dikte":`Voice and dictation`,"Sonraki görsel":`Next image`,"Takvim ve görevler":`Calendar and tasks`,"Telefon erişimini Desktop’tan eşleştirin ve cihaz yetkilerini yönetin.":`Pair phone access from Desktop and manage device permissions.`,"Toptan ve bayi":`Wholesale and dealers`,"Veresiye ve tahsilat":`Customer credit and collections`,"Web siten de sistemin bir parçası":`Your website is part of the system`,WhatsApp:`WhatsApp`,"Yayınlanan içerik web’de görünür; talepler ve siparişler işinize geri döner.":`Published content appears on the web; requests and orders flow back to your business.`,"Çalışan örnekleri gör":`See working examples`,"Önceki görsel":`Previous image`,"Özellikleri filtrele":`Filter features`,"Ürün, stok ve barkod":`Products, stock and barcodes`,"Ürün, stok, barkod ve hızlı satış.":`Products, stock, barcodes and quick sale.`,"Ürünleri düzenleyin, stok hareketlerini ve barkodlu ürünlerinizi yönetin.":`Edit products and manage stock movements and barcodes.`,"Ürünü okutun veya seçin, sepeti oluşturup ödemeyi tamamlayın.":`Scan or select products, build a basket and complete payment.`,"İhtiyacınız olduğunda, yanınızda":`There when you need it`,"İsteğe bağlı":`Optional`,"İsteğe bağlı: QR Menü ve online satış":`Optional: QR Menu and online sales`,"İsteğe bağlı: QR Menü, stok ve online satış":`Optional: QR Menu, stock and online sales`,"İsteğe bağlı: rezervasyon ve Android Companion":`Optional: bookings and Android Companion`,"İsteğe bağlı: veresiye, toptan ve bayi":`Optional: customer credit, wholesale and dealers`,"İzinli alıcı listeleriyle, tanımlı sağlayıcı ve onaylı şablon koşullarında kampanya yürütün.":`Run campaigns with opted-in recipients, configured providers and approved templates where required.`,"İçerik hazırlayın, web’de yayınlayın ve izinli Instagram hesabıyla tek görsel paylaşın.":`Prepare content, publish it on the web and share a single image through an authorised Instagram account.`,"İşiniz farklı, yardımcınız aynı":`Different businesses, the same assistant`,"İşletmene göre şekillenir":`Fits the way you work`,"İşletmeni keşfet":`Explore your business`,"İşletmenizin günlük yardımcısı":`Your everyday business assistant`,"Online mağaza örneği":`Online store example`,"Bayi Android (Pilot)":`Dealer Android (Pilot)`,"Android 8.0+ · test sürümü; mağaza sürümü değil":`Android 8.0+ · test build; not an app store release`,"Windows x64":`Windows x64`,"Windows x86":`Windows x86`,"Tanıtım ve test merkezi":`Introduction and testing centre`,"Yardımcı Asistan’ı tanıyın,":`Explore Yardımcı Asistan,`,"uygulamadan deneyin.":`try it from the app.`,"Konaklama, restoran, perakende ve toptan işlemlerini örnek ekranlarda inceleyin. Desktop’ı bağlayın, kendi yayınlarınızı web ve Android ile test edin.":`Explore accommodation, restaurant, retail and wholesale tools in sample screens. Connect Desktop and test your own publications with web and Android.`,"Profilleri incele":`Explore profiles`,"Web bağlantısını incele":`Explore the web connection`,"Örnek katalog · 18 ürün":`Sample catalogue · 18 products`,"Mağaza görünümünü inceleyin":`Explore the store layout`,"Bu ürünler yalnızca tanıtım örneğidir; canlı mağazaya eklenmez ve sipariş oluşturmaz. Ürün çizimleri temsilidir.":`These products are presentation examples only. They are not added to the live store and cannot create orders. Product drawings are illustrative.`,"Kendi yayınlarınızla test edin":`Test with your own publications`,"Aşağıdaki sayfalar yalnız Desktop’tan yayınladığınız verileri gösterir. Yayın yoksa boş görünür; içerik kaldırıldığında sayfadan da kalkar. Bayi portalı davet ve oturum gerektirir.":`The pages below show only data you publish from Desktop. They are empty without a publication, and withdrawn content disappears. The dealer portal requires an invitation and a session.`,"Desktop yayınıyla test":`Test with a Desktop publication`,"Test sayfasını aç":`Open the test page`,"Bayi müşterilerini, fiyat gruplarını ve siparişlerini yönetin; davetli web erişimini isteğe bağlı açın.":`Manage dealer customers, price groups and orders, and optionally enable invited web access.`,"Müşteri talepleri":`Customer requests`,"Web ve telefon kanallarından gelen talepleri Müşteri İşleri alanında takip edin.":`Track requests from web and phone channels in Customer Operations.`,"Çoklu dil ve AI çeviri":`Languages and AI translation`,"Yayın metinlerini elle veya AI desteğiyle çevirin; eksik ve güncelliğini yitiren çeviriler Türkçeye döner.":`Translate published text manually or with AI assistance; missing and stale translations fall back to Turkish.`,"AI için sağlayıcı gerekir":`AI requires a provider`,"Market / Perakende / Toptan":`Market / Retail / Wholesale`,"Ürün, stok, barkod, hızlı satış ve isteğe bağlı bayi işlemleri.":`Products, stock, barcodes, quick sale and optional dealer operations.`,"AI çeviri ve Dil Yönetimi":`AI translation and Language Management`,"Web’de yayınlanan metinler için hedef dilleri seçin; manuel çevirileri koruyun ve AI çevirilerini kontrol edin.":`Choose target languages for published web text, retain manual translations and review AI translations.`,"Teslimat ve kargo":`Delivery and shipping`,"Siparişte teslim alma veya kargoyu seçin; gönderileri ve takip bilgilerini yönetin. Aras bağlantısı hesap ve başarılı bağlantı testi gerektirir.":`Choose pickup or shipping for orders and manage shipments and tracking details. Aras requires an account and a successful connection test.`,"Hesap ve bağlantı testi":`Account and connection test`,"Bayi portalı":`Dealer portal`,"Davetli bayiler kendi katalog, fiyat ve siparişlerine web’den erişir; erişim ve sipariş yetkileri Desktop’tan yönetilir.":`Invited dealers access their own catalogue, prices and orders on the web; Desktop manages access and order permissions.`,"Barkoddan ürün bilgisi":`Product details by barcode`,"Desteklenen barkodları Open Food Facts üzerinden sorgulayın; dönen ürün bilgilerini kontrol ederek kullanın.":`Look up supported barcodes through Open Food Facts and review the returned product details before using them.`,"Ürün bulunmasına bağlı":`Subject to product availability`,"Doğum günü hatırlatmaları":`Birthday reminders`,"İzinli müşteri kayıtları için doğum günü mesajı hazırlığını WhatsApp ayarlarıyla birlikte yönetin.":`Manage birthday message preparation for consenting customers alongside WhatsApp settings.`,"İzin ve servis ayarı":`Consent and service settings`,"Google yorumları ve harita":`Google reviews and maps`,"Yayınlanan işletme iletişimini ve konumunu web’de gösterin; Google yorumları için kendi hesabınızı yapılandırın.":`Show published business contacts and location on the web, and configure your own account for Google reviews.`,"Online mağaza":`Online store`,"Yayınlanan ürünleri inceleyin; sipariş kabulü açıksa gerçek sipariş akışını deneyin.":`Browse published products and try the real order flow when order acceptance is enabled.`,"Oda ve rezervasyon":`Rooms and reservations`,"Yayınlanan odaları inceleyin ve rezervasyon talebinin Desktop’a ulaşmasını test edin.":`Browse published rooms and test the reservation request reaching Desktop.`,"Yayınlanan masaları ve masa detaylarını inceleyin.":`Browse published tables and their details.`,"Desktop’tan yayınladığınız menü, ürün ve fiyat değişikliklerini görün.":`View menu, product and price changes published from Desktop.`,"Desktop’tan oluşturulan davetle oturum açın; bayiye özel katalog ve siparişleri deneyin.":`Sign in with an invitation created in Desktop and test dealer-specific catalogues and orders.`,"Duyurular ve kampanyalar":`Announcements and campaigns`,"Yayınladığınız duyuruları görün; düzenleme ve yayından kaldırma sonuçlarını kontrol edin.":`View your published announcements and check the results of editing and withdrawal.`,"İşletme bilgileri ve galeri":`Business details and gallery`,"İşletme açıklaması, fotoğraflar ve konum bilgileri kendi yayınlarınızdan gelir.":`Business descriptions, photos and location details come from your own publications.`,"Yayınlanan işletme fotoğraflarını ve desteklenen medyaları inceleyin.":`Browse published business photos and supported media.`,"İletişim ve yorumlar":`Contacts and reviews`,"Yayınlanan iletişim bilgilerini ve yapılandırılmış Google yorumlarını ayrı sayfalarda inceleyin.":`View published contact details and configured Google reviews on their own pages.`,"Alım, tedarikçi ve stok sayımı":`Purchasing, suppliers and stock counts`,"Ürün alımlarını, tedarikçi hesaplarını ve fiziksel stok sayımlarını kaydedin.":`Record product purchases, supplier accounts and physical stock counts.`,"Barkod ve raf etiketi":`Barcodes and shelf labels`,"Barkodlu ürünlerle çalışın; ürün ve raf etiketlerini hazırlayın.":`Work with barcoded products and prepare product and shelf labels.`,"Sipariş ve teslim hazırlığı":`Orders and delivery preparation`,"Manuel, web ve bayi siparişlerini takip edin; satışa dönüştürme ve gönderim adımlarını ayrı yönetin.":`Track manual, web and dealer orders, keeping sales conversion and shipping steps separate.`,"Yedek ve veri aktarımı":`Backups and data transfer`,"Yerel yedekleri, içe ve dışa aktarma araçlarını kullanın; uygulama kilidiyle erişimi koruyun.":`Use local backups and import/export tools, and protect access with the app lock.`,"Filtre kahve":`Filter coffee`,"Türk kahvesi":`Turkish coffee`,"Bitki çayı":`Herbal tea`,"20 poşet":`20 bags`,Zeytinyağı:`Olive oil`,"Çiçek balı":`Flower honey`,"Çilek reçeli":`Strawberry jam`,Makarna:`Pasta`,Bulgur:`Bulgur`,"Kırmızı mercimek":`Red lentils`,"Sıvı sabun":`Liquid soap`,Şampuan:`Shampoo`,"El kremi":`Hand cream`,"Bulaşık deterjanı":`Dishwashing liquid`,"Yüzey temizleyici":`Surface cleaner`,"Temizlik bezi":`Cleaning cloth`,"3 adet":`3 pieces`,"Kâğıt havlu":`Paper towels`,"2 rulo":`2 rolls`,"Pamuklu havlu":`Cotton towel`,Defter:`Notebook`,"80 yaprak":`80 sheets`,Gıda:`Food`,Bakım:`Care`,Ev:`Home`,Kırtasiye:`Stationery`,"Desktop’tan içerik yayınlayın; Canlı Sayfalar üzerinden değişiklikleri, yayından kaldırmayı ve yeni işlemleri test edin.":`Publish content from Desktop and use Live Pages to test changes, withdrawal and new operations.`,"Tanıtımı inceleyin, Desktop’ı bağlayın ve kendi verilerinizle test edin.":`Explore the introduction, connect Desktop and test with your own data.`,"Telefondan talep, rezervasyon, masa ve stok işlemlerine cihaz izinleriyle erişin; eşleştirmeyi Desktop’tan yönetin.":`Access requests, reservations, tables and stock operations from your phone with device permissions, and manage pairing from Desktop.`,"Yayınlanan masaları inceleyin; masa rezervasyonu taleplerini uygulamayla test edin.":`Browse published tables and test table reservation requests with the app.`,"Yerel yedek ve veri aktarımını kullanın; bildirimleri takip edin ve uygulama kilidiyle erişimi koruyun.":`Use local backups and data transfer, follow notifications and protect access with the app lock.`,"Davetle giriş yapın; bayiye özel katalog, fiyat, sepet ve sipariş geçmişini pilot uygulamada test edin.":`Sign in by invitation and test the dealer-specific catalogue, prices, cart and order history in the pilot app.`,"Örnek mağaza":`Sample store`,"Ürünleri inceleyin":`Browse products`,"Temsili ürün ve fiyatlar":`Illustrative products and prices`,Kategoriler:`Categories`,"Sepet örneği":`Sample cart`,"2 ürün · örnek toplam":`2 products · sample total`,"Sabit tanıtım örneği; sipariş oluşturmaz.":`Static illustration; no orders are created.`,"Temsili mağaza · örnek ürün ve fiyatlar":`Sample store · illustrative products and prices`,"Temsili ürün ve fiyatlar · sabit tanıtım görseli":`Illustrative products and prices · static presentation image`,Toplam:`Total`},n=document.documentElement.lang===`en`?`en-GB`:`tr-TR`;function r(e,r={}){return(n===`en-GB`?t[e]??e:e).replace(/\{(\w+)\}/g,(e,t)=>Object.hasOwn(r,t)?String(r[t]):e)}function i(e){return r(e).replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e])}var a=`#yardimci-asistan-widget`,o=!1,s=!1,c=``,l=[],u={apiBaseUrl:``};function d(){o||(o=!0,u={...u,...ne()},f(),queueMicrotask(f),document.addEventListener(`submit`,p,!0))}function f(){let e=window.YardimciAsistanWidget;if(!e||typeof e.init!=`function`||e.__availabilityInitWrapped===!0)return;let t=e.init.bind(e);e.init=(e={})=>{u={...u,...re(e)},t(e)},e.__availabilityInitWrapped=!0}function p(e){let t=e.target instanceof HTMLFormElement?e.target:null;if(!t?.matches(`.ya-widget-ai[data-ya-ai-form]`))return;if(t.dataset.yaAvailabilityBypass===`1`){delete t.dataset.yaAvailabilityBypass;return}let n=new FormData(t),r=String(n.get(`message`)??``).trim();if(!r)return;let i=c!==``&&y(r,l),a=v(r);!i&&!a?b():(e.preventDefault(),e.stopImmediatePropagation(),s||m(t,r,i))}async function m(e,t,n){let i=u.apiBaseUrl.trim().replace(/\/$/,``);if(!i){h(e);return}let a=n?`${c} ${t}`.trim():t;s=!0,_(e,!0),ee(r(`Canlı müsaitlik kontrol ediliyor...`));try{let t=await(await fetch(`${i}/api/availability.php`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({message:a})})).json().catch(()=>null);if(t?.handled!==!0||!t.answer){b(),h(e);return}t.complete===!1?(c=a,l=Array.isArray(t.missing)?t.missing.filter(e=>typeof e==`string`):[]):b(),e.isConnected&&(g(e,t.answer,t.live===!0),te(),_(e,!1))}catch{b(),h(e)}finally{s=!1}}function h(e){e.isConnected&&(te(),_(e,!1),e.dataset.yaAvailabilityBypass=`1`,queueMicrotask(()=>{e.isConnected&&e.requestSubmit()}))}function g(e,t,n){let i=e.closest(`.ya-widget-subview`);if(!i)return;let a=i.querySelector(`.ya-widget-ai-answer`);a||(a=document.createElement(`div`),a.className=`ya-widget-ai-answer`,e.insertAdjacentElement(`afterend`,a)),a.dataset.yaAvailabilityAnswer=`1`,a.replaceChildren();let o=document.createElement(`p`),s=document.createElement(`strong`);s.textContent=r(n?`Canlı Müsaitlik`:`Müsaitlik Kontrolü`);let c=document.createElement(`span`);c.textContent=t,o.append(s,c),a.append(o);let l=i.querySelector(`.ya-widget-inline-trust`);l&&(l.textContent=r(`Müsaitlik sorgusu rezervasyon oluşturmaz; son onay işletmeye aittir.`))}function _(e,t){let n=e.querySelector(`button[type="submit"]`);if(!n)return;n.disabled=t;let i=n.querySelector(`span`);i&&(i.textContent=r(t?`Müsaitlik kontrol ediliyor`:`AI Yardımcıya Sor`))}function v(e){let t=e.toLocaleLowerCase(`tr-TR`),n=/\b(?:oda(?:lar)?|otel|pansiyon|konaklama)(?:mız|miz|muz|müz|ımız|imiz|umuz|ümüz|nız|niz|nuz|nüz|ınız|iniz|unuz|ünüz)?(?:da|de|ta|te|dan|den|tan|ten|ya|ye|yı|yi|yu|yü|nın|nin|nun|nün)?\b/u.test(t),r=/(müsait|musait|boş|bos|yer\s+var|rezervasyon)/u.test(t)||/\b(?:oda(?:lar)?|otel|pansiyon|konaklama)(?:mız|miz|muz|müz|ımız|imiz|umuz|ümüz|nız|niz|nuz|nüz|ınız|iniz|unuz|ünüz)?(?:da|de|ta|te|dan|den|tan|ten|ya|ye|yı|yi|yu|yü|nın|nin|nun|nün)?\s+var(?:\s*m[ıiuü])?\b/u.test(t);return n&&r}function y(e,t){let n=e.toLocaleLowerCase(`tr-TR`).trim();return!!(t.includes(`guest_count`)&&(/^\d{1,2}$/.test(n)||/\b\d{1,2}\s*(kişi|kisi|kişilik|kisilik|yetişkin|yetiskin|çocuk|cocuk)\b/u.test(n))||t.includes(`date_range`)&&(/\b20\d{2}-\d{2}-\d{2}\b/.test(n)||/\b\d{1,2}[./]\d{1,2}(?:[./]20\d{2})?\b/.test(n)||/\b\d{1,2}\s*(?:-|–|—|ile)\s*\d{1,2}\b/u.test(n)||/\b(ocak|şubat|subat|mart|nisan|mayıs|mayis|haziran|temmuz|ağustos|agustos|eylül|eylul|ekim|kasım|kasim|aralık|aralik|bugün|bugun|yarın|yarin)\b/u.test(n)))}function b(){c=``,l=[]}function ee(e){let t=document.querySelector(`${a} [data-ya-status]`);t&&(t.textContent=e,t.hidden=!1)}function te(){let e=document.querySelector(`${a} [data-ya-status]`);e&&(e.textContent=``,e.hidden=!0)}function ne(){let e=Array.from(document.scripts).reverse(),t=document.currentScript??e.find(e=>e.dataset.apiBaseUrl!==void 0||/widget\.js(?:$|\?)/.test(e.src));return re({...t?.dataset.apiBaseUrl===void 0?{}:{apiBaseUrl:t.dataset.apiBaseUrl}})}function re(e){let t={};return typeof e.apiBaseUrl==`string`&&e.apiBaseUrl.trim()&&(t.apiBaseUrl=e.apiBaseUrl),t}var ie={pension_reservation:`Pansiyon rezervasyonu`,restaurant_reservation:`Masa rezervasyonu`,general_info:`Bilgi talebi`},ae=/^\+[1-9]\d{6,14}$/,oe=/^5\d{9}$/,se=`Telefon numarası geçerli formatta olmalı. Yurt dışı numaralarında ülke kodunu ekleyin. Örnek: +90 532 123 45 67 veya +44 7911 123456`;function ce(e,t){let n=de(e);if(!n.ok)return{ok:!1,mode:`wa_link`,code:`invalid_phone`,message:n.error};let r=t.trim();if(!r)return{ok:!1,mode:`wa_link`,code:`empty_message`,message:`WhatsApp mesajı boş olmamalı.`};let i=encodeURIComponent(r);return{ok:!0,mode:`wa_link`,url:`https://wa.me/${n.whatsapp}?text=${i}`,whatsappPhone:n.whatsapp,phoneDisplay:n.display,message:r,encodedMessage:i}}function le(e,t){let n=ce(e,t);return n.ok?n.url:``}function ue(e,t){let n=ie[e.request_type]??`Bilgi talebi`;return[`Merhaba, ${t} için talep oluşturmak istiyorum.`,`Talep türü: ${n}`,`Ad soyad: ${e.customer_name}`,`Telefon: ${e.customer_phone}`,`Tarih: ${e.date_text}`,e.time_text?`Saat: ${e.time_text}`:``,`Kişi sayısı: ${e.guest_count}`,e.message?`Not: ${e.message}`:``,`Lütfen bilgileri kontrol edip gönder tuşuna basın.`].filter(Boolean).join(`
`)}function de(e){let t=fe(e);return t.ok?{ok:!0,whatsapp:t.whatsapp,e164:t.e164,national:t.national,display:pe(e)}:{ok:!1,error:t.error}}function fe(e){let t=me(e.trim()),n=``;if(t.startsWith(`+`)){if(!ae.test(t)||t.startsWith(`+90`)&&!oe.test(t.slice(3)))return{ok:!1,error:se};n=t}else{let e=he(t);if(!e||!oe.test(e))return{ok:!1,error:se};n=`+90${e}`}let r=n.slice(1);return{ok:!0,e164:n,national:n.startsWith(`+90`)?n.slice(3):r,whatsapp:r}}function pe(e){let t=fe(e);return t.ok?t.e164.startsWith(`+90`)&&t.national.length===10?`+90 ${t.national.slice(0,3)} ${t.national.slice(3,6)} ${t.national.slice(6,8)} ${t.national.slice(8,10)}`:t.e164:e.trim()}function me(e){if(!e||!/^[+\d\s()./-]+$/.test(e))return``;let t=e.replace(/[\s()./-]/g,``);return t.startsWith(`00`)?`+${t.slice(2)}`:t}function he(e){return e.startsWith(`90`)&&e.length===12?e.slice(2):e.startsWith(`0`)&&e.length===11?e.slice(1):e.length===10?e:null}function ge(e,t){if(n===`tr-TR`)return ue(e,t);let i=e.request_type===`pension_reservation`?r(`Rezervasyon talebi`):e.request_type===`restaurant_reservation`?r(`Masa talebi`):r(`Bilgi talebi`);return[r(`Merhaba, {0} için talep oluşturmak istiyorum.`,{0:t}),r(`Talep türü: {0}`,{0:i}),r(`Ad soyad: {0}`,{0:e.customer_name}),r(`Telefon: {0}`,{0:e.customer_phone}),r(`Tarih: {0}`,{0:e.date_text}),e.time_text?r(`Saat: {0}`,{0:e.time_text}):``,r(`Kişi sayısı: {0}`,{0:new Intl.NumberFormat(n).format(Number(e.guest_count))}),e.message?r(`Not: {0}`,{0:e.message}):``,r(`Lütfen bilgileri kontrol edip gönder tuşuna basın.`)].filter(Boolean).join(`
`)}var x={CUSTOMERS:`core.customers`,REQUESTS:`customer.requests`,TASKS:`core.tasks`,CALENDAR:`core.calendar`,NOTIFICATIONS:`core.notifications`,FINANCE:`core.finance`,REPORTS:`core.reports`,WEB:`core.web`,SYNC:`core.sync`,BACKUPS:`core.backups`,DEVICES:`core.devices`,WHATSAPP:`service.whatsapp`,MARKETING_STUDIO:`marketing.studio`,MESSAGING_CAMPAIGNS:`messaging.campaigns`,AI:`service.ai`,ANDROID:`service.android`,ACCOMMODATION_ROOMS:`accommodation.rooms`,ACCOMMODATION_RESERVATIONS:`accommodation.reservations`,ACCOMMODATION_STAYS:`accommodation.stays`,ACCOMMODATION_FOLIO:`accommodation.folio`,FOOD_TABLES:`food_service.tables`,FOOD_RESERVATIONS:`food_service.reservations`,FOOD_ORDERS:`food_service.orders`,FOOD_MENU:`food_service.menu`,QR_MENU:`channel.qr_menu`,CATALOG:`commerce.catalog`,INVENTORY:`commerce.inventory`,SALES:`commerce.sales`,ORDERS:`commerce.orders`,ONLINE_SALES:`channel.online_sales`,WHOLESALE:`commerce.wholesale`,CUSTOMER_CREDIT:`commerce.customer_credit`,RETAIL_BARCODE:`retail.barcode`,RETAIL_PURCHASING:`retail.purchasing`,RETAIL_SUPPLIERS:`retail.suppliers`,RETAIL_LABELS:`retail.labels`},S=x,_e={[S.REQUESTS]:[S.CUSTOMERS],[S.MESSAGING_CAMPAIGNS]:[S.CUSTOMERS,S.MARKETING_STUDIO],[S.ACCOMMODATION_RESERVATIONS]:[S.ACCOMMODATION_ROOMS],[S.ACCOMMODATION_STAYS]:[S.ACCOMMODATION_ROOMS],[S.ACCOMMODATION_FOLIO]:[S.ACCOMMODATION_ROOMS,S.ACCOMMODATION_STAYS,S.FINANCE],[S.FOOD_RESERVATIONS]:[S.FOOD_TABLES],[S.FOOD_MENU]:[S.CATALOG],[S.FOOD_ORDERS]:[S.FOOD_TABLES,S.FOOD_MENU],[S.QR_MENU]:[S.FOOD_MENU],[S.INVENTORY]:[S.CATALOG],[S.SALES]:[S.CATALOG],[S.ORDERS]:[S.CATALOG],[S.ONLINE_SALES]:[S.ORDERS],[S.WHOLESALE]:[S.CUSTOMERS,S.ORDERS],[S.CUSTOMER_CREDIT]:[S.CUSTOMERS,S.SALES,S.FINANCE],[S.RETAIL_BARCODE]:[S.CATALOG],[S.RETAIL_PURCHASING]:[S.CATALOG,S.INVENTORY],[S.RETAIL_SUPPLIERS]:[S.RETAIL_PURCHASING],[S.RETAIL_LABELS]:[S.CATALOG]},ve=[S.CUSTOMERS,S.TASKS,S.CALENDAR,S.NOTIFICATIONS,S.FINANCE,S.REPORTS,S.WEB,S.SYNC,S.BACKUPS,S.DEVICES],C=[S.REQUESTS,S.MESSAGING_CAMPAIGNS,S.MARKETING_STUDIO],ye=[S.REQUESTS],be=[S.ACCOMMODATION_ROOMS,S.ACCOMMODATION_STAYS,S.ACCOMMODATION_FOLIO],xe=[S.ACCOMMODATION_RESERVATIONS],Se=[S.ACCOMMODATION_RESERVATIONS],Ce=[S.FOOD_TABLES,S.FOOD_ORDERS,S.FOOD_MENU,S.CATALOG,S.SALES],we=[S.FOOD_RESERVATIONS,S.QR_MENU,S.INVENTORY,S.ONLINE_SALES],Te=[S.FOOD_RESERVATIONS,S.QR_MENU,S.INVENTORY],Ee=[S.CATALOG,S.INVENTORY,S.SALES,S.RETAIL_BARCODE],De=[S.RETAIL_PURCHASING,S.RETAIL_SUPPLIERS,S.RETAIL_LABELS,S.CUSTOMER_CREDIT,S.WHOLESALE,S.ONLINE_SALES],Oe=[S.RETAIL_PURCHASING,S.RETAIL_SUPPLIERS];function w(...e){return[...new Set(e.flat())]}function T(e,t,n,r,i,a){let o=new Set(i),s=a.filter(e=>o.has(e)),c=Ae(w(ve,r,s));return{id:e,label:t,description:n,requiredCapabilities:[...r],optionalCapabilities:[...i],defaultOptionalCapabilities:[...s],defaultCapabilities:c}}function ke(e){return _e[e]??[]}function Ae(e){let t=new Set(e),n=[...t];for(;n.length>0;){let e=n.pop();if(e)for(let r of ke(e))t.has(r)||(t.add(r),n.push(r))}return[...t]}T(`pension_restaurant`,`Pansiyon + Restoran/Kafe`,`Konaklama ve yiyecek-içecek operasyonları aynı işletme omurgasında çalışır.`,w(be,Ce),w(C,xe,we),w(ye,Se,Te)),T(`pension`,`Pansiyon`,`Konaklama, müşteri, finans, web ve saha operasyonları için hazır profil.`,be,w(C,xe),w(ye,Se)),T(`restaurant`,`Restoran / Kafe`,`Masa, sipariş, menü, stok, satış ve saha operasyonları için hazır profil.`,Ce,w(C,we),w(ye,Te)),T(`market`,`Market / Perakende / Toptan`,`Ürün, barkod, stok, hızlı satış, tedarikçi, etiket ve opsiyonel bayi/toptan operasyonları için hazır profil.`,Ee,w(C,De),Oe);var je=[{id:`facebook`,label:`Facebook`,hosts:[`facebook.com`,`fb.com`]},{id:`instagram`,label:`Instagram`,hosts:[`instagram.com`]},{id:`youtube`,label:`YouTube`,hosts:[`youtube.com`,`youtu.be`]},{id:`tiktok`,label:`TikTok`,hosts:[`tiktok.com`]},{id:`x`,label:`X`,hosts:[`x.com`,`twitter.com`]}];new Set(je.map(e=>e.id));var Me=[{id:`wifi`,label:`Wi-Fi`,group:`connectivity`},{id:`parking`,label:`Otopark`,group:`transport`},{id:`pet_friendly`,label:`Evcil hayvan kabul edilir`,group:`policy`},{id:`family_friendly`,label:`Çocuklu ailelere uygun`,group:`policy`},{id:`wheelchair_access`,label:`Tekerlekli sandalye erişimine uygun`,group:`accessibility`},{id:`step_free_access`,label:`Basamaksız erişim`,group:`accessibility`},{id:`garden`,label:`Bahçe`,group:`outdoor`},{id:`terrace`,label:`Teras`,group:`outdoor`},{id:`luggage_storage`,label:`Bagaj emaneti`,group:`service`},{id:`airport_transfer`,label:`Havalimanı transferi`,group:`transport`}];Me.length,je.length,new Set(Me.map(e=>e.id)),new Map(Me.map(e=>[e.id,e.label])),x.ACCOMMODATION_ROOMS,x.FOOD_TABLES,x.FOOD_MENU,x.FOOD_ORDERS,x.FOOD_TABLES,x.FOOD_MENU,x.ACCOMMODATION_ROOMS,x.FOOD_TABLES,x.FOOD_MENU,x.FOOD_ORDERS,x.CATALOG,x.CUSTOMERS,x.CUSTOMERS,x.WHATSAPP,x.DEVICES,x.CUSTOMERS,x.MESSAGING_CAMPAIGNS,x.MARKETING_STUDIO,x.ONLINE_SALES,x.WHOLESALE,x.ONLINE_SALES,x.WHOLESALE,x.WHOLESALE,x.RETAIL_BARCODE,x.ACCOMMODATION_STAYS,x.ACCOMMODATION_ROOMS;var E=x;E.WHOLESALE,E.ACCOMMODATION_RESERVATIONS,E.FOOD_RESERVATIONS,E.FOOD_RESERVATIONS,E.QR_MENU,{aras:{id:`aras`,name:`Aras Kargo`}}.aras;var Ne=[{id:`air_conditioning`,label:`Klima`,group:`comfort`},{id:`wifi`,label:`Wi-Fi`,group:`connectivity`},{id:`private_bathroom`,label:`Özel banyo`,group:`bathroom`},{id:`balcony`,label:`Balkon`,group:`outdoor`},{id:`terrace`,label:`Teras`,group:`outdoor`},{id:`sea_view`,label:`Deniz manzarası`,group:`view`},{id:`garden_view`,label:`Bahçe manzarası`,group:`view`},{id:`mountain_view`,label:`Dağ manzarası`,group:`view`},{id:`tv`,label:`TV`,group:`comfort`},{id:`mini_fridge`,label:`Mini buzdolabı`,group:`comfort`},{id:`heating`,label:`Isıtma`,group:`comfort`},{id:`work_desk`,label:`Çalışma masası`,group:`comfort`},{id:`kitchenette`,label:`Mini mutfak`,group:`comfort`},{id:`step_free_access`,label:`Basamaksız erişim`,group:`accessibility`},{id:`wheelchair_friendly`,label:`Tekerlekli sandalye erişimine uygun`,group:`accessibility`},{id:`non_smoking`,label:`Sigara içilmeyen oda`,group:`policy`}];Ne.length,new Set(Ne.map(e=>e.id)),new Map(Ne.map(e=>[e.id,e.label]));var Pe=[{id:`indoor`,label:`İç mekân`,group:`location`},{id:`outdoor`,label:`Açık alan`,group:`location`},{id:`terrace`,label:`Teras / veranda`,group:`location`},{id:`window_side`,label:`Cam kenarı`,group:`location`},{id:`sea_view`,label:`Deniz manzarası`,group:`view`},{id:`garden_view`,label:`Bahçe manzarası`,group:`view`},{id:`quiet_area`,label:`Sakin bölüm`,group:`experience`},{id:`wheelchair_friendly`,label:`Tekerlekli sandalye erişimine uygun`,group:`accessibility`}];Pe.length,new Set(Pe.map(e=>e.id)),new Map(Pe.map(e=>[e.id,e.label]));function Fe(e,t){let n=t.state&&(e.runtime.stateAliases[t.state]??t.state),r=e.assets.find(e=>e.usage===t.usage&&(t.width===void 0||e.dimensions.width===t.width)&&(n===void 0||e.state===n)&&(t.theme===void 0||e.theme===t.theme));if(!r)throw Error(`Nexa asset missing: ${JSON.stringify(t)}`);return r}var Ie={ready:``,thinking:`Düşünüyorum…`,listening:`Dinliyorum…`,speaking:`Yanıt hazır.`,pleased:`Tamamlandı.`,concerned:`Bir sorun oldu.`};function Le(e,t={}){let n=`ready`,r=0,i=`cancel`,a,o=!1,s=new Set,c=new Set,l=new Set;function u(){a!==void 0&&(e.cancel(a),a=void 0)}function d(e){if(n!==e){n=e;for(let e of l)e()}}function f(n){if(u(),c.size)d(`listening`);else if(n===`error`){if(!o&&t.error!==void 0){d(`ready`);return}d(`concerned`),o&&t.error!==void 0&&(a=e.schedule(()=>{a=void 0,d(`ready`)},t.error))}else!o||n===`cancel`?d(`ready`):(d(n===`success`?`pleased`:`speaking`),a=e.schedule(()=>{a=void 0,d(`ready`)},n===`success`?t.success??900:t.response??700))}return{getState:()=>n,subscribe(e){return l.add(e),()=>{l.delete(e)}},setActive(e){o=e,o||(u(),(n===`speaking`||n===`pleased`||n===`concerned`&&t.error!==void 0)&&d(`ready`))},beginListening(){u();let e=Symbol();return c.add(e),s.size||d(`listening`),()=>{c.delete(e)&&!s.size&&!c.size&&d(`ready`)}},begin(){u();let e=++r;i=`cancel`,s.add(e),d(`thinking`);let t=!1;return n=>{t||(t=!0,s.delete(e)&&(e===r&&(i=n),s.size||f(i)))}},reset(){u(),s.clear(),c.clear(),r++,i=`cancel`,d(`ready`)}}}var Re=()=>({gazeX:0,gazeY:0,tilt:0,nod:0,blink:0,surprise:0,smile:0}),ze=[`left`,`right`,`up`,`down`,`curious-left`,`curious-right`];function Be(e=Math.random){let t=(t,n)=>t+e()*(n-t),n=t(2800,4800),r=-1/0,i=!1,a=t(3e3,6500),o=-1/0,s=0,c=`left`,l,u=!1,d=-1/0;function f(){r=o=d=-1/0,n=t(2800,4800),a=t(3e3,6500),s=0,u=!1}return{reset:f,react(e,n,r){r!==`ready`||n-d<2200&&(e!==`press`||c===`press`)||(c=e,o=n,s=e===`press`?1200:1e3,d=n,a=n+s+t(6e3,14e3))},sample(d,f){let p=Re();d>=n&&(r=d,i=e()<.23,n=d+t(3600,9500));let m=d-r,h=e=>e>=0&&e<=180?Math.sin(e/180*Math.PI):0;if(p.blink=Math.max(h(m),i?h(m-310):0),f!==`ready`)return p;if(d>=a){let n=ze.filter(e=>e!==l);c=n[Math.floor(e()*n.length)],l=c,o=d,s=t(1400,2400);let r=!u&&e()<.2;a=d+s+(r?t(400,900):e()<.2?t(22e3,32e3):t(6e3,18e3)),u=r}let g=(d-o)/s;if(!(g>=0&&g<=1))return p;let _=Math.sin(g*Math.PI)**2;return(c===`left`||c===`curious-left`||c===`hover`)&&(p.gazeX=-3*_),(c===`right`||c===`curious-right`)&&(p.gazeX=3*_),c===`up`&&(p.gazeY=-2.5*_),c===`down`&&(p.gazeY=2*_),(c===`curious-left`||c===`hover`)&&(p.tilt=-2.5*_),c===`curious-right`&&(p.tilt=2.5*_),c===`press`&&(p.surprise=g<.25?Math.sin(g/.25*Math.PI):0,p.nod=g>=.25?Math.sin((g-.25)/.75*Math.PI*2)*_*2:0,p.smile=_),p}}}var Ve={idle:`Sakin`,thinking:`Düşünen`,speaking:`Konuşan`,success:`Sevinen`,concerned:`Dikkatli`,listening:`Dinleyen`};function He(e){switch(e){case`thinking`:return`thinking`;case`speaking`:return`speaking`;case`pleased`:return`success`;case`concerned`:return`concerned`;case`listening`:return`listening`;case`ready`:case`sleep`:return`idle`}}var Ue=0;function We(e){return`<svg xmlns="http://www.w3.org/2000/svg" id="${e}" data-nexa-rig="" style="display:block;width:100%;height:100%;overflow:visible;transform:none;animation:none" viewBox="0 0 200 200" role="img" aria-label="Nexa">
      <style>
        #${e} *{animation:none;transition:none}
        #${e} .nexa-rig-edge{fill:none;stroke-linecap:round;stroke-linejoin:round}
        #${e} .nexa-rig-brow{fill:none;stroke:#153c63;stroke-width:3.5;stroke-linecap:round}
        #${e} .nexa-rig-lid-edge{fill:none;stroke:#234969;stroke-width:1.4;stroke-linecap:round}
        #${e} .nexa-rig-mouth-line{fill:none;stroke:#103859;stroke-width:3;stroke-linecap:round}
        #${e} .nexa-rig-thinking-light,#${e} .nexa-rig-success-highlight{opacity:0}
        #${e}[data-expression="thinking"] .nexa-rig-thinking-light{opacity:.8}
        #${e}[data-expression="success"] .nexa-rig-success-highlight{opacity:.8}
        #${e}[data-size="small"] .nexa-rig-micro-hide{display:none}
        #${e}[data-size="small"] .nexa-rig-brow{stroke-width:4.3}
        #${e}[data-size="small"] .nexa-rig-mouth-line{stroke-width:4}
        #${e} .nexa-rig-eye-spark{fill:#fff}
        #${e} .nexa-rig-mouth-fill{fill:#103859;stroke:#1a5172;stroke-width:1}
      </style>
      <defs>
        <linearGradient id="${e}-body" x1=".13" y1=".1" x2=".85" y2=".95" gradientUnits="objectBoundingBox"><stop stop-color="#9becf3" style="stop-color:#9becf3"/><stop offset=".25" stop-color="#51c7df" style="stop-color:#51c7df"/><stop offset=".58" stop-color="#248ac5" style="stop-color:#248ac5"/><stop offset=".86" stop-color="#15508f" style="stop-color:#15508f"/><stop offset="1" stop-color="#11385f" style="stop-color:#11385f"/></linearGradient>
        <radialGradient id="${e}-glass" cx=".33" cy=".25" r=".83"><stop stop-color="#defafa" style="stop-color:#defafa"/><stop offset=".4" stop-color="#9ee7ef" style="stop-color:#9ee7ef"/><stop offset=".72" stop-color="#64c6df" style="stop-color:#64c6df"/><stop offset="1" stop-color="#2f80ad" style="stop-color:#2f80ad"/></radialGradient>
        <linearGradient id="${e}-fin" x1=".2" y1="0" x2=".7" y2="1"><stop stop-color="#b9ffff" stop-opacity=".9" style="stop-color:#b9ffff;stop-opacity:.9"/><stop offset=".38" stop-color="#5bd2e8" stop-opacity=".75" style="stop-color:#5bd2e8;stop-opacity:.75"/><stop offset=".75" stop-color="#268bbb" stop-opacity=".7" style="stop-color:#268bbb;stop-opacity:.7"/><stop offset="1" stop-color="#1d4f8b" stop-opacity=".9" style="stop-color:#1d4f8b;stop-opacity:.9"/></linearGradient>
        <linearGradient id="${e}-ribbon" x1="0" y1="0" x2="1" y2=".65"><stop stop-color="#96f3f2" style="stop-color:#96f3f2"/><stop offset=".3" stop-color="#50dce8" style="stop-color:#50dce8"/><stop offset=".62" stop-color="#29aace" style="stop-color:#29aace"/><stop offset="1" stop-color="#225d9a" style="stop-color:#225d9a"/></linearGradient>
        <linearGradient id="${e}-edge" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e6ffff" stop-opacity=".96" style="stop-color:#e6ffff;stop-opacity:.96"/><stop offset=".48" stop-color="#a9f7fa" stop-opacity=".7" style="stop-color:#a9f7fa;stop-opacity:.7"/><stop offset="1" stop-color="#67bfed" stop-opacity=".1" style="stop-color:#67bfed;stop-opacity:.1"/></linearGradient>
        <linearGradient id="${e}-crest" x1=".8" y1="0" x2=".2" y2="1"><stop stop-color="#d1ffff" style="stop-color:#d1ffff"/><stop offset=".32" stop-color="#64dbe9" style="stop-color:#64dbe9"/><stop offset=".8" stop-color="#258bc0" style="stop-color:#258bc0"/><stop offset="1" stop-color="#175080" style="stop-color:#175080"/></linearGradient>
        <radialGradient id="${e}-pupil"><stop stop-color="#164c73" style="stop-color:#164c73"/><stop offset=".65" stop-color="#123353" style="stop-color:#123353"/><stop offset="1" stop-color="#0a263f" style="stop-color:#0a263f"/></radialGradient>
        <clipPath id="${e}-eye-l"><path data-eye-clip="left"/></clipPath><clipPath id="${e}-eye-r"><path data-eye-clip="right"/></clipPath>
      </defs>
      <g data-part="tail">
        <path d="M87 134 C107 136 130 139 144 156 C154 173 137 183 110 190 C124 175 114 170 100 166 C83 160 75 149 87 134Z" fill="url(#${e}-fin)" stroke="#48b7d4" stroke-opacity=".5" stroke-width="1" style="fill:url(#${e}-fin);stroke:#48b7d4;stroke-opacity:.5;stroke-width:1"/>
        <path class="nexa-rig-edge" d="M118 149 C151 164 141 177 121 184" stroke="url(#${e}-edge)" stroke-width="1.3" style="stroke:url(#${e}-edge);stroke-width:1.3"/>
        <path class="nexa-rig-edge nexa-rig-micro-hide" d="M106 150Q131 161 126 177" stroke="#8fe7ef" stroke-opacity=".32" stroke-width="1" style="stroke:#8fe7ef;stroke-opacity:.32;stroke-width:1"/>
      </g>
      <g data-part="far-fin"><path d="M58 91C42 97 29 110 24 127C39 124 51 124 65 113Z" fill="url(#${e}-fin)" stroke="#68c6df" stroke-opacity=".5" style="fill:url(#${e}-fin);stroke:#68c6df;stroke-opacity:.5"/><path class="nexa-rig-edge" d="M27 123Q43 103 57 101" stroke="url(#${e}-edge)" stroke-width="1.1" style="stroke:url(#${e}-edge);stroke-width:1.1"/></g>
      <g data-part="side-fin">
        <path d="M135 94 C159 110 170 91 182 89 C180 109 163 137 138 136 C132 122 128 108 135 94Z" fill="url(#${e}-fin)" stroke="#72d5e5" stroke-opacity=".4" stroke-width="1" style="fill:url(#${e}-fin);stroke:#72d5e5;stroke-opacity:.4;stroke-width:1"/>
        <path class="nexa-rig-edge" d="M144 111C158 116 174 102 180 93" stroke="url(#${e}-edge)" stroke-width="1.7" style="stroke:url(#${e}-edge);stroke-width:1.7"/>
        <path class="nexa-rig-edge nexa-rig-micro-hide" d="M144 119Q162 118 172 108" stroke="#8cdae9" stroke-opacity=".4" stroke-width="1" style="stroke:#8cdae9;stroke-opacity:.4;stroke-width:1"/>
      </g>
      <g data-part="body">
        <path d="M68 48C90 37 124 45 141 66C154 84 156 112 145 134C133 156 111 166 91 161C78 158 72 150 60 146C44 140 39 126 41 110C40 83 48 61 68 48Z" fill="url(#${e}-body)" stroke="#246f9d" stroke-width="1.4" style="fill:url(#${e}-body);stroke:#246f9d;stroke-width:1.4"/>
        <path d="M49 107C46 129 65 139 77 146C91 154 103 151 110 153C102 164 87 160 79 154C64 144 42 145 41 123Z" fill="#153d7b" fill-opacity=".22" style="fill:#153d7b;fill-opacity:.22"/>
        <path d="M124 55C146 68 153 95 148 113C144 128 135 138 124 146C134 128 138 117 140 95C140 76 131 64 124 55Z" fill="#0c427d" fill-opacity=".26" style="fill:#0c427d;fill-opacity:.26"/>
        <path class="nexa-rig-edge" d="M47 101C45 78 52 61 70 51C88 41 107 44 119 49" stroke="url(#${e}-edge)" stroke-width="2" style="stroke:url(#${e}-edge);stroke-width:2"/>
        <path class="nexa-rig-edge nexa-rig-micro-hide" d="M139 118Q132 144 111 151" stroke="#6ccbe3" stroke-opacity=".54" stroke-width="1.5" style="stroke:#6ccbe3;stroke-opacity:.54;stroke-width:1.5"/>
      </g>
      <g data-part="crown">
        <path d="M61 62C54 49 58 34 72 31C92 29 105 33 122 23C134 17 149 13 166 13C159 28 149 43 132 49C112 54 100 45 83 48C73 50 67 55 61 62Z" fill="url(#${e}-crest)" stroke="#66c6de" stroke-width="1" style="fill:url(#${e}-crest);stroke:#66c6de;stroke-width:1"/>
        <path d="M61 57C75 31 99 50 119 39C137 30 150 20 165 14C151 41 139 48 121 49C101 51 82 40 61 57Z" fill="#2289bc" fill-opacity=".42" style="fill:#2289bc;fill-opacity:.42"/>
        <path class="nexa-rig-edge" d="M61 51C64 31 82 32 98 33C124 35 137 14 165 13" stroke="url(#${e}-edge)" stroke-width="2.2" style="stroke:url(#${e}-edge);stroke-width:2.2"/>
        <path class="nexa-rig-edge nexa-rig-micro-hide" d="M79 39C104 43 121 31 143 24" stroke="#b4f7fb" stroke-opacity=".55" stroke-width="1" style="stroke:#b4f7fb;stroke-opacity:.55;stroke-width:1"/>
        <path class="nexa-rig-edge" d="M140 31L151 25" stroke="#dbffff" stroke-width="2" stroke-opacity=".7" style="stroke:#dbffff;stroke-opacity:.7;stroke-width:2"/>
      </g>
      <g data-part="face">
        <path d="M69 63C89 52 116 55 131 70C146 85 146 110 129 125C114 137 86 139 66 124C50 112 49 87 58 74C61 69 65 66 69 63Z" fill="#0b5786" fill-opacity=".25" style="fill:#0b5786;fill-opacity:.25"/>
        <path d="M68 65C88 54 115 58 129 72C142 86 141 108 126 121C110 135 84 133 67 120C54 110 52 91 60 76C62 71 65 68 68 65Z" fill="url(#${e}-glass)" stroke="#c0fbf8" stroke-opacity=".43" stroke-width="1.4" style="fill:url(#${e}-glass);stroke:#c0fbf8;stroke-opacity:.43;stroke-width:1.4"/>
        <path class="nexa-rig-edge nexa-rig-micro-hide" d="M65 73C81 58 107 60 122 69" stroke="#f0ffff" stroke-opacity=".56" stroke-width="2.7" style="stroke:#f0ffff;stroke-opacity:.56;stroke-width:2.7"/>
        <path class="nexa-rig-edge nexa-rig-micro-hide" d="M59 106Q59 114 65 118" stroke="#ddffff" stroke-opacity=".7" stroke-width="2" style="stroke:#ddffff;stroke-opacity:.7;stroke-width:2"/>
        <g data-part="brows"><path class="nexa-rig-brow" data-brow="left"/><path class="nexa-rig-brow" data-brow="right"/></g>
        <g data-part="eyes">
          <g data-eye="left"><path data-eye-white="left" fill="#e9ffff" stroke="#2a6685" stroke-width="1" style="fill:#e9ffff;stroke:#2a6685;stroke-width:1"/><g clip-path="url(#${e}-eye-l)"><g data-pupil="left"><ellipse cx="77" cy="94" rx="6.2" ry="7.8" fill="url(#${e}-pupil)" style="fill:url(#${e}-pupil)"/><circle class="nexa-rig-eye-spark" cx="75" cy="91" r="1.8"/><circle cx="80" cy="97" r=".8" fill="#83dced" style="fill:#83dced"/></g></g><path class="nexa-rig-lid-edge" data-lid="left"/></g>
          <g data-eye="right"><path data-eye-white="right" fill="#e9ffff" stroke="#2a6685" stroke-width="1" style="fill:#e9ffff;stroke:#2a6685;stroke-width:1"/><g clip-path="url(#${e}-eye-r)"><g data-pupil="right"><ellipse cx="114" cy="92" rx="6.2" ry="7.8" fill="url(#${e}-pupil)" style="fill:url(#${e}-pupil)"/><circle class="nexa-rig-eye-spark" cx="112" cy="89" r="1.8"/><circle cx="117" cy="95" r=".8" fill="#83dced" style="fill:#83dced"/></g></g><path class="nexa-rig-lid-edge" data-lid="right"/></g>
        </g>
        <g data-part="muzzle"><path d="M87 102Q96 105 104 101" fill="none" stroke="#e5ffff" stroke-opacity=".33" stroke-width="1.5" stroke-linecap="round" style="fill:none;stroke:#e5ffff;stroke-opacity:.33;stroke-width:1.5;stroke-linecap:round"/><path data-mouth="" class="nexa-rig-mouth-fill"/><path data-mouth-line="" class="nexa-rig-mouth-line"/><path data-mouth-light="" fill="#8adee8" style="fill:#8adee8"/></g>
        <g class="nexa-rig-success-highlight" data-part="cheeks"><path d="M63 105L71 108M122 105L129 101" class="nexa-rig-edge" stroke="#e0ffff" stroke-width="2.4" style="stroke:#e0ffff;stroke-width:2.4"/></g>
      </g>
      <g data-part="ribbon">
        <path d="M41 114C52 132 66 139 91 134C117 130 138 123 157 129C143 129 145 149 130 156C113 165 87 154 67 147C52 144 38 133 41 114Z" fill="url(#${e}-ribbon)" stroke="#4cc2db" stroke-opacity=".7" stroke-width="1" style="fill:url(#${e}-ribbon);stroke:#4cc2db;stroke-opacity:.7;stroke-width:1"/>
        <path d="M44 123C65 146 84 140 107 135C124 131 144 126 155 129C134 136 142 148 125 152C101 155 80 146 67 143C55 140 47 133 44 123Z" fill="#41c4da" fill-opacity=".32" style="fill:#41c4da;fill-opacity:.32"/>
        <path class="nexa-rig-edge" d="M42 116C55 140 76 140 97 135C117 130 139 124 156 129" stroke="url(#${e}-edge)" stroke-width="2.2" style="stroke:url(#${e}-edge);stroke-width:2.2"/>
        <path class="nexa-rig-edge nexa-rig-micro-hide" d="M78 149C106 157 127 160 137 146" stroke="#95e6ee" stroke-opacity=".45" stroke-width="1" style="stroke:#95e6ee;stroke-opacity:.45;stroke-width:1"/>
      </g>
      <g data-part="lights"><circle class="nexa-rig-thinking-light" data-light="one" cx="138" cy="49" r="2.1" fill="#d2ffff" style="fill:#d2ffff"/><circle class="nexa-rig-thinking-light" data-light="two" cx="164" cy="114" r="1.4" fill="#acf5ff" style="fill:#acf5ff"/><path class="nexa-rig-success-highlight nexa-rig-edge" data-success-light="" d="M155 57L159 47M161 61L168 57" stroke="#b6f9f8" stroke-width="2" style="stroke:#b6f9f8;stroke-width:2"/></g>
    </svg>`}var D=(e,t,n)=>e.setAttribute(t,String(n)),O=(e,t,n=0)=>Math.sin(e/t*Math.PI*2+n);function Ge(e,t=!1){let n=t?0:e.elapsed/1e3,r=He(e.state);D(e.svg,`data-expression`,r),D(e.svg,`data-nexa-state`,e.state),D(e.svg,`aria-label`,`Nexa · ${Ve[r]}`);let i=+!t,a=e.natural&&!t&&e.state!==`sleep`?e.behavior.sample(e.elapsed,e.state):null,o=r===`success`&&!t&&n<.9?Math.sin(n/.9*Math.PI*2)*1.8:0;if(e.natural){let t=r===`idle`||r===`listening`,s=i*O(n,9.7,e.phase)*(t?1.4:.5)+(a?.nod??0)+o,c=(a?.tilt??0)+(r===`listening`?2:0),l=1+i*O(n,6.8,e.phase+1)*.003;D(e.presence,`transform`,`translate(0 ${s.toFixed(3)}) rotate(${c.toFixed(3)} 100 110) translate(100 110) scale(${l.toFixed(4)}) translate(-100 -110)`)}else e.presence.removeAttribute(`transform`);let s=r===`success`?t?.55:n<.9?.55+.45*Math.sin(n/.9*Math.PI):.55:0,c=+(r===`thinking`),l=+(r===`speaking`),u=-3*c-7*s+i*O(n,c?4.7:7.1,e.phase)*(c?2.8:1.6),d=-21*s-4*c+i*(O(n,6.3,e.phase+1)*2+l*Math.max(0,O(n,3.6))*-7);D(e.parts.crown,`transform`,`rotate(${u.toFixed(3)} 75 52)`),D(e.parts[`side-fin`],`transform`,`rotate(${d.toFixed(3)} 137 109)`),D(e.parts[`far-fin`],`transform`,`rotate(${(s*11+i*O(n,8,2)*1.5).toFixed(3)} 57 110)`),D(e.parts.tail,`transform`,`rotate(${(i*O(n,8.4,e.phase+2)*2.8-s*3).toFixed(3)} 98 146)`),D(e.parts.ribbon,`transform`,`rotate(${(i*O(n,6.8,e.phase+4)*1.6-s*2).toFixed(3)} 62 136)`);let f=c?-2.4:+!!l,p=c?-2.5:0;if(e.natural)f+=a?.gazeX??0,p+=a?.gazeY??0,r===`listening`&&(f=1.5);else if(!t&&r!==`success`){let t=(n+e.phase)%8.6,r=t>3.1&&t<4.8?Math.sin((t-3.1)/1.7*Math.PI):0;f+=r*(c?3:l?-2.8:2.4),p-=r*(c?.7:.25)}let m=(n+e.phase*.45)%7.1,h=e.natural?a?.blink??0:!t&&r!==`success`&&m>5.9&&m<6.12?Math.sin((m-5.9)/.22*Math.PI):0;e.eyes.forEach((t,o)=>{let s=o?114:77,c=o?92:94,u=13.5,d=e.state===`sleep`?.15:r===`concerned`?5.8:r===`thinking`?o?4.4:5.7:r===`speaking`?o?8.5:7.5:r===`success`?3:o?7.2:7.7;d+=(a?.surprise??0)*2.2,d=Math.max(.15,d*(1-h));let m=r===`success`,g=m?c-5.5-d:c-d*1.5,_=m?c-5.5+d:c+d*1.55,v=`M${s-u} ${c}Q${s} ${g.toFixed(3)} ${s+u} ${c}Q${s} ${_.toFixed(3)} ${s-u} ${c}Z`;D(t.white,`d`,v),D(t.clip,`d`,v),D(t.lid,`d`,`M${s-u} ${c}Q${s} ${g.toFixed(3)} ${s+u} ${c}`),D(t.pupil,`transform`,`translate(${f.toFixed(3)} ${(p+(m?-2:0)).toFixed(3)})`);let y;y=r===`concerned`?o?`M103 78Q114 74 125 71`:`M65 73Q76 74 86 80`:r===`thinking`?o?`M103 77Q114 72 125 75`:`M65 76Q76 76 86 82`:r===`speaking`?o?`M104 73Q114 67 124 72`:`M66 78Q76 74 86 76`:m?o?`M103 76Q114 68 125 74`:`M65 77Q76 70 87 76`:o?`M104 76Q114 73 124 76`:`M66 79Q76 76 86 79`,D(t.brow,`d`,y),D(t.brow,`transform`,`translate(0 ${(i*l*O(n,4.2,o)*.7).toFixed(3)})`)});let g=``,_=``,v=``;if(r===`concerned`)_=`M88 118Q96 110 105 118`;else if(r===`idle`||r===`listening`)_=`M88 113Q96 ${(121+(a?.smile??0)*3).toFixed(3)} 104 112`;else if(r===`thinking`)_=`M94 116Q100 113 107 114`;else if(r===`success`)g=`M83 110Q96 117 109 108Q107 125 97 126Q87 127 83 110Z`,v=`M90 122Q98 118 105 120Q98 128 90 122Z`;else{let e=t?0:Math.floor(n*3.4)%8;e===3||e===7?_=`M88 113Q96 119 105 112`:e===2||e===5?(g=`M93 111C101 108 105 114 102 121C99 128 91 122 91 117Q91 114 93 111Z`,v=`M94 121Q98 117 102 120Q98 125 94 121Z`):e===1||e===4?g=`M87 113Q98 119 108 112Q105 121 98 121Q91 122 87 113Z`:(g=`M86 111Q96 117 108 110Q107 124 98 125Q88 125 86 111Z`,v=`M92 122Q99 118 105 120Q99 126 92 122Z`)}D(e.mouth,`d`,g),D(e.mouthLine,`d`,_),D(e.mouthLight,`d`,v),D(e.lightOne,`transform`,`translate(${(i*O(n,4.6)*4).toFixed(3)} ${(-i*(1+O(n,4.6,1))*3).toFixed(3)})`),D(e.lightTwo,`transform`,`translate(${(-i*O(n,5.4)*3).toFixed(3)} ${(i*O(n,5.4,2)*5).toFixed(3)})`),e.successLight.style.opacity=String(r===`success`?t?.65:Math.min(1,s*1.3):0)}function Ke(e,t){let n=e.ownerDocument,r=n.defaultView;if(!r)throw Error(`Nexa rig requires a browser document`);let i;do i=`nexa-rig-${++Ue}`;while(n.getElementById(i));e.innerHTML=We(i);let a=e.querySelector(`svg`);if(!a||typeof a.createSVGRect!=`function`)throw e.replaceChildren(),Error(`Nexa SVG rendering unavailable`);let o=e=>{let t=a.querySelector(e);if(!t)throw Error(`Missing Nexa rig part: ${e}`);return t},s=e=>o(`[data-part="${e}"]`),c=n.createElementNS(`http://www.w3.org/2000/svg`,`g`);c.dataset.part=`presence`;for(let e of[...a.children])e.tagName.toLowerCase()===`g`&&c.append(e);a.append(c);let l={svg:a,state:t.state,elapsed:0,phase:0,parts:{crown:s(`crown`),"side-fin":s(`side-fin`),"far-fin":s(`far-fin`),tail:s(`tail`),ribbon:s(`ribbon`)},eyes:[`left`,`right`].map(e=>({white:o(`[data-eye-white="${e}"]`),clip:o(`[data-eye-clip="${e}"]`),lid:o(`[data-lid="${e}"]`),pupil:o(`[data-pupil="${e}"]`),brow:o(`[data-brow="${e}"]`)})),mouth:o(`[data-mouth]`),mouthLine:o(`[data-mouth-line]`),mouthLight:o(`[data-mouth-light]`),lightOne:o(`[data-light="one"]`),lightTwo:o(`[data-light="two"]`),successLight:o(`[data-success-light]`),presence:c,natural:t.natural??!1,behavior:Be()},u=t,d=0,f=0,p=!1,m=r.matchMedia(`(prefers-reduced-motion: reduce)`),h=!1,g=()=>!p&&(l.state!==`pleased`||l.elapsed<900)&&(!l.natural||l.state!==`concerned`||l.elapsed<1200)&&u.motion&&l.state!==`sleep`&&h&&e.isConnected&&n.visibilityState===`visible`&&n.hasFocus()&&!m.matches;function _(e){d=0,g()?(l.natural&&f&&e-f<32||(l.elapsed+=f?Math.min(e-f,80):0,f=e,Ge(l)),d=r.requestAnimationFrame(_)):v()}function v(){if(p)return;d&&r.cancelAnimationFrame(d),d=0,f=0;let e=g();a.dataset.motionActive=String(e),a.dataset.size=u.size<=40?`small`:`full`,Ge(l,!e),e&&(d=r.requestAnimationFrame(_))}let y=new r.IntersectionObserver(([e])=>{h=e?.isIntersecting??!1,v()});return y.observe(e),m.addEventListener(`change`,v),n.addEventListener(`visibilitychange`,v),r.addEventListener(`focus`,v),r.addEventListener(`blur`,v),v(),{update(e){if(p)return;e.state!==l.state&&(l.state=e.state,l.elapsed=0,l.behavior.reset());let t=u.motion!==e.motion||u.size!==e.size||u.natural!==e.natural||a.dataset.nexaState!==e.state;l.natural=e.natural??!1,u=e,t&&v()},react(e){l.natural&&g()&&l.state===`ready`&&l.behavior.react(e,l.elapsed,l.state)},unmount(){p||(p=!0,d&&r.cancelAnimationFrame(d),a.dataset.motionActive=`false`,y.disconnect(),m.removeEventListener(`change`,v),n.removeEventListener(`visibilitychange`,v),r.removeEventListener(`focus`,v),r.removeEventListener(`blur`,v),a.remove())}}}var qe={schemaVersion:1,character:`Nexa`,defaultState:`ready`,pathBase:`repository-root`,states:[`sleep`,`ready`,`listening`,`thinking`,`speaking`,`success`,`warning`],stateLabels:{sleep:`UYKU`,ready:`HAZIR`,listening:`DİNLİYOR`,thinking:`DÜŞÜNÜYOR`,speaking:`KONUŞUYOR`,success:`BAŞARILI`,warning:`UYARI`},themePolicy:`Same character pixels for light and dark. Only separate habitat and contact-shadow assets vary.`,motion:{static:!0,motionSafe:!0,bakedAnimation:!1},registration:{canvas:`square`,contentHeightRatio:.88,crop:[134,130,1178,1174],sharedBodyAlpha:!0,stateChanges:`inner-face-only`,edgeTreatment:`Detached alpha specks removed; nearest opaque RGB extended beneath common alpha fringe.`},opticalPolicy:{stateSizes:[32,48],source:`master/nexa-optical-source-1254.png`,changes:[`broad internal color masses`,`no thin internal ribbons`,`solid navy facial features`,`no tiny eye highlights`]},webPolicy:{conversationAvatarPlacement:`header-only`,perMessageAvatar:!1},assets:[{id:`master.nexa-ready-512`,state:`ready`,usage:`master`,dimensions:{width:512,height:512},assetPath:`assets/nexa/master/nexa-ready-512.png`,detail:`full`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/png`,bytes:182850,sha256:`6ee4f84534e134cf6fc311f3170e3f21d44354c1b874ed95696e0f44dcd7f724`,source:{body:`assets/nexa/master/nexa-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-ready-expression.png`}},{id:`master.nexa-optical-512`,state:`ready`,usage:`optical-master`,dimensions:{width:512,height:512},assetPath:`assets/nexa/master/nexa-optical-512.png`,detail:`optical`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/png`,bytes:153559,sha256:`a9155d49612714c3dc4c679eae86c453416cf587e7d4eaca914a812d3a0c5dae`,source:{body:`assets/nexa/master/nexa-optical-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-ready-expression.png`}},{id:`states.nexa-sleep-512`,state:`sleep`,usage:`state`,dimensions:{width:512,height:512},assetPath:`assets/nexa/states/nexa-sleep-512.webp`,detail:`full`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:123104,sha256:`ed617e1d97059abf06a16c5f0cfd83fa06bf37bbc454b18086d6fdbe05ecb62e`,source:{body:`assets/nexa/master/nexa-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-sleep-expression.png`}},{id:`states.nexa-sleep-256`,state:`sleep`,usage:`state`,dimensions:{width:256,height:256},assetPath:`assets/nexa/states/nexa-sleep-256.webp`,detail:`full`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:37600,sha256:`9fbdae465719965ee8e2843a856309ac1f05b681647787c4264edbccea27a527`,source:{body:`assets/nexa/master/nexa-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-sleep-expression.png`}},{id:`states.nexa-sleep-128`,state:`sleep`,usage:`state`,dimensions:{width:128,height:128},assetPath:`assets/nexa/states/nexa-sleep-128.webp`,detail:`full`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:14310,sha256:`ebf69a9d3c6cb19e5094b85036689cdf6aa7de86a0884b0cb318497f57d01239`,source:{body:`assets/nexa/master/nexa-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-sleep-expression.png`}},{id:`states.nexa-sleep-96`,state:`sleep`,usage:`state`,dimensions:{width:96,height:96},assetPath:`assets/nexa/states/nexa-sleep-96.webp`,detail:`full`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:9112,sha256:`621c40cd2b6a5f9c8ad224c736d456597e7d6e867aa9c34245264d7e9a7931f7`,source:{body:`assets/nexa/master/nexa-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-sleep-expression.png`}},{id:`states.nexa-sleep-64`,state:`sleep`,usage:`state`,dimensions:{width:64,height:64},assetPath:`assets/nexa/states/nexa-sleep-64.webp`,detail:`full`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:5092,sha256:`a594bf7e5944c282c7b36be4f3d71ffbf1c5c70b2bce29c7fab71e2fb55b42a5`,source:{body:`assets/nexa/master/nexa-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-sleep-expression.png`}},{id:`states.nexa-sleep-48`,state:`sleep`,usage:`state`,dimensions:{width:48,height:48},assetPath:`assets/nexa/states/nexa-sleep-48.webp`,detail:`optical`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:3054,sha256:`e3b3f79d840effad774ab0145589a35494b05b474d8fe3ab0ee1a226ecb222ba`,source:{body:`assets/nexa/master/nexa-optical-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-sleep-expression.png`}},{id:`states.nexa-sleep-32`,state:`sleep`,usage:`state`,dimensions:{width:32,height:32},assetPath:`assets/nexa/states/nexa-sleep-32.webp`,detail:`optical`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:1840,sha256:`2d892998bb2f5651a93f673c5c3704f22d53611193da3b3701b8642340a7c68f`,source:{body:`assets/nexa/master/nexa-optical-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-sleep-expression.png`}},{id:`states.nexa-ready-512`,state:`ready`,usage:`state`,dimensions:{width:512,height:512},assetPath:`assets/nexa/states/nexa-ready-512.webp`,detail:`full`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:124244,sha256:`5db60cd69c0478808ec22c3fbfcf59660d5f225db975e05aa6ef76f44059f9e0`,source:{body:`assets/nexa/master/nexa-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-ready-expression.png`}},{id:`states.nexa-ready-256`,state:`ready`,usage:`state`,dimensions:{width:256,height:256},assetPath:`assets/nexa/states/nexa-ready-256.webp`,detail:`full`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:38084,sha256:`c8f4bd7222065c359b040afcd3adcf08162d7e1b417dfc0851d9d23f193e3f89`,source:{body:`assets/nexa/master/nexa-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-ready-expression.png`}},{id:`states.nexa-ready-128`,state:`ready`,usage:`state`,dimensions:{width:128,height:128},assetPath:`assets/nexa/states/nexa-ready-128.webp`,detail:`full`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:14470,sha256:`96a14c90617dc9dd8527d498698657a830a51b761989bb663c170815ae5d5a25`,source:{body:`assets/nexa/master/nexa-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-ready-expression.png`}},{id:`states.nexa-ready-96`,state:`ready`,usage:`state`,dimensions:{width:96,height:96},assetPath:`assets/nexa/states/nexa-ready-96.webp`,detail:`full`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:9202,sha256:`91d19941bbc1f844b296b288069a2719e6c19d8d7ecfc932fd72925788081c7c`,source:{body:`assets/nexa/master/nexa-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-ready-expression.png`}},{id:`states.nexa-ready-64`,state:`ready`,usage:`state`,dimensions:{width:64,height:64},assetPath:`assets/nexa/states/nexa-ready-64.webp`,detail:`full`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:5148,sha256:`4904b78fdba27ef56c526a17e9570439e235ece751fabd6790a62b15fd108d72`,source:{body:`assets/nexa/master/nexa-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-ready-expression.png`}},{id:`states.nexa-ready-48`,state:`ready`,usage:`state`,dimensions:{width:48,height:48},assetPath:`assets/nexa/states/nexa-ready-48.webp`,detail:`optical`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:3128,sha256:`3ece597954adb08cafd95a9db46f8ce99bf3298f9c4c59ed2928658aa9cbd014`,source:{body:`assets/nexa/master/nexa-optical-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-ready-expression.png`}},{id:`states.nexa-ready-32`,state:`ready`,usage:`state`,dimensions:{width:32,height:32},assetPath:`assets/nexa/states/nexa-ready-32.webp`,detail:`optical`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:1874,sha256:`9cdecfa7336d9fdfcd704ef1bbc07d105c89aacfde8a7e9de2159fa6f2652014`,source:{body:`assets/nexa/master/nexa-optical-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-ready-expression.png`}},{id:`states.nexa-listening-512`,state:`listening`,usage:`state`,dimensions:{width:512,height:512},assetPath:`assets/nexa/states/nexa-listening-512.webp`,detail:`full`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:124206,sha256:`fe06476a36dadcece221b1612289419f038c25cdd6f6f3546933a1c450ed0bca`,source:{body:`assets/nexa/master/nexa-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-listening-expression.png`}},{id:`states.nexa-listening-256`,state:`listening`,usage:`state`,dimensions:{width:256,height:256},assetPath:`assets/nexa/states/nexa-listening-256.webp`,detail:`full`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:38100,sha256:`7143f8d8e6972c251b3cfe4491af1368d15ff62b201952a36927e4339af7423a`,source:{body:`assets/nexa/master/nexa-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-listening-expression.png`}},{id:`states.nexa-listening-128`,state:`listening`,usage:`state`,dimensions:{width:128,height:128},assetPath:`assets/nexa/states/nexa-listening-128.webp`,detail:`full`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:14570,sha256:`6076c5646044e14b70f4df191c3112037a53d2dae585de0515e40f87ec627e08`,source:{body:`assets/nexa/master/nexa-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-listening-expression.png`}},{id:`states.nexa-listening-96`,state:`listening`,usage:`state`,dimensions:{width:96,height:96},assetPath:`assets/nexa/states/nexa-listening-96.webp`,detail:`full`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:9274,sha256:`6a1a508295dddc3303535d1a3f38f55505b9ef541a39a83627b40452b0c61db7`,source:{body:`assets/nexa/master/nexa-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-listening-expression.png`}},{id:`states.nexa-listening-64`,state:`listening`,usage:`state`,dimensions:{width:64,height:64},assetPath:`assets/nexa/states/nexa-listening-64.webp`,detail:`full`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:5174,sha256:`1570bcf5f3869ed3cc18e5f818cccf6dee0da56e6e6e8ea371d8ae4cfd63dc2f`,source:{body:`assets/nexa/master/nexa-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-listening-expression.png`}},{id:`states.nexa-listening-48`,state:`listening`,usage:`state`,dimensions:{width:48,height:48},assetPath:`assets/nexa/states/nexa-listening-48.webp`,detail:`optical`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:3120,sha256:`37e0f6e4d1e3085a74c77fb5b920875e2dbc722a8bb6ac64510945b372ec8ad2`,source:{body:`assets/nexa/master/nexa-optical-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-listening-expression.png`}},{id:`states.nexa-listening-32`,state:`listening`,usage:`state`,dimensions:{width:32,height:32},assetPath:`assets/nexa/states/nexa-listening-32.webp`,detail:`optical`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:1866,sha256:`cbecb57b37ad0c80b996d15452fc1cfd942f7bfd910072c3ef02c00dcabb2dc4`,source:{body:`assets/nexa/master/nexa-optical-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-listening-expression.png`}},{id:`states.nexa-thinking-512`,state:`thinking`,usage:`state`,dimensions:{width:512,height:512},assetPath:`assets/nexa/states/nexa-thinking-512.webp`,detail:`full`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:124118,sha256:`34fc6b9d86a3fd9c39ff6cab03a7e50a3903a32eef30a3cadda01bf9b6f7789e`,source:{body:`assets/nexa/master/nexa-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-thinking-expression.png`}},{id:`states.nexa-thinking-256`,state:`thinking`,usage:`state`,dimensions:{width:256,height:256},assetPath:`assets/nexa/states/nexa-thinking-256.webp`,detail:`full`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:38136,sha256:`e619f121b336b2cc6f6fd8c49575d518ec5f8eec242ce8ebc0db4ee0afd0ec49`,source:{body:`assets/nexa/master/nexa-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-thinking-expression.png`}},{id:`states.nexa-thinking-128`,state:`thinking`,usage:`state`,dimensions:{width:128,height:128},assetPath:`assets/nexa/states/nexa-thinking-128.webp`,detail:`full`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:14518,sha256:`da3e3fe6773bccbd0a87b9bef747e9716a2fa830e39635d352c633ec47ca1583`,source:{body:`assets/nexa/master/nexa-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-thinking-expression.png`}},{id:`states.nexa-thinking-96`,state:`thinking`,usage:`state`,dimensions:{width:96,height:96},assetPath:`assets/nexa/states/nexa-thinking-96.webp`,detail:`full`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:9242,sha256:`c3a5acd2fb5ef7ab5a854b1c5f81c34dfb63491e0934cca5e142da0a89844076`,source:{body:`assets/nexa/master/nexa-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-thinking-expression.png`}},{id:`states.nexa-thinking-64`,state:`thinking`,usage:`state`,dimensions:{width:64,height:64},assetPath:`assets/nexa/states/nexa-thinking-64.webp`,detail:`full`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:5164,sha256:`e75cfa7efd7b9b9cea157c4da8fae73b780d96deaadd84992888c0c06b1b12a7`,source:{body:`assets/nexa/master/nexa-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-thinking-expression.png`}},{id:`states.nexa-thinking-48`,state:`thinking`,usage:`state`,dimensions:{width:48,height:48},assetPath:`assets/nexa/states/nexa-thinking-48.webp`,detail:`optical`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:3074,sha256:`a6a9e54f76a106d705cb2bbb51615c719c308b1f9b57fafa2724d1fab2a63f9f`,source:{body:`assets/nexa/master/nexa-optical-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-thinking-expression.png`}},{id:`states.nexa-thinking-32`,state:`thinking`,usage:`state`,dimensions:{width:32,height:32},assetPath:`assets/nexa/states/nexa-thinking-32.webp`,detail:`optical`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:1866,sha256:`fb39bea7021be1c45d75ce46a3d641bb25b5ec4aec375c119cca43eb3a63a0cd`,source:{body:`assets/nexa/master/nexa-optical-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-thinking-expression.png`}},{id:`states.nexa-speaking-512`,state:`speaking`,usage:`state`,dimensions:{width:512,height:512},assetPath:`assets/nexa/states/nexa-speaking-512.webp`,detail:`full`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:124414,sha256:`5502d6840142fea2b02f032d187d7f6bb7d8aa477130868e02c756ee347c05e6`,source:{body:`assets/nexa/master/nexa-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-speaking-expression.png`}},{id:`states.nexa-speaking-256`,state:`speaking`,usage:`state`,dimensions:{width:256,height:256},assetPath:`assets/nexa/states/nexa-speaking-256.webp`,detail:`full`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:38300,sha256:`ed84bd8cea354af587169326305ed521c818049ea893317073111dccaa8ad50e`,source:{body:`assets/nexa/master/nexa-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-speaking-expression.png`}},{id:`states.nexa-speaking-128`,state:`speaking`,usage:`state`,dimensions:{width:128,height:128},assetPath:`assets/nexa/states/nexa-speaking-128.webp`,detail:`full`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:14584,sha256:`09770add79a1cb9b96f1cd17a64fe1dbec0b37a3e0d9aaed91f9f67bdaa13d83`,source:{body:`assets/nexa/master/nexa-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-speaking-expression.png`}},{id:`states.nexa-speaking-96`,state:`speaking`,usage:`state`,dimensions:{width:96,height:96},assetPath:`assets/nexa/states/nexa-speaking-96.webp`,detail:`full`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:9352,sha256:`0be48d62c1c09a4853cf794ab97f960e3e3d0431f18c0d064e48a090584ec99f`,source:{body:`assets/nexa/master/nexa-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-speaking-expression.png`}},{id:`states.nexa-speaking-64`,state:`speaking`,usage:`state`,dimensions:{width:64,height:64},assetPath:`assets/nexa/states/nexa-speaking-64.webp`,detail:`full`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:5190,sha256:`bf2715144b02b7ba4e255eb35381d26043511e9ef339597eebd58f328dd8fd68`,source:{body:`assets/nexa/master/nexa-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-speaking-expression.png`}},{id:`states.nexa-speaking-48`,state:`speaking`,usage:`state`,dimensions:{width:48,height:48},assetPath:`assets/nexa/states/nexa-speaking-48.webp`,detail:`optical`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:3104,sha256:`9becd9f6dd3e2b4d9890509e2c2eb771a4ce8aa979527a327bae220b841c08df`,source:{body:`assets/nexa/master/nexa-optical-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-speaking-expression.png`}},{id:`states.nexa-speaking-32`,state:`speaking`,usage:`state`,dimensions:{width:32,height:32},assetPath:`assets/nexa/states/nexa-speaking-32.webp`,detail:`optical`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:1874,sha256:`998477a58fb1ff12477975bc38a5a627ab81e9a165869125af395d7b7971d389`,source:{body:`assets/nexa/master/nexa-optical-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-speaking-expression.png`}},{id:`states.nexa-success-512`,state:`success`,usage:`state`,dimensions:{width:512,height:512},assetPath:`assets/nexa/states/nexa-success-512.webp`,detail:`full`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:124328,sha256:`b124543ad87ce5d0c59f20d6ead57d09ca11aa87601aac35ad160e57be38ab54`,source:{body:`assets/nexa/master/nexa-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-success-expression.png`}},{id:`states.nexa-success-256`,state:`success`,usage:`state`,dimensions:{width:256,height:256},assetPath:`assets/nexa/states/nexa-success-256.webp`,detail:`full`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:38078,sha256:`c29a7545577a6d5f334e1c978a54f61d04a8ecad1321adcf807125de94bcaf97`,source:{body:`assets/nexa/master/nexa-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-success-expression.png`}},{id:`states.nexa-success-128`,state:`success`,usage:`state`,dimensions:{width:128,height:128},assetPath:`assets/nexa/states/nexa-success-128.webp`,detail:`full`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:14524,sha256:`a99bebe6dd53c28a3242d11138b774aef5bbf9727ac3bb5efa369a8dfd0eb3e7`,source:{body:`assets/nexa/master/nexa-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-success-expression.png`}},{id:`states.nexa-success-96`,state:`success`,usage:`state`,dimensions:{width:96,height:96},assetPath:`assets/nexa/states/nexa-success-96.webp`,detail:`full`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:9236,sha256:`7fb8a120d30f4bd19b9f881c09652201e69d0146cafdd8b7f5c337a501acbcd5`,source:{body:`assets/nexa/master/nexa-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-success-expression.png`}},{id:`states.nexa-success-64`,state:`success`,usage:`state`,dimensions:{width:64,height:64},assetPath:`assets/nexa/states/nexa-success-64.webp`,detail:`full`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:5158,sha256:`46a40c63c2bd110d2eae84c2c9aaa19978db3093b021f23648d1f1a36878a150`,source:{body:`assets/nexa/master/nexa-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-success-expression.png`}},{id:`states.nexa-success-48`,state:`success`,usage:`state`,dimensions:{width:48,height:48},assetPath:`assets/nexa/states/nexa-success-48.webp`,detail:`optical`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:3068,sha256:`4d417672752a489386604a630eb98e848fb1d71d6373516c8f753ebaf0564e6b`,source:{body:`assets/nexa/master/nexa-optical-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-success-expression.png`}},{id:`states.nexa-success-32`,state:`success`,usage:`state`,dimensions:{width:32,height:32},assetPath:`assets/nexa/states/nexa-success-32.webp`,detail:`optical`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:1868,sha256:`60d9c7cf797ca9af341ef9f26e937b70e3a65cf106771c0e0c9f398bc89d6a6a`,source:{body:`assets/nexa/master/nexa-optical-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-success-expression.png`}},{id:`states.nexa-warning-512`,state:`warning`,usage:`state`,dimensions:{width:512,height:512},assetPath:`assets/nexa/states/nexa-warning-512.webp`,detail:`full`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:124034,sha256:`b29ea8b23fc90736c503aec043474ed6636fafa67961da98861d1bdec283f763`,source:{body:`assets/nexa/master/nexa-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-warning-expression.png`}},{id:`states.nexa-warning-256`,state:`warning`,usage:`state`,dimensions:{width:256,height:256},assetPath:`assets/nexa/states/nexa-warning-256.webp`,detail:`full`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:38028,sha256:`f9773fe7a439e1b19984a7b53043729ee65faac9e16ddb8d0d5d86d3bc4e087a`,source:{body:`assets/nexa/master/nexa-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-warning-expression.png`}},{id:`states.nexa-warning-128`,state:`warning`,usage:`state`,dimensions:{width:128,height:128},assetPath:`assets/nexa/states/nexa-warning-128.webp`,detail:`full`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:14484,sha256:`d85a6d9087938fff667d89ef0f2d52ff5d2cc77a9cfa432cc6f75f6bf644ff71`,source:{body:`assets/nexa/master/nexa-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-warning-expression.png`}},{id:`states.nexa-warning-96`,state:`warning`,usage:`state`,dimensions:{width:96,height:96},assetPath:`assets/nexa/states/nexa-warning-96.webp`,detail:`full`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:9230,sha256:`70f5a9020967183796dcfc9a3d38dd3fe899fb83e83df019c8ccaf6f495456b2`,source:{body:`assets/nexa/master/nexa-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-warning-expression.png`}},{id:`states.nexa-warning-64`,state:`warning`,usage:`state`,dimensions:{width:64,height:64},assetPath:`assets/nexa/states/nexa-warning-64.webp`,detail:`full`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:5118,sha256:`65a9c940e498b4a432dcdd35439924cdfdd70dfdf93f4e4fcfeb5cd400e64012`,source:{body:`assets/nexa/master/nexa-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-warning-expression.png`}},{id:`states.nexa-warning-48`,state:`warning`,usage:`state`,dimensions:{width:48,height:48},assetPath:`assets/nexa/states/nexa-warning-48.webp`,detail:`optical`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:3082,sha256:`0f44663e9efffd04c7abafa822105327b9f19d61cc3df4a52d8a7580220c7581`,source:{body:`assets/nexa/master/nexa-optical-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-warning-expression.png`}},{id:`states.nexa-warning-32`,state:`warning`,usage:`state`,dimensions:{width:32,height:32},assetPath:`assets/nexa/states/nexa-warning-32.webp`,detail:`optical`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:1870,sha256:`60eaddba12e1ea4c53af4f0ca544b8f3073ff22110ffe662d6829e1a211debfe`,source:{body:`assets/nexa/master/nexa-optical-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-warning-expression.png`}},{id:`desktop.nexa-desktop-wide`,state:`ready`,usage:`desktop-wide`,dimensions:{width:256,height:256},assetPath:`assets/nexa/states/nexa-ready-256.webp`,detail:`full`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:38084,sha256:`c8f4bd7222065c359b040afcd3adcf08162d7e1b417dfc0851d9d23f193e3f89`,recommendedDisplayDimensions:{width:128,height:128},pixelRatio:2,source:{body:`assets/nexa/master/nexa-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-ready-expression.png`}},{id:`desktop.nexa-desktop-compact`,state:`ready`,usage:`desktop-compact`,dimensions:{width:128,height:128},assetPath:`assets/nexa/desktop/nexa-desktop-compact.webp`,detail:`optical`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:11444,sha256:`590c7c0f4475271cd2e722573859ec4bdc8181e97b2e6cb2c7a2762b79aaea7c`,recommendedDisplayDimensions:{width:64,height:64},pixelRatio:2,source:{body:`assets/nexa/master/nexa-optical-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-ready-expression.png`}},{id:`desktop.nexa-desktop-micro`,state:`ready`,usage:`desktop-micro`,dimensions:{width:40,height:40},assetPath:`assets/nexa/desktop/nexa-desktop-micro.webp`,detail:`optical`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:2560,sha256:`a7675b5183bf19c4db4a46d53544b084b45857a0b7235a035d6c568d8c9872c9`,recommendedDisplayDimensions:{width:40,height:40},pixelRatio:1,source:{body:`assets/nexa/master/nexa-optical-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-ready-expression.png`}},{id:`web.nexa-web-launcher`,state:`ready`,usage:`web-launcher`,dimensions:{width:96,height:96},assetPath:`assets/nexa/web/nexa-web-launcher.webp`,detail:`optical`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:7690,sha256:`941d9cffd2fe6e3f5fcfc7b75a28943e10995c558f69b2499285e96f68d669c6`,recommendedDisplayDimensions:{width:48,height:48},pixelRatio:2,source:{body:`assets/nexa/master/nexa-optical-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-ready-expression.png`}},{id:`web.nexa-web-welcome`,state:`ready`,usage:`web-welcome`,dimensions:{width:256,height:256},assetPath:`assets/nexa/states/nexa-ready-256.webp`,detail:`full`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:38084,sha256:`c8f4bd7222065c359b040afcd3adcf08162d7e1b417dfc0851d9d23f193e3f89`,recommendedDisplayDimensions:{width:128,height:128},pixelRatio:2,source:{body:`assets/nexa/master/nexa-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-ready-expression.png`}},{id:`web.nexa-web-compact-header`,state:`ready`,usage:`web-compact-header`,dimensions:{width:64,height:64},assetPath:`assets/nexa/web/nexa-web-compact-header.webp`,detail:`optical`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:4578,sha256:`7a09913c80c5c24a303ff56d7224d89daf09c971290117827c5fd8e0abf60b82`,recommendedDisplayDimensions:{width:32,height:32},pixelRatio:2,source:{body:`assets/nexa/master/nexa-optical-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-ready-expression.png`}},{id:`web.nexa-web-thinking-header`,state:`thinking`,usage:`web-thinking-header`,dimensions:{width:64,height:64},assetPath:`assets/nexa/web/nexa-web-thinking-header.webp`,detail:`optical`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:4518,sha256:`7cc28fa304d87f26411de3a2442ddd1e878025ece77cd358e5d3cacf4e430611`,recommendedDisplayDimensions:{width:32,height:32},pixelRatio:2,source:{body:`assets/nexa/master/nexa-optical-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-thinking-expression.png`}},{id:`web.nexa-web-speaking-header`,state:`speaking`,usage:`web-speaking-header`,dimensions:{width:64,height:64},assetPath:`assets/nexa/web/nexa-web-speaking-header.webp`,detail:`optical`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:4502,sha256:`4f430efa94d60e20f121e24d0604331691c6ced4dd1e24f65584bbf3f2780ef0`,recommendedDisplayDimensions:{width:32,height:32},pixelRatio:2,source:{body:`assets/nexa/master/nexa-optical-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-speaking-expression.png`}},{id:`desktop.nexa-desktop-micro-36`,state:`ready`,usage:`desktop-micro`,dimensions:{width:36,height:36},assetPath:`assets/nexa/desktop/nexa-desktop-micro-36.webp`,detail:`optical`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:2256,sha256:`34cf2bf81cd388b6cf59f8dd12cbd0020cb13312d84cc0199da968467475653a`,recommendedDisplayDimensions:{width:36,height:36},pixelRatio:1,source:{body:`assets/nexa/master/nexa-optical-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-ready-expression.png`}},{id:`desktop.nexa-desktop-micro-44`,state:`ready`,usage:`desktop-micro`,dimensions:{width:44,height:44},assetPath:`assets/nexa/desktop/nexa-desktop-micro-44.webp`,detail:`optical`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:2968,sha256:`bb43de6be93f792d135ffbb5789f2a1c67a8432f74bf4c050e5b2a27bb442c3e`,recommendedDisplayDimensions:{width:44,height:44},pixelRatio:1,source:{body:`assets/nexa/master/nexa-optical-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-ready-expression.png`}},{id:`desktop.nexa-desktop-micro-72`,state:`ready`,usage:`desktop-micro`,dimensions:{width:72,height:72},assetPath:`assets/nexa/desktop/nexa-desktop-micro-72.webp`,detail:`optical`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:5296,sha256:`dfe06f69e67064f7384b679db867ba59a46375df6333e2ad79c5ddef2bc439d7`,recommendedDisplayDimensions:{width:36,height:36},pixelRatio:2,source:{body:`assets/nexa/master/nexa-optical-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-ready-expression.png`}},{id:`desktop.nexa-desktop-micro-80`,state:`ready`,usage:`desktop-micro`,dimensions:{width:80,height:80},assetPath:`assets/nexa/desktop/nexa-desktop-micro-80.webp`,detail:`optical`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:6036,sha256:`5c89e9eb2376331c9c7b71fb2a926e245f808369adf609b35a05cd9bd72025d9`,recommendedDisplayDimensions:{width:40,height:40},pixelRatio:2,source:{body:`assets/nexa/master/nexa-optical-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-ready-expression.png`}},{id:`desktop.nexa-desktop-micro-88`,state:`ready`,usage:`desktop-micro`,dimensions:{width:88,height:88},assetPath:`assets/nexa/desktop/nexa-desktop-micro-88.webp`,detail:`optical`,theme:`independent`,static:!0,motionSafe:!0,animated:!1,format:`image/webp`,bytes:6792,sha256:`8d22f8447f6c19e17ae94f757ee91633049386f61e67e0337aefd3e6980d47d5`,recommendedDisplayDimensions:{width:44,height:44},pixelRatio:2,source:{body:`assets/nexa/master/nexa-optical-body-source-1254.png`,expression:`assets/nexa/master/expressions/nexa-ready-expression.png`}},{id:`habitat.nexa-habitat-wide-light`,state:null,usage:`habitat-wide`,dimensions:{width:256,height:144},assetPath:`assets/nexa/habitat/nexa-habitat-wide-light.svg`,detail:`habitat`,theme:`light`,static:!0,motionSafe:!0,animated:!1,format:`image/svg+xml`,bytes:535,sha256:`2efa2524def42eebd3f37f3e3713dd874df3de29f938255661278593f90f6d2b`,vectorSource:`assets/nexa/habitat/nexa-habitat-wide-light.svg`},{id:`habitat.nexa-habitat-compact-light`,state:null,usage:`habitat-compact`,dimensions:{width:192,height:80},assetPath:`assets/nexa/habitat/nexa-habitat-compact-light.svg`,detail:`habitat`,theme:`light`,static:!0,motionSafe:!0,animated:!1,format:`image/svg+xml`,bytes:522,sha256:`eca2d4bf697bda37db5ab2e2d05df9943c5c84ff05b8b357ae8bbef061925ec6`,vectorSource:`assets/nexa/habitat/nexa-habitat-compact-light.svg`},{id:`habitat.nexa-contact-shadow-light`,state:null,usage:`contact-shadow`,dimensions:{width:128,height:24},assetPath:`assets/nexa/habitat/nexa-contact-shadow-light.svg`,detail:`shadow`,theme:`light`,static:!0,motionSafe:!0,animated:!1,format:`image/svg+xml`,bytes:316,sha256:`dfaacc2c2f3ff978ee8491e15e9ac0c5e4e663909dee85f26a7c370fee043030`,vectorSource:`assets/nexa/habitat/nexa-contact-shadow-light.svg`},{id:`habitat.nexa-micro-shadow-light`,state:null,usage:`micro-shadow`,dimensions:{width:48,height:12},assetPath:`assets/nexa/habitat/nexa-micro-shadow-light.svg`,detail:`shadow`,theme:`light`,static:!0,motionSafe:!0,animated:!1,format:`image/svg+xml`,bytes:312,sha256:`470bb94144f0a7b77215969e0d94396cf27fe93720e6a28778ca1082ea6c6045`,vectorSource:`assets/nexa/habitat/nexa-micro-shadow-light.svg`},{id:`habitat.nexa-habitat-wide-dark`,state:null,usage:`habitat-wide`,dimensions:{width:256,height:144},assetPath:`assets/nexa/habitat/nexa-habitat-wide-dark.svg`,detail:`habitat`,theme:`dark`,static:!0,motionSafe:!0,animated:!1,format:`image/svg+xml`,bytes:535,sha256:`00b7a358aa64e7d0e7c9e1790f6928b3e74439b0e42ded8aca73ff86bb7712d2`,vectorSource:`assets/nexa/habitat/nexa-habitat-wide-dark.svg`},{id:`habitat.nexa-habitat-compact-dark`,state:null,usage:`habitat-compact`,dimensions:{width:192,height:80},assetPath:`assets/nexa/habitat/nexa-habitat-compact-dark.svg`,detail:`habitat`,theme:`dark`,static:!0,motionSafe:!0,animated:!1,format:`image/svg+xml`,bytes:522,sha256:`a7a6ebff446a1e97fad63ce62c64efbf26f03dba91e7298e3c23eea6ef7e9309`,vectorSource:`assets/nexa/habitat/nexa-habitat-compact-dark.svg`},{id:`habitat.nexa-contact-shadow-dark`,state:null,usage:`contact-shadow`,dimensions:{width:128,height:24},assetPath:`assets/nexa/habitat/nexa-contact-shadow-dark.svg`,detail:`shadow`,theme:`dark`,static:!0,motionSafe:!0,animated:!1,format:`image/svg+xml`,bytes:316,sha256:`baf462e0d1cc505f94a3ce25278f3ecdc622c2d136e96b6c79c91942880cb92a`,vectorSource:`assets/nexa/habitat/nexa-contact-shadow-dark.svg`},{id:`habitat.nexa-micro-shadow-dark`,state:null,usage:`micro-shadow`,dimensions:{width:48,height:12},assetPath:`assets/nexa/habitat/nexa-micro-shadow-dark.svg`,detail:`shadow`,theme:`dark`,static:!0,motionSafe:!0,animated:!1,format:`image/svg+xml`,bytes:312,sha256:`1b93e18755393d157c7addaa419593c03363c5be1bba7f959c09ae1c9b00b554`,vectorSource:`assets/nexa/habitat/nexa-micro-shadow-dark.svg`}],sources:{body:`assets/nexa/master/nexa-body-source-1254.png`,opticalBody:`assets/nexa/master/nexa-optical-body-source-1254.png`,expressionMask:`assets/nexa/master/nexa-expression-mask-1254.png`,readyHighResolution:`assets/nexa/master/nexa-ready-source-1254.png`,opticalHighResolution:`assets/nexa/master/nexa-optical-source-1254.png`,expressions:{sleep:`assets/nexa/master/expressions/nexa-sleep-expression.png`,ready:`assets/nexa/master/expressions/nexa-ready-expression.png`,listening:`assets/nexa/master/expressions/nexa-listening-expression.png`,thinking:`assets/nexa/master/expressions/nexa-thinking-expression.png`,speaking:`assets/nexa/master/expressions/nexa-speaking-expression.png`,success:`assets/nexa/master/expressions/nexa-success-expression.png`,warning:`assets/nexa/master/expressions/nexa-warning-expression.png`},generationPrompts:`assets/nexa/master/generation-prompts.json`,lineage:`assets/nexa/master/source-lineage.json`},runtime:{stateAliases:{pleased:`success`,concerned:`warning`},desktop:{wide:{usage:`state`,width:256,displaySize:112},compact:{usage:`state`,width:96,displaySize:56},micro:{usage:`state`,width:48,displaySize:40}},web:{launcher:{usage:`web-launcher`},welcome:{usage:`web-welcome`},ready:{usage:`web-compact-header`},thinking:{usage:`web-thinking-header`},speaking:{usage:`web-speaking-header`},concerned:{usage:`state`,state:`warning`,width:48}},fallbackPolicy:`WebP supported by target Electron and modern browsers; no redundant runtime PNG fallback. Source masters remain PNG.`}},Je=document.currentScript instanceof HTMLScriptElement?document.currentScript.src:``,k=Le({schedule:(e,t)=>window.setTimeout(e,t),cancel:e=>window.clearTimeout(e)},{response:1400,success:1600,error:2800});function Ye(e,t,n){let r=e===`header`?t===`thinking`||t===`speaking`||t===`concerned`?t:`ready`:e,i=Fe(qe,qe.runtime.web[r]);return Je?new URL(i.assetPath,new URL(`.`,Je)).href:n?`${n.replace(/\/$/,``)}/${i.assetPath}`:i.assetPath}var Xe={launcher:48,welcome:112,header:32},A=[],Ze=[];function Qe(){for(let{controller:e,removeHover:t}of A)t(),e.unmount();A=[],Ze=[]}function $e(e,t){for(let n of e.querySelectorAll(`[data-nexa-role]`)){let r=n.dataset.nexaRole;try{let e=Ke(n,{state:k.getState(),motion:!1,natural:!0,size:Xe[r]}),t=()=>e.react(`hover`);n.addEventListener(`pointerenter`,t),A.push({role:r,controller:e,removeHover:()=>n.removeEventListener(`pointerenter`,t)})}catch{let i=e.ownerDocument.createElement(`img`);i.alt=``,i.className=`ya-widget-nexa-fallback`,i.src=Ye(r,k.getState(),t),n.replaceChildren(i),Ze.push({role:r,image:i})}}}function et(e,t){let n=k.getState();for(let{role:t,controller:r}of A)r.update({state:n,motion:e&&t!==`launcher`,natural:!0,size:Xe[t]});for(let{role:e,image:r}of Ze){let i=Ye(e,n,t);r.src!==i&&(r.src=i)}let i=document.querySelector(`[data-ya-nexa-speech-slot]`),a=i?.querySelector(`[data-ya-nexa-speech]`);if(!i||!a||i.dataset.state===n)return;i.dataset.state=n;let o=r(Ie[n]);if(i.hidden=!o,a.setAttribute(`aria-label`,o),a.textContent=o,n===`thinking`){a.textContent=o.replace(/…$/,``);let e=document.createElement(`span`);e.className=`ya-nexa-speech-dots`,e.setAttribute(`aria-hidden`,`true`);for(let t=0;t<3;t++){let t=document.createElement(`i`);t.textContent=`.`,e.append(t)}a.append(e)}}var j=`#yardimci-asistan-widget`,tt=`yardimci-asistan-direct-request-style`,nt=new WeakMap,rt=!1,it=!1,M={businessName:`Yardımcı Asistan`,whatsappPhone:``,apiBaseUrl:``};function at(){if(rt)return;rt=!0,M={...M,...vt()},bt(),ot(),queueMicrotask(ot),document.addEventListener(`submit`,lt,!0);let e=document.querySelector(j);e&&(st(e),ct(e))}function ot(){let e=window.YardimciAsistanWidget;if(!e||typeof e.init!=`function`||e.__directRequestInitWrapped===!0)return;let t=e.init.bind(e);e.init=(e={})=>{M={...M,...yt(e)},t(e);let n=document.querySelector(j);n&&(st(n),queueMicrotask(()=>ct(n)))},e.__directRequestInitWrapped=!0}function st(e){e.dataset.yaDirectRequestObserved!==`1`&&(e.dataset.yaDirectRequestObserved=`1`,new MutationObserver(()=>ct(e)).observe(e,{childList:!0,subtree:!0}))}function ct(e){let t=e.querySelector(`.ya-widget-form[data-ya-form]`);if(!t)return;let n=t.querySelector(`button[type="submit"]`);n&&n.dataset.yaDirectRequestButton!==`1`&&(n.dataset.yaDirectRequestButton=`1`,n.innerHTML=`${St()}<span>${i(`Talebi Gönder`)}</span>`)}function lt(e){let t=e.target instanceof HTMLFormElement?e.target:null;t?.matches(`.ya-widget-form[data-ya-form]`)&&(e.preventDefault(),e.stopImmediatePropagation(),it||ut(t))}async function ut(e){let t=new FormData(e),n=String(t.get(`customer_phone`)??``).trim(),i=de(n);if(!i.ok){N(r(i.error)),e.querySelector(`input[name="customer_phone"]`)?.focus();return}let a=String(t.get(`request_type`)??`pension_reservation`);if(a!==`pension_reservation`&&a!==`restaurant_reservation`){N(r(`Talep türü geçerli değil. Lütfen yeniden deneyin.`));return}let o={request_type:a,customer_name:String(t.get(`customer_name`)??``).trim(),customer_phone:n,date_text:String(t.get(`date_text`)??``).trim(),start_date:String(t.get(`start_date`)??``).trim(),end_date:String(t.get(`end_date`)??``).trim(),time:String(t.get(`time`)??``).trim(),guest_count:Number(t.get(`guest_count`)??1),message:dt(String(t.get(`message`)??``).trim(),String(t.get(`context_resource_type`)??``).trim(),String(t.get(`context_resource_name`)??``).trim()),source:`web_form`,whatsapp_message:``,context:{resourceType:String(t.get(`context_resource_type`)??``).trim(),resourceId:String(t.get(`context_resource_id`)??``).trim(),resourceName:String(t.get(`context_resource_name`)??``).trim(),sourcePath:String(t.get(`context_source_path`)??``).trim()}},s=ft(o);if(!o.customer_name||s||!Number.isFinite(o.guest_count)||o.guest_count<1){N(s||r(`Lütfen gerekli alanları kontrol edin.`));return}if(o.whatsapp_message=ge({...o,time_text:o.time},M.businessName||r(`İşletme`)),!M.apiBaseUrl.trim()){N(r(`Web talep bağlantısı bu sitede etkin değil. İsterseniz WhatsApp üzerinden yazabilirsiniz.`)),mt(e,o.whatsapp_message);return}let c=JSON.stringify({...o,customer_phone:i.e164,whatsapp_message:``}),l=nt.get(e),u=l?.intent===c?l.key:Array.from(crypto.getRandomValues(new Uint8Array(16)),e=>e.toString(16).padStart(2,`0`)).join(``);nt.set(e,{intent:c,key:u}),o.idempotency_key=u,it=!0,_t(),gt(e,!0);let d=k.begin(),f=r(`Talep işletmeye iletilemedi. İnternet bağlantınızı kontrol edip tekrar deneyin.`);try{let t=await fetch(`${M.apiBaseUrl.trim().replace(/\/$/,``)}/api/request.php`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(o)}),n=await t.json().catch(()=>null);if(!t.ok||n?.ok!==!0||!n.request_id)throw f=t.status===429?r(`Çok fazla istek gönderildi. Biraz sonra aynı talebi tekrar deneyin.`):t.status>=400&&t.status<500?r(`İstek işlenemedi. Lütfen bilgileri kontrol edip tekrar deneyin.`):r(`Talep işletmeye iletilemedi.`),Error(`request_failed`);d(e.isConnected?`success`:`cancel`),nt.delete(e),_t(),pt(e,n.whatsapp_message||o.whatsapp_message)}catch{d(e.isConnected?`error`:`cancel`),N(f),mt(e,o.whatsapp_message),gt(e,!1)}finally{it=!1}}function dt(e,t,n){return n?[`${r(t===`room`?`İlgili oda`:t===`table`?`İlgili masa`:t===`product`?`İlgili ürün`:`İlgili kayıt`)}: ${n}`,e].filter(Boolean).join(`
`):e}function ft(e){return e.request_type===`pension_reservation`?!e.start_date||!e.end_date?r(`Lütfen giriş ve çıkış tarihlerini seçin.`):e.end_date<=e.start_date?r(`Çıkış tarihi giriş tarihinden sonra olmalı.`):``:e.start_date?e.time?``:r(`Lütfen rezervasyon saatini seçin.`):r(`Lütfen rezervasyon tarihini seçin.`)}function pt(e,t){let n=e.closest(`.ya-widget-subview`),a=n?.querySelector(`.ya-widget-subview-intro`),o=a?.querySelector(`h2`),s=a?.querySelector(`p`);o&&(o.textContent=r(`Talebiniz işletmeye iletildi`)),s&&(s.textContent=r(`İşletme talebinizi inceleyip sizinle iletişime geçecek.`));let c=document.createElement(`div`);c.className=`ya-widget-request-success`;let l=document.createElement(`div`);l.className=`ya-widget-request-success-card`,l.innerHTML=`${wt()}<div><strong>${i(`Talebiniz kaydedildi.`)}</strong></div>`,c.appendChild(l);let u=document.createElement(`div`);if(u.className=`ya-widget-request-success-actions`,ht()){let e=document.createElement(`button`);e.type=`button`,e.className=`ya-widget-secondary-action`,e.dataset.yaRequestWhatsapp=`1`,e.innerHTML=`${Ct()}<span>${i(`WhatsApp'tan da yaz`)}</span>`,e.addEventListener(`click`,()=>{let e=le(M.whatsappPhone,t);e&&window.open(e,`_blank`,`noopener,noreferrer`)}),u.appendChild(e)}let d=document.createElement(`button`);d.type=`button`,d.className=`ya-widget-primary-action`,d.dataset.yaRequestDone=`1`,d.innerHTML=`${wt()}<span>${i(`Tamam`)}</span>`,d.addEventListener(`click`,()=>{n?.querySelector(`[data-ya-view="home"]`)?.click()}),u.appendChild(d),c.appendChild(u),e.replaceWith(c)}function mt(e,t){if(!ht()||e.querySelector(`[data-ya-request-fallback]`))return;let n=document.createElement(`button`);n.type=`button`,n.className=`ya-widget-secondary-action ya-widget-request-fallback`,n.dataset.yaRequestFallback=`1`,n.innerHTML=`${Ct()}<span>${i(`WhatsApp'tan Yaz`)}</span>`,n.addEventListener(`click`,()=>{let e=le(M.whatsappPhone,t);e&&window.open(e,`_blank`,`noopener,noreferrer`)}),e.querySelector(`button[type="submit"]`)?.insertAdjacentElement(`afterend`,n)}function ht(){return document.querySelector(j)?.dataset.yaWhatsappEnabled!==`0`&&M.whatsappPhone.trim()!==``}function gt(e,t){let n=e.querySelector(`button[type="submit"]`);n&&(n.disabled=t,n.classList.toggle(`is-loading`,t),n.innerHTML=t?`<span class="ya-widget-spinner" aria-hidden="true"></span><span>${i(`Talep gönderiliyor…`)}</span>`:`${St()}<span>${i(`Talebi Gönder`)}</span>`)}function N(e){let t=document.querySelector(`${j} [data-ya-status]`),n=t?.querySelector(`[data-ya-status-text]`);t&&n&&(n.textContent=e,t.hidden=!1)}function _t(){let e=document.querySelector(`${j} [data-ya-status]`),t=e?.querySelector(`[data-ya-status-text]`);e&&t&&(t.textContent=``,e.hidden=!0)}function vt(){let e=Array.from(document.scripts).reverse(),t=(document.currentScript??e.find(e=>e.dataset.apiBaseUrl!==void 0||/widget\.js(?:$|\?)/.test(e.src)))?.dataset;return yt({...t?.businessName===void 0?{}:{businessName:t.businessName},...t?.whatsappPhone===void 0?{}:{whatsappPhone:t.whatsappPhone},...t?.apiBaseUrl===void 0?{}:{apiBaseUrl:t.apiBaseUrl}})}function yt(e){let t={};return typeof e.businessName==`string`&&e.businessName.trim()&&(t.businessName=e.businessName),typeof e.whatsappPhone==`string`&&e.whatsappPhone.trim()&&(t.whatsappPhone=e.whatsappPhone),typeof e.apiBaseUrl==`string`&&e.apiBaseUrl.trim()&&(t.apiBaseUrl=e.apiBaseUrl),t}function bt(){if(document.getElementById(tt))return;let e=document.createElement(`style`);e.id=tt,e.textContent=`
    ${j} .ya-widget-request-success { display: grid; gap: 12px; }
    ${j} .ya-widget-request-success-card {
      display: flex; align-items: flex-start; gap: 10px; padding: 13px;
      border: 1px solid rgba(47,111,94,.2); border-radius: 15px; background: #edf5ec;
    }
    ${j} .ya-widget-request-success-card > .ya-widget-icon { color: #2F6F5E; }
    ${j} .ya-widget-request-success-card div { display: grid; gap: 3px; }
    ${j} .ya-widget-request-success-card strong { color: #172033; font-size: 13px; }
    ${j} .ya-widget-request-success-actions { display: grid; gap: 8px; }
    ${j} .ya-widget-request-fallback { margin-top: -4px; }
  `,document.head.appendChild(e)}function xt(e){return`<svg class="ya-widget-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${e}</svg>`}function St(){return xt(`<path d="m22 2-7 20-4-9-9-4 20-7Z"/><path d="M22 2 11 13"/>`)}function Ct(){return xt(`<path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.4-4A8 8 0 1 1 20 11.5Z"/><path d="M9 8.7c.5 2.5 2 4 4.5 4.8l1-1"/>`)}function wt(){return xt(`<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/>`)}function Tt(){let e=[...document.querySelectorAll(`[data-showcase-avatar]`)];if(!e.length)return;let t=document.createElement(`style`);t.textContent=`
    [data-showcase-avatar] { width:var(--showcase-avatar-size,200px); max-width:100%; min-width:0; display:grid; justify-items:center; overflow:hidden; isolation:isolate; }
    [data-showcase-avatar] .showcase-avatar-speech-slot { display:grid; place-items:center; width:100%; min-height:52px; padding:5px 8px 12px; box-sizing:border-box; }
    [data-showcase-avatar] .showcase-avatar-speech { position:relative; max-width:100%; padding:7px 12px; box-sizing:border-box; border:1px solid var(--line,#d7e4df); border-radius:14px; color:var(--ink,#172033); background:var(--paper,#fffdf8); box-shadow:0 3px 9px rgba(18,45,70,.08); font-size:13px; line-height:1.4; text-align:center; overflow-wrap:anywhere; animation:showcase-avatar-greeting 180ms ease-out both; }
    [data-showcase-avatar] .showcase-avatar-speech[hidden] { display:none; }
    [data-showcase-avatar] .showcase-avatar-speech::after { content:""; position:absolute; left:calc(50% - 4px); top:100%; width:8px; height:8px; background:inherit; border-right:inherit; border-bottom:inherit; transform:translateY(-4px) rotate(45deg); }
    [data-showcase-avatar] .showcase-avatar-stage { position:relative; width:100%; padding-bottom:22px; }
    [data-showcase-avatar] .showcase-avatar-character { display:block; width:100%; aspect-ratio:1; }
    [data-showcase-avatar] .showcase-avatar-character img { width:100%; height:100%; display:block; object-fit:contain; }
    [data-showcase-avatar] .showcase-avatar-stage::after { content:""; position:absolute; top:calc(100% - 14px); left:20%; width:60%; height:10px; background:radial-gradient(ellipse,rgba(18,45,70,.18),transparent 70%); border-radius:50%; }
    @keyframes showcase-avatar-greeting { from { opacity:0; transform:translateY(3px); } to { opacity:1; transform:translateY(0); } }
    @media (prefers-reduced-motion:reduce) { [data-showcase-avatar] .showcase-avatar-speech { animation:none; } }
  `,document.head.append(t);let n=[];function r(){n.length||(n=e.map(e=>{let t=Number(e.dataset.showcaseSize||200),n=Number.isFinite(t)?Math.min(240,Math.max(112,t)):200;e.style.setProperty(`--showcase-avatar-size`,`${n}px`),e.innerHTML=`<div class="showcase-avatar-speech-slot"><span class="showcase-avatar-speech" role="status" hidden>${i(`Merhaba!`)}</span></div><div class="showcase-avatar-stage" aria-hidden="true"><span class="showcase-avatar-character"></span></div>`;let r=e.querySelector(`.showcase-avatar-character`),a=e.querySelector(`.showcase-avatar-speech`),o,s=0,c=!1;try{o=Ke(r,{state:`ready`,motion:!0,natural:!0,size:n})}catch{let e=document.createElement(`img`);e.alt=``,e.src=Ye(`welcome`,`ready`,``),r.replaceChildren(e)}let l=()=>o?.react(`hover`);r.addEventListener(`pointerenter`,l);let u=new IntersectionObserver(([e])=>{e?.isIntersecting&&!c&&(c=!0,a.hidden=!1,o?.react(`press`),s=window.setTimeout(()=>{a.hidden=!0,s=0},3600),u.disconnect())});return u.observe(e),()=>{window.clearTimeout(s),u.disconnect(),r.removeEventListener(`pointerenter`,l),o?.unmount()}}))}r(),window.addEventListener(`pagehide`,()=>{for(let e of n)e();n=[]}),window.addEventListener(`pageshow`,r)}var Et={tax_certificate:`Vergi levhası`,activity_certificate:`Faaliyet belgesi`,authorization:`Yetki belgesi`,other:`Diğer belgeler`};function Dt(){return`<div class="ya-widget-subview"><button type="button" data-ya-view="home">Geri</button>
    <h2 class="ya-widget-view-title" tabindex="-1">Bayi Başvurusu</h2>
    <form class="ya-widget-form" data-dealer-application>
      ${[[`company_name`,`Firma / unvan`,`text`],[`authorized_person`,`Yetkili adı soyadı`,`text`],[`customer_phone`,`Telefon`,`tel`],[`email`,`E-posta`,`email`],[`tax_office`,`Vergi dairesi (isteğe bağlı)`,`text`],[`tax_number`,`Vergi numarası (isteğe bağlı)`,`text`]].map(([e,t,n])=>`<label class="ya-widget-field"><span>${t}</span><input name="${e}" type="${n}" maxlength="${e===`tax_number`?32:e===`authorized_person`?160:e===`email`?254:e===`tax_office`?120:180}" ${e.startsWith(`tax_`)?``:`required`} /></label>`).join(``)}
      <label class="ya-widget-field"><span>Başvuru notu (isteğe bağlı)</span><textarea name="message" maxlength="3000" rows="2"></textarea></label>
      <fieldset><legend>Belgeler (isteğe bağlı)</legend>
        <label class="ya-widget-field"><span>Belge türü</span><select name="document_kind">${Object.entries(Et).map(([e,t])=>`<option value="${e}">${t}</option>`).join(``)}</select></label>
        <label class="ya-widget-field"><span>Dosya seç · PDF, JPG, PNG · En fazla 5 dosya, dosya başına 10 MB</span><input data-document-picker type="file" accept="application/pdf,image/jpeg,image/png,.pdf,.jpg,.jpeg,.png" multiple /></label>
        <div data-document-list></div>
      </fieldset>
      <progress data-upload-progress max="100" value="0" hidden aria-label="Belge yükleme ilerlemesi"></progress>
      <p data-application-status role="status"></p><button class="ya-widget-primary-action" type="submit">Başvuruyu Gönder</button>
    </form></div>`}function Ot(e,t){let n=e.querySelector(`[data-dealer-application]`);if(!n)return;let r=n,i=[],a=r.querySelector(`[data-application-status]`),o=r.querySelector(`[data-document-list]`),s=r.querySelector(`[data-document-picker]`),c=r.querySelector(`[data-upload-progress]`),l=null,u=!1;function d(){o.replaceChildren(),i.forEach((e,t)=>{let n=document.createElement(`div`),r=document.createElement(`span`);r.textContent=`${Et[e.kind]} · ${e.file.name}`;let a=document.createElement(`button`);a.type=`button`,a.textContent=`Kaldır`,a.addEventListener(`click`,()=>{u||(i.splice(t,1),d())}),n.append(r,a),o.append(n)})}s.addEventListener(`change`,()=>{a.textContent=``;let e=Array.from(s.files??[]);if(i.length+e.length>5)a.textContent=`En fazla 5 dosya ekleyebilirsiniz.`;else if(e.some(e=>!e.size||e.size>10485760||!/\.(pdf|jpe?g|png)$/i.test(e.name)))a.textContent=`PDF, JPG veya PNG seçin. Her dosya en fazla 10 MB olabilir.`;else{let t=r.elements.namedItem(`document_kind`).value;i.push(...e.map(e=>({file:e,kind:t}))),d()}s.value=``}),r.addEventListener(`submit`,e=>{f(e)});async function f(e){if(e.preventDefault(),!u&&r.reportValidity()){u=!0,a.textContent=`Başvuru ve belgeler gönderiliyor…`,c.hidden=!1;try{let e=new FormData(r);e.delete(`document_kind`),e.set(`request_type`,`dealer_application`),e.set(`customer_name`,String(e.get(`authorized_person`))),e.set(`guest_count`,`1`);let n=await Promise.all(i.map(async({file:e,kind:t})=>({name:e.name,kind:t,hash:Array.from(new Uint8Array(await crypto.subtle.digest(`SHA-256`,await e.arrayBuffer())),e=>e.toString(16).padStart(2,`0`)).join(``)}))),o=JSON.stringify({fields:Array.from(e.entries()),files:n});(!l||l.intent!==o)&&(l={intent:o,key:crypto.randomUUID()}),e.set(`idempotency_key`,l.key),i.forEach(({file:t,kind:n})=>{e.append(`documents[]`,t),e.append(`document_kinds[]`,n)}),r.querySelectorAll(`input,button,select,textarea`).forEach(e=>e.disabled=!0);let s=await new Promise(n=>{let r=new XMLHttpRequest;r.open(`POST`,`${t.replace(/\/$/,``)}/api/request.php`),r.timeout=12e4,r.upload.onprogress=e=>{e.lengthComputable&&(c.value=e.loaded/e.total*100)},r.onload=()=>{try{let e=JSON.parse(r.responseText),t=e&&typeof e==`object`?e:{};n({ok:r.status>=200&&r.status<300&&t.ok===!0&&typeof t.request_id==`string`&&/^[A-Za-z0-9_-]{1,180}$/.test(t.request_id),message:typeof t.message==`string`?t.message:`Başvuru sonucu doğrulanamadı. Aynı başvuruyu yeniden deneyin.`})}catch{n({ok:!1,message:`Sunucu yanıtı okunamadı. Aynı başvuruyu yeniden deneyin.`})}},r.onerror=r.ontimeout=()=>n({ok:!1,message:`Yükleme tamamlanamadı. Aynı başvuruyu yeniden deneyin.`}),r.send(e)});s.ok?(l=null,r.reset(),i.length=0,d(),a.textContent=`Başvurunuz alındı. İşletmenin değerlendirmesi bekleniyor.`):a.textContent=s.message||`Başvuru gönderilemedi.`}catch{a.textContent=`Başvuru gönderilemedi. Yeniden deneyin.`}finally{u=!1,c.hidden=!0,r.querySelectorAll(`input,button,select,textarea`).forEach(e=>e.disabled=!1)}}}}function kt(e,t){return`
    #${e} {
      position: fixed;
      right: 18px;
      bottom: var(--ya-widget-bottom, 18px);
      z-index: 2147483000;
      color: #172033;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.4;
      transition: bottom 180ms ease;
    }

    #${e} * {
      box-sizing: border-box;
    }

    #${e} button,
    #${e} input,
    #${e} select,
    #${e} textarea {
      font: inherit;
    }

    #${e} button:focus-visible,
    #${e} a:focus-visible,
    #${e} input:focus-visible,
    #${e} select:focus-visible,
    #${e} textarea:focus-visible {
      outline: 3px solid rgba(255, 184, 146, 0.72);
      outline-offset: 2px;
    }

    #${e} [hidden] {
      display: none !important;
    }

    #${e} .ya-widget-icon {
      width: 18px;
      height: 18px;
      flex: 0 0 auto;
      fill: none;
      stroke: currentColor;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-width: 1.9;
    }

    .ya-widget-button {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-height: 58px;
      padding: 5px 14px 5px 6px;
      border: 1px solid #d7e4eb;
      border-radius: 20px;
      color: #172f4a;
      background: #f8fbfd;
      box-shadow: 0 6px 20px rgba(18, 45, 70, .12);
      cursor: pointer;
      transition: background-color 180ms ease;
    }
    .ya-widget-button:hover { background: #eef6fa; }
    #${e} .ya-widget-launcher-avatar { display: grid; width: 48px; height: 48px; flex: 0 0 auto; place-items: center; }
    .ya-widget-launcher-copy { display: grid; min-width: 0; text-align: left; }
    .ya-widget-launcher-copy strong { font-size: 14px; }
    .ya-widget-launcher-copy small { color: #5e7384; font-size: 11px; }
    #${e} .ya-widget-nexa,
    #${e} .ya-widget-nexa-fallback { display: block; width: 100%; height: 100%; object-fit: contain; }
    #${e} .ya-widget-nexa-welcome { display: block; width: 112px; height: 132px; padding-bottom: 20px; flex: 0 0 auto; position: relative; }
    #${e} .ya-widget-nexa-welcome::after { content: ""; position: absolute; width: 68px; height: 7px; left: 22px; top: 120px; border-radius: 50%; background: radial-gradient(ellipse, rgba(18,45,70,.16), transparent 70%); }
    #${e} .ya-widget-business-mark { display: inline-flex; vertical-align: middle; margin-right: 6px; }
    #${e} .ya-widget-business-mark .ya-widget-mark { width: 20px; height: 20px; border-radius: 4px; }
    #${e} .ya-widget-business-mark .ya-widget-mark-fallback { font-size: 8px; }
    @media (prefers-color-scheme: dark) {
      .ya-widget-button { background: #1d2e40; color: #eef6fb; border-color: #415668; }
      .ya-widget-button:hover { background: #263d50; }
      .ya-widget-launcher-copy small { color: #c0d2df; }
    }

    .ya-widget-mark {
      width: 34px;
      height: 34px;
      object-fit: contain;
      border-radius: 10px;
    }

    .ya-widget-mark-fallback {
      display: grid;
      place-items: center;
      color: ${t.primaryColor};
      background: #ffffff;
      font-size: 12px;
      font-weight: 900;
      letter-spacing: 0.04em;
    }

    .ya-widget-panel {
      display: flex;
      width: 410px;
      max-width: calc(100vw - 28px);
      max-height: min(710px, calc(100dvh - 36px));
      overflow: hidden;
      flex-direction: column;
      border: 1px solid rgba(47, 111, 94, 0.24);
      border-radius: 24px;
      background: #fff9ef;
      box-shadow: 0 28px 80px rgba(23, 32, 51, 0.26), 0 0 0 5px rgba(47, 111, 94, 0.07);
      transform-origin: right bottom;
    }

    .ya-widget-panel.is-opening {
      animation: ya-widget-panel-in 210ms cubic-bezier(.2,.8,.2,1) both;
    }

    .ya-widget-panel.is-closing {
      animation: ya-widget-panel-out 150ms ease-in both;
      pointer-events: none;
    }

    @keyframes ya-widget-panel-in {
      from { opacity: 0; transform: translateY(14px) scale(.975); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    @keyframes ya-widget-panel-out {
      from { opacity: 1; transform: translateY(0) scale(1); }
      to { opacity: 0; transform: translateY(10px) scale(.985); }
    }

    .ya-widget-header {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      min-height: 64px;
      padding: 14px;
      overflow: hidden;
      color: #ffffff;
      background: linear-gradient(135deg, ${t.primaryColor}, #18564e 56%, #123d3a);
      isolation: isolate;
    }

    #${e} .ya-widget-nexa-speech-slot { flex: 1 0 100%; min-width: 0; padding-bottom: 4px; }
    #${e} .ya-widget-nexa-speech {
      position: relative; display: inline-block; max-width: 100%; padding: 6px 10px;
      border: 1px solid rgba(255,255,255,.35); border-radius: 12px;
      background: #f8fbfd; color: #172f4a; box-shadow: 0 2px 6px rgba(18,45,70,.1);
      font-size: 12px; line-height: 1.4; overflow-wrap: anywhere;
      animation: ya-nexa-speech-in 180ms ease-out both;
    }
    #${e} .ya-widget-nexa-speech::after {
      content: ""; position: absolute; top: 100%; left: 12px; width: 7px; height: 7px;
      background: inherit; border-right: inherit; border-bottom: inherit;
      transform: translateY(-3px) rotate(45deg);
    }
    #${e} .ya-nexa-speech-dots i { display: inline-block; font-style: normal; animation: ya-nexa-speech-dot 1400ms ease-in-out infinite; }
    #${e} .ya-nexa-speech-dots i:nth-child(2) { animation-delay: 160ms; }
    #${e} .ya-nexa-speech-dots i:nth-child(3) { animation-delay: 320ms; }
    #${e}[data-nexa-motion-active="false"] .ya-nexa-speech-dots i { animation: none; }
    @keyframes ya-nexa-speech-in { from { opacity: 0; transform: translateY(3px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes ya-nexa-speech-dot { 0%, 70%, 100% { opacity: .4; transform: translateY(0); } 35% { opacity: 1; transform: translateY(-2px); } }
    @media (prefers-color-scheme: dark) {
      #${e} .ya-widget-nexa-speech { background: #1d2e40; color: #eef6fb; border-color: #526b7c; }
    }

    .ya-widget-header::after {
      position: absolute;
      top: -75px;
      right: -45px;
      width: 190px;
      height: 190px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.18), transparent 64%);
      content: "";
      z-index: -1;
    }

    .ya-widget-identity {
      display: flex;
      align-items: center;
      gap: 11px;
      min-width: 0;
    }

    #${e} .ya-widget-avatar { display: grid; width: 32px; height: 32px; flex: 0 0 auto; place-items: center; }
    .ya-widget-title-copy {
      display: grid;
      min-width: 0;
      gap: 3px;
    }

    .ya-widget-title-copy strong {
      overflow: hidden;
      font-size: 15px;
      line-height: 1.25;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .ya-widget-title-copy small {
      max-width: 260px;
      color: rgba(255, 255, 255, 0.78);
      font-size: 11px;
      line-height: 1.35;
    }

    .ya-widget-close {
      display: grid;
      width: 44px;
      height: 44px;
      flex: 0 0 auto;
      place-items: center;
      padding: 0;
      border: 1px solid rgba(255, 255, 255, 0.24);
      border-radius: 14px;
      color: #ffffff;
      background: rgba(255, 255, 255, 0.08);
      cursor: pointer;
    }

    .ya-widget-close:hover {
      background: rgba(255, 255, 255, 0.16);
    }

    .ya-widget-close span {
      font-size: 25px;
      line-height: 1;
      transform: translateY(-1px);
    }

    .ya-widget-notice {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 9px 13px;
      border-bottom: 1px solid rgba(185, 112, 25, 0.18);
      color: #6c4719;
      background: #fff4df;
      font-size: 11px;
      font-weight: 700;
      line-height: 1.4;
      animation: ya-widget-notice-in 150ms ease-out both;
    }

    .ya-widget-notice-icon {
      display: grid;
      width: 20px;
      height: 20px;
      flex: 0 0 auto;
      place-items: center;
      border-radius: 7px;
      color: #8b5b1c;
      background: rgba(255,255,255,.72);
    }

    .ya-widget-notice-icon .ya-widget-icon { width: 13px !important; height: 13px !important; }

    @keyframes ya-widget-notice-in {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .ya-widget-content {
      min-height: 0;
      overflow-y: auto;
      overscroll-behavior: contain;
      scrollbar-color: rgba(47, 111, 94, 0.32) transparent;
    }

    .ya-widget-home,
    .ya-widget-subview {
      display: grid;
      gap: 14px;
      padding: 16px;
      animation: ya-widget-view-in 170ms ease-out both;
    }

    @keyframes ya-widget-view-in {
      from { opacity: 0; transform: translateX(7px); }
      to { opacity: 1; transform: translateX(0); }
    }

    .ya-widget-welcome,
    .ya-widget-subview-intro {
      display: flex;
      align-items: flex-start;
      gap: 11px;
    }

    .ya-widget-welcome {
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 13px;
      border: 1px solid rgba(47, 111, 94, 0.13);
      border-radius: 17px 17px 17px 5px;
      background: linear-gradient(135deg, rgba(231, 240, 230, 0.78), rgba(255, 255, 255, 0.88));
    }

    .ya-widget-subview-intro > span {
      display: grid;
      width: 38px;
      height: 38px;
      flex: 0 0 auto;
      place-items: center;
      border-radius: 13px;
      color: ${t.primaryColor};
      background: #ffffff;
      box-shadow: inset 0 0 0 1px rgba(47, 111, 94, 0.15), 0 5px 14px rgba(23, 32, 51, 0.06);
    }

    .ya-widget-kicker {
      color: ${t.primaryColor};
      font-size: 10px;
      font-weight: 850;
      letter-spacing: 0.055em;
      text-transform: uppercase;
    }

    .ya-widget-welcome h2,
    .ya-widget-subview-intro h2 {
      margin: 3px 0 3px;
      color: #172033;
      font-size: 17px;
      line-height: 1.25;
    }

    .ya-widget-welcome p,
    .ya-widget-subview-intro p {
      margin: 0;
      color: #626875;
      font-size: 12px;
      line-height: 1.45;
    }

    .ya-widget-actions {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }

    .ya-widget-action-card {
      display: grid;
      grid-template-columns: 34px minmax(0, 1fr) 16px;
      align-items: center;
      gap: 8px;
      min-width: 0;
      min-height: 72px;
      padding: 10px;
      border: 1px solid rgba(47, 111, 94, 0.14);
      border-radius: 15px;
      color: #24313a;
      background: rgba(255, 255, 255, 0.92);
      box-shadow: 0 5px 16px rgba(23, 32, 51, 0.04);
      text-align: left;
      cursor: pointer;
      transition: transform 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
    }

    .ya-widget-action-card:hover {
      transform: translateY(-2px);
      border-color: rgba(47, 111, 94, 0.36);
      box-shadow: 0 8px 20px rgba(23, 32, 51, 0.07);
    }

    .ya-widget-action-card:active { transform: translateY(0) scale(.985); }

    .ya-widget-action-icon {
      display: grid;
      width: 34px;
      height: 34px;
      place-items: center;
      border-radius: 11px;
      color: ${t.primaryColor};
      background: #edf6ec;
    }

    .ya-widget-action-copy { display: grid; min-width: 0; gap: 2px; }
    .ya-widget-action-copy strong { color: #172033; font-size: 11px; font-weight: 850; }

    .ya-widget-action-copy small {
      display: -webkit-box;
      overflow: hidden;
      color: #6d737c;
      font-size: 9px;
      font-weight: 600;
      line-height: 1.3;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    .ya-widget-action-arrow { display: grid; place-items: center; color: #8b918f; }
    .ya-widget-action-arrow .ya-widget-icon { width: 14px !important; height: 14px !important; }

    .ya-widget-suggestions button,
    .ya-widget-topic-chips button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      min-height: 40px;
      padding: 8px 11px;
      border: 1px solid #ddd9d0;
      border-radius: 999px;
      color: #24313a;
      background: rgba(255, 255, 255, 0.92);
      box-shadow: 0 5px 16px rgba(23, 32, 51, 0.04);
      font-size: 11px;
      font-weight: 750;
      cursor: pointer;
      transition: transform 150ms ease, border-color 150ms ease, background 150ms ease;
    }

    .ya-widget-suggestions button:hover,
    .ya-widget-topic-chips button:hover {
      transform: translateY(-1px);
      border-color: rgba(47, 111, 94, 0.42);
    }

    .ya-widget-context-card,
    .ya-widget-location-card {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
      padding: 10px;
      border: 1px solid rgba(47, 111, 94, 0.14);
      border-radius: 14px;
      background: #f7faf5;
    }

    .ya-widget-context-card img,
    .ya-widget-context-icon {
      width: 48px;
      height: 42px;
      flex: 0 0 auto;
      border-radius: 10px;
      object-fit: cover;
    }

    .ya-widget-context-icon,
    .ya-widget-location-card > span {
      display: grid;
      place-items: center;
      color: ${t.primaryColor};
      background: #ffffff;
      box-shadow: inset 0 0 0 1px rgba(47, 111, 94, 0.14);
    }

    .ya-widget-context-card > div,
    .ya-widget-location-card > div { display: grid; min-width: 0; gap: 2px; }

    .ya-widget-context-card small {
      color: ${t.primaryColor};
      font-size: 9px;
      font-weight: 850;
      text-transform: uppercase;
    }

    .ya-widget-context-card strong,
    .ya-widget-location-card strong {
      overflow: hidden;
      color: #172033;
      font-size: 12px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .ya-widget-location-card > span {
      width: 38px;
      height: 38px;
      flex: 0 0 auto;
      border-radius: 12px;
    }

    .ya-widget-location-card p { margin: 0; color: #626875; font-size: 11px; line-height: 1.4; }
    .ya-widget-directions .ya-widget-primary-action { text-decoration: none; }

    .ya-widget-trust,
    .ya-widget-form-note {
      display: flex;
      align-items: flex-start;
      gap: 7px;
      margin: 0;
      color: #69707b;
      font-size: 11px;
      line-height: 1.45;
    }

    .ya-widget-trust .ya-widget-icon,
    .ya-widget-form-note .ya-widget-icon {
      width: 15px !important;
      height: 15px !important;
      color: ${t.primaryColor};
    }

    .ya-widget-subview-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    .ya-widget-subview-nav > button {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      min-height: 40px;
      padding: 7px 9px;
      border: 0;
      border-radius: 11px;
      color: #58606f;
      background: transparent;
      font-size: 12px;
      font-weight: 750;
      cursor: pointer;
    }

    .ya-widget-subview-nav > button:hover {
      color: #172033;
      background: rgba(255, 255, 255, 0.76);
    }

    .ya-widget-active-flow {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      min-height: 34px;
      padding: 6px 10px;
      border: 1px solid rgba(47, 111, 94, 0.16);
      border-radius: 999px;
      color: ${t.primaryColor};
      background: #eef6ed;
      font-size: 11px;
      font-weight: 800;
    }

    .ya-widget-active-flow .ya-widget-icon {
      width: 15px !important;
      height: 15px !important;
    }

    .ya-widget-subview-intro {
      padding: 0 2px;
    }

    .ya-widget-form,
    .ya-widget-ai,
    .ya-widget-direct-whatsapp {
      display: grid;
      gap: 12px;
    }

    .ya-widget-field-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .ya-widget-field {
      display: grid;
      min-width: 0;
      gap: 6px;
      color: #172033;
      font-size: 12px;
      font-weight: 800;
    }

    .ya-widget-field small {
      color: #777d87;
      font-size: 10px;
      font-weight: 600;
    }

    .ya-widget-field input,
    .ya-widget-field textarea {
      width: 100%;
      min-height: 44px;
      padding: 10px 11px;
      border: 1px solid #dcd7cf;
      border-radius: 12px;
      color: #172033;
      background: rgba(255, 255, 255, 0.94);
      font-size: 13px !important;
      font-weight: 500;
    }

    .ya-widget-field textarea {
      min-height: 64px;
      resize: vertical;
    }

    .ya-widget-field input::placeholder,
    .ya-widget-field textarea::placeholder {
      color: #777d87;
      opacity: 1;
    }

    .ya-widget-date-group,
    .ya-widget-guest-group {
      min-width: 0;
      margin: 0;
      padding: 0;
      border: 0;
    }

    .ya-widget-date-group {
      position: relative;
      padding: 11px;
      border: 1px solid rgba(47, 111, 94, 0.14);
      border-radius: 15px;
      background: linear-gradient(135deg, rgba(231, 240, 230, 0.75), rgba(255, 255, 255, 0.78));
    }

    .ya-widget-date-group legend,
    .ya-widget-guest-group legend {
      margin-bottom: 7px;
      padding: 0;
      color: #172033;
      font-size: 12px;
      font-weight: 850;
    }

    .ya-widget-date-options {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 6px;
    }

    .ya-widget-date-options > button,
    .ya-widget-date-custom {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      min-width: 0;
      min-height: 42px;
      padding: 7px 5px;
      overflow: hidden;
      border: 1px solid #dcd7cf;
      border-radius: 10px;
      color: #334048;
      background: rgba(255, 255, 255, 0.9);
      font-size: 10px;
      font-weight: 800;
      text-align: center;
      cursor: pointer;
    }

    .ya-widget-date-options > button.is-active,
    .ya-widget-date-custom.is-active {
      color: ${t.primaryColor};
      border-color: rgba(47, 111, 94, 0.5);
      background: #e7f1e6;
      box-shadow: inset 0 0 0 1px rgba(47, 111, 94, 0.07);
    }

    .ya-widget-date-custom .ya-widget-icon,
    .ya-widget-date-picker .ya-widget-icon {
      width: 14px !important;
      height: 14px !important;
    }

    .ya-widget-date-range {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }

    .ya-widget-date-range-single {
      grid-template-columns: 1fr;
    }

    .ya-widget-schedule-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      align-items: end;
      gap: 8px;
    }

    .ya-widget-schedule-row .ya-widget-time-field {
      margin-top: 0;
    }

    .ya-widget-date-picker {
      position: relative;
      display: grid;
      gap: 5px;
      min-width: 0;
    }

    .ya-widget-date-picker > span,
    .ya-widget-time-field > span {
      color: #5f6872;
      font-size: 10px;
      font-weight: 800;
    }

    .ya-widget-date-picker > button {
      display: flex;
      align-items: center;
      gap: 7px;
      min-width: 0;
      min-height: 44px;
      padding: 9px 10px;
      border: 1px solid #dcd7cf;
      border-radius: 11px;
      color: #334048;
      background: rgba(255, 255, 255, 0.94);
      cursor: pointer;
      text-align: left;
    }

    .ya-widget-date-picker > button strong {
      min-width: 0;
      overflow: hidden;
      font-size: 11px;
      font-weight: 800;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .ya-widget-calendar {
      position: absolute;
      top: 69px;
      right: 10px;
      left: 10px;
      z-index: 24;
      display: grid;
      gap: 8px;
      padding: 11px;
      border: 1px solid rgba(47, 111, 94, 0.2);
      border-radius: 14px;
      background: #fffdf8;
      box-shadow: 0 18px 44px rgba(23, 32, 51, 0.2);
    }

    .ya-widget-calendar[hidden] { display: none; }

    .ya-widget-calendar-head {
      display: grid;
      grid-template-columns: 34px minmax(0, 1fr) 34px 30px;
      align-items: center;
      gap: 6px;
    }

    .ya-widget-calendar-head > button {
      display: grid;
      width: 34px;
      height: 34px;
      place-items: center;
      padding: 0;
      border: 1px solid #e1ddd5;
      border-radius: 10px;
      color: #334048;
      background: #ffffff;
      cursor: pointer;
    }

    .ya-widget-calendar-head > button:disabled { cursor: not-allowed; opacity: .35; }

    .ya-widget-calendar-head > .ya-widget-calendar-close {
      width: 30px;
      height: 30px;
      border-color: transparent;
      color: #6d737c;
      background: #f6f3ed;
      font-size: 19px;
      line-height: 1;
    }

    .ya-widget-calendar-head > .ya-widget-calendar-close:hover {
      color: #172033;
      background: #ece8df;
    }

    .ya-widget-calendar-title { color: #172033; font-size: 12px; font-weight: 850; text-align: center; }

    .ya-widget-calendar-shortcuts {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }

    .ya-widget-calendar-shortcuts button {
      min-height: 28px;
      padding: 5px 8px;
      border: 1px solid rgba(47, 111, 94, 0.14);
      border-radius: 999px;
      color: #52605c;
      background: #f5faf4;
      font-size: 9px;
      font-weight: 800;
      cursor: pointer;
      transition: transform 120ms ease, border-color 120ms ease;
    }

    .ya-widget-calendar-shortcuts button:first-child { color: #7a6557; background: #fff8ef; }
    .ya-widget-calendar-shortcuts button:hover:not(:disabled) { transform: translateY(-1px); border-color: rgba(47, 111, 94, 0.34); }
    .ya-widget-calendar-shortcuts button:disabled { cursor: not-allowed; opacity: .38; }

    .ya-widget-calendar-weekdays,
    .ya-widget-calendar-days {
      display: grid;
      grid-template-columns: repeat(7, minmax(0, 1fr));
      gap: 4px;
    }

    .ya-widget-calendar-weekdays span {
      color: #7a8089;
      font-size: 9px;
      font-weight: 800;
      text-align: center;
    }

    .ya-widget-calendar-days button,
    .ya-widget-calendar-empty { aspect-ratio: 1; min-width: 0; }

    .ya-widget-calendar-days button {
      display: grid;
      place-items: center;
      padding: 0;
      border: 1px solid transparent;
      border-radius: 9px;
      color: #334048;
      background: transparent;
      font-size: 10px;
      font-weight: 800;
      cursor: pointer;
    }

    .ya-widget-calendar-days button:hover:not(:disabled) { border-color: rgba(47, 111, 94, 0.28); background: #f1f7f0; }
    .ya-widget-calendar-days button.is-today { border-color: rgba(47, 111, 94, 0.3); }
    .ya-widget-calendar-days button.is-in-range { border-radius: 7px; background: rgba(47, 111, 94, 0.10); }

    .ya-widget-calendar-days button.is-range-edge,
    .ya-widget-calendar-days button.is-selected {
      color: #ffffff;
      border-color: transparent;
      background: ${t.primaryColor};
    }

    .ya-widget-calendar-days button:disabled { color: #c4c5c7; cursor: not-allowed; }

    .ya-widget-time-field {
      position: relative;
      display: grid;
      gap: 5px;
      margin-top: 9px;
    }

    .ya-widget-time-trigger {
      display: grid;
      grid-template-columns: 18px minmax(0, 1fr) 16px;
      align-items: center;
      gap: 8px;
      width: 100%;
      min-height: 42px;
      padding: 8px 10px;
      border: 1px solid #dcd7cf;
      border-radius: 10px;
      color: #334048;
      background: rgba(255, 255, 255, 0.94);
      text-align: left;
      cursor: pointer;
      transition: border-color 130ms ease, box-shadow 130ms ease;
    }

    .ya-widget-time-trigger:hover,
    .ya-widget-time-trigger[aria-expanded="true"] {
      border-color: rgba(47, 111, 94, 0.44);
      box-shadow: 0 0 0 3px rgba(47, 111, 94, 0.08);
    }

    .ya-widget-time-trigger strong {
      font-size: 12px;
      font-weight: 800;
    }

    .ya-widget-time-trigger .ya-widget-icon {
      width: 15px !important;
      height: 15px !important;
      color: ${t.primaryColor};
    }

    .ya-widget-time-trigger .ya-widget-icon:last-child {
      justify-self: end;
      color: #8b918f;
      transform: rotate(90deg);
    }

    .ya-widget-time-popover {
      position: absolute;
      top: 66px;
      right: 0;
      z-index: 25;
      width: min(220px, calc(200% + 8px));
      padding: 10px;
      border: 1px solid rgba(47, 111, 94, 0.2);
      border-radius: 14px;
      background: #fffdf8;
      box-shadow: 0 18px 44px rgba(23, 32, 51, 0.2);
      animation: ya-widget-result-in 150ms ease-out both;
    }

    .ya-widget-time-popover[hidden] { display: none; }

    .ya-widget-time-popover-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 8px;
    }

    .ya-widget-time-popover-head > div {
      display: flex;
      align-items: baseline;
      gap: 7px;
    }

    .ya-widget-time-popover-head small {
      color: #777d87;
      font-size: 9px;
      font-weight: 750;
    }

    .ya-widget-time-popover-head strong {
      color: ${t.primaryColor};
      font-size: 15px;
      font-weight: 900;
    }

    .ya-widget-time-popover-actions {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .ya-widget-time-popover-actions button {
      min-height: 28px;
      border: 0;
      border-radius: 9px;
      cursor: pointer;
    }

    .ya-widget-time-clear {
      padding: 0 8px;
      color: #6f6258;
      background: #f8f1e8;
      font-size: 9px;
      font-weight: 800;
    }

    .ya-widget-time-clear:disabled {
      cursor: default;
      opacity: .4;
    }

    .ya-widget-time-close {
      display: grid;
      width: 28px;
      place-items: center;
      padding: 0;
      color: #6d737c;
      background: #f3efe7;
      font-size: 19px;
      line-height: 1;
    }

    .ya-widget-time-columns {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 62px;
      gap: 8px;
    }

    .ya-widget-time-column {
      display: grid;
      gap: 5px;
      min-width: 0;
    }

    .ya-widget-time-column > span {
      color: #6b727c;
      font-size: 9px;
      font-weight: 800;
      text-align: center;
    }

    .ya-widget-time-scroll {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 4px;
      max-height: 128px;
      padding: 2px;
      overflow-y: auto;
      overscroll-behavior: contain;
      scrollbar-width: thin;
      scrollbar-color: rgba(47, 111, 94, 0.25) transparent;
    }

    .ya-widget-time-minutes {
      grid-template-columns: 1fr;
    }

    .ya-widget-time-scroll button {
      min-height: 32px;
      padding: 4px;
      border: 1px solid transparent;
      border-radius: 8px;
      color: #36444b;
      background: #f5f7f3;
      font-size: 10px;
      font-weight: 800;
      cursor: pointer;
    }

    .ya-widget-time-scroll button:hover {
      border-color: rgba(47, 111, 94, 0.24);
      background: #eef5ec;
    }

    .ya-widget-time-scroll button.is-selected {
      color: #ffffff;
      border-color: transparent;
      background: ${t.primaryColor};
      box-shadow: 0 4px 10px rgba(47, 111, 94, 0.18);
    }

    .ya-widget-date-options > input[type="hidden"] {
      display: none;
    }

    .ya-widget-stepper {
      display: grid;
      grid-template-columns: 44px 64px 44px;
      width: max-content;
      overflow: hidden;
      border: 1px solid #dcd7cf;
      border-radius: 12px;
      background: #ffffff;
    }

    .ya-widget-stepper button {
      display: grid;
      min-width: 44px;
      min-height: 44px;
      place-items: center;
      padding: 0;
      border: 0;
      color: ${t.primaryColor};
      background: transparent;
      cursor: pointer;
    }

    .ya-widget-stepper button:first-child {
      border-right: 1px solid #e2ddd5;
    }

    .ya-widget-stepper button:last-child {
      border-left: 1px solid #e2ddd5;
    }

    .ya-widget-stepper button:disabled {
      cursor: not-allowed;
      opacity: 0.4;
    }

    .ya-widget-stepper input {
      width: 64px;
      min-width: 0;
      border: 0;
      color: #172033;
      background: transparent;
      text-align: center;
      font-size: 14px !important;
      font-weight: 850;
      appearance: textfield;
    }

    .ya-widget-stepper input::-webkit-inner-spin-button,
    .ya-widget-stepper input::-webkit-outer-spin-button {
      margin: 0;
      appearance: none;
    }

    .ya-widget-primary-action,
    .ya-widget-secondary-action {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      min-height: 46px;
      padding: 10px 13px;
      border-radius: 13px;
      font-size: 12px;
      font-weight: 850;
      cursor: pointer;
    }

    .ya-widget-primary-action {
      border: 1px solid transparent;
      color: #ffffff;
      background: linear-gradient(135deg, ${t.primaryColor}, #1b5a50);
      box-shadow: 0 9px 22px rgba(47, 111, 94, 0.2);
    }

    .ya-widget-secondary-action {
      border: 1px solid rgba(47, 111, 94, 0.24);
      color: ${t.primaryColor};
      background: #ffffff;
    }

    .ya-widget-primary-action:disabled {
      cursor: wait;
      opacity: 0.7;
    }

    .ya-widget-suggestions,
    .ya-widget-topic-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .ya-widget-suggestions button,
    .ya-widget-topic-chips button {
      min-height: 40px;
      padding: 7px 10px;
      font-size: 11px;
      box-shadow: none;
    }

    .ya-widget-suggestions button.is-active,
    .ya-widget-topic-chips button.is-active {
      color: ${t.primaryColor};
      border-color: rgba(47, 111, 94, 0.44);
      background: #e9f3e8;
    }

    .ya-widget-ai-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .ya-widget-ai-answer {
      display: flex;
      align-items: flex-start;
      gap: 9px;
      padding: 12px;
      border: 1px solid rgba(47, 111, 94, 0.16);
      border-radius: 16px 16px 16px 5px;
      background: linear-gradient(135deg, #edf5ec, #ffffff);
    }

    .ya-widget-ai-answer p {
      display: grid;
      gap: 3px;
      margin: 0;
      min-width: 0;
    }

    .ya-widget-ai-answer strong {
      color: #172033;
      font-size: 11px;
    }

    .ya-widget-ai-answer p span {
      color: #555e68;
      font-size: 12px;
      line-height: 1.5;
      white-space: pre-wrap;
    }

    .ya-widget-inline-trust {
      padding-top: 2px;
    }

    .ya-widget-primary-action,
    .ya-widget-secondary-action {
      transition: transform 140ms ease, filter 140ms ease, opacity 140ms ease;
    }

    .ya-widget-primary-action:active:not(:disabled),
    .ya-widget-secondary-action:active:not(:disabled) { transform: scale(.985); }

    .ya-widget-primary-action.is-loading { cursor: wait; }

    .ya-widget-spinner {
      width: 16px;
      height: 16px;
      flex: 0 0 auto;
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: ya-widget-spin 700ms linear infinite;
    }

    @keyframes ya-widget-spin { to { transform: rotate(360deg); } }

    .ya-widget-ai-answer,
    .ya-widget-request-success { animation: ya-widget-result-in 190ms ease-out both; }

    @keyframes ya-widget-result-in {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .ya-widget-message-preview {
      padding: 11px;
      border: 1px solid rgba(47, 111, 94, 0.14);
      border-radius: 14px 14px 4px 14px;
      background: #edf5ec;
    }

    .ya-widget-message-preview > span {
      color: ${t.primaryColor};
      font-size: 10px;
      font-weight: 850;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .ya-widget-message-preview p {
      margin: 5px 0 0;
      color: #36444b;
      font-size: 11px;
      line-height: 1.5;
      white-space: pre-wrap;
    }

    .ya-widget-status {
      margin: 0 16px 16px;
      padding: 10px 11px;
      border: 1px solid rgba(228, 120, 99, 0.26);
      border-radius: 12px;
      color: #8b4133;
      background: #fff0e7;
      font-size: 11px;
      font-weight: 700;
      line-height: 1.45;
    }

    @media (max-width: 520px) {
      #${e} {
        right: 0;
        bottom: 0;
        left: 0;
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
        pointer-events: none;
      }

      #${e} > * {
        pointer-events: auto;
      }

      .ya-widget-button {
        margin: 0 12px max(12px, env(safe-area-inset-bottom));
      }

      .ya-widget-panel {
        width: 100%;
        max-width: none;
        max-height: min(92dvh, 760px);
        border-right: 0;
        border-bottom: 0;
        border-left: 0;
        border-radius: 24px 24px 0 0;
        box-shadow: 0 -18px 60px rgba(23, 32, 51, 0.28);
      }

      .ya-widget-content {
        padding-bottom: env(safe-area-inset-bottom);
      }
    }

    @media (max-width: 430px) {
      .ya-widget-header {
        min-height: 86px;
        padding: 12px;
      }

      .ya-widget-title-copy small {
        max-width: 235px;
      }

      .ya-widget-home,
      .ya-widget-subview {
        padding: 14px;
      }

      .ya-widget-field-grid {
        grid-template-columns: 1fr;
      }

      .ya-widget-date-options,
      .ya-widget-date-range {
        grid-template-columns: 1fr 1fr;
      }

      .ya-widget-ai-actions {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 350px) {
      .ya-widget-launcher-copy,
      .ya-widget-launcher-sparkle {
        display: none;
      }

      .ya-widget-button {
        min-width: 58px;
        padding-right: 8px;
      }

      .ya-widget-title-copy small {
        display: none;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .ya-widget-button,
      .ya-widget-action-card,
      .ya-widget-suggestions button,
      .ya-widget-topic-chips button,
      .ya-widget-primary-action,
      .ya-widget-secondary-action {
        transition: none;
      }

      #${e} .ya-widget-launcher-avatar,
      #${e} .ya-widget-avatar,
      .ya-widget-panel.is-opening,
      .ya-widget-panel.is-closing,
      .ya-widget-home,
      .ya-widget-subview,
      .ya-widget-notice,
      .ya-widget-ai-answer,
      .ya-widget-request-success,
      .ya-widget-spinner {
        animation: none;
      }
      #${e} .ya-widget-nexa-speech,
      #${e} .ya-nexa-speech-dots i { animation: none; }
      #${e} .ya-widget-launcher-avatar { transition: none; }
    }
  `}var At={sparkles:`<path d="m12 3-1.4 3.5L7 8l3.6 1.4L12 13l1.4-3.6L17 8l-3.6-1.5L12 3Z"/><path d="m5 15-.8 2-2.2.8 2.2.9L5 21l.8-2.3 2.2-.9-2.2-.8L5 15Z"/>`,bot:`<rect x="5" y="7" width="14" height="11" rx="4"/><path d="M12 4v3M9 12h.01M15 12h.01M9 15h6"/>`,calendar:`<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M8 3v4M16 3v4M4 9h16M8 13h.01M12 13h.01M16 13h.01"/>`,clock:`<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`,table:`<path d="M4 10h16M6 10l-1 10M18 10l1 10M8 6h8a2 2 0 0 1 2 2v2H6V8a2 2 0 0 1 2-2Z"/>`,bed:`<path d="M3 18v-7M21 18v-5a2 2 0 0 0-2-2H9a3 3 0 0 0-3 3v1M3 15h18M7 11V8h5a2 2 0 0 1 2 2v1"/>`,pin:`<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>`,info:`<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>`,search:`<circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/>`,"chevron-left":`<path d="m15 18-6-6 6-6"/>`,"chevron-right":`<path d="m9 18 6-6-6-6"/>`,help:`<circle cx="12" cy="12" r="9"/><path d="M9.7 9a2.5 2.5 0 1 1 3.2 2.4c-.7.3-.9.8-.9 1.6M12 17h.01"/>`,whatsapp:`<path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.4-4A8 8 0 1 1 20 11.5Z"/><path d="M9 8.7c.5 2.5 2 4 4.5 4.8l1-1"/>`,shield:`<path d="M12 3 5 6v5c0 4.5 2.8 7.8 7 10 4.2-2.2 7-5.5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>`,"arrow-left":`<path d="m15 18-6-6 6-6M9 12h10"/>`,minus:`<path d="M5 12h14"/>`,plus:`<path d="M12 5v14M5 12h14"/>`,send:`<path d="m22 2-7 20-4-9-9-4 20-7Z"/><path d="M22 2 11 13"/>`};function P(e,t=``){return`<svg class="ya-widget-icon${t?` ${t}`:``}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${At[e]}</svg>`}function jt(){let e=document.currentScript?.dataset??{},t=Mt({...e.businessName===void 0?{}:{businessName:e.businessName},...e.whatsappPhone===void 0?{}:{whatsappPhone:e.whatsappPhone},...e.apiBaseUrl===void 0?{}:{apiBaseUrl:e.apiBaseUrl},...e.logoUrl===void 0?{}:{logoUrl:e.logoUrl},...e.primaryColor===void 0?{}:{primaryColor:e.primaryColor},...e.accentColor===void 0?{}:{accentColor:e.accentColor},...e.address===void 0?{}:{address:e.address},...e.mapUrl===void 0?{}:{mapUrl:e.mapUrl}}),n=Nt(e.profileId);return n&&(t.profileId=n),(e.aiEnabled===`true`||e.aiEnabled===`false`)&&(t.aiEnabled=e.aiEnabled===`true`),(e.whatsappEnabled===`true`||e.whatsappEnabled===`false`)&&(t.whatsappEnabled=e.whatsappEnabled===`true`),t}function Mt(e){return Object.fromEntries(Object.entries(e).filter(([,e])=>typeof e==`string`&&e.length>0))}function Nt(e){let t=String(e??``).trim();return[`pension_restaurant`,`pension`,`restaurant`,`market`].includes(t)?t:``}function Pt(e){if(!Array.isArray(e))return[];let t=new Set([`accommodation`,`food_service`,`menu`,`qr_menu`,`catalog`,`directions`]);return[...new Set(e.map(e=>String(e??``).trim()).filter(e=>t.has(e)))]}function Ft(e){let t=Pt(e.publicSurfaces);return new Set(t.length>0?t:Bt(e.profileId))}function It(e){return e.whatsappEnabled&&e.whatsappPhone.trim()!==``}function Lt(e,t){if(!e.requestsEnabled)return!1;if(t===`dealer_application`)return e.dealerApplicationEnabled===!0;let n=Ft(e);return t===`pension_reservation`?n.has(`accommodation`):t!==`restaurant_reservation`||n.has(`food_service`)}function Rt(e){let t=Ft(e),n=[];return t.has(`accommodation`)&&n.push(r(`Oda fiyatları`),r(`Oda müsaitliği`),r(`Kahvaltı saatleri`)),t.has(`food_service`)&&n.push(r(`Masa var mı?`),r(`Menü hakkında bilgi`),r(`Çocuklar için uygun mu?`)),t.has(`catalog`)&&n.push(r(`Ürün stokta mı?`),r(`Ürün fiyatı`),r(`Çalışma saatleri`)),t.has(`directions`)&&n.push(r(`Konum ve yol tarifi`)),n.length===0&&n.push(r(`Çalışma saatleri`),r(`İletişim`),r(`Konum`)),[...new Set(n)].slice(0,6)}function zt(e){let t=Ft(e),n=[];return t.has(`accommodation`)&&n.push({key:`reservation`,label:r(`Rezervasyon soracağım`),message:r(`Merhaba, {0} için oda müsaitliği ve rezervasyon hakkında bilgi almak istiyorum.`,{0:e.businessName})}),t.has(`food_service`)&&n.push({key:`table`,label:r(`Masa soracağım`),message:r(`Merhaba, {0} için masa müsaitliği hakkında bilgi almak istiyorum.`,{0:e.businessName})}),t.has(`menu`)&&n.push({key:`menu`,label:r(`Menü hakkında soracağım`),message:r(`Merhaba, {0} menüsü hakkında bilgi almak istiyorum.`,{0:e.businessName})}),t.has(`catalog`)&&n.push({key:`product`,label:r(`Ürün / stok soracağım`),message:r(`Merhaba, {0} için ürün ve stok bilgisi almak istiyorum.`,{0:e.businessName})}),n.push({key:`custom`,label:r(`Kendi mesajımı yazacağım`),message:``}),n}function Bt(e){return e===`pension_restaurant`?[`accommodation`,`food_service`,`menu`,`qr_menu`,`directions`]:e===`pension`?[`accommodation`,`directions`]:e===`restaurant`?[`food_service`,`menu`,`qr_menu`,`directions`]:e===`market`?[`catalog`,`directions`]:[]}function Vt(e){let t=Number(e);return Number.isFinite(t)&&t>=1?Math.min(30,Math.floor(t)):1}function F(e,t){let n=new Date(e.getFullYear(),e.getMonth(),e.getDate());return n.setDate(n.getDate()+t),n}function I(e){return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`}function L(e){let[t,n,r]=e.split(`-`).map(Number);if(!t||!n||!r)return null;let i=new Date(t,n-1,r);return Number.isNaN(i.getTime())?null:i}function Ht(e){return new Intl.DateTimeFormat(n,{month:`long`,year:`numeric`}).format(e).replace(/^./u,e=>e.toLocaleUpperCase(n))}function R(e){let t=L(e);if(!t)return r(`Tarih seç`);let i=t.getFullYear()!==new Date().getFullYear();return new Intl.DateTimeFormat(n,{day:`numeric`,month:`long`,...i?{year:`numeric`}:{}}).format(t)}function Ut(e,t){let n=R(e);return t===`today`?r(`Bugün, {0}`,{0:n}):t===`tomorrow`?r(`Yarın, {0}`,{0:n}):n}function Wt(e,t){let n=e.intent??`home`,i=Gt(e.context);if(n===`accommodation.reserve`)return Lt(t,`pension_reservation`)?{view:`form`,requestType:`pension_reservation`,context:i,questionDraft:``}:z();if(n===`food.reserve`)return Lt(t,`restaurant_reservation`)?{view:`form`,requestType:`restaurant_reservation`,context:i,questionDraft:``}:z();if(n===`contact.whatsapp`)return It(t)?{view:`whatsapp`,context:i,questionDraft:``}:z();if(n===`directions`)return{view:`directions`,context:i,questionDraft:i?.question??``};if(n===`accommodation.info`||n===`info`){if(!t.aiEnabled)return z();let e=String(i?.resourceName??``).trim();return{view:`info`,context:i,questionDraft:String(i?.question??``).trim()||(e?r(`{0} hakkında bilgi almak istiyorum.`,{0:e}):``)}}return{view:`home`,context:i,questionDraft:``}}function Gt(e){if(!e)return null;let t={resourceType:String(e.resourceType??``).trim(),resourceId:String(e.resourceId??``).trim(),resourceName:String(e.resourceName??``).trim(),imageUrl:String(e.imageUrl??``).trim(),sourcePath:String(e.sourcePath??``).trim()||window.location.pathname,question:String(e.question??``).trim(),address:String(e.address??``).trim(),mapUrl:String(e.mapUrl??``).trim()};return Object.values(t).some(Boolean)?t:null}function Kt(e){let t=String(e??``).trim();return[`home`,`accommodation.reserve`,`accommodation.info`,`food.reserve`,`contact.whatsapp`,`info`,`directions`].includes(t)?t:null}function qt(e){return e?`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e)}`:``}function z(){return{view:`home`,context:null,questionDraft:``}}var B=`yardimci-asistan-widget`,Jt=`yardimci-asistan-widget-style`,Yt={businessName:`Yardımcı Asistan`,whatsappPhone:``,apiBaseUrl:``,logoUrl:``,primaryColor:`#2F6F5E`,accentColor:`#E47863`,profileId:``,publicSurfaces:[],aiEnabled:!0,whatsappEnabled:!0,requestsEnabled:!0,dealerApplicationEnabled:!1,address:``,mapUrl:``},Xt=jt(),V={...Yt},H={isOpen:!1,view:`home`,requestType:`pension_reservation`,status:``,aiAnswer:``,aiLoading:!1,questionDraft:``,whatsappDraft:``,whatsappTopic:``,context:null},Zt=!1,U=0,Qt=!1,$t=0,en=!1;function tn(e){return`<span class="ya-widget-nexa" data-nexa-role="${e}" aria-hidden="true"></span>`}function W(){let e=document.getElementById(B),t=H.isOpen&&!U&&document.visibilityState===`visible`&&document.hasFocus();if(k.setActive(t),!e)return;let n=t&&!window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;e.dataset.nexaMotionActive=String(n),e.dataset.nexaState=k.getState(),et(n,V.apiBaseUrl)}function nn(){en||(en=!0,k.subscribe(W),document.addEventListener(`visibilitychange`,W),window.addEventListener(`focus`,W),window.addEventListener(`blur`,W),window.matchMedia(`(prefers-reduced-motion: reduce)`).addEventListener(`change`,W))}function G(e={}){k.reset(),nn();let t={...Yt,...Xt,...jt(),...e};V={...t,profileId:Nt(t.profileId),publicSurfaces:Pt(t.publicSurfaces)};if(document.querySelector(`script[data-publication-managed="true"]`)){V={...V,profileId:``,publicSurfaces:[],aiEnabled:!1,whatsappEnabled:!1,requestsEnabled:!1,dealerApplicationEnabled:!1};qn(V),er(),K();document.dispatchEvent(new Event(`ya:ready`))}else qn(V),er(),K(),$n(++$t)}function rn(e={}){k.reset(),Qt=!H.isOpen,U&&=(window.clearTimeout(U),0),H={...H,...Wt(e,V),isOpen:!0,status:``,aiLoading:!1,aiAnswer:``},K(),Z(`.ya-widget-view-title, [data-ya-close]`)}function an(){let e=document.querySelector(`#${B} .ya-widget-panel`),t=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches===!0;e&&!t?(e.classList.add(`is-closing`),U&&window.clearTimeout(U),U=window.setTimeout(()=>{U=0,on()},150),W()):on()}function on(){k.reset(),k.setActive(!1),H={...H,isOpen:!1,view:`home`,status:``,aiLoading:!1,aiAnswer:``,questionDraft:``,context:null},K(),Z(`[data-ya-open]`)}function sn(e,t){return le(e,t)}function cn(e,t=V.businessName){return ge({...e,time_text:e.time},t)}function ln(e){let t=de(e);return t.ok?{ok:!0,whatsapp:t.whatsapp}:{ok:!1,error:r(t.error)}}function K(){let e=Kn();e.dataset.yaWhatsappEnabled=V.whatsappEnabled?`1`:`0`,Qe(),e.innerHTML=H.isOpen?dn():un(),$e(e,V.apiBaseUrl),H.isOpen&&(Qt=!1),Tn(e),W()}function un(){return`
    <button class="ya-widget-button" type="button" data-ya-open aria-label="${i(`Yardımcı Asistan'ı aç`)}">
      <span class="ya-widget-launcher-avatar">
        ${tn(`launcher`)}
      </span>
      <span class="ya-widget-launcher-copy">
        <strong>${i(`Yardımcı`)}</strong>
        <small>${i(`Asistan`)}</small>
      </span>
    </button>
  `}function dn(){return`
    <section class="ya-widget-panel${Qt?` is-opening`:``}" role="dialog" aria-labelledby="ya-widget-title">
      <header class="ya-widget-header">
        ${H.view===`home`?``:`<div class="ya-widget-nexa-speech-slot" data-ya-nexa-speech-slot hidden><span class="ya-widget-nexa-speech" data-ya-nexa-speech role="status" aria-atomic="true"></span></div>`}
        <div class="ya-widget-identity">
          ${H.view===`home`?``:`<span class="ya-widget-avatar">${tn(`header`)}</span>`}
          <span class="ya-widget-title-copy">
            <strong id="ya-widget-title">${H.view===`home`&&V.logoUrl?`<span class="ya-widget-business-mark">${fn()}</span>`:``}${Q(Gn())}</strong>
            <small>${Q(Wn())}</small>
          </span>
        </div>
        <button class="ya-widget-close" type="button" data-ya-close aria-label="${i(`Asistanı kapat`)}">
          <span aria-hidden="true">×</span>
        </button>
      </header>
      <div class="ya-widget-notice" data-ya-status role="status" ${H.status?``:`hidden`}>
        <span class="ya-widget-notice-icon" aria-hidden="true">${P(`info`)}</span>
        <span data-ya-status-text>${Q(H.status)}</span>
      </div>
      <div class="ya-widget-content">
        ${H.view===`home`?pn():``}
        ${H.view===`form`?mn():``}
        ${H.view===`info`?bn():``}
        ${H.view===`whatsapp`?xn():``}
        ${H.view===`directions`?Sn():``}
      </div>
    </section>
  `}function fn(){return V.logoUrl?`<img class="ya-widget-mark" src="${$(V.logoUrl)}" alt="" aria-hidden="true" />`:``}function pn(){let e=Jn(),t=[];return V.requestsEnabled&&e.has(`accommodation`)&&t.push(q({requestType:`pension_reservation`,icon:`calendar`,title:r(`Rezervasyon yap`),description:r(`Tarih ve kişi bilgilerini iletin`)})),V.requestsEnabled&&e.has(`food_service`)&&t.push(q({requestType:`restaurant_reservation`,icon:`table`,title:r(`Masa sor`),description:r(`Tarih, saat ve kişi sayısını seçin`)})),V.requestsEnabled&&V.dealerApplicationEnabled&&t.push(q({requestType:`dealer_application`,icon:`send`,title:`Bayi Başvurusu`,description:`Firma bilgilerinizi iletin`})),V.aiEnabled&&e.has(`catalog`)&&t.push(q({view:`info`,icon:`search`,title:r(`Ürün / stok sor`),description:r(`Ürün ve stok bilgisini hızlıca öğrenin`)})),V.aiEnabled&&t.push(q({view:`info`,icon:`sparkles`,title:r(`Asistana sor`),description:r(`İşletme hakkında kısa bir soru sorun`)})),e.has(`directions`)&&t.push(q({view:`directions`,icon:`pin`,title:r(`Yol tarifi`),description:r(`Konumu açın veya ulaşımı sorun`)})),V.whatsappEnabled&&V.whatsappPhone.trim()&&t.push(q({view:`whatsapp`,icon:`whatsapp`,title:`WhatsApp`,description:r(`Hazır bir mesaj oluşturun`)})),`
    <div class="ya-widget-home">
      <div class="ya-widget-welcome">
        <span class="ya-widget-nexa-welcome">${tn(`welcome`)}</span>
        <div>
          <span class="ya-widget-kicker">${i(`İşletme yardımcısı`)}</span>
          <h2 class="ya-widget-view-title" tabindex="-1">${i(`Merhaba, ben Nexa.`)}</h2>
          <p>${i(`İşlemi seçin; gerekli alanı doğrudan açayım.`)}</p>
        </div>
      </div>
      <div class="ya-widget-actions" role="group" aria-label="${i(`Hızlı asistan seçenekleri`)}">
        ${t.join(``)}
      </div>
    </div>
  `}function q(e){return`
    <button class="ya-widget-action-card" type="button" ${e.requestType?`data-ya-request-type="${e.requestType}"`:`data-ya-view="${e.view??`home`}"`}>
      <span class="ya-widget-action-icon" aria-hidden="true">${P(e.icon)}</span>
      <span class="ya-widget-action-copy">
        <strong>${Q(e.title)}</strong>
        <small>${Q(e.description)}</small>
      </span>
      <span class="ya-widget-action-arrow" aria-hidden="true">${P(`chevron-right`)}</span>
    </button>
  `}function mn(){if(H.requestType===`dealer_application`)return Dt();let e=H.requestType===`restaurant_reservation`,t=r(e?`Masa talebi`:`Rezervasyon talebi`),n=r(e?`Masa talebinizi hazırlayalım`:`Rezervasyonunuzu hazırlayalım`),a=e?gn():hn();return`
    <div class="ya-widget-subview">
      ${J(t,e?`table`:`calendar`)}
      <div class="ya-widget-subview-intro">
        <span aria-hidden="true">${P(`sparkles`)}</span>
        <div>
          <h2 class="ya-widget-view-title" tabindex="-1">${n}</h2>
          <p>${i(`Tarih ve iletişim bilgilerinizi ekleyin.`)}</p>
        </div>
      </div>
      ${Cn()}
      <form class="ya-widget-form" data-ya-form>
        <input type="hidden" name="request_type" value="${H.requestType}" />
        ${wn()}
        ${a}
        <div class="ya-widget-field-grid">
          <label class="ya-widget-field">
            <span>${i(`Ad soyad`)}</span>
            <input name="customer_name" required autocomplete="name" placeholder="${i(`Adınız soyadınız`)}" />
          </label>
          <label class="ya-widget-field">
            <span>${i(`Telefon`)}</span>
            <input name="customer_phone" required inputmode="tel" autocomplete="tel" placeholder="+90 5xx… / +44…" />
          </label>
        </div>
        ${yn()}
        <label class="ya-widget-field">
          <span>${i(`Kısa not`)} <small>${i(`(isteğe bağlı)`)}</small></span>
          <textarea name="message" rows="2" placeholder="${i(`Tercihiniz veya eklemek istediğiniz kısa not`)}"></textarea>
        </label>
        <button class="ya-widget-primary-action" type="submit">
          ${P(`send`)}
          <span>${i(`Talebi Gönder`)}</span>
        </button>
      </form>
    </div>
  `}function hn(){let e=I(new Date),t=I(F(new Date,1));return`
    <fieldset class="ya-widget-date-group" data-ya-accommodation-dates>
      <legend>${i(`Konaklama tarihleri`)}</legend>
      <div class="ya-widget-date-range">
        ${vn(`start_date`,r(`Giriş`),r(`Giriş tarihi`),e)}
        ${vn(`end_date`,r(`Çıkış`),r(`Çıkış tarihi`),t)}
      </div>
      <input name="date_text" type="hidden" />
      <div class="ya-widget-calendar" data-ya-calendar hidden></div>
    </fieldset>
  `}function gn(){let e=I(new Date);return`
    <fieldset class="ya-widget-date-group" data-ya-restaurant-date>
      <legend>${i(`Tarih ve saat`)}</legend>
      <div class="ya-widget-schedule-row">
        ${vn(`start_date`,r(`Tarih`),r(`Tarih seç`),e)}
        ${_n()}
      </div>
      <input name="date_text" type="hidden" />
      <div class="ya-widget-calendar" data-ya-calendar hidden></div>
    </fieldset>
  `}function _n(){return`
    <div class="ya-widget-time-field">
      <span>${i(`Saat`)}</span>
      <button class="ya-widget-time-trigger" type="button" data-ya-open-time-picker aria-expanded="false">
        ${P(`clock`)}
        <strong data-ya-time-label>${i(`Saat seç`)}</strong>
        ${P(`chevron-right`)}
      </button>
      <input name="time" type="hidden" />
      <div class="ya-widget-time-popover" data-ya-time-popover hidden></div>
    </div>
  `}function vn(e,t,n,r){return`
    <div class="ya-widget-date-picker" data-ya-date-picker-control="${e}">
      <span>${t}</span>
      <button type="button" data-ya-open-date-picker="${e}">
        ${P(`calendar`)}
        <strong data-ya-date-label="${e}">${n}</strong>
      </button>
      <input name="${e}" type="hidden" data-ya-date-value-input min="${r}" />
    </div>
  `}function yn(){return`
    <fieldset class="ya-widget-guest-group">
      <legend>${i(`Kişi sayısı`)}</legend>
      <div class="ya-widget-stepper">
        <button type="button" data-ya-guest-step="-1" aria-label="${i(`Kişi sayısını azalt`)}" disabled>${P(`minus`)}</button>
        <input name="guest_count" required type="number" min="1" max="30" value="2" inputmode="numeric" aria-label="${i(`Kişi sayısı`)}" />
        <button type="button" data-ya-guest-step="1" aria-label="${i(`Kişi sayısını artır`)}">${P(`plus`)}</button>
      </div>
    </fieldset>
  `}function bn(){let e=Zn();return`
    <div class="ya-widget-subview ya-widget-info">
      ${J(r(`Bilgi al`),`help`)}
      <div class="ya-widget-subview-intro">
        <span aria-hidden="true">${P(`bot`)}</span>
        <div>
          <h2 class="ya-widget-view-title" tabindex="-1">${i(`Merak ettiğiniz şeyi sorun`)}</h2>
          <p>${i(`Kısa sorunuzu yazın veya sık sorulanlardan birini seçin.`)}</p>
        </div>
      </div>
      ${Cn()}
      <div class="ya-widget-suggestions" role="group" aria-label="${i(`Sık sorulan sorular`)}">
        ${e.map(e=>`<button type="button" data-ya-question-suggestion="${$(e)}">${Q(e)}</button>`).join(``)}
      </div>
      <form class="ya-widget-ai" data-ya-ai-form>
        <label class="ya-widget-field">
          <span>${i(`Kısa soru`)}</span>
          <textarea name="message" required maxlength="1200" rows="3" placeholder="${i(`Örn. Bu akşam 4 kişilik masa var mı?`)}">${Q(H.questionDraft)}</textarea>
        </label>
        <div class="ya-widget-ai-actions">
          <button class="ya-widget-primary-action ${H.aiLoading?`is-loading`:``}" type="submit" ${H.aiLoading?`disabled`:``}>
            ${H.aiLoading?`<span class="ya-widget-spinner" aria-hidden="true"></span>`:P(`sparkles`)}
            <span>${H.aiLoading?r(`Yanıt hazırlanıyor…`):r(`AI Yardımcıya Sor`)}</span>
          </button>
          ${V.whatsappEnabled&&V.whatsappPhone.trim()?`<button class="ya-widget-secondary-action" type="button" data-ya-ai-whatsapp>
                ${P(`whatsapp`)}
                <span>${i(`WhatsApp'tan Yaz`)}</span>
              </button>`:``}
        </div>
      </form>
      ${H.aiAnswer?`<div class="ya-widget-ai-answer">
              <p><strong>${i(`AI Yardımcı`)}</strong><span>${Q(H.aiAnswer)}</span></p>
            </div>`:``}
    </div>
  `}function xn(){let e=Qn();return`
    <div class="ya-widget-subview ya-widget-whatsapp-view">
      ${J(`WhatsApp`,`whatsapp`)}
      <div class="ya-widget-subview-intro">
        <span aria-hidden="true">${P(`whatsapp`)}</span>
        <div>
          <h2 class="ya-widget-view-title" tabindex="-1">${i(`Mesajınızı birlikte hazırlayalım`)}</h2>
          <p>${i(`Konuyu seçin; metni isterseniz göndermeden önce düzenleyin.`)}</p>
        </div>
      </div>
      <div class="ya-widget-topic-chips" role="group" aria-label="${i(`WhatsApp mesaj konusu`)}">
        ${e.map(e=>`
              <button
                type="button"
                data-ya-whatsapp-topic="${e.key}"
                data-ya-whatsapp-message="${$(e.message)}"
                aria-pressed="${H.whatsappTopic===e.key?`true`:`false`}"
                class="${H.whatsappTopic===e.key?`is-active`:``}"
              >${Q(e.label)}</button>
            `).join(``)}
      </div>
      <form class="ya-widget-direct-whatsapp" data-ya-whatsapp-form>
        <label class="ya-widget-field">
          <span>${i(`Mesajınız`)}</span>
          <textarea name="message" required rows="3" maxlength="1200" placeholder="${i(`Kısa mesajınızı yazın`)}">${Q(H.whatsappDraft)}</textarea>
        </label>
        <div class="ya-widget-message-preview">
          <span>${i(`Hazır mesaj`)}</span>
          <p data-ya-message-preview>${H.whatsappDraft?Q(H.whatsappDraft):r(`Bir konu seçtiğinizde mesajınız burada görünecek.`)}</p>
        </div>
        <button class="ya-widget-primary-action" type="submit">
          ${P(`send`)}
          <span>${i(`WhatsApp'ta Aç`)}</span>
        </button>
      </form>
    </div>
  `}function Sn(){let e=String(H.context?.address||V.address||``).trim(),t=String(H.context?.mapUrl||V.mapUrl||qt(e)).trim();return`
    <div class="ya-widget-subview ya-widget-directions">
      ${J(r(`Yol tarifi`),`pin`)}
      <div class="ya-widget-subview-intro">
        <span aria-hidden="true">${P(`pin`)}</span>
        <div>
          <h2 class="ya-widget-view-title" tabindex="-1">${i(`Bize nasıl ulaşabilirsiniz?`)}</h2>
          <p>${i(`Konumu açabilir veya ulaşım hakkında kısa bir soru sorabilirsiniz.`)}</p>
        </div>
      </div>
      ${Cn()}
      <div class="ya-widget-location-card">
        <span>${P(`pin`)}</span>
        <div>
          <strong>${Q(V.businessName)}</strong>
          <p>${Q(e||r(`Adres bilgisi site tarafından iletilmedi.`))}</p>
        </div>
      </div>
      <div class="ya-widget-ai-actions">
        ${t?`<a class="ya-widget-primary-action" href="${$(t)}" target="_blank" rel="noopener noreferrer">${P(`pin`)}<span>${i(`Haritada Aç`)}</span></a>`:``}
        ${V.aiEnabled?`<button class="ya-widget-secondary-action" type="button" data-ya-directions-question>
          ${P(`help`)}<span>${i(`Yol Tarifi Sor`)}</span>
        </button>`:``}
      </div>
    </div>
  `}function Cn(){let e=H.context,t=String(e?.resourceName??``).trim();if(!t)return``;let n=String(e?.resourceType??``).trim(),i=r(n===`room`?`Seçili oda`:n===`table`?`Seçili masa`:n===`product`?`Seçili ürün`:`Sayfa bağlamı`),a=String(e?.imageUrl??``).trim();return`
    <div class="ya-widget-context-card" data-ya-context-card>
      ${a?`<img src="${$(a)}" alt="" />`:`<span class="ya-widget-context-icon">${P(n===`room`?`bed`:`sparkles`)}</span>`}
      <div>
        <small>${Q(i)}</small>
        <strong>${Q(t)}</strong>
      </div>
    </div>
  `}function wn(){let e=H.context??{};return`
    <input type="hidden" name="context_resource_type" value="${$(String(e.resourceType??``))}" />
    <input type="hidden" name="context_resource_id" value="${$(String(e.resourceId??``))}" />
    <input type="hidden" name="context_resource_name" value="${$(String(e.resourceName??``))}" />
    <input type="hidden" name="context_source_path" value="${$(String(e.sourcePath??``))}" />
  `}function J(e,t){return`
    <div class="ya-widget-subview-nav">
      <button type="button" data-ya-view="home">${P(`arrow-left`)}<span>${i(`Geri`)}</span></button>
      <span class="ya-widget-active-flow">${P(t)} ${Q(e)}</span>
    </div>
  `}function Tn(e){Ot(e,V.apiBaseUrl),e.querySelector(`[data-ya-open]`)?.addEventListener(`click`,()=>rn()),e.querySelector(`[data-ya-close]`)?.addEventListener(`click`,an),e.querySelectorAll(`[data-ya-view]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.yaView;H={...H,isOpen:!0,view:t,status:``,aiLoading:!1,context:t===`home`?null:H.context,questionDraft:t===`home`?``:H.questionDraft},K(),Z(`.ya-widget-view-title`)})}),e.querySelectorAll(`[data-ya-request-type]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.yaRequestType;Xn(t)?(H={...H,view:`form`,requestType:t,status:``},K(),Z(`.ya-widget-view-title`)):X(r(`Bu işlem işletmenin etkin web seçeneklerinde kullanılamıyor.`))})}),En(e),Nn(e),Ln(e),Rn(e),Bn(e),zn(e),e.querySelector(`[data-ya-ai-form]`)?.addEventListener(`submit`,e=>void Vn(e)),e.querySelector(`[data-ya-whatsapp-form]`)?.addEventListener(`submit`,Hn),e.onkeydown=e=>{e.key===`Escape`&&H.isOpen&&(e.preventDefault(),an())}}function En(e){e.querySelectorAll(`[data-ya-open-date-picker]`).forEach(t=>{t.addEventListener(`click`,()=>Dn(e,String(t.dataset.yaOpenDatePicker??``)))});let t=e.querySelector(`[data-ya-calendar]`);t?.addEventListener(`click`,n=>{let r=n.target instanceof Element?n.target.closest(`button`):null;if(!r||r.disabled)return;if(r.dataset.yaCalendarClose===`1`){Y(e);return}if(r.dataset.yaCalendarShortcut){kn(e,String(r.dataset.yaCalendarShortcut),t);return}if(r.dataset.yaCalendarShift){let n=Number(r.dataset.yaCalendarShift),i=L(String(t.dataset.yaCalendarMonth??``));if(!i||!Number.isFinite(n))return;t.dataset.yaCalendarMonth=I(new Date(i.getFullYear(),i.getMonth()+n,1)),On(e);return}let i=String(r.dataset.yaCalendarDay??``),a=e.querySelector(`input[name="${String(t.dataset.yaCalendarTarget??``)}"]`);i&&a&&(a.value=i,a.dispatchEvent(new Event(`change`,{bubbles:!0})),Y(e))});let n=e.querySelector(`input[name="start_date"]`),r=e.querySelector(`input[name="end_date"]`);n?.addEventListener(`change`,()=>{e.querySelector(`[data-ya-accommodation-dates]`)?jn(e):Mn(e,`custom`,n.value)}),r?.addEventListener(`change`,()=>jn(e))}function Dn(e,t){In(e);let n=e.querySelector(`[data-ya-calendar]`),r=e.querySelector(`input[name="${t}"]`);if(!n||!r)return;let i=L(r.value)??L(r.min)??new Date;n.dataset.yaCalendarTarget=t,n.dataset.yaCalendarMonth=I(new Date(i.getFullYear(),i.getMonth(),1)),n.hidden=!1,On(e)}function Y(e){let t=e.querySelector(`[data-ya-calendar]`);t&&(t.hidden=!0)}function On(e){let t=e.querySelector(`[data-ya-calendar]`);if(!t)return;let n=String(t.dataset.yaCalendarTarget??``),a=e.querySelector(`input[name="${n}"]`),o=L(String(t.dataset.yaCalendarMonth??``));if(!a||!o)return;let s=o.getFullYear(),c=o.getMonth(),l=new Date(s,c,1),u=new Date(s,c+1,0),d=(l.getDay()+6)%7,f=a.min||I(new Date),p=a.value,m=I(new Date),h=e.querySelector(`input[name="start_date"]`)?.value??``,g=e.querySelector(`input[name="end_date"]`)?.value??``,_=!!e.querySelector(`[data-ya-accommodation-dates]`),v=[];for(let e=0;e<d;e+=1)v.push(`<span class="ya-widget-calendar-empty" aria-hidden="true"></span>`);for(let e=1;e<=u.getDate();e+=1){let t=I(new Date(s,c,e)),n=t<f,r=[t===p?`is-selected`:``,t===m?`is-today`:``,_&&h&&g&&t>h&&t<g?`is-in-range`:``,_&&(t===h||t===g)?`is-range-edge`:``].filter(Boolean).join(` `);v.push(`<button type="button" data-ya-calendar-day="${t}" class="${r}" ${n?`disabled`:``} aria-label="${$(R(t))}">${e}</button>`)}let y=_?n===`end_date`?[[`clear`,r(`Temizle`),!g],[`day1`,r(`1 gün`),!h],[`day2`,r(`2 gün`),!h],[`day7`,r(`7 gün`),!h],[`day10`,r(`10 gün`),!h]]:[[`clear`,r(`Temizle`),!h],[`today`,r(`Bugün`),!1],[`tomorrow`,r(`Yarın`),!1]]:[[`clear`,r(`Temizle`),!p],[`today`,r(`Bugün`),!1],[`tomorrow`,r(`Yarın`),!1]],b=I(new Date(s,c,0));t.innerHTML=`
    <div class="ya-widget-calendar-head">
      <button type="button" data-ya-calendar-shift="-1" aria-label="${i(`Önceki ay`)}" ${b<f?`disabled`:``}>${P(`chevron-left`)}</button>
      <strong class="ya-widget-calendar-title">${Q(Ht(o))}</strong>
      <button type="button" data-ya-calendar-shift="1" aria-label="${i(`Sonraki ay`)}">${P(`chevron-right`)}</button>
      <button class="ya-widget-calendar-close" type="button" data-ya-calendar-close="1" aria-label="${i(`Takvimi kapat`)}">×</button>
    </div>
    <div class="ya-widget-calendar-shortcuts">
      ${y.map(([e,t,n])=>`<button type="button" data-ya-calendar-shortcut="${e}" ${n?`disabled`:``}>${t}</button>`).join(``)}
    </div>
    <div class="ya-widget-calendar-weekdays" aria-hidden="true"><span>${i(`Pzt`)}</span><span>${i(`Sal`)}</span><span>${i(`Çar`)}</span><span>${i(`Per`)}</span><span>${i(`Cum`)}</span><span>${i(`Cmt`)}</span><span>${i(`Paz`)}</span></div>
    <div class="ya-widget-calendar-days">${v.join(``)}</div>
  `}function kn(e,t,n){let r=String(n.dataset.yaCalendarTarget??``),i=e.querySelector(`input[name="${r}"]`);if(!i)return;let a=!!e.querySelector(`[data-ya-accommodation-dates]`),o=new Date;if(t===`clear`){An(e,r),Y(e);return}let s=/^day(1|2|7|10)$/.exec(t);if(s){let t=Number(s[1]),n=e.querySelector(`input[name="start_date"]`),i=e.querySelector(`input[name="end_date"]`),o=n?L(n.value):null;if(!a||r!==`end_date`||!n||!i||!o)return;i.value=I(F(o,t)),i.dispatchEvent(new Event(`change`,{bubbles:!0})),Y(e);return}let c=I(t===`tomorrow`?F(o,1):o);i.min&&c<i.min||(i.value=c,a?i.dispatchEvent(new Event(`change`,{bubbles:!0})):Mn(e,t===`tomorrow`?`tomorrow`:`today`,c),Y(e))}function An(e,t){let n=e.querySelector(`input[name="${t}"]`);if(!n)return;let i=!!e.querySelector(`[data-ya-accommodation-dates]`);if(n.value=``,i){let n=e.querySelector(`input[name="start_date"]`),r=e.querySelector(`input[name="end_date"]`);t===`start_date`&&n&&r&&(r.value=``,r.min=I(F(new Date,1))),jn(e);return}let a=e.querySelector(`input[name="date_text"]`),o=e.querySelector(`[data-ya-date-label="start_date"]`);a&&(a.value=``),o&&(o.textContent=r(`Tarih seç`)),e.querySelector(`[data-ya-open-date-picker]`)?.classList.remove(`is-active`)}function jn(e){let t=e.querySelector(`input[name="start_date"]`),n=e.querySelector(`input[name="end_date"]`),i=e.querySelector(`input[name="date_text"]`);if(!t||!n||!i)return;if(t.value){let e=L(t.value);e&&(n.min=I(F(e,1)),n.value&&n.value<=t.value&&(n.value=``))}let a=e.querySelector(`[data-ya-date-label="start_date"]`),o=e.querySelector(`[data-ya-date-label="end_date"]`);a&&(a.textContent=t.value?R(t.value):r(`Giriş tarihi`)),o&&(o.textContent=n.value?R(n.value):r(`Çıkış tarihi`)),i.value=t.value&&n.value?`${R(t.value)} – ${R(n.value)}`:``}function Mn(e,t,n){let r=e.querySelector(`input[name="start_date"]`),i=e.querySelector(`input[name="date_text"]`),a=e.querySelector(`[data-ya-open-date-picker]`),o=e.querySelector(`[data-ya-date-label="start_date"]`);if(!r||!i||!n)return;let s=Ut(n,t);r.value=n,i.value=s,e.querySelectorAll(`[data-ya-date-preset]`).forEach(e=>{let n=e.dataset.yaDatePreset===t;e.classList.toggle(`is-active`,n),e.setAttribute(`aria-pressed`,String(n))}),a?.classList.add(`is-active`),o&&(o.textContent=R(n))}function Nn(e){let t=e.querySelector(`[data-ya-open-time-picker]`),r=e.querySelector(`[data-ya-time-popover]`),i=e.querySelector(`input[name="time"]`);t&&r&&i&&(t.addEventListener(`click`,()=>{Y(e);let n=r.hidden;n&&Pn(e),r.hidden=!n,t.setAttribute(`aria-expanded`,String(n))}),r.addEventListener(`click`,t=>{let a=t.target instanceof Element?t.target.closest(`button`):null;if(!a||a.disabled)return;if(a.dataset.yaTimeClose===`1`){In(e);return}if(a.dataset.yaTimeClear===`1`){Fn(e),In(e);return}let o=a.dataset.yaTimeHour,s=a.dataset.yaTimeMinute;o!==void 0&&(r.dataset.yaSelectedHour=o),s!==void 0&&(r.dataset.yaSelectedMinute=s);let c=String(r.dataset.yaSelectedHour??``),l=String(r.dataset.yaSelectedMinute??``);if(c&&l){i.value=`${c}:${l}`;let t=e.querySelector(`[data-ya-time-label]`);t&&(t.textContent=new Intl.DateTimeFormat(n,{hour:`2-digit`,minute:`2-digit`}).format(new Date(2e3,0,1,Number(c),Number(l))))}Pn(e),s!==void 0&&c&&l&&In(e)}))}function Pn(e){let t=e.querySelector(`[data-ya-time-popover]`),n=e.querySelector(`input[name="time"]`);if(!t||!n)return;let r=/^([01]\\d|2[0-3]):([0-5]\\d)$/.exec(n.value);r&&(t.dataset.yaSelectedHour=r[1],t.dataset.yaSelectedMinute=r[2]);let a=String(t.dataset.yaSelectedHour??``),o=String(t.dataset.yaSelectedMinute??``),s=Array.from({length:24},(e,t)=>String(t).padStart(2,`0`));t.innerHTML=`
    <div class="ya-widget-time-popover-head">
      <div>
        <small>${i(`Saat seçimi`)}</small>
        <strong>${a||`--`}:${o||`--`}</strong>
      </div>
      <div class="ya-widget-time-popover-actions">
        <button class="ya-widget-time-clear" type="button" data-ya-time-clear="1" ${n.value?``:`disabled`}>${i(`Temizle`)}</button>
        <button class="ya-widget-time-close" type="button" data-ya-time-close="1" aria-label="${i(`Saat seçimini kapat`)}">×</button>
      </div>
    </div>
    <div class="ya-widget-time-columns">
      <div class="ya-widget-time-column" aria-label="${i(`Saatler`)}">
        <span>${i(`Saat`)}</span>
        <div class="ya-widget-time-scroll">
          ${s.map(e=>`<button type="button" data-ya-time-hour="${e}" class="${a===e?`is-selected`:``}">${e}</button>`).join(``)}
        </div>
      </div>
      <div class="ya-widget-time-column" aria-label="${i(`Dakikalar`)}">
        <span>${i(`Dakika`)}</span>
        <div class="ya-widget-time-scroll ya-widget-time-minutes">
          ${[`00`,`15`,`30`,`45`].map(e=>`<button type="button" data-ya-time-minute="${e}" class="${o===e?`is-selected`:``}">${e}</button>`).join(``)}
        </div>
      </div>
    </div>
  `,window.requestAnimationFrame(()=>{t.querySelector(`.ya-widget-time-scroll .is-selected`)?.scrollIntoView({block:`center`})})}function Fn(e){let t=e.querySelector(`[data-ya-time-popover]`),n=e.querySelector(`input[name="time"]`),i=e.querySelector(`[data-ya-time-label]`);n&&(n.value=``),i&&(i.textContent=r(`Saat seç`)),t&&(delete t.dataset.yaSelectedHour,delete t.dataset.yaSelectedMinute)}function In(e){let t=e.querySelector(`[data-ya-time-popover]`),n=e.querySelector(`[data-ya-open-time-picker]`);t&&(t.hidden=!0),n?.setAttribute(`aria-expanded`,`false`)}function Ln(e){let t=e.querySelector(`input[name="guest_count"]`);if(!t)return;let n=()=>{let n=Vt(t.value);e.querySelectorAll(`[data-ya-guest-step]`).forEach(e=>{let t=Number(e.dataset.yaGuestStep??0);e.disabled=t<0&&n<=1||t>0&&n>=30})};e.querySelectorAll(`[data-ya-guest-step]`).forEach(e=>{e.addEventListener(`click`,()=>{let r=Number(e.dataset.yaGuestStep??0);t.value=String(Math.min(30,Math.max(1,Vt(t.value)+r))),n()})}),t.addEventListener(`input`,n),n()}function Rn(e){let t=e.querySelector(`.ya-widget-ai textarea`);t&&(t.addEventListener(`input`,()=>{H.questionDraft=t.value}),e.querySelectorAll(`[data-ya-question-suggestion]`).forEach(n=>{n.addEventListener(`click`,()=>{let r=String(n.dataset.yaQuestionSuggestion??``);t.value=r,H.questionDraft=r,e.querySelectorAll(`[data-ya-question-suggestion]`).forEach(e=>e.classList.remove(`is-active`)),n.classList.add(`is-active`),t.focus()})}),e.querySelector(`[data-ya-ai-whatsapp]`)?.addEventListener(`click`,()=>{let e=t.value.trim()||r(`Bilgi almak istiyorum.`);H.questionDraft=t.value;let n=r(`Merhaba, {0} hakkında bilgi almak istiyorum. Sorum: {1}`,{0:V.businessName,1:e});window.open(sn(V.whatsappPhone,n),`_blank`,`noopener,noreferrer`),X(``)}))}function zn(e){e.querySelector(`[data-ya-directions-question]`)?.addEventListener(`click`,()=>{let e=String(H.context?.address||V.address||``).trim();H={...H,view:`info`,questionDraft:H.context?.question?.trim()||(e?r(`{0} adresine nasıl gelebilirim?`,{0:e}):r(`İşletmenize nasıl gelebilirim?`)),status:``},K(),Z(`.ya-widget-ai textarea`)})}function Bn(e){let t=e.querySelector(`.ya-widget-direct-whatsapp textarea`),n=e.querySelector(`[data-ya-message-preview]`);if(!t||!n)return;let i=()=>{H.whatsappDraft=t.value,n.textContent=t.value.trim()||r(`Mesajınızı yazdığınızda burada görünecek.`)};t.addEventListener(`input`,()=>{H.whatsappTopic=`custom`,e.querySelectorAll(`[data-ya-whatsapp-topic]`).forEach(e=>{let t=e.dataset.yaWhatsappTopic===`custom`;e.classList.toggle(`is-active`,t),e.setAttribute(`aria-pressed`,String(t))}),i()}),e.querySelectorAll(`[data-ya-whatsapp-topic]`).forEach(n=>{n.addEventListener(`click`,()=>{let r=String(n.dataset.yaWhatsappTopic??``),a=String(n.dataset.yaWhatsappMessage??``);H.whatsappTopic=r,t.value=a,i(),e.querySelectorAll(`[data-ya-whatsapp-topic]`).forEach(e=>{let t=e===n;e.classList.toggle(`is-active`,t),e.setAttribute(`aria-pressed`,String(t))}),t.focus()})})}async function Vn(e){if(e.preventDefault(),!V.aiEnabled){H={...H,view:`home`,status:``,aiLoading:!1,aiAnswer:``},K();return}let t=e.currentTarget,i=new FormData(t),a=String(i.get(`message`)??``).trim();if(!a){X(r(`Lütfen kısa sorunuzu yazın.`));return}if(!V.apiBaseUrl){X(r(`AI bağlantısı bu sitede etkin değil. Sorunuzu WhatsApp'tan iletebilirsiniz.`));return}H={...H,questionDraft:a,status:``,aiLoading:!0};let o=k.begin();K();let s=``;try{let e=`${V.apiBaseUrl.replace(/\/$/,``)}/api/chat.php`,t=await fetch(e,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({message:a,...n===`en-GB`?{response_language:`en`}:{}})}),r=await t.json().catch(()=>null);if(!t.ok||!r?.ok||!r.answer)throw s=Un(r?.error,r?.message),Error(`ai_failed`);H={...H,aiAnswer:r.answer,aiLoading:!1,status:r.fallback?Un(r.error):``},o(r.fallback?`error`:`response`),K()}catch{o(`error`),H={...H,aiLoading:!1,status:s||r(`AI servisine ulaşılamadı. İnternet veya sunucu bağlantısını kontrol edin. Hata kodu: widget_connection_failed.`)},K()}}function Hn(e){e.preventDefault();let t=e.currentTarget,n=new FormData(t),i=String(n.get(`message`)??``).trim();i?(H.whatsappDraft=i,window.open(sn(V.whatsappPhone,i),`_blank`,`noopener,noreferrer`),X(``)):X(r(`Lütfen bir konu seçin veya kısa mesajınızı yazın.`))}function X(e){H.status=e;let t=document.querySelector(`#${B} [data-ya-status]`),n=t?.querySelector(`[data-ya-status-text]`);t&&n&&(n.textContent=e,t.hidden=!e)}function Un(e,t=``){let i=n===`en-GB`?r(`AI hizmeti şu anda kullanılamıyor. Lütfen tekrar deneyin.`):String(e?.message||t||r(`AI yanıtı alınamadı.`)).trim(),a=String(e?.code||`unknown_ai_error`).trim(),o=Number(e?.provider_status||0);return r(`{0} Hata kodu: {1}{2}.{3}`,{0:i,1:a,2:o>0?` (HTTP ${o})`:``,3:e?.retryable===!0?r(` Biraz sonra yeniden deneyebilirsiniz.`):``})}function Wn(){let e=Jn();return e.has(`accommodation`)&&e.has(`food_service`)?r(`Rezervasyon, masa ve bilgi taleplerinizi hızlıca hazırlayayım.`):e.has(`accommodation`)?r(`Oda, rezervasyon ve konaklama sorularınızda yardımcı olayım.`):e.has(`food_service`)?r(`Masa, menü ve restoran sorularınızda yardımcı olayım.`):e.has(`catalog`)?r(`Ürün, stok ve işletme bilgileri için yardımcı olayım.`):r(`İşletme hakkında bilgi ve iletişim taleplerinizde yardımcı olayım.`)}function Gn(){let e=(V.businessName.trim()||r(`Yardımcı`)).replace(/\s+(?:Pansiyon|Otel|Butik Otel|Restoran|Kafe)(?:\s*(?:&|\/)\s*(?:Pansiyon|Otel|Restoran|Kafe))*\s*$/i,``).trim();return`${e&&e.toLocaleLowerCase(`tr-TR`)!==`yardımcı asistan`?e:r(`Yardımcı`)} ${V.aiEnabled?r(`AI Asistanı`):r(`Yardımcısı`)}`}function Kn(){let e=document.getElementById(B);if(e)return e;let t=document.createElement(`div`);return t.id=B,document.body.appendChild(t),t}function qn(e){let t=document.getElementById(Jt);t||(t=document.createElement(`style`),t.id=Jt,document.head.appendChild(t)),t.textContent=kt(B,e)}function Jn(){return Ft(V)}function Yn(){return It(V)}function Xn(e){return Lt(V,e)}function Zn(){return Rt(V)}function Qn(){return zt(V)}async function $n(e){let t=V.apiBaseUrl.trim().replace(/\/$/,``);if(t)try{let n=await fetch(`${t}/api/business.php`,{method:`GET`,headers:{Accept:`application/json`}}),r=await n.json().catch(()=>null);if(e!==$t||!n.ok||r?.ok!==!0||!r.business)return;let i=r.business,a=Nt(i.profile_id),o=Pt(i.public_surfaces);V={...V,businessName:String(i.display_name??``).trim()||V.businessName,whatsappPhone:String(i.whatsapp??``).trim()||V.whatsappPhone,primaryColor:String(i.primary_color??``).trim()||V.primaryColor,accentColor:String(i.accent_color??``).trim()||V.accentColor,address:String(i.address??``).trim()||V.address,mapUrl:String(i.map_url??``).trim()||V.mapUrl,aiEnabled:typeof i.ai_enabled==`boolean`?i.ai_enabled:V.aiEnabled,whatsappEnabled:typeof i.whatsapp_enabled==`boolean`?i.whatsapp_enabled:V.whatsappEnabled,dealerApplicationEnabled:i.dealer_application_enabled===!0,requestsEnabled:typeof i.requests_enabled==`boolean`?i.requests_enabled:V.requestsEnabled,profileId:a||V.profileId,publicSurfaces:o.length>0?o:V.publicSurfaces},(H.view===`form`&&!Xn(H.requestType)||H.view===`info`&&!V.aiEnabled||H.view===`whatsapp`&&!Yn())&&(H={...H,view:`home`,status:``,aiLoading:!1,aiAnswer:``,questionDraft:``}),qn(V),K()}catch{}}function er(){Zt||(Zt=!0,document.addEventListener(`click`,e=>{let t=e.target instanceof Element?e.target.closest(`[data-ya-action]`):null;if(!t||t.closest(`#${B}`))return;let n=Kt(t.dataset.yaAction);n&&(e.preventDefault(),rn({intent:n,context:{...t.dataset.yaResourceType===void 0?{}:{resourceType:t.dataset.yaResourceType},...t.dataset.yaResourceId===void 0?{}:{resourceId:t.dataset.yaResourceId},...t.dataset.yaResourceName===void 0?{}:{resourceName:t.dataset.yaResourceName},...t.dataset.yaImageUrl===void 0?{}:{imageUrl:t.dataset.yaImageUrl},sourcePath:t.dataset.yaSourcePath||window.location.pathname,...t.dataset.yaQuestion===void 0?{}:{question:t.dataset.yaQuestion},...t.dataset.yaAddress===void 0?{}:{address:t.dataset.yaAddress},...t.dataset.yaMapUrl===void 0?{}:{mapUrl:t.dataset.yaMapUrl}}}))}))}function Z(e){window.requestAnimationFrame(()=>{document.querySelector(`#${B} ${e}`)?.focus()})}function Q(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#039;`)}function $(e){return Q(e).replace(/`/g,`&#096;`)}function applyPublication(e){V={...V,...e,profileId:``,publicSurfaces:Pt(e.publicSurfaces),aiEnabled:e.aiEnabled===!0,requestsEnabled:e.requestsEnabled===!0,dealerApplicationEnabled:e.dealerApplicationEnabled===!0,whatsappEnabled:e.whatsappEnabled===!0};if((H.view===`form`&&!Xn(H.requestType))||(H.view===`info`&&!V.aiEnabled)||(H.view===`whatsapp`&&!Yn()))H={...H,...z(),status:``,aiAnswer:``,aiLoading:!1};K()}function openRequest(e){if(!Xn(e))return;H={...H,isOpen:!0,view:`form`,requestType:e,status:``};K(),Z(`.ya-widget-view-title`)}return window.YardimciAsistanWidget={init:G,open:rn,close:an,setPublication:applyPublication,openRequest},document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,()=>G(),{once:!0}):G(),at(),d(),document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,Tt,{once:!0}):Tt(),e.buildWhatsAppMessage=cn,e.close=an,e.createWhatsAppLink=sn,e.init=G,e.normalizeInternationalPhone=ln,e.setPublication=applyPublication,e.openRequest=openRequest,e.open=rn,e})({});