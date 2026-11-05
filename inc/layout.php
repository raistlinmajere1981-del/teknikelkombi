<?php
declare(strict_types=1);
require_once __DIR__ . '/language.php';
te_prepare_language();
header('Cache-Control: private, no-store');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
function te(string $s): string { return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function te_public_links(string $page = '', bool $navigation = false, bool $footer = false): void {
    foreach ([
        ['store','Mağaza','/magaza/','store','data-store-only'],
        ['brands','Markalar','/markalar/','brands','data-section="brands"'],
        ['rooms','Odalar','/odalar/','rooms','data-surface="rooms"'],
        ['restaurant','Restoran','/restoran/','restaurant','data-surface="restaurant"'],
        ['qr-menu','QR Menü','/qr-menu/','qr-menu','data-surface="qr_menu"'],
        ['about','Hakkımızda','/hakkimizda/','about','data-public-page="about"'],
        ['gallery','Galeri','/galeri/','gallery','data-public-page="gallery"'],
        ['reviews','Yorumlar','/yorumlar/','reviews','data-public-page="reviews"'],
        ['announcements','Kampanyalar','/duyurular/','announcements','data-public-page="announcements"'],
        ['contact','İletişim','/iletisim/','contact','data-contact-link']
    ] as [$id,$label,$href,$current,$gate]) { if ($navigation && $id === 'store') continue; if ($footer && !in_array($id,['store','brands','rooms','restaurant','gallery','contact'],true)) continue; ?>
<a href="<?= te($href) ?>" <?= $gate ?> <?= ($page === $current || ($page === 'room' && $id === 'rooms')) ? 'aria-current="page"' : '' ?> hidden><?= te_t($label) ?></a>
<?php }
}
function te_contact_fields(bool $compact = false): void { ?>
<a data-business-phone hidden aria-label="<?= te_t('İşletmeyi ara') ?>"></a>
<a data-business-email hidden aria-label="<?= te_t('İşletmeye e-posta gönder') ?>"></a>
<p data-business-address hidden></p>
<?php if (!$compact): ?><a data-business-whatsapp hidden rel="noopener noreferrer"><?= te_t('WhatsApp ile yaz') ?> ↗</a>
<a data-business-directions hidden rel="noopener noreferrer" target="_blank"><?= te_t('Yol tarifi') ?> ↗</a>
<a data-business-website hidden rel="noopener noreferrer" target="_blank"><?= te_t('Diğer web sitesi') ?> ↗</a><?php endif; ?>
<div class="social-row"><span class="social-row-label"><?= te_t('Sosyal medya') ?></span><div data-business-socials hidden aria-label="<?= te_t('Sosyal medya') ?>"></div></div>
<?php }
function te_header(string $page, string $title): void { ?>
<!doctype html>
<html lang="<?= te_language() ?>"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#12283d">
<meta name="description" content="" data-public-description>
<title data-page-title="<?= te_t($title) ?>"><?= te_t($title) ?></title>
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/assets/site.css">
<link rel="stylesheet" href="/assets/publication.css">
<link rel="stylesheet" href="/assets/compare.css">
<link rel="stylesheet" href="/assets/assistant/presentation.css">
<?php if (in_array($page, ['home','announcements'], true)): ?><link rel="stylesheet" href="/assets/marketing.css"><?php endif; ?>
<script src="/assets/site.js" type="module"></script>
</head><body data-page="<?= te($page) ?>">
<a class="skip" href="#main"><?= te_t('İçeriğe geç') ?></a>
<header class="header"><div class="container header-main">
<a class="brand" href="/" aria-label="<?= te_t('Teknikel Ana Sayfa') ?>"><img src="/assets/logo.webp" alt="<?= te_t('TEKNİKEL — Kombi Yedek Parça ve Kart Tamiri') ?>" width="250" height="72"></a>
<form class="header-search" action="/magaza/" method="get" role="search" data-store-only hidden><label class="sr-only" for="global-search"><?= te_t('Ürün veya stok kodu ara') ?></label><input id="global-search" name="q" type="search" placeholder="<?= te_t('Ürün adı, stok kodu veya model ara...') ?>" maxlength="180"><button type="submit" aria-label="<?= te_t('Ara') ?>"><svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10.7" cy="10.7" r="6.7"/><path d="m16 16 5 5"/></svg></button></form>
<div class="header-actions"><nav class="language-chooser" aria-label="<?= te_t('Dil seçimi') ?>" hidden inert></nav><a class="basket-link" href="/sepet/" aria-label="<?= te_t('Perakende sepeti') ?>" data-store-only hidden><?= te_t('Sepet') ?> <span data-retail-count>0</span></a>
<a class="account-link" href="/hesabim/" data-account-only hidden><span class="account-icon">↗</span><span><?= te_t('Hesabım') ?><small><?= te_t('Müşteri hesabı') ?></small></span></a></div>
</div>
<nav class="nav" aria-label="<?= te_t('Ana menü') ?>"><div class="container nav-inner">
<details class="category-menu" data-category-menu hidden><summary><?= te_t('Tüm kategoriler') ?> <span aria-hidden="true">⌄</span></summary><div class="category-popover"><a class="category-all" href="/magaza/"><?= te_t('Tüm ürünler →') ?></a><div data-category-nav></div></div></details>
<?php te_public_links($page,true); ?>

</div></nav></header>
<main id="main">
<div class="container"><p class="shop-message" data-shop-message role="status" aria-live="polite" hidden></p></div>
<?php }
function te_footer(): void { ?>
</main>
<footer class="footer"><div class="container foot-main">
<div class="footer-identity"><a class="footer-logo" href="/"><img src="/assets/logo.webp" alt="Teknikel" width="220" height="63" loading="lazy"></a><p data-business-description hidden></p></div>
<div class="footer-navigation"><h3><?= te_t('Keşfedin') ?></h3><?php te_public_links('',false,true); ?><a href="/demo-icerik/"><span><?= te_t('Demo Veri Paketi') ?></span> <span aria-hidden="true">↓</span></a></div>
<div class="footer-contact" data-business-contact hidden><h3><?= te_t('İletişim') ?></h3><?php te_contact_fields(true); ?></div>
</div><div class="container footer-bottom"><span>© <?= date('Y') ?> <span data-business-name hidden></span></span></div></footer>
<script src="/assets/assistant/widget.js" data-publication-managed="true" data-api-base-url="/yardimci-asistan" data-logo-url="/assets/logo.webp" data-primary-color="#12283d" data-accent-color="#e5263c" defer></script>
</body></html>
<?php }

function te_public_page(string $page, string $title): void { te_header($page,$title); ?>
<section class="container publication-page" aria-labelledby="publication-title">
<div class="crumb"><a href="/"><?= te_t('Anasayfa') ?></a> / <?php if ($page === 'room'): ?><a href="/odalar/"><?= te_t('Odalar') ?></a> / <?php endif; ?><?= te_t($title) ?></div>
<div class="eyebrow" data-business-name hidden></div><h1 id="publication-title"><?= te_t($title) ?></h1>
<p class="status-line" data-publication-state role="status" aria-live="polite"><?= te_t('Bilgiler yükleniyor…') ?></p>
<div data-public-content hidden><?php if ($page === 'contact'): ?>
<div class="contact-layout">
<section class="contact-details" aria-label="<?= te_t('İletişim bilgileri') ?>">
<div class="contact-eyebrow"><?= te_t('Bize ulaşın') ?></div>
<h2><?= te_t('İletişim bilgileri') ?></h2>
<p class="contact-lead"><?= te_t('Ürün, sipariş ve teknik sorularınız için bize ulaşabilirsiniz.') ?></p>
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
