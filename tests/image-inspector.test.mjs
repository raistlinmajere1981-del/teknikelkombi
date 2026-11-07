import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {packageFiles} from '../scripts/package-site.mjs';
const repo=new URL('../',import.meta.url).pathname;
test('browser assets are the canonical shared source and the package contains every worker dependency',()=>{
 const files=packageFiles(repo);
 for(const name of ['core.js','worker.js','inspector.js','inspector.css']){
  const source=readFileSync(new URL('../../YardimciAsistan/packages/image-inspector/runtime/'+name,import.meta.url));
  const canonical='canonical/public/assets/site/image-inspector/'+name,mirror='assets/site/image-inspector/'+name;
  assert.ok(files.includes(canonical)&&files.includes(mirror),name);
  assert.ok(source.equals(readFileSync(new URL('../'+canonical,import.meta.url))),name);
  assert.ok(source.equals(readFileSync(new URL('../'+mirror,import.meta.url))),name);
 }
});
