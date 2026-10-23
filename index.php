<?php require_once __DIR__.'/inc/layout.php'; te_header('home', 'Kombi Yedek Parça ve Kart Tamiri'); ?>
<section class="hero"><div class="container hero-wrap">
<div class="hero-copy">
<div class="overline"><span class="red-dot"></span> SERVİSİN İHTİYACI OLAN HER PARÇA</div>
<h1>Doğru parçayı bulmak artık <em>çok daha kolay.</em></h1>
<p>Kombi yedek parça, teknik ekipman ve kart tamiri için aradığınız çözümler tek bir yerde. Ürün koduyla arayın, hızlıca inceleyin.</p>
<div class="hero-buttons"><a class="btn btn-red" href="/katalog/" data-store-only hidden>Ürün kataloğunu keşfet <span>→</span></a><a class="btn btn-light" href="/bayi/">Bayi misiniz? <span>↗</span></a></div>
<div class="hero-highlights" data-store-only hidden><span><b>01</b> Kolay ürün arama</span><span><b>02</b> Marka ve kategori filtreleri</span><span><b>03</b> Bayilere özel alan</span></div>
</div>
<div class="hero-visual" aria-hidden="true"><div class="technical-rings"></div><div class="visual-tag">TEKNİKEL / PARÇA KATALOĞU</div>
<div class="part-shot shot-a"><img src="/assets/part-valve.jpg" alt=""></div>
<div class="part-shot shot-b"><img src="/assets/part-pump.jpg" alt=""></div>
<div class="part-shot shot-c"><img src="/assets/part-exchanger.jpg" alt=""></div>
<div class="visual-label">DOĞRU PARÇA.<br><strong>DOĞRU ÇÖZÜM.</strong></div>
</div>
</div></section>
<section class="quick-strip" data-store-only hidden><div class="container quick-inner"><span><b>Ürünü bulun</b><small>İsim, stok kodu veya model</small></span><i>→</i><span><b>Detayları inceleyin</b><small>Teknik bilgiler ve görseller</small></span><i>→</i><span><b>Sipariş sürecine geçin</b><small>Perakende veya bayi hesabıyla</small></span></div></section>
<section class="section campaign-section" aria-labelledby="campaign-heading" hidden><div class="container">
<div class="heading"><div><div class="eyebrow">TEKNİKEL / KAMPANYALAR</div><h2 id="campaign-heading">Öne çıkan <span>ürünler ve duyurular.</span></h2></div></div>
<p class="campaign-feedback" data-campaign-feedback role="status" aria-live="polite" hidden></p>
<div class="campaign-grid" data-campaign-grid></div>
</div></section>
<section class="section categories" data-category-section hidden><div class="container">
<div class="heading"><div><div class="eyebrow">ÜRÜN GRUPLARI</div><h2>Aradığınız parçaya <span>doğrudan ulaşın.</span></h2></div><a href="/katalog/" data-store-only hidden class="text-link">Tüm kategoriler <span>↗</span></a></div>
<div class="category-grid" data-category-grid></div>
</div></section>
<section class="section featured" data-store-only hidden><div class="container">
<div class="heading"><div><div class="eyebrow">KATALOĞUMUZDAN</div><h2>Parçalar, <span>tek yerde.</span></h2></div><a class="text-link" href="/katalog/" data-store-only hidden>Kataloğa geç ↗</a></div>
<p class="status-line" data-catalog-state>Katalog bağlantısı kontrol ediliyor...</p>
<div class="product-grid" data-featured-grid></div>
</div></section>
<section class="brand-section" data-brand-section hidden><div class="container"><span class="eyebrow">KATALOĞUMUZDAKİ MARKALAR</span><div class="brands" data-brand-list></div></div></section>
<section class="dealer-callout"><div class="container callout-inner"><div><div class="eyebrow">PROFESYONELLERE ÖZEL</div><h2>Teknik servisiniz için <span>daha hızlı sipariş.</span></h2><p>Bayi davetinizle giriş yapın; size özel kataloğa, fiyatlara ve sipariş geçmişinize ulaşın.</p></div><a href="/bayi/" class="btn btn-red">Bayi alanını incele <span>↗</span></a></div></section>
<?php te_footer(); ?>