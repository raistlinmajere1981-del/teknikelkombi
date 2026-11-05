import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdirSync,writeFileSync,readdirSync,readFileSync} from 'node:fs';
import {validateSourceCatalog} from './source-catalog.mjs';
const phpFiles = ['index.php','inc/layout.php','inc/language.php','katalog/index.php','urun/index.php','sepet/index.php','bayi/index.php','hesabim/index.php','restoran/index.php','qr-menu/index.php','odalar/index.php','odalar/oda/index.php','magaza/index.php','markalar/index.php','demo-icerik/index.php','iletisim/index.php','hakkimizda/index.php','galeri/index.php','yorumlar/index.php','duyurular/index.php'];
const jsFiles = [...readdirSync('assets').filter(file => file.endsWith('.js')).map(file => 'assets/' + file),...readdirSync('assets/assistant').filter(file => file.endsWith('.js')).map(file => 'assets/assistant/' + file),...readdirSync('tests/fixtures').filter(file => file.endsWith('.mjs')).map(file => 'tests/fixtures/' + file),...readdirSync('tests').filter(file => file.endsWith('.mjs')).map(file => 'tests/' + file)];
const results = [];
for (const file of [...phpFiles,...jsFiles]) {
  const php = file.endsWith('.php'); const result = spawnSync(php ? 'php' : process.execPath,php ? ['-l',file] : ['--check',file],{encoding:'utf8'});
  results.push({file,passed:result.status === 0}); assert.equal(result.status,0,result.stderr || result.stdout); console.log('PASS',file);
}
mkdirSync('.test-artifacts',{recursive:true}); writeFileSync('.test-artifacts/checks.json',JSON.stringify(results,null,2) + '\n');
const source = JSON.parse(readFileSync('canonical/locales/tr.json','utf8'));
const catalog = spawnSync('php',['-r',"$_GET['resource']='translation-source'; $_SERVER['REQUEST_METHOD']='GET'; require 'index.php';"],{encoding:'utf8'});
assert.equal(catalog.status,0,catalog.stderr);
assert.ok(Buffer.byteLength(catalog.stdout) <= 512 * 1024);
const published = await validateSourceCatalog(JSON.parse(catalog.stdout));
assert.equal(published.id, source._meta.catalog_id);
assert.deepEqual(
  Object.fromEntries(Object.entries(published.entries).map(([key, value]) => [key, value.text])),
  Object.fromEntries(Object.entries(source).filter(([key]) => key !== '_meta'))
);
console.log('PASS canonical PHP translation-source catalog');
