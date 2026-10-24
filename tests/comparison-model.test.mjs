import test from 'node:test';
import assert from 'node:assert/strict';
import {ComparisonSelection,comparisonRows,freshTransform,transformCss,filterCss} from '../assets/comparison-model.js';
import {publicProducts} from './fixtures/api.mjs';

test('selection accepts current catalog IDs, removes withdrawn IDs, cannot re-add an obsolete card',() => {
  const selection = new ComparisonSelection(); assert.equal(selection.add('p1',publicProducts),true); assert.equal(selection.add('p2',publicProducts),true);
  const updated = [publicProducts[0]]; assert.deepEqual(selection.reconcile(updated),['p1',null]);
  assert.equal(selection.add('p2',updated),false); assert.equal(selection.add('private-product',updated),false);
  selection.clear(); assert.deepEqual(selection.ids,[null,null]);
});
test('comparison reads authorized prices, highlights differences, and leaves unpublished fields empty',() => {
  const a = {...publicProducts[0],manufacturer_part_code:'PART-42',model:'M-1'}, b = publicProducts[1];
  const rows = comparisonRows(a,b,[{id:'c1',name:'Published category'}]);
  assert.equal(rows.find(row => row.key === 'manufacturer_part_code').right,'');
  assert.equal(rows.find(row => row.key === 'category').left,'Published category');
  assert.equal(rows.find(row => row.key === 'price').different,true);
  const privateRows = comparisonRows({...a,price:80},{...b,price:180});
  assert.match(privateRows.find(row => row.key === 'price').left,/80,00/);
  assert.equal(JSON.stringify(rows).includes('uyumlu'),false);
});
test('view transforms and filters never mutate the original catalog image or product',() => {
  const product = structuredClone(publicProducts[0]), before = JSON.stringify(product), value = freshTransform();
  value.zoom = 2; value.rotation = 90; value.flipX = -1; value.x = 24; value.filter = 'negative'; value.contrast = 150;
  assert.equal(transformCss(value),'translate(24px, 0px) rotate(90deg) scale(-2, 2)');
  assert.equal(filterCss(value),'invert(1) contrast(150%)'); assert.equal(JSON.stringify(product),before);
  assert.deepEqual(freshTransform(),{zoom:1,x:0,y:0,rotation:0,flipX:1,flipY:1,filter:'normal',contrast:100});
});
