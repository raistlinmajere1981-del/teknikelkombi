# Teknikel — yeni web sitesi önizlemesi

Bu proje Teknikel'in mevcut IdeaSoft sitesinin yerine geçecek yeni web tasarımının **ayrı ve ilk test sürümüdür**.

- Test: https://yardimciasistantoptanci.alwaysdata.net/
- Mevcut canlı satış sitesi: https://www.teknikelkombiyedekparca.com.tr/ (dokunulmaz).
- Veri otoritesi: Yardımcı Asistan Desktop. Test sitesi GET /yardimci-asistan/api/business.php ve /catalog.php yayınlarını okur.
- API/yayın kurulmamışsa **yalnız tasarım ve bekleme durumları** gösterilir. Sahte fiyat, stok veya sipariş yoktur.
- /bayi/ ilk aşamada hazırlık ekranıdır. Gerçek bayi akışı mevcut /api/dealer/ endpoint'lerine bağlanacaktır.
- Yerel PHP: php -S 127.0.0.1:8093 -t .
- Yayın: yalnız site dosyaları sunucunun /www yoluna aktarılır. Ana web modülü, secret ve veritabanına dokunulmaz.
- Marka kimliği: mevcut logonun geçici aynı dosyası kullanılıyor. Görsel iyileştirme ikinci tur.
- Dekoratif fotoğraflar mevcut Teknikel sitesinden alınan parça fotoğraflarıdır; satış kataloğunu temsil etmez.

Codex yalnız YardimciAsistan reposunda bayi Android/API yapısını geliştirecek; bu dizine müdahale etmeyecek.
