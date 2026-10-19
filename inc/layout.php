<?php
declare(strict_types=1);
header('Cache-Control: private, no-store');
header('X-Content-Type-Options: nosniff');
function te(string $s): string { return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function te_header(string $page, string $title): void { ?>
<!doctype html>
<html lang="tr"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#12283d">
<meta name="description" content="Teknikel kombi yedek parça ve kart tamiri. Parçaları hızlıca bulun, ürün koduyla arayın ve bayi işlemlerine ulaşın.">
<title><?= te($title) ?> | Teknikel</title>
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/assets/site.css">
<script src="/assets/site.js" defer></script>
</head><body data-page="<?= te($page) ?>">
<a class="skip" href="#main">İçeriğe geç</a>
<div class="topline"><div class="container top-inner"><span>TEKNİK PARÇADA DOĞRU ADRES</span><div><a href="tel:02164624098">0216 462 40 98</a><span class="top-sep">·</span><a href="/#iletisim">İletişim</a></div></div></div>
<header class="header"><div class="container header-main">
<a class="brand" href="/" aria-label="Teknikel Ana Sayfa"><img src="/assets/logo.webp" alt="TEKNİKEL — Kombi Yedek Parça ve Kart Tamiri" width="250" height="72"></a>
<form class="header-search" action="/katalog/" method="get" role="search"><label class="sr-only" for="global-search">Ürün veya stok kodu ara</label><input id="global-search" name="q" type="search" placeholder="Ürün adı, stok kodu veya model ara..." maxlength="180"><button type="submit" aria-label="Ara"><svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10.7" cy="10.7" r="6.7"/><path d="m16 16 5 5"/></svg></button></form>
<a class="account-link" href="/bayi/"><span class="account-icon">↗</span><span>Bayi Girişi<small>Kurumsal müşteriler</small></span></a>
</div>
<nav class="nav" aria-label="Ana menü"><div class="container nav-inner">
<a class="<?= $page === 'catalog' ? 'active' : '' ?>" href="/katalog/">Tüm Ürünler</a>
<a href="/katalog/?q=Elektronik+Kart">Elektronik Kartlar</a>
<a href="/katalog/?q=Pompa">Pompalar</a>
<a href="/katalog/?q=Gaz+Valfi">Gaz Valfleri</a>
<a href="/katalog/?q=Eşanjör">Eşanjörler</a>
<a class="nav-dealer" href="/bayi/">Bayi Sipariş Sistemi <span>↗</span></a>
</div></nav></header>
<main id="main">
<?php }
function te_footer(): void { ?>
</main>
<footer class="footer" id="iletisim"><div class="container foot-main">
<div><div class="footer-brand">TEKNİKEL</div><p>Kombi yedek parçaları ve elektronik kart tamiri için uzman çözüm ortağınız.</p></div>
<div><h3>Keşfedin</h3><a href="/katalog/">Ürün Kataloğu</a><a href="/bayi/">Bayi İşlemleri</a></div>
<div><h3>İletişim</h3><a href="tel:02164624098">0216 462 40 98</a><a href="https://www.teknikelkombiyedekparca.com.tr/" rel="noopener">Mevcut satış sitesi ↗</a></div>
</div><div class="container footer-bottom">© <?= date('Y') ?> Teknikel <span>Yeni web sitesi — önizleme sürümü</span></div></footer>
</body></html>
<?php }