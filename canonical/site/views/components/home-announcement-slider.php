<?php declare(strict_types=1); namespace YaSite;
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) { http_response_code(404); exit; }
// Publication order is authoritative; expand each record's ordered media in place.
$slides = [];
foreach (records($view['publication']['announcements'] ?? []) as $item) {
    if (!published($item) || ($item['published'] ?? false) !== true) continue;
    $copy = ['title' => text($item['title'] ?? ''), 'text' => text($item['text'] ?? '')];
    $images = [];
    foreach (records($item['images'] ?? []) as $image) {
        $url = media_url($image['url'] ?? '', $site['module_path']);
        if ($url !== '' && published($image)) $images[] = ['url' => $url, 'alt' => text($image['altText'] ?? '')];
    }
    foreach ($images as $image) $slides[] = $copy + $image;
    if ($images === [] && ($copy['title'] !== '' || $copy['text'] !== '')) $slides[] = $copy;
}
$total = count($slides);
if ($total === 0) return;
?>
<section class="home-section announcement-slider" data-announcement-slider aria-labelledby="home-announcements-title" aria-roledescription="<?= e(t($site, 'theme.teknikel.announcements.carousel')) ?>">
  <div class="section-heading announcement-heading">
    <h2 id="home-announcements-title"><?= e(t($site, 'page.announcements')) ?></h2>
    <a class="text-link" href="<?= e(page_url($site, 'announcements')) ?>"><?= e(t($site, 'theme.teknikel.announcements.all')) ?> <span aria-hidden="true">→</span></a>
  </div>
  <div class="announcement-stage" id="home-announcement-stage" tabindex="0" aria-label="<?= e(t($site, 'page.announcements')) ?>">
    <?php foreach ($slides as $index => $slide): $hasCopy = $slide['title'] !== '' || $slide['text'] !== ''; ?>
    <article id="home-announcement-<?= $index + 1 ?>" class="announcement-slide<?= $index === 0 ? ' is-active' : '' ?><?= isset($slide['url']) ? ' has-image' : '' ?><?= $hasCopy ? ' has-copy' : '' ?>" data-announcement-slide role="group" aria-roledescription="<?= e(t($site, 'theme.teknikel.announcements.slide')) ?>" aria-label="<?= e(t($site, 'theme.teknikel.announcements.position', ['current' => $index + 1, 'total' => $total])) ?>"<?= $index === 0 ? '' : ' hidden inert aria-hidden="true"' ?>>
      <?php if (isset($slide['url'])): ?>
      <div class="announcement-media"><img src="<?= e($slide['url']) ?>" alt="<?= e($slide['alt']) ?>" decoding="async"<?= $index === 0 ? '' : ' loading="lazy"' ?>></div>
      <?php endif; ?>
      <?php if ($hasCopy): ?>
      <div class="announcement-copy">
        <?php if ($slide['title'] !== ''): ?><h3><?= e($slide['title']) ?></h3><?php endif; ?>
        <?php if ($slide['text'] !== ''): ?><p><?= nl2br(e($slide['text'])) ?></p><?php endif; ?>
      </div>
      <?php endif; ?>
    </article>
    <?php endforeach; ?>
  </div>
  <?php if ($total > 1): ?>
  <div class="announcement-controls" data-announcement-controls hidden>
    <button type="button" data-announcement-step="-1" aria-controls="home-announcement-stage" aria-label="<?= e(t($site, 'theme.teknikel.announcements.previous')) ?>"><span aria-hidden="true">←</span></button>
    <div class="announcement-dots" role="group" aria-label="<?= e(t($site, 'page.announcements')) ?>">
      <?php foreach ($slides as $index => $slide): ?>
      <button type="button" data-announcement-select="<?= $index ?>" aria-controls="home-announcement-<?= $index + 1 ?>" aria-label="<?= e(t($site, 'theme.teknikel.announcements.select', ['number' => $index + 1])) ?>" aria-current="<?= $index === 0 ? 'true' : 'false' ?>"><span></span></button>
      <?php endforeach; ?>
    </div>
    <button type="button" data-announcement-step="1" aria-controls="home-announcement-stage" aria-label="<?= e(t($site, 'theme.teknikel.announcements.next')) ?>"><span aria-hidden="true">→</span></button>
    <button type="button" class="announcement-playback" data-announcement-playback data-pause="<?= e(t($site, 'theme.teknikel.announcements.pause')) ?>" data-resume="<?= e(t($site, 'theme.teknikel.announcements.resume')) ?>" data-reduced="<?= e(t($site, 'theme.teknikel.announcements.reduced')) ?>"><?= e(t($site, 'theme.teknikel.announcements.pause')) ?></button>
  </div>
  <p class="announcement-status" data-announcement-status role="status" aria-live="polite" aria-atomic="true"></p>
  <script src="<?= e(asset($site, 'site/announcement-slider.js')) ?>" defer></script>
  <?php endif; ?>
</section>
