<?php
// No socket, live API, database or provider: actual root renders unavailable safely.
declare(strict_types=1);
function check(bool $condition, string $message): void { if (!$condition) throw new RuntimeException($message); }
putenv('YA_SITE_API_ORIGIN=offline-test');
$_SERVER['REQUEST_URI'] = '/'; $_SERVER['REQUEST_METHOD'] = 'GET';
$_GET = ['lang' => 'en']; $_COOKIE = ['ya_site_language' => 'ar', 'teknikel_site_language' => 'en'];
ob_start(); require __DIR__ . '/../index.php'; $html = ob_get_clean();
check(str_contains($html, '<html lang="tr"'), 'Language OFF must ignore query and stale cookies');
check(!str_contains($html, 'class="language-picker"'), 'Language OFF selector');
check(str_contains($html, '/assets/core/site.mjs') && str_contains($html, '/assets/site/theme.css'), 'Actual root must load canonical asset URLs');
check(str_contains($html, '/assets/site/brand/logo.webp'), 'Teknikel brand retained');
check(str_contains($html, 'id="site-context"'), 'Actual common layout executed');
check(!str_contains($html, '/assets/assistant/') && !str_contains($html, '/assets/site.js'), 'No retired widget/runtime');
check(in_array(realpath(__DIR__.'/../canonical/public/index.php'), get_included_files(), true), 'Root actually included canonical entry');
check(!in_array(realpath(__DIR__.'/../inc/layout.php'), get_included_files(), true), 'Legacy layout inactive');
$root = __DIR__.'/../canonical';
$source = \YaSite\source_catalog($root);
check($source['id'] === 'teknikel-site' && $source['source_language'] === 'tr', 'Source identity and language');
$old = json_decode(file_get_contents(__DIR__.'/../assets/i18n/tr.json'), true, 512, JSON_THROW_ON_ERROR);
foreach ($old['entries'] as $key => $entry) check($source['entries'][$key] === $entry, 'Preserve old site source key '.$key);
check(strlen(json_encode($source)) < 512*1024, 'Desktop discovery size limit');
$business = ['ok'=>true,'business'=>['display_name'=>'TEST','public_surfaces'=>['store','rooms','restaurant','qr_menu'], 'requests_enabled'=>true,'request_types'=>['general_info'],'ai_enabled'=>false,'about_text'=>'TEST About','phone'=>'+905550000000','google_reviews_enabled'=>true,'gallery'=>[['id'=>'g1','url'=>'https://example.test/photo.webp']]]];
$sources = [];
foreach ([
 'catalog'=>['enabled'=>true,'products'=>[['product_id'=>'p1','name'=>'TEST Product']],'delivery_methods'=>['pickup']],
 'rooms'=>['enabled'=>true,'rooms'=>[['id'=>'r1','name'=>'TEST Room']]],
 'tables'=>['enabled'=>true,'tables'=>[['id'=>'t1','name'=>'TEST Table']]],
 'menu'=>['ok'=>true,'categories'=>[['id'=>'c1','name'=>'TEST Category']],'items'=>[['id'=>'m1','name'=>'TEST Meal','category_id'=>'c1']]],
 'marketing'=>['publications'=>[['id'=>'a1','title'=>'TEST Announcement','published'=>true,'channel'=>'website']]],
 'google-reviews'=>['available'=>true,'reviews'=>[['author'=>'TEST','text'=>'TEST review']]],
 'account/config'=>['enabled'=>true]
] as $key=>$data) $sources[$key]=['status'=>'ok','data'=>$data];
$config = require $root.'/site/config.php';
$pub = \YaSite\project_publication($business,$sources,'/yardimci-asistan','tr');
$pages = \YaSite\available_pages($pub,$config,$root);
foreach (['home','catalog','account','rooms','restaurant','menu','about','contact','gallery','announcements','reviews','demo-content'] as $page) check(isset($pages[$page]), 'Published page available: '.$page);
check($pub['features']['requests'] && !$pub['features']['chat'], 'AI OFF request remains available');
$_GET=['id'=>'p1']; $site['language']=\YaSite\language_context($root,[]);
ob_start(); \YaSite\render_view('pages/catalog',['publication'=>$pub,'title'=>'TEST'],$site); $catalog=ob_get_clean();
check(str_contains($catalog,'data-ya-action="request.general"') && str_contains($catalog,'data-ya-resource-id="p1"'), 'Product uses common request with public ID');
// Render every available page, using the same core resolver and real skin.
set_error_handler(static function (int $level, string $message): never { throw new RuntimeException($message); });
foreach (array_keys($pages) as $page) {
    $renderView = ['publication'=>$pub, 'pages'=>$pages, 'page'=>$page, 'title'=>'TEST '.$page,
        'status'=>'ok', 'room'=>null, 'table'=>null, 'menu_category'=>'',
        'menu_categories'=>$pub['categories'], 'effects'=>[], 'canonical'=>'', 'demo_widget_visible'=>false];
    ob_start(); \YaSite\render_view('pages/'.$page, $renderView, $site); $pageHtml=ob_get_clean();
    check(trim($pageHtml) !== '', 'Available page renders: '.$page);
    if (in_array($page, ['catalog','account'], true)) {
        ob_start(); \YaSite\render_view('layout', $renderView, $site); $full=ob_get_clean();
        check(substr_count($full, 'src="/assets/core/widget.js"') === 1, 'Exactly one common widget on '.$page);
        check(!str_contains($full, '/assets/assistant/'), 'No custom request runtime on '.$page);
        check(str_contains($full, $page === 'catalog' ? '/assets/core/storefront.js' : '/assets/core/portal.js'), 'Correct shared interaction on '.$page);
        preg_match_all('~(?:src|href)="(/assets/[^"?]+)"~', $full, $assets);
        foreach ($assets[1] as $asset) check(is_file(__DIR__.'/..'.$asset), 'Loaded root asset exists: '.$asset);
    }

}
restore_error_handler();
$business['business']['public_surfaces']=[];
$closed=\YaSite\available_pages(\YaSite\project_publication($business,$sources,'/yardimci-asistan','tr'),$config,$root);
foreach (['catalog','rooms','restaurant','menu'] as $page) check(!isset($closed[$page]), 'Surface OFF gate: '.$page);
$empty=\YaSite\available_pages(\YaSite\project_publication([],[],'/yardimci-asistan','tr'),$config,$root);
check(array_keys($empty)===['home','demo-content'], 'Unavailable publication leaves only home and site editorial demo');
echo "canonical-entry-php-ok: actual root, assets, source, language OFF, 12 page renders/gates, AI OFF product hook\n";
