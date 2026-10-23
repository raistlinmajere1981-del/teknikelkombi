<?php
require_once dirname(__DIR__) . '/inc/language.php';
te_prepare_language();
// Previous catalog links remain valid, but Mağaza owns the canonical public storefront.
if (parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) === '/katalog/') {
    $query = [];
    foreach (['q','category','brand','lang'] as $key) {
        if (isset($_GET[$key]) && is_string($_GET[$key])) $query[$key] = mb_substr($_GET[$key],0,180);
    }
    header('Location: /magaza/' . ($query ? '?' . http_build_query($query) : ''), true, 302);
    exit;
}
?>
<?php require_once dirname(__DIR__).'/inc/layout.php'; te_header('store','Mağaza'); ?>
<div class="catalog-head"><div class="container"><div class="crumb"><a href="/"><?= te_t('Anasayfa') ?></a> <?= te_t('/ Katalog') ?></div><div class="catalog-headline"><div><div class="eyebrow"><?= te_t('TEKNİKEL ÜRÜNLERİ') ?></div><h1><?= te_t('Mağaza') ?></h1><p><?= te_t('Parçaları isim, stok kodu veya kategoriye göre bulun; sepetinize ekleyin.') ?></p></div><span class="counter" data-count></span></div></div></div>
<div class="container catalog-layout"><aside class="filter-side" data-store-only hidden><h2><?= te_t('Kataloğu filtrele') ?></h2><form data-catalog-filter role="search"><label for="catalog-query"><?= te_t('Ürün arama') ?></label><input id="catalog-query" name="q" type="search" maxlength="180" placeholder="<?= te_t('Ürün veya stok kodu') ?>"><label for="catalog-category"><?= te_t('Kategori') ?></label><select id="catalog-category" name="category"><option value=""><?= te_t('Tüm kategoriler') ?></option></select><label for="catalog-brand" data-brand-label hidden><?= te_t('Marka') ?></label><select id="catalog-brand" name="brand" hidden><option value=""><?= te_t('Tüm markalar') ?></option></select><button class="btn btn-red" type="submit"><?= te_t('Ürünleri göster →') ?></button></form><p class="aside-info"><?= te_t('Bu alanda perakende fiyatları gösterilir. Sipariş sırasında ödeme alınmaz; işletmenin onayı beklenir.') ?></p></aside>
<section class="catalog-main" aria-label="<?= te_t('Ürün listesi') ?>"><div class="catalog-toolbar"><span data-catalog-state role="status"><?= te_t('Katalog yükleniyor...') ?></span><button type="button" class="refresh" data-reload><?= te_t('Yenile ↻') ?></button></div><div class="product-grid" data-product-grid></div><div class="pagination" data-pagination hidden><button data-prev type="button"><?= te_t('← Önceki') ?></button><span data-page-number></span><button data-next type="button"><?= te_t('Sonraki →') ?></button></div></section></div>
<?php te_footer(); ?>
