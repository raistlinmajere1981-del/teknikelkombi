<?php require_once dirname(__DIR__).'/inc/layout.php'; te_header('cart','Perakende Sepeti'); ?>
<div class="catalog-head"><div class="container"><div class="crumb"><a href="/"><?= te_t('Anasayfa') ?></a> / <a href="/magaza/"><?= te_t('Katalog') ?></a> <?= te_t('/ Sepet') ?></div><div class="catalog-headline"><div><div class="eyebrow"><?= te_t('PERAKENDE SİPARİŞ') ?></div><h1><?= te_t('Sepetiniz') ?></h1><p><?= te_t('Ödeme alınmaz. Sipariş talebiniz işletmenin onayını bekler.') ?></p></div><a href="/magaza/" class="text-link"><?= te_t('Alışverişe devam et →') ?></a></div></div></div>
<div class="container checkout-page"><p data-catalog-state role="status"><?= te_t('Katalog kontrol ediliyor...') ?></p><div data-cart-root></div></div>
<?php te_footer(); ?>
