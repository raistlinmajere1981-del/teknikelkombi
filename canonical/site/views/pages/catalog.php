<?php declare(strict_types=1); namespace YaSite;
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) { http_response_code(404); exit; }
// Detail layout is selected before paint, not hidden after the catalog renders.
$id = is_string($_GET['id'] ?? null) ? $_GET['id'] : '';
?>
  <div class="ya-storefront teknikel-catalog<?= $id !== '' ? ' is-detail' : '' ?>">
    <a class="skip-link" href="#products"><?= e(t($site, 'nav.skip')) ?></a>
    <header class="store-header">
      <div>
        <h1><?= e($view['title']) ?></h1><p id="catalog-account" hidden></p>
      </div>
    </header>

    <div id="store-layout" class="store-layout">
      <aside id="catalog-filter-rail" class="catalog-filter-rail" aria-label="<?= e(t($site, 'catalog.filters')) ?>">
        <div class="rail-heading">
          <strong><?= e(t($site, 'catalog.filters')) ?></strong>
          <button id="catalog-reset" type="button" class="quiet"><?= e(t($site, 'catalog.reset_view')) ?></button>
        </div>
        <form class="catalog-filters" id="catalog-filters" role="search">
          <label for="catalog-search"><span class="sr-only"><?= e(t($site, 'catalog.search')) ?></span><input id="catalog-search" type="search" maxlength="180" autocomplete="off" placeholder="<?= e(t($site, 'catalog.search')) ?>"></label>
          <section class="category-picker" id="catalog-category-field" aria-label="<?= e(t($site, 'catalog.category')) ?>">
            <div class="filter-group-heading">
              <span><?= e(t($site, 'catalog.category')) ?></span>
              <span id="category-selected-count" class="filter-count" hidden>0</span>
              <button id="category-clear" class="filter-clear" type="button" hidden aria-label="<?= e(t($site, 'catalog.reset')) ?>">×</button>
            </div>
            <input id="catalog-category" type="hidden" value="">
            <label for="category-query" class="sr-only"><?= e(t($site, 'catalog.category')) ?></label>
            <input id="category-query" type="search" autocomplete="off" maxlength="100" aria-controls="category-options" placeholder="<?= e(t($site, 'catalog.search_short')) ?>" aria-label="<?= e(t($site, 'catalog.category')) ?>">
            <div id="category-options" class="category-options" role="group" aria-label="<?= e(t($site, 'catalog.category')) ?>"></div>
          </section>
          <section id="catalog-brand-field" class="brand-picker" aria-label="<?= e(t($site, 'catalog.brand')) ?>" hidden>
            <div class="filter-group-heading"><span><?= e(t($site, 'catalog.brand')) ?></span></div>
            <input id="catalog-brand" type="hidden" value="">
            <div id="brand-options" class="brand-options" role="group" aria-label="<?= e(t($site, 'catalog.brand')) ?>"></div>
          </section>
          <label for="catalog-sku"><span class="sr-only"><?= e(t($site, 'catalog.sku')) ?></span><input id="catalog-sku" type="search" maxlength="80" autocomplete="off" placeholder="<?= e(t($site, 'catalog.sku')) ?>"></label>
          <label for="favorites-only" class="favorites-filter"><input id="favorites-only" type="checkbox"> <?= e(t($site, 'catalog.favorites_only')) ?></label>
        </form>
      </aside>
      <section aria-label="<?= e(t($site, 'page.catalog')) ?>" id="products" tabindex="-1">
        <div class="catalog-results-bar" role="toolbar" aria-label="<?= e(t($site, 'theme.teknikel.list.toolbar')) ?>">
          <button id="filter-panel-toggle" type="button" class="button secondary mobile-rail-toggle" aria-expanded="false" aria-controls="catalog-filter-rail"><?= e(t($site, 'catalog.category')) ?></button>
          <div class="catalog-results-summary">
            <p id="catalog-count" role="status" aria-live="polite"></p>
            <button id="refresh" class="catalog-icon-button" type="button" title="<?= e(t($site, 'account.refresh_products')) ?>" aria-label="<?= e(t($site, 'account.refresh_products')) ?>" aria-controls="product-grid">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11a8 8 0 0 0-14-5l-2 2"/><path d="M4 3v5h5"/><path d="M4 13a8 8 0 0 0 14 5l2-2"/><path d="M20 21v-5h-5"/></svg>
            </button>
          </div>
          <div class="catalog-result-actions">
            <label class="catalog-toolbar-select" for="catalog-sort">
              <span><?= e(t($site, 'theme.teknikel.list.sort')) ?></span>
              <select id="catalog-sort" aria-controls="product-grid">
                <option value="published"><?= e(t($site, 'theme.teknikel.list.published')) ?></option>
                <option value="name-asc"><?= e(t($site, 'theme.teknikel.list.name_asc')) ?></option>
                <option value="name-desc"><?= e(t($site, 'theme.teknikel.list.name_desc')) ?></option>
                <option value="price-asc"><?= e(t($site, 'theme.teknikel.list.price_asc')) ?></option>
                <option value="price-desc"><?= e(t($site, 'theme.teknikel.list.price_desc')) ?></option>
              </select>
            </label>
            <label class="catalog-toolbar-select catalog-page-size" for="catalog-page-size">
              <span><?= e(t($site, 'theme.teknikel.list.per_page')) ?></span>
              <select id="catalog-page-size" aria-controls="product-grid">
                <option value="18">18</option><option value="36">36</option><option value="54">54</option>
              </select>
            </label>
            <div class="catalog-view-switch" role="group" aria-label="<?= e(t($site, 'theme.teknikel.list.view')) ?>">
              <button id="catalog-view-grid" type="button" aria-pressed="true" aria-controls="product-grid" title="<?= e(t($site, 'theme.teknikel.list.grid')) ?>" aria-label="<?= e(t($site, 'theme.teknikel.list.grid')) ?>">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
              </button>
              <button id="catalog-view-list" type="button" aria-pressed="false" aria-controls="product-grid" title="<?= e(t($site, 'theme.teknikel.list.list')) ?>" aria-label="<?= e(t($site, 'theme.teknikel.list.list')) ?>">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M9 5h12M9 12h12M9 19h12"/><rect x="3" y="3" width="3" height="4" rx=".5"/><rect x="3" y="10" width="3" height="4" rx=".5"/><rect x="3" y="17" width="3" height="4" rx=".5"/></svg>
              </button>
            </div>
            <button id="compare-open" class="button secondary" type="button" disabled><?= e(t($site, 'catalog.compare')) ?></button>
          </div>
        </div>
        <div id="catalog-state" class="state" role="status" aria-live="polite"></div>

        <section id="product-detail" class="content-card" hidden tabindex="-1" aria-labelledby="product-detail-title"></section>
        <div id="detail-request-hook" hidden>
<?php if (!empty($view['publication']['features']['requests'])
    && in_array('general_info', $view['publication']['info']['request_types'] ?? [], true)):
    foreach ($view['publication']['products'] as $product):
        if ($id === '' || $product['product_id'] !== $id) continue;
?>
<button type="button" class="button secondary" data-ya-action="request.general"
    data-ya-resource-type="product" data-ya-resource-id="<?= e($product['product_id']) ?>"
    data-ya-resource-name="<?= e($product['name']) ?>" data-theme-widget-trigger hidden><?= e(t($site, 'theme.teknikel.product.request')) ?></button>
<?php endforeach; endif;
?>

        </div>

        <section id="comparison-panel" class="content-card" hidden tabindex="-1" aria-labelledby="comparison-title"></section>
        <!-- Product cards have one owner: Teknikel catalog.js. Avoid a transient
             server-rendered legacy card grid before the current catalog loads. -->
        <div id="product-grid" class="product-grid" aria-busy="true"></div>
        <nav id="catalog-pagination" class="section-heading" aria-label="<?= e(t($site, 'catalog.pagination')) ?>" hidden>
          <button id="catalog-prev" class="quiet" type="button" aria-controls="product-grid"><?= e(t($site, 'catalog.previous')) ?></button>
          <p id="catalog-page-status" role="status" aria-live="polite"></p>
          <button id="catalog-next" class="quiet" type="button" aria-controls="product-grid"><?= e(t($site, 'catalog.next')) ?></button>
        </nav>
      </section>

    </div>
    <noscript><p class="state"><?= e(t($site, 'account.noscript')) ?></p></noscript>
  </div>


<!-- Teknikel-owned renderer, loaded before the canonical catalog runtime. -->
<link rel="stylesheet" href="<?= e(asset($site, 'site/image-inspector/inspector.css')) ?>">
<script src="<?= e(asset($site, 'site/image-inspector/core.js')) ?>" defer></script>
<script src="<?= e(asset($site, 'site/image-inspector/inspector.js')) ?>" defer></script>
<script src="<?= e(asset($site, 'site/product-card.js')) ?>" defer></script>
