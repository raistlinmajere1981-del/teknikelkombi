<?php
declare(strict_types=1);
namespace YaSite;
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) { http_response_code(404); exit; }
$publication = $view['publication'];
$contact = $publication['contact'];
?>
<footer class="site-footer teknikel-footer">
  <div class="shell footer-grid">
    <div class="footer-brand">
      <a class="footer-logo" href="<?= e(page_url($site, 'home')) ?>" aria-label="<?= e(t($site, 'theme.teknikel.brand')) ?>">
        <img class="brand-logo" src="<?= e(asset($site, 'site/brand/logo.webp')) ?>" alt="<?= e(t($site, 'theme.teknikel.brand')) ?>" width="350" height="91" loading="lazy">
      </a>
      <?php if ($publication['name'] !== ''): ?><p><?= e($publication['name']) ?></p><?php endif; ?>
    </div>
    <nav class="footer-navigation" aria-label="<?= e(t($site, 'nav.footer')) ?>">
      <?php foreach ($view['pages'] as $id => $page): if ($id === 'account' || !empty($page['internal'])) continue; ?>
      <a href="<?= e(page_url($site, $id)) ?>"<?= $view['page'] === $id ? ' aria-current="page"' : '' ?>><?= e(t($site, $page['key'])) ?></a>
      <?php endforeach; ?>
    </nav>
    <?php if ($contact['available']): ?>
    <div class="footer-contact">
      <?php if ($contact['tel'] !== ''): ?><a href="<?= e($contact['tel']) ?>"><?= e($contact['phone']) ?></a><?php endif; ?>
      <?php if ($contact['email'] !== ''): ?><a href="mailto:<?= e($contact['email']) ?>"><?= e($contact['email']) ?></a><?php endif; ?>
      <?php if ($contact['address'] !== ''): ?><p><?= nl2br(e($contact['address'])) ?></p><?php endif; ?>
    </div>
    <?php endif; ?>
    <div class="footer-extras">
      <?php if (isset($view['pages']['account'])): ?>
      <a class="footer-account-link" href="<?= e(page_url($site, 'account')) ?>"<?= $view['page'] === 'account' ? ' aria-current="page"' : '' ?>>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M4.5 20c.4-4.1 3.2-6.2 7.5-6.2s7.1 2.1 7.5 6.2"/></svg><?= e(t($site, $view['pages']['account']['key'])) ?>
      </a>
      <?php endif; ?>
      <?php if ($contact['social'] !== []): ?>
        <span class="footer-social-label"><?= e(t($site, 'contact.social')) ?></span>
        <?php render_view('components/social-icons', ['social' => $contact['social'], 'variant' => 'footer'], $site); ?>
      <?php endif; ?>
    </div>
    <?php if ($publication['name'] !== ''): ?>
    <small class="footer-copyright">© <?= e(number_text($site, (int) date('Y'))) ?> <?= e($publication['name']) ?></small>
    <?php endif; ?>
  </div>
</footer>
