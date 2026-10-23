<?php require_once dirname(__DIR__).'/inc/layout.php'; te_header('qr-menu','QR Menü'); ?>
<section class="container publication-page" aria-labelledby="publication-title">
<div class="crumb"><a href="/"><?= te_t('Anasayfa') ?></a> <?= te_t('/ QR Menü') ?></div>
<div class="eyebrow">TEKNİKEL</div><h1 id="publication-title"><?= te_t('QR Menü') ?></h1>
<p class="status-line" data-publication-state role="status" aria-live="polite"><?= te_t('Menü yükleniyor…') ?></p>
<div class="menu-filters" data-menu-filters role="group" aria-label="<?= te_t('Menü kategorileri') ?>" hidden></div>
<div data-menu-list></div>
</section>
<?php te_footer(); ?>
