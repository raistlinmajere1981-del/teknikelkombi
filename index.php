<?php // teknikel-site
// Hosting adapter: canonical owns publication, language, widget and commerce.
declare(strict_types=1);
$allowed = ['page','lang','q','category','id','sku','brand','action','order','account_error','reorder','resource','token'];
foreach ($_GET as $key => $value) {
    if (!in_array($key, $allowed, true) || !is_string($value) || strlen($value) > 2048 || preg_match('/[\x00-\x1f\x7f]/', $value)) {
        http_response_code(400); exit;
    }
}
// The common account portal consumes mailbox tokens in a fragment, never storage.
if (isset($_GET['token'])) {
    $path = rtrim(preg_replace('~/index\.php$~D', '/', parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/'), '/');
    if (!(in_array($path, ['/hesabim','/bayi'], true) || ($path === '' && ($_GET['page'] ?? '') === 'account'))
        || !in_array($_GET['action'] ?? '', ['verify','reset'], true) || !preg_match('/^[A-Za-z0-9_-]{16,2048}$/D', $_GET['token'])) {
        http_response_code(400); exit;
    }
    $token = $_GET['token']; unset($_GET['token']);
    $_GET['page'] = 'account';
    header('Cache-Control: private, no-store'); header('Referrer-Policy: no-referrer');
    header('Location: /?' . http_build_query($_GET) . '#token=' . rawurlencode($token), true, 302); exit;
}
$templateRoot = __DIR__ . '/canonical';
require $templateRoot . '/public/index.php';
