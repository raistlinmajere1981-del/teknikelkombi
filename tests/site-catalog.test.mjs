import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {validateSourceCatalog} from './source-catalog.mjs';

const sha = value => createHash('sha256').update(value).digest('hex');
const local = JSON.parse(readFileSync(new URL('../canonical/locales/tr.json',import.meta.url),'utf8'));
const entries = Object.fromEntries(Object.entries(local).filter(([key])=>key!=='_meta').map(([key,text])=>[key,{text,hash:sha(text)}]));
const revision = sha(Object.keys(entries).sort().map(key=>`${key}:${entries[key].hash}\n`).join(''));
const manifest = {version:1,id:local._meta.catalog_id,revision,source_language:'tr',entries};
test('PHP public source endpoint matches the local UTF-8 catalog and actual Desktop validator',async () => {
  const result = spawnSync('php',['-r',`$_GET['resource']='translation-source'; $_SERVER['REQUEST_METHOD']='GET'; require 'index.php';`],{encoding:'utf8'});
  assert.equal(result.status,0,result.stderr);
  assert.deepEqual(await validateSourceCatalog(JSON.parse(result.stdout)),manifest);
  assert.ok(Buffer.byteLength(result.stdout) <= 512 * 1024);
  assert.ok(readFileSync(new URL('../canonical/locales/tr.json',import.meta.url)).length <= 512 * 1024);
  const texts = Object.values(manifest.entries).map(entry => entry.text);
  assert.ok(texts.includes('Demo Veri Paketi'));
  assert.ok(texts.includes('Bu test paketindeki telefon ve e-posta alanlarına gerçek ileti göndermeyin.'));
});
test('Canonical SSR ignores unauthorized English URL and retired cookies without enabling the language picker',() => {
  const result = spawnSync('php',['-r',`$_GET['lang']='en'; $_COOKIE['teknikel_language']='en'; $_COOKIE['teknikel_site_language']='en'; require 'index.php';`],{encoding:'utf8'});
  assert.equal(result.status,0,result.stderr);
  assert.match(result.stdout,/<html lang="tr" dir="ltr">/);
  assert.doesNotMatch(result.stdout,/<(?:nav|form)[^>]+class="language-picker"|data-language="en"/);
  assert.match(result.stdout,/Parçayı bulun\. Detayını inceleyin\./);
});
test('source endpoint rejects POST without rendering HTML',() => {
  const result = spawnSync('php',['-r',`register_shutdown_function(static function(){file_put_contents('php://stderr',(string)http_response_code());}); $_GET['resource']='translation-source'; $_SERVER['REQUEST_METHOD']='POST'; require 'index.php';`],{encoding:'utf8'});
  assert.equal(result.status,0,result.stderr);
  assert.equal(result.stdout,'');
  assert.equal(result.stderr,'405');
});
test('every explicit Turkish UI source is cataloged and the retired English dictionary is removed',() => {
  assert.equal(existsSync(new URL('../assets/i18n/en.json',import.meta.url)),false);
  const texts = new Set(Object.values(manifest.entries).map(entry => entry.text));
  const root = new URL('../',import.meta.url);
  const paths = [
    ...readdirSync(new URL('assets/',root)).filter(file => file.endsWith('.js')).map(file => 'assets/'+file),
    ...readdirSync(new URL('assets/assistant/',root)).filter(file => file.endsWith('.js') && file !== 'widget.js').map(file => 'assets/assistant/'+file),
    ...readdirSync(root,{recursive:true}).filter(file => /^(?:inc\/|[^/]+\/)?[^/]+\.php$/.test(file) && !file.startsWith('canonical/'))
  ];
  for (const path of paths) {
    const source = readFileSync(new URL(path,root),'utf8');
    for (const match of source.matchAll(/\b(?:te_t|t)\('((?:\\.|[^'\\])*)'/g)) {
      const text = match[1].replace(/\\'/g,"'").replace(/\\\\/g,'\\');
      assert.ok(texts.has(text),path+': '+text);
    }
  }
});
