<?php declare(strict_types=1); namespace YaSite;
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) { http_response_code(404); exit; }
$publication = $view['publication']; $images = [];
// Only already gated, public records supply hero media. No local product fallback.
if (isset($view['pages']['catalog'])) {
    foreach ($publication['products'] as $record) {
        $url = media_url($record['image_url'] ?? '', $site['module_path']);
        if ($url !== '' && !isset($images[$url])) $images[$url] = ['url' => $url, 'title' => $record['name'], 'product' => true];
        if (count($images) === 2) break;
    }
}
if ($images === [] && isset($view['pages']['gallery'])) {
    foreach (array_slice($publication['gallery'], 0, 2) as $image) $images[$image['url']] = $image + ['product' => false];
}
$generalRequest = !empty($publication['features']['requests']) && in_array('general_info', $publication['info']['request_types'] ?? [], true);
?>
<section class="hero teknikel-hero<?= $images !== [] ? ' has-media' : '' ?>">
  <div class="hero-copy">
    <?php if ($publication['name'] !== ''): ?><p class="eyebrow"><?= e($publication['name']) ?></p><?php endif; ?>
    <h1><?= e(t($site, 'theme.teknikel.hero.title')) ?></h1>
    <?php if ($publication['description'] !== ''): ?><p class="lede"><?= nl2br(e($publication['description'])) ?></p><?php endif; ?>
    <div class="hero-actions">
      <?php if (isset($view['pages']['catalog'])): ?><a class="button" href="<?= e(page_url($site, 'catalog')) ?>"><?= e(t($site, 'theme.teknikel.hero.catalog')) ?><span aria-hidden="true">↗</span></a><?php endif; ?>
      <?php if ($generalRequest): ?><button class="button secondary" type="button" data-ya-action="request.general" data-theme-widget-trigger hidden><?= e(t($site, 'theme.teknikel.hero.request')) ?></button>
      <?php elseif (isset($view['pages']['contact'])): ?><a class="button secondary" href="<?= e(page_url($site, 'contact')) ?>"><?= e(t($site, 'page.contact')) ?></a><?php endif; ?>
    </div>
  </div>
  <?php if ($images !== []): ?>
  <div class="hero-media">
    <?php foreach (array_values($images) as $index => $image): ?>
    <figure class="hero-visual<?= $image['product'] ? ' is-product' : '' ?>">
      <img src="<?= e($image['url']) ?>" alt="<?= e($image['title']) ?>" decoding="async"<?= $index === 0 ? ' fetchpriority="high"' : ' loading="lazy"' ?>>
      <?php if ($image['title'] !== ''): ?><figcaption><?= e($image['title']) ?></figcaption><?php endif; ?>
    </figure>
    <?php endforeach; ?>
  </div>
  <?php endif; ?>
</section>
