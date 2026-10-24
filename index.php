<?php require_once __DIR__.'/inc/layout.php'; te_header('home', 'Ana Sayfa'); ?>
<section class="hero" data-section="hero" hidden><div class="container hero-wrap">
<div class="hero-copy">
<div class="overline"><span class="red-dot"></span><span data-business-name hidden></span></div>
<h1 data-hero-title></h1>
<p data-business-description hidden></p>
<div class="hero-buttons"><a class="btn btn-red" href="/magaza/" data-store-only hidden><?= te_t('Ürün kataloğunu keşfet') ?> <span>→</span></a><a class="btn btn-light" href="/iletisim/" data-contact-link hidden><?= te_t('İletişime geç') ?> <span>↗</span></a></div>
<div class="hero-highlights" data-section="featured" hidden><span><b>01</b> <?= te_t('Ürünü bulun') ?></span><span><b>02</b> <?= te_t('Detayları inceleyin') ?></span><span><b>03</b> <?= te_t('Görselleri karşılaştırın') ?></span></div>
</div>
<div class="hero-publication" data-hero-media hidden></div>
</div></section>
<section class="section campaign-section" data-section="campaigns" aria-labelledby="campaign-heading" hidden><div class="container">
<div class="heading"><div><div class="eyebrow"><?= te_t('GÜNCEL YAYINLAR') ?></div><h2 id="campaign-heading"><?= te_t('Kampanyalar ve duyurular') ?></h2></div><a href="/duyurular/" class="text-link"><?= te_t('Tümünü gör →') ?></a></div>
<p class="campaign-feedback" data-campaign-feedback role="status" aria-live="polite" hidden></p><div class="campaign-grid" data-campaign-grid></div>
</div></section>
<section class="section categories" data-category-section hidden><div class="container">
<div class="heading"><div><div class="eyebrow"><?= te_t('ÜRÜN GRUPLARI') ?></div><h2><?= te_t('Aradığınız parçaya') ?> <span><?= te_t('doğrudan ulaşın.') ?></span></h2></div><a href="/magaza/" class="text-link"><?= te_t('Tüm kategoriler') ?> ↗</a></div>
<div class="category-grid" data-category-grid></div>
</div></section>
<section class="section featured" data-section="featured" hidden><div class="container">
<div class="heading"><div><div class="eyebrow"><?= te_t('KATALOĞUMUZDAN') ?></div><h2><?= te_t('İnceleyin.') ?> <span><?= te_t('Karşılaştırarak seçin.') ?></span></h2></div><a class="text-link" href="/magaza/"><?= te_t('Kataloğa geç ↗') ?></a></div>
<p class="status-line" data-catalog-state></p><div class="product-grid" data-featured-grid></div>
</div></section>
<section class="brand-section" id="markalar" data-brand-section hidden><div class="container"><span class="eyebrow"><?= te_t('KATALOĞUMUZDAKİ MARKALAR') ?></span><div class="brands" data-brand-list></div></div></section>
<?php foreach ([['rooms','Odalar','/odalar/'],['restaurant','Restoran','/restoran/'],['qr_menu','QR Menü','/qr-menu/'],['gallery','Galeri','/galeri/'],['reviews','Google yorumları','/yorumlar/']] as [$key,$label,$href]): ?>
<section class="section home-publication" data-section="<?= te($key) ?>" hidden><div class="container">
<div class="heading"><h2><?= te_t($label) ?></h2><a href="<?= te($href) ?>" class="text-link"><?= te_t('Tümünü gör →') ?></a></div>
<?php if ($key === 'reviews'): ?><div data-home-review-summary class="home-review-summary"></div><?php endif; ?>
<div class="publication-grid" data-home-list="<?= te($key) ?>"></div></div></section>
<?php endforeach; ?>
<section class="dealer-callout" data-section="dealer" hidden><div class="container callout-inner"><div><div class="eyebrow"><?= te_t('BAYİ SİSTEMİ') ?></div><h2><?= te_t('İşletmeniz için') ?> <span><?= te_t('tek bir çalışma alanı.') ?></span></h2><p data-business-description hidden></p></div><div class="callout-actions"><button type="button" class="btn btn-red" data-support-flow="dealer"><?= te_t('Bayi başvurusu') ?> ↗</button><a href="/hesabim/" class="text-link" data-account-only hidden><?= te_t('Bayi hesabına giriş →') ?></a></div></div></section>
<section class="section support-callout" data-section="support" hidden><div class="container callout-inner"><div><div class="eyebrow"><?= te_t('YARDIMCI ASİSTAN') ?></div><h2><?= te_t('Birlikte bulalım.') ?></h2><p><?= te_t('İhtiyacınız olan işlemle devam edin.') ?></p></div><div class="home-support-actions" data-home-support></div></div></section>
<section class="section home-contact" data-section="contact" hidden><div class="container"><div class="heading"><h2><?= te_t('İletişim') ?></h2><a href="/iletisim/" class="text-link"><?= te_t('İletişim ve konum →') ?></a></div><div class="public-contact"><?php te_contact_fields(); ?></div></div></section>
<?php te_footer(); ?>
