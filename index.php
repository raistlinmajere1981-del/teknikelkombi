<?php require_once __DIR__.'/inc/layout.php'; te_header('home', 'Kombi Yedek Parça ve Kart Tamiri'); ?>
<section class="hero"><div class="container hero-wrap">
<div class="hero-copy">
<div class="overline"><span class="red-dot"></span> <?= te_t('SERVİSİN İHTİYACI OLAN HER PARÇA') ?></div>
<h1><?= te_t('Doğru parçayı bulmak artık') ?> <em><?= te_t('çok daha kolay.') ?></em></h1>
<p><?= te_t('Kombi yedek parça, teknik ekipman ve kart tamiri için aradığınız çözümler tek bir yerde. Ürün koduyla arayın, hızlıca inceleyin.') ?></p>
<div class="hero-buttons"><a class="btn btn-red" href="/magaza/" data-store-only hidden><?= te_t('Ürün kataloğunu keşfet') ?> <span>→</span></a><a class="btn btn-light" href="/bayi/"><?= te_t('Bayi misiniz?') ?> <span>↗</span></a></div>
<div class="hero-highlights" data-store-only hidden><span><b>01</b> <?= te_t('Kolay ürün arama') ?></span><span><b>02</b> <?= te_t('Marka ve kategori filtreleri') ?></span><span><b>03</b> <?= te_t('Bayilere özel alan') ?></span></div>
</div>
<div class="hero-visual" aria-hidden="true"><div class="technical-rings"></div><div class="visual-tag"><?= te_t('TEKNİKEL / PARÇA KATALOĞU') ?></div>
<div class="part-shot shot-a"><img src="/assets/part-valve.jpg" alt=""></div>
<div class="part-shot shot-b"><img src="/assets/part-pump.jpg" alt=""></div>
<div class="part-shot shot-c"><img src="/assets/part-exchanger.jpg" alt=""></div>
<div class="visual-label"><?= te_t('DOĞRU PARÇA.') ?><br><strong><?= te_t('DOĞRU ÇÖZÜM.') ?></strong></div>
</div>
</div></section>
<section class="quick-strip" data-store-only hidden><div class="container quick-inner"><span><b><?= te_t('Ürünü bulun') ?></b><small><?= te_t('İsim, stok kodu veya model') ?></small></span><i>→</i><span><b><?= te_t('Detayları inceleyin') ?></b><small><?= te_t('Teknik bilgiler ve görseller') ?></small></span><i>→</i><span><b><?= te_t('Sipariş sürecine geçin') ?></b><small><?= te_t('Perakende veya bayi hesabıyla') ?></small></span></div></section>
<section class="section campaign-section" aria-labelledby="campaign-heading" hidden><div class="container">
<div class="heading"><div><div class="eyebrow"><?= te_t('TEKNİKEL / KAMPANYALAR') ?></div><h2 id="campaign-heading"><?= te_t('Öne çıkan') ?> <span><?= te_t('ürünler ve duyurular.') ?></span></h2></div></div>
<p class="campaign-feedback" data-campaign-feedback role="status" aria-live="polite" hidden></p>
<div class="campaign-grid" data-campaign-grid></div>
</div></section>
<section class="section categories" data-category-section hidden><div class="container">
<div class="heading"><div><div class="eyebrow"><?= te_t('ÜRÜN GRUPLARI') ?></div><h2><?= te_t('Aradığınız parçaya') ?> <span><?= te_t('doğrudan ulaşın.') ?></span></h2></div><a href="/magaza/" data-store-only hidden class="text-link"><?= te_t('Tüm kategoriler') ?> <span>↗</span></a></div>
<div class="category-grid" data-category-grid></div>
</div></section>
<section class="section featured" data-store-only hidden><div class="container">
<div class="heading"><div><div class="eyebrow"><?= te_t('KATALOĞUMUZDAN') ?></div><h2><?= te_t('Parçalar,') ?> <span><?= te_t('tek yerde.') ?></span></h2></div><a class="text-link" href="/magaza/" data-store-only hidden><?= te_t('Kataloğa geç ↗') ?></a></div>
<p class="status-line" data-catalog-state><?= te_t('Katalog bağlantısı kontrol ediliyor...') ?></p>
<div class="product-grid" data-featured-grid></div>
</div></section>
<section class="brand-section" data-brand-section hidden><div class="container"><span class="eyebrow"><?= te_t('KATALOĞUMUZDAKİ MARKALAR') ?></span><div class="brands" data-brand-list></div></div></section>
<section class="dealer-callout"><div class="container callout-inner"><div><div class="eyebrow"><?= te_t('PROFESYONELLERE ÖZEL') ?></div><h2><?= te_t('Teknik servisiniz için') ?> <span><?= te_t('daha hızlı sipariş.') ?></span></h2><p><?= te_t('Bayi davetinizle giriş yapın; size özel kataloğa, fiyatlara ve sipariş geçmişinize ulaşın.') ?></p></div><a href="/bayi/" class="btn btn-red"><?= te_t('Bayi alanını incele') ?> <span>↗</span></a></div></section>
<?php te_footer(); ?>