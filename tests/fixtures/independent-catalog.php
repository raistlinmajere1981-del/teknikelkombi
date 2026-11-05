<?php declare(strict_types=1); namespace YaSite;
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) { http_response_code(404); exit; }
?>
<h1>TEST unrelated table catalog</h1>
<table data-independent-catalog><tbody></tbody></table>
<p data-independent-cart role="status"></p>
<p data-independent-message role="alert"></p>
<button type="button" data-independent-order>TEST order</button>
