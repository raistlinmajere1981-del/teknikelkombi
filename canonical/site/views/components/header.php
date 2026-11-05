<?php
declare(strict_types=1);
namespace YaSite;
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) { http_response_code(404); exit; }
$publication = $view['publication'];
$accountAvailable = isset($view['pages']['account']);
?>
<header class="site-header teknikel-header">
  <div class="shell header-content">
    <a class="site-name" href="<?= e(page_url($site, 'home')) ?>" aria-label="<?= e(t($site, 'theme.teknikel.brand')) ?>">
      <img class="brand-logo" src="<?= e(asset($site, 'site/brand/logo.webp')) ?>" alt="<?= e(t($site, 'theme.teknikel.brand')) ?>" width="350" height="91">
    </a>
    <nav id="main-navigation" class="main-navigation" aria-label="<?= e(t($site, 'nav.main')) ?>">
      <?php foreach ($view['pages'] as $id => $page): if ($id === 'account') continue; ?>
      <a href="<?= e(page_url($site, $id)) ?>"<?= $view['page'] === $id ? ' aria-current="page"' : '' ?>><?= e(t($site, $page['key'])) ?></a>
      <?php endforeach; ?>
      <div class="menu-social"><?php render_view('components/social-icons', ['social' => $publication['contact']['social'], 'variant' => 'menu'], $site); ?></div>
    </nav>
    <div class="header-tools">
      <?php render_view('components/social-icons', ['social' => $publication['contact']['social'], 'variant' => 'header'], $site); ?>
      <?php if (isset($view['pages']['catalog'])): ?>
      <a class="header-cart-link" href="<?= e($view['page'] === 'catalog' ? '#cart' : page_url($site, 'catalog') . '#cart') ?>" aria-label="<?= e(t($site, 'cart.title')) ?>" title="<?= e(t($site, 'cart.title')) ?>">
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h2l2.2 11.3a2 2 0 0 0 2 1.7H19a2 2 0 0 0 2-1.6L22 8H6"/><circle cx="10" cy="21" r="1"/><circle cx="19" cy="21" r="1"/></svg>
        <span id="header-cart-count" class="header-cart-count" hidden>0</span>
      </a>
      <?php endif; ?>
      <?php if (count($site['language']['catalogs']) > 1): ?>
      <form method="get" class="language-picker" aria-label="<?= e(t($site, 'language.label')) ?>">
        <?php foreach (language_query_fields($view) as $key => $value): ?>
        <input type="hidden" name="<?= e($key) ?>" value="<?= e($value) ?>">
        <?php endforeach; ?>
        <?php foreach ($site['language']['catalogs'] as $code => $catalog):
          $label = text($catalog['_meta']['label'] ?? '') ?: strtoupper($code);
          $flag = match ($code) { 'tr' => '🇹🇷', 'en' => '🇬🇧', default => '🌐' };
          $active = $site['language']['code'] === $code;
        ?>
        <button class="flag-option<?= $active ? ' is-active' : '' ?>" type="submit" name="lang" value="<?= e($code) ?>"
          lang="<?= e($code) ?>" title="<?= e($label) ?>" aria-label="<?= e($label) ?>" aria-pressed="<?= $active ? 'true' : 'false' ?>">
          <span class="flag-pictogram" aria-hidden="true"><?= e($flag) ?></span>
          <span class="language-code" aria-hidden="true"><?= e(strtoupper($code)) ?></span>
        </button>
        <?php endforeach; ?>
      </form>
      <?php endif; ?>
      <?php if ($accountAvailable): ?>
      <a class="account-link" href="<?= e(page_url($site, 'account')) ?>"<?= $view['page'] === 'account' ? ' aria-current="page"' : '' ?>>
        <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M4.5 20c.4-4.1 3.2-6.2 7.5-6.2s7.1 2.1 7.5 6.2"/></svg>
        <span><?= e(t($site, $view['pages']['account']['key'])) ?></span>
      </a>
      <?php endif; ?>
      <button type="button" class="menu-toggle" aria-expanded="true" aria-controls="main-navigation" data-menu-toggle hidden><?= e(t($site, 'nav.close')) ?></button>
    </div>
  </div>
</header>
