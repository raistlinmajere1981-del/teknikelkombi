<?php require_once dirname(__DIR__).'/inc/layout.php'; te_header('account','Hesabım'); ?>
<section class="container account-page" data-dealer-login>
<div class="eyebrow">TEKNİKEL</div><h1 data-account-only hidden><?= te_t('Hesabım') ?></h1>
<p data-login-state role="status" aria-live="polite"><?= te_t('Hesap durumu kontrol ediliyor…') ?></p>
<div data-account-root hidden></div>
<button type="button" class="btn btn-outline" data-account-local><?= te_t('Yerel oturumu temizle') ?></button>
</section>
<section class="dealer-workspace" data-dealer-workspace hidden>
<div class="catalog-head"><div class="container"><div class="eyebrow"><?= te_t('TEKNİKEL / BAYİ HESABI') ?></div><div class="catalog-headline"><div><h1 data-dealer-name></h1><p><?= te_t('Firmanıza özel katalog ve siparişler') ?></p></div><button class="refresh" type="button" data-dealer-refresh><?= te_t('Yenile ↻') ?></button></div><nav class="dealer-tabs" aria-label="<?= te_t('Bayi işlemleri') ?>"><button type="button" data-dealer-tab="catalog" aria-current="page"><?= te_t('Katalog') ?></button><button type="button" data-dealer-tab="cart"><?= te_t('Sepet') ?> <span data-dealer-count>0</span></button><button type="button" data-dealer-tab="orders"><?= te_t('Siparişler') ?></button><button type="button" data-dealer-tab="account"><?= te_t('Hesabım') ?></button></nav></div></div>
<div class="container dealer-content"><p class="shop-message" data-dealer-state role="status" aria-live="polite"></p><div data-dealer-content></div></div>
</section>
<?php te_footer(); ?>
