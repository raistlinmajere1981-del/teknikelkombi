import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';

const site = (name) => readFileSync(resolve('canonical',name),'utf8');
const local = (name) => readFileSync(resolve(name),'utf8');

test('canonical Teknikel only binds site-owned fixed photos through an opt-in manifest', () => {
  const source = site('core/render.php');
  const adapter = site('public/assets/core/effects.mjs');
  const config = site('site/config.php');
  assert.match(source,/function effect_bindings\(/);
  assert.match(source,/return effect_manifest_bindings\(\$root,\s*\$basePath\);/);
  assert.match(source,/effects-manifest\.json/);
  assert.doesNotMatch(source,/(\$config\['effects'\]|data-effect-slot)/);
  assert.doesNotMatch(config,/'effects'\s*=>/);
  assert.match(adapter,/matchesSource/);
  assert.doesNotMatch(adapter,/dataset\.effectSlot/);
  assert.equal(existsSync(resolve('canonical/public/assets/site/scenes/effects-manifest.json')),false);
});

test('product/galeri/oda/masa image publication is not an effect slot', () => {
  const hero = site('site/views/components/hero.php');
  const gallery = site('core/views/pages/gallery.php');
  assert.match(hero,/\$image\['url'\]/);
  assert.match(gallery,/\$image\['url'\]/);
  for(const text of [hero,gallery,local('assets/homepage.js'),local('assets/publication-model.js')]) {
    assert.doesNotMatch(text,/data-effect-slot|effects-manifest\.json/);
  }
  assert.doesNotMatch(hero, /asset\(\$site,\s*'site\/(?:img|media)\//);
});
