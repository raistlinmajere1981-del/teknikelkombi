import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdirSync,writeFileSync,readdirSync} from 'node:fs';
const phpFiles = ['index.php','inc/layout.php','inc/language.php','katalog/index.php','urun/index.php','sepet/index.php','bayi/index.php','hesabim/index.php','restoran/index.php','qr-menu/index.php','odalar/index.php','odalar/oda/index.php','magaza/index.php','markalar/index.php','iletisim/index.php','hakkimizda/index.php','galeri/index.php','yorumlar/index.php','duyurular/index.php'];
const jsFiles = [...readdirSync('assets').filter(file => file.endsWith('.js')).map(file => 'assets/' + file),...readdirSync('assets/assistant').filter(file => file.endsWith('.js')).map(file => 'assets/assistant/' + file),'tests/fixtures/api.mjs',...readdirSync('tests').filter(file => file.endsWith('.mjs')).map(file => 'tests/' + file)];
const results = [];
for (const file of [...phpFiles,...jsFiles]) {
  const php = file.endsWith('.php'); const result = spawnSync(php ? 'php' : process.execPath,php ? ['-l',file] : ['--check',file],{encoding:'utf8'});
  results.push({file,passed:result.status === 0}); assert.equal(result.status,0,result.stderr || result.stdout); console.log('PASS',file);
}
mkdirSync('.test-artifacts',{recursive:true}); writeFileSync('.test-artifacts/checks.json',JSON.stringify(results,null,2) + '\n');
