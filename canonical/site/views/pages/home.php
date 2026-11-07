<?php declare(strict_types=1); namespace YaSite;
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) { http_response_code(404); exit; }
$publication = $view['publication'];
render_view('components/hero', $view, $site);
?>
<?php if (count(array_filter($view['pages'], static fn (array $page): bool => empty($page['editorial']))) === 1): $key = $view['status'] === 'ok' ? 'empty' : 'unavailable'; ?>
<section class="empty-state" role="status"><h2><?= e(t($site, 'state.' . $key . '.title')) ?></h2><p><?= e(t($site, 'state.' . $key . '.text')) ?></p></section>
<?php endif; ?>

<?php if (isset($view['pages']['catalog'])): ?>
<section class="home-section ya-storefront" id="catalog-preview" aria-labelledby="catalog-preview-title">
  <div class="section-heading"><div><p class="eyebrow"><?= e(t($site, 'page.catalog')) ?></p><h2 id="catalog-preview-title"><?= e(t($site, 'theme.teknikel.catalog.selection')) ?></h2></div><a class="text-link" href="<?= e(page_url($site, 'catalog')) ?>"><?= e(t($site, 'theme.teknikel.catalog.all')) ?> <span aria-hidden="true">→</span></a></div>
  <div class="teknikel-home-commerce">
    <div id="home-product-grid" class="product-grid teknikel-home-products" aria-busy="true" aria-live="polite"></div>
    <div id="home-product-actions" class="teknikel-home-actions" hidden>
      <span id="home-product-status" role="status" aria-live="polite"></span>
      <button id="home-compare-open" type="button" class="button secondary" disabled><?= e(t($site, 'catalog.compare')) ?></button>
    </div>
    <aside id="home-cart" class="teknikel-home-cart" aria-labelledby="home-cart-title">
      <div class="teknikel-home-cart-heading">
        <h3 id="home-cart-title"><?= e(t($site, 'cart.title')) ?> <span id="home-cart-count">0</span></h3>
        <a class="text-link" href="<?= e(page_url($site, 'catalog')) ?>#cart"><?= e(t($site, 'cart.title')) ?> →</a>
      </div>
      <p id="home-cart-message" role="status" aria-live="polite"></p>
      <ul id="home-cart-items" class="teknikel-home-cart-items"></ul>
      <div id="home-cart-totals" class="teknikel-home-cart-totals"></div>
    </aside>
  </div>
  <noscript><p class="state"><?= e(t($site, 'account.noscript')) ?> <a href="<?= e(page_url($site, 'catalog')) ?>"><?= e(t($site, 'page.catalog')) ?></a></p></noscript>
</section>
<?php endif; ?>

<?php if (isset($view['pages']['announcements'])) render_view('components/home-announcement-slider', $view, $site); ?>

<?php if (isset($view['pages']['about'])): ?>
<section class="home-section about-preview" aria-labelledby="about-title"><div><p class="eyebrow"><?= e(t($site, 'page.about')) ?></p><h2 id="about-title"><?= e(t($site, 'theme.teknikel.about.title')) ?></h2></div><div><?php if ($publication['about'] !== ''): ?><p><?= nl2br(e($publication['about'])) ?></p><?php endif; ?><a class="text-link" href="<?= e(page_url($site, 'about')) ?>"><?= e(t($site, 'theme.teknikel.about.more')) ?> <span aria-hidden="true">→</span></a></div></section>
<?php endif; ?>

<?php if (!empty($publication['features']['dealer_application'])): ?>
<section class="home-section dealer-callout" aria-labelledby="dealer-title"><div><p class="eyebrow"><?= e(t($site, 'dealer.application.title')) ?></p><h2 id="dealer-title"><?= e(t($site, 'theme.teknikel.dealer.title')) ?></h2><p><?= e(t($site, 'theme.teknikel.dealer.text')) ?></p></div><button class="button" type="button" data-ya-action="home" data-theme-widget-trigger hidden><?= e(t($site, 'theme.teknikel.dealer.open')) ?></button></section>
<?php endif; ?>

<?php if (isset($view['pages']['reviews'])): ?>
<section class="home-section" aria-labelledby="reviews-title"><div class="section-heading"><h2 id="reviews-title"><?= e(t($site, 'page.reviews')) ?></h2><a class="text-link" href="<?= e(page_url($site, 'reviews')) ?>"><?= e(t($site, 'theme.teknikel.reviews.all')) ?></a></div><div class="collection">
  <?php foreach (array_slice($publication['reviews'], 0, 3) as $review): ?><figure class="content-card review-card"><blockquote><?= nl2br(e(text($review['text'] ?? ''))) ?></blockquote><figcaption><?= e(text($review['author'] ?? '') ?: t($site, 'content.review.author')) ?></figcaption></figure><?php endforeach; ?>
</div></section>
<?php endif; ?>

<?php $discover = array_intersect_key($view['pages'], array_flip(['rooms', 'restaurant', 'menu', 'gallery'])); if ($discover !== []): ?>
<section class="home-section" aria-labelledby="discover-title"><h2 id="discover-title"><?= e(t($site, 'theme.teknikel.discover')) ?></h2><div class="page-grid"><?php foreach ($discover as $id => $page): ?><a class="page-link" href="<?= e(page_url($site, $id)) ?>"><?= e(t($site, $page['key'])) ?> <span aria-hidden="true">↗</span></a><?php endforeach; ?></div></section>
<?php endif; ?>

<?php if (isset($view['pages']['contact'])): $contact = $publication['contact']; ?>
<section class="home-section contact-preview" aria-labelledby="contact-title"><h2 id="contact-title"><?= e(t($site, 'page.contact')) ?></h2><div><?php if ($contact['tel'] !== ''): ?><a href="<?= e($contact['tel']) ?>"><?= e($contact['phone']) ?></a><?php endif; ?><?php if ($contact['address'] !== ''): ?><p><?= nl2br(e($contact['address'])) ?></p><?php endif; ?><a class="text-link" href="<?= e(page_url($site, 'contact')) ?>"><?= e(t($site, 'theme.teknikel.contact.more')) ?> <span aria-hidden="true">→</span></a></div></section>
<?php endif; ?>


<?php if (isset($view['pages']['catalog'])): ?>
<!-- Only the site view opts into the shared headless commerce controller. -->
<script src="<?= e(asset($site, 'core/commerce.js')) ?>" defer></script>
<link rel="stylesheet" href="<?= e(asset($site, 'site/image-inspector/inspector.css')) ?>">
<script src="<?= e(asset($site, 'site/image-inspector/core.js')) ?>" defer></script>
<script src="<?= e(asset($site, 'site/image-inspector/inspector.js')) ?>" defer></script>
<script src="<?= e(asset($site, 'site/product-card.js')) ?>" defer></script>
<script src="<?= e(asset($site, 'site/home-catalog.js')) ?>" data-api-base="<?= e($site['module_path']) ?>/api/" defer></script>
<?php endif; ?>
