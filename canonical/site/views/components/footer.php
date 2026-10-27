<?php declare(strict_types=1); namespace YaSite;
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) { http_response_code(404); exit; }
$publication = $view['publication']; ?>
<footer class="site-footer"><div class="shell footer-grid">
  <div class="footer-brand"><a href="<?= e(page_url($site, 'home')) ?>"><img class="brand-logo" src="<?= e(asset($site, 'site/brand/logo.webp')) ?>" alt="<?= e(t($site, 'theme.teknikel.brand')) ?>" width="350" height="91" loading="lazy"></a><?php if ($publication['name'] !== ''): ?><p><?= e($publication['name']) ?></p><?php endif; ?></div>
  <nav class="footer-navigation" aria-label="<?= e(t($site, 'nav.footer')) ?>"><?php render_navigation($view, $site); ?></nav>
  <?php if ($publication['contact']['available']): $contact = $publication['contact']; ?><div class="footer-contact"><?php if ($contact['tel'] !== ''): ?><a href="<?= e($contact['tel']) ?>"><?= e($contact['phone']) ?></a><?php endif; ?><?php if ($contact['email'] !== ''): ?><a href="mailto:<?= e($contact['email']) ?>"><?= e($contact['email']) ?></a><?php endif; ?><?php if ($contact['address'] !== ''): ?><p><?= nl2br(e($contact['address'])) ?></p><?php endif; ?></div><?php endif; ?>
  <?php if ($publication['name'] !== ''): ?><small class="footer-copyright">© <?= e(number_text($site, (int) date('Y'))) ?> <?= e($publication['name']) ?></small><?php endif; ?>
</div></footer>
