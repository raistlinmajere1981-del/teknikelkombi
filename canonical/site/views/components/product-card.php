<?php declare(strict_types=1); namespace YaSite;
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) { http_response_code(404); exit; }
$record = $view['record']; $image = media_url($record['image_url'] ?? '', $site['module_path']);
$price = price_text($site, $record['price'] ?? null, $record['currency'] ?? '');
$preview = !empty($view['preview']);
?>
<article class="content-card technical-product<?= $preview ? ' is-preview' : '' ?>">
  <?php if ($image !== ''): ?><div class="technical-product-media"><img src="<?= e($image) ?>" alt="<?= e($record['name']) ?>" loading="lazy" decoding="async"></div><?php endif; ?>
  <div class="technical-product-copy"><h3><a href="<?= e(page_url($site, 'catalog') . '&id=' . rawurlencode(text($record['product_id'] ?? ''))) ?>"><?= e($record['name']) ?></a></h3>
    <?php if (text($record['sku'] ?? '') !== ''): ?><p class="product-sku"><span><?= e(t($site, 'theme.teknikel.product.sku')) ?></span> <?= e($record['sku']) ?></p><?php endif; ?>
    <?php if (!$preview && text($record['description'] ?? '') !== ''): ?><p><?= nl2br(e($record['description'])) ?></p><?php endif; ?>
    <?php if ($price !== ''): ?><p class="price" data-format-currency="<?= e($record['price']) ?>" data-currency="<?= e($record['currency']) ?>"><?= e($price) ?></p><?php endif; ?>
  </div>
</article>
