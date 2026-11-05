<?php declare(strict_types=1); namespace YaSite;
// Presentation hook only. Public IDs and request availability come from core.
$id = is_string($_GET['id'] ?? null) ? $_GET['id'] : '';
if (!empty($view['publication']['features']['requests'])
    && in_array('general_info', $view['publication']['info']['request_types'] ?? [], true)):
    foreach ($view['publication']['products'] as $product):
        if ($id === '' || $product['product_id'] !== $id) continue;
?>
<p><button type="button" class="button secondary" data-ya-action="request.general"
    data-ya-resource-type="product" data-ya-resource-id="<?= e($product['product_id']) ?>"
    data-ya-resource-name="<?= e($product['name']) ?>" data-theme-widget-trigger hidden><?= e(t($site, 'theme.teknikel.product.request')) ?></button></p>
<?php endforeach; endif;
require $site['root'] . '/core/views/pages/catalog.php';
