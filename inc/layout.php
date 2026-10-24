<?php
declare(strict_types=1);
require_once __DIR__ . '/language.php';
te_prepare_language();
header('Cache-Control: private, no-store');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
function te(string $s): string { return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function te_public_links(string $page = ''): void {
    foreach ([
        ['store','Mağaza','/magaza/','store','data-store-only'],
        ['rooms','Odalar','/odalar/','rooms','data-surface="rooms"'],
        ['restaurant','Restoran','/restoran/','restaurant','data-surface="restaurant"'],
        ['qr-menu','QR Menü','/qr-menu/','qr-menu','data-surface="qr_menu"'],
        ['about','Hakkımızda','/hakkimizda/','about','data-public-page="about"'],
        ['gallery','Galeri','/galeri/','gallery','data-public-page="gallery"'],
        ['reviews','Yorumlar','/yorumlar/','reviews','data-public-page="reviews"'],
        ['announcements','Duyurular','/duyurular/','announcements','data-public-page="announcements"'],
        ['contact','İletişim','/iletisim/','contact','data-contact-link']
    ] as [$id,$label,$href,$current,$gate]) { ?>
<a href="<?= te($href) ?>" <?= $gate ?> <?= ($page === $current || ($page === 'room' && $id === 'rooms')) ? 'aria-current="page"' : '' ?> hidden><?= te_t($label) ?></a>
<?php }
}
function te_contact_fields(): void { ?>
<a data-business-phone hidden aria-label="<?= te_t('İşletmeyi ara') ?>"></a><a data-business-email hidden aria-label="<?= te_t('İşletmeye e-posta gönder') ?>"></a><p data-business-address hidden></p>
<a data-business-whatsapp hidden rel="noopener noreferrer">WhatsApp ↗</a><a data-business-directions hidden rel="noopener noreferrer"><?= te_t('Yol tarifi ↗') ?></a><a data-business-website hidden rel="noopener noreferrer"><?= te_t('Web sitesi ↗') ?></a><div data-business-socials hidden aria-label="<?= te_t('Sosyal medya') ?>"></div>
<?php }
function te_header(string $page, string $title): void { ?>
<!doctype html>
<html lang="<?= te_language() ?>"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#12283d">
<meta name="description" content="<?= te_t('Teknikel kombi yedek parça ve kart tamiri. Parçaları hızlıca bulun, ürün koduyla arayın ve bayi işlemlerine ulaşın.') ?>">
<title><?= te_t($title) ?> | Teknikel</title>
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/assets/site.css">
<?php if (in_array($page, ['home','announcements'], true)): ?><link rel="stylesheet" href="/assets/marketing.css"><?php endif; ?>
<script id="teknikel-english" type="application/json"><?= json_encode(te_dictionary(), JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_UNICODE) ?></script>
<script src="/assets/site.js" type="module"></script>
</head><body data-page="<?= te($page) ?>">
<a class="skip" href="#main"><?= te_t('İçeriğe geç') ?></a>
<div class="topline"><div class="container top-inner"><span><?= te_t('TEKNİK PARÇADA DOĞRU ADRES') ?></span><div class="top-contact"><a data-business-phone hidden aria-label="<?= te_t('İşletmeyi ara') ?>"></a><a href="/iletisim/" data-contact-link hidden><?= te_t('İletişim') ?></a></div></div></div>
<header class="header"><div class="container header-main">
<a class="brand" href="/" aria-label="<?= te_t('Teknikel Ana Sayfa') ?>"><img src="/assets/logo.webp" alt="<?= te_t('TEKNİKEL — Kombi Yedek Parça ve Kart Tamiri') ?>" width="250" height="72"></a>
<form class="header-search" action="/magaza/" method="get" role="search" data-store-only hidden><label class="sr-only" for="global-search"><?= te_t('Ürün veya stok kodu ara') ?></label><input id="global-search" name="q" type="search" placeholder="<?= te_t('Ürün adı, stok kodu veya model ara...') ?>" maxlength="180"><button type="submit" aria-label="<?= te_t('Ara') ?>"><svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10.7" cy="10.7" r="6.7"/><path d="m16 16 5 5"/></svg></button></form>
<div class="header-actions"><nav class="language-chooser" aria-label="<?= te_t('Dil seçimi') ?>">
<?php foreach (['tr'=>'Türkçe', 'en'=>'English'] as $language=>$label): ?>
<a href="<?= te(te_language_url($language)) ?>" data-language="<?= te($language) ?>" lang="<?= te($language) ?>" aria-label="<?= te($label) ?>" <?= te_language() === $language ? 'aria-current="true"' : '' ?>><?= strtoupper($language) ?></a>
<?php endforeach; ?></nav><a class="basket-link" href="/sepet/" aria-label="<?= te_t('Perakende sepeti') ?>" data-store-only hidden><?= te_t('Sepet') ?> <span data-retail-count>0</span></a>
<a class="account-link" href="/hesabim/" data-account-only hidden><span class="account-icon">↗</span><span><?= te_t('Hesabım') ?><small><?= te_t('Müşteri hesabı') ?></small></span></a></div>
</div>
<nav class="nav" aria-label="<?= te_t('Ana menü') ?>"><div class="container nav-inner">
<div class="nav-categories" data-category-nav hidden></div>
<?php te_public_links($page); ?>
<a class="nav-dealer" href="/hesabim/" data-account-only hidden><?= te_t('Bayi Sipariş Sistemi') ?> <span>↗</span></a>
</div></nav></header>
<main id="main">
<div class="container"><p class="shop-message" data-shop-message role="status" aria-live="polite" hidden></p></div>
<?php }
function te_footer(): void { ?>
</main>
<footer class="footer"><div class="container foot-main">
<div><div class="footer-brand">TEKNİKEL</div><p data-business-name hidden></p><p><?= te_t('Kombi yedek parçaları ve elektronik kart tamiri için uzman çözüm ortağınız.') ?></p></div>
<div><h3><?= te_t('Keşfedin') ?></h3><?php te_public_links(); ?><a href="/hesabim/" data-account-only hidden><?= te_t('Hesabım') ?></a></div>
<div id="iletisim" data-business-contact hidden><h3><?= te_t('İletişim') ?></h3><?php te_contact_fields(); ?></div>
</div><div class="container footer-bottom">© <?= date('Y') ?> Teknikel <span><?= te_t('Yeni web sitesi — önizleme sürümü') ?></span></div></footer>
<script src="/assets/assistant/widget.js" data-business-name="Teknikel" data-api-base-url="/yardimci-asistan" data-logo-url="/assets/logo.webp" data-primary-color="#12283d" data-accent-color="#e5263c" defer></script>
</body></html>
<?php }

function te_public_page(string $page, string $title): void { te_header($page,$title); ?>
<section class="container publication-page" aria-labelledby="publication-title">
<div class="crumb"><a href="/"><?= te_t('Anasayfa') ?></a> / <?php if ($page === 'room'): ?><a href="/odalar/"><?= te_t('Odalar') ?></a> / <?php endif; ?><?= te_t($title) ?></div>
<div class="eyebrow">TEKNİKEL</div><h1 id="publication-title"><?= te_t($title) ?></h1>
<p class="status-line" data-publication-state role="status" aria-live="polite"><?= te_t('Bilgiler yükleniyor…') ?></p>
<div data-public-content hidden><?php if ($page === 'contact'): ?>
<div class="contact-layout">
<section class="contact-details" aria-label="<?= te_t('İletişim bilgileri') ?>">
<h2><?= te_t('İletişim bilgileri') ?></h2>
<div class="public-contact" aria-label="<?= te_t('İşletme iletişim bilgileri') ?>"><?php te_contact_fields(); ?></div>
</section>
<section class="contact-map" data-business-map hidden aria-label="<?= te_t('Harita') ?>">
<h2><?= te_t('Konum') ?></h2>
<iframe data-business-map-frame title="<?= te_t('İşletmenin haritadaki konumu') ?>" loading="lazy" referrerpolicy="no-referrer" allowfullscreen></iframe>
<p data-business-map-caption></p>
</section>
</div><?php endif; ?></div>
</section>
<?php te_footer(); } ?>
