<?php // teknikel-site: fixed editorial alias, no second runtime.
declare(strict_types=1);
$parameters = ['page' => 'demo-content'];
if (isset($_GET['lang'])) {
    if (!is_string($_GET['lang']) || !preg_match('/^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/D', $_GET['lang'])) { http_response_code(400); exit; }
    $parameters['lang'] = $_GET['lang'];
}
header('Location: /?' . http_build_query($parameters), true, 302);
