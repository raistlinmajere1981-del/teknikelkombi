<?php declare(strict_types=1); namespace YaSite;
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) { http_response_code(404); exit; }
$publication = $view['publication'];
render_view('components/hero', $view, $site);
?>
<?php if (count(array_filter($view['pages'], static fn (array $page): bool => empty($page['editorial']))) === 1): $key = $view['status'] === 'ok' ? 'empty' : 'unavailable'; ?>
<section class="empty-state" role="status"><h2><?= e(t($site, 'state.' . $key . '.title')) ?></h2><p><?= e(t($site, 'state.' . $key . '.text')) ?></p></section>
<?php endif; ?>

<?php if (isset($view['pages']['catalog'])): ?>
<section class="home-section" id="catalog-preview" aria-labelledby="catalog-preview-title">
  <div class="section-heading"><div><p class="eyebrow"><?= e(t($site, 'page.catalog')) ?></p><h2 id="catalog-preview-title"><?= e(t($site, 'theme.teknikel.catalog.selection')) ?></h2></div><a class="text-link" href="<?= e(page_url($site, 'catalog')) ?>"><?= e(t($site, 'theme.teknikel.catalog.all')) ?> <span aria-hidden="true">→</span></a></div>
  <div class="collection technical-products"><?php foreach (array_slice($publication['products'], 0, 4) as $record) render_view('components/product-card', ['record' => $record, 'preview' => true], $site); ?></div>
</section>
<?php endif; ?>

<?php if (isset($view['pages']['announcements'])): $announcement = $publication['announcements'][0]; ?>
<section class="home-section announcement-strip" aria-labelledby="announcement-title"><div><p class="eyebrow"><?= e(t($site, 'page.announcements')) ?></p><h2 id="announcement-title"><?= e($announcement['title']) ?></h2><?php if (text($announcement['text'] ?? '') !== ''): ?><p><?= nl2br(e($announcement['text'])) ?></p><?php endif; ?></div><a class="text-link" href="<?= e(page_url($site, 'announcements')) ?>"><?= e(t($site, 'theme.teknikel.announcements.all')) ?> <span aria-hidden="true">→</span></a></section>
<?php endif; ?>

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
