<?php
declare(strict_types=1);
namespace YaSite;
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) { http_response_code(404); exit; }
$links = is_array($view['social'] ?? null) ? $view['social'] : [];
$variant = in_array($view['variant'] ?? '', ['header', 'footer', 'menu'], true) ? $view['variant'] : 'footer';
if ($links !== []):
?>
<div class="social-links social-links--<?= e($variant) ?>" aria-label="<?= e(t($site, 'contact.social')) ?>">
<?php foreach ($links as $link):
  $url = web_url($link['url'] ?? '');
  if ($url === '') continue;
  $rawPlatform = strtolower(text($link['platform'] ?? ''));
  $platform = match (true) {
      str_contains($rawPlatform, 'instagram') => 'instagram',
      str_contains($rawPlatform, 'facebook') => 'facebook',
      str_contains($rawPlatform, 'youtube') => 'youtube',
      str_contains($rawPlatform, 'tiktok') => 'tiktok',
      str_contains($rawPlatform, 'linkedin') => 'linkedin',
      $rawPlatform === 'x', str_contains($rawPlatform, 'twitter') => 'x',
      default => 'other',
  };
  $label = text($link['platform'] ?? '') ?: t($site, 'contact.social');
?>
  <a class="social-link social-link--<?= e($platform) ?>" href="<?= e($url) ?>" target="_blank" rel="noopener noreferrer" title="<?= e($label) ?>" aria-label="<?= e($label) ?>">
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <?php if ($platform === 'instagram'): ?>
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5"/><circle cx="12" cy="12" r="4.1"/><circle cx="17.8" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    <?php elseif ($platform === 'facebook'): ?>
      <path d="M14.5 20.5V12h3l.5-3.4h-3.5V6.5c0-1 .4-1.6 1.8-1.6H18V2a22 22 0 0 0-2.5-.15C12.6 1.85 11 3.6 11 6.8v1.8H8.5V12H11v8.5"/>
    <?php elseif ($platform === 'youtube'): ?>
      <rect x="2" y="5.5" width="20" height="13" rx="4"/><path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none"/>
    <?php elseif ($platform === 'linkedin'): ?>
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7.3 10v7M7.3 7.3v.1M11 17v-7h3v1.2c1-1.8 4-1.7 4 1.2V17"/>
    <?php elseif ($platform === 'x'): ?>
      <path d="M4 3.5h3.5L20 20.5h-3.6zM20 3.5 4 20.5"/>
    <?php elseif ($platform === 'tiktok'): ?>
      <path d="M13 3v12a4.5 4.5 0 1 1-4.5-4.5M13 3c.6 3.3 2.4 4.9 5.7 5.2"/>
    <?php else: ?>
      <path d="M10 13.8a4.5 4.5 0 0 0 6.3 0l2.3-2.3a4.5 4.5 0 0 0-6.4-6.4L10.6 6.7M14 10.2a4.5 4.5 0 0 0-6.3 0l-2.3 2.3a4.5 4.5 0 0 0 6.4 6.4l1.6-1.6"/>
    <?php endif; ?>
    </svg>
  </a>
<?php endforeach; ?>
</div>
<?php endif; ?>
