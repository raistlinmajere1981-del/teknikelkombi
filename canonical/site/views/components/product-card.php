<?php declare(strict_types=1); namespace YaSite;
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) { http_response_code(404); exit; }
$record = $view['record'];
$price = price_text($site, $record['price'] ?? null, $record['currency'] ?? '');
$preview = !empty($view['preview']);
$productHref = page_url($site, 'catalog') . '&id=' . rawurlencode(text($record['product_id'] ?? ''));
$gallery = [];
$rawPhotos = array_merge([$record['image_url'] ?? ''], is_array($record['image_urls'] ?? null) ? $record['image_urls'] : []);
foreach ($rawPhotos as $candidate) {
    $url = media_url($candidate, $site['module_path']);
    if ($url !== '' && !in_array($url, $gallery, true)) $gallery[] = $url;
    if (count($gallery) >= 12) break;
}
$image = $gallery[0] ?? '';
?>
<article class="content-card technical-product<?= $preview ? ' is-preview' : '' ?>">
  <div class="technical-product-media teknikel-product-media teknikel-gallery" data-gallery-images="<?= e(json_html($gallery)) ?>" data-gallery-name="<?= e($record['name']) ?>">
    <a class="teknikel-gallery-image-link" href="<?= e($productHref) ?>" aria-label="<?= e($record['name']) ?>">
      <?php if ($image !== ''): ?><img src="<?= e($image) ?>" alt="<?= e($record['name']) ?>" loading="lazy" decoding="async"><?php else: ?><span class="teknikel-gallery-missing"><?= e(t($site, 'theme.teknikel.gallery.missing')) ?></span><?php endif; ?>
    </a>
    <?php if (count($gallery) > 1): ?>
    <div class="teknikel-gallery-controls" role="group" aria-label="<?= e(t($site, 'theme.teknikel.gallery.title')) ?>">
      <button type="button" data-gallery-step="-1" aria-label="<?= e(t($site, 'theme.teknikel.gallery.previous')) ?>">‹</button>
      <span class="teknikel-gallery-count" aria-live="polite">1 / <?= count($gallery) ?></span>
      <button type="button" data-gallery-step="1" aria-label="<?= e(t($site, 'theme.teknikel.gallery.next')) ?>">›</button>
    </div>
    <?php endif; ?>
  </div>
  <div class="technical-product-copy"><h3><a href="<?= e($productHref) ?>"><?= e($record['name']) ?></a></h3>
    <?php if (text($record['sku'] ?? '') !== ''): ?><p class="product-sku"><span><?= e(t($site, 'theme.teknikel.product.sku')) ?></span> <?= e($record['sku']) ?></p><?php endif; ?>
    <?php if (text($record['brand'] ?? '') !== ''): ?><span class="product-brand"><?= e($record['brand']) ?></span><?php endif; ?>
    <?php if (count($gallery) > 1): ?><a class="product-gallery-link" href="<?= e($productHref) ?>"><?= e(t($site, 'theme.teknikel.gallery.title')) ?> (<?= count($gallery) ?>)</a><?php endif; ?>
    <?php if (!$preview && text($record['description'] ?? '') !== ''): ?><p><?= nl2br(e($record['description'])) ?></p><?php endif; ?>
    <?php if ($price !== ''): ?><p class="price"><span data-format-currency="<?= e($record['price']) ?>" data-currency="<?= e($record['currency']) ?>"><?= e($price) ?></span><?php $unit = text($record['unit'] ?? ''); if (in_array($unit, ['piece','kg','g','l','ml','pack','box','meter','other'], true)): ?> / <?= e(t($site, 'store.unit.' . $unit)) ?><?php endif; ?></p><?php endif; ?>
  </div>
</article>
