<?php
declare(strict_types=1);

// Site-owned configuration. Public HTTP service only; never a sync secret or DB path.
return [
    'api_origin' => getenv('YA_SITE_API_ORIGIN') ?: '',
    'public_origin' => getenv('YA_SITE_PUBLIC_ORIGIN') ?: 'https://yardimciasistantoptanci.alwaysdata.net',
    'api_base_path' => '/yardimci-asistan',
    'base_path' => '',
    'favicon' => 'site/brand/favicon.svg',
    // Restrict/reorder existing pages; this cannot grant publication visibility.
    'page_order' => ['home', 'catalog', 'announcements', 'about', 'gallery', 'reviews', 'contact', 'account'],
    'hidden_pages' => [],
    // slot => filename under public/assets/site/scenes/. Empty means zero engine requests.
    'effects' => [],
];
