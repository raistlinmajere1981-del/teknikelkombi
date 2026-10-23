<?php
declare(strict_types=1);
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
<a href="<?= te($href) ?>" <?= $gate ?> <?= ($page === $current || ($page === 'room' && $id === 'rooms')) ? 'aria-current="page"' : '' ?> hidden><?= te($label) ?></a>
<?php }
}
function te_contact_fields(): void { ?>
<a data-business-phone hidden aria-label="İşletmeyi ara"></a><a data-business-email hidden aria-label="İşletmeye e-posta gönder"></a><p data-business-address hidden></p>
<a data-business-whatsapp hidden rel="noopener noreferrer">WhatsApp ↗</a><a data-business-directions hidden rel="noopener noreferrer">Yol tarifi ↗</a><a data-business-website hidden rel="noopener noreferrer">Web sitesi ↗</a><div data-business-socials hidden aria-label="Sosyal medya"></div>
<?php }
function te_header(string $page, string $title): void { ?>
<!doctype html>
<html lang="tr"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#12283d">
<meta name="description" content="Teknikel kombi yedek parça ve kart tamiri. Parçaları hızlıca bulun, ürün koduyla arayın ve bayi işlemlerine ulaşın.">
<title><?= te($title) ?> | Teknikel</title>
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/assets/site.css">
<?php if (in_array($page, ['home','announcements'], true)): ?><link rel="stylesheet" href="/assets/marketing.css"><?php endif; ?>
<script src="/assets/site.js" type="module"></script>
</head><body data-page="<?= te($page) ?>">
<a class="skip" href="#main">İçeriğe geç</a>
<div class="topline"><div class="container top-inner"><span>TEKNİK PARÇADA DOĞRU ADRES</span><div class="top-contact"><a data-business-phone hidden aria-label="İşletmeyi ara"></a><a href="/iletisim/" data-contact-link hidden>İletişim</a></div></div></div>
<header class="header"><div class="container header-main">
<a class="brand" href="/" aria-label="Teknikel Ana Sayfa"><img src="/assets/logo.webp" alt="TEKNİKEL — Kombi Yedek Parça ve Kart Tamiri" width="250" height="72"></a>
<form class="header-search" action="/katalog/" method="get" role="search" data-store-only hidden><label class="sr-only" for="global-search">Ürün veya stok kodu ara</label><input id="global-search" name="q" type="search" placeholder="Ürün adı, stok kodu veya model ara..." maxlength="180"><button type="submit" aria-label="Ara"><svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10.7" cy="10.7" r="6.7"/><path d="m16 16 5 5"/></svg></button></form>
<div class="header-actions"><a class="basket-link" href="/sepet/" aria-label="Perakende sepeti" data-store-only hidden>Sepet <span data-retail-count>0</span></a>
<a class="account-link" href="/bayi/"><span class="account-icon">↗</span><span>Bayi Girişi<small>Kurumsal müşteriler</small></span></a></div>
</div>
<nav class="nav" aria-label="Ana menü"><div class="container nav-inner">
<a class="<?= $page === 'catalog' ? 'active' : '' ?>" href="/katalog/" data-store-only hidden>Tüm Ürünler</a>
<div class="nav-categories" data-category-nav hidden></div>
<?php te_public_links($page); ?>
<a class="nav-dealer" href="/bayi/">Bayi Sipariş Sistemi <span>↗</span></a>
</div></nav></header>
<main id="main">
<div class="container"><p class="shop-message" data-shop-message role="status" aria-live="polite" hidden></p></div>
<?php }
function te_footer(): void { ?>
</main>
<footer class="footer"><div class="container foot-main">
<div><div class="footer-brand">TEKNİKEL</div><p data-business-name hidden></p><p>Kombi yedek parçaları ve elektronik kart tamiri için uzman çözüm ortağınız.</p></div>
<div><h3>Keşfedin</h3><a href="/katalog/" data-store-only hidden>Ürün Kataloğu</a><?php te_public_links(); ?><a href="/bayi/">Bayi İşlemleri</a></div>
<div id="iletisim" data-business-contact hidden><h3>İletişim</h3><?php te_contact_fields(); ?></div>
</div><div class="container footer-bottom">© <?= date('Y') ?> Teknikel <span>Yeni web sitesi — önizleme sürümü</span></div></footer>
</body></html>
<?php }

function te_public_page(string $page, string $title): void { te_header($page,$title); ?>
<section class="container publication-page" aria-labelledby="publication-title">
<div class="crumb"><a href="/">Anasayfa</a> / <?php if ($page === 'room'): ?><a href="/odalar/">Odalar</a> / <?php endif; ?><?= te($title) ?></div>
<div class="eyebrow">TEKNİKEL</div><h1 id="publication-title"><?= te($title) ?></h1>
<p class="status-line" data-publication-state role="status" aria-live="polite">Bilgiler yükleniyor…</p>
<div data-public-content hidden><?php if ($page === 'contact'): ?><div class="public-contact" aria-label="İşletme iletişim bilgileri"><?php te_contact_fields(); ?></div><?php endif; ?></div>
</section>
<?php te_footer(); } ?>
