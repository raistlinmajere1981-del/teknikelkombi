import test from 'node:test';
import assert from 'node:assert/strict';
import {projectPublication} from '../assets/publication-model.js';
import {assistantPublication} from '../assets/assistant/presentation.js';
import {customerRequestPayload,createCustomerRequestSender,requestPhone} from '../assets/assistant/customer-request.js';
import {publicProducts} from './fixtures/api.mjs';

const snapshot = () => ({business:{business:{requests_enabled:true,request_types:['general_info','price_question','dealer_application'],ai_enabled:false,dealer_application_enabled:true,public_surfaces:['store']}},catalog:{enabled:true,products:publicProducts}});
const values = {customer_name:' TEST Customer ',customer_phone:'0555 000 00 00',message:' Stok var mı? ',product_id:'p1'};
test('no-AI business independently publishes general, product and dealer request actions',() => {
  const view = projectPublication(snapshot());
  assert.deepEqual(view.flows.map(flow => flow.id),['general','product','dealer']);
  assert.equal(view.flows.find(flow => flow.id === 'product').requestType,'price_question');
  assert.equal(assistantPublication(view).requestsEnabled,true);
  assert.equal(assistantPublication(view).aiEnabled,false);
  assert.deepEqual(assistantPublication(view).requestTypes,['general_info','price_question','dealer_application']);
});
test('product permission prefers price_question, falls back only to published general_info',() => {
  const input = snapshot();
  for (const [types,expected] of [[['price_question'],'price_question'],[['general_info'],'general_info'],[['other'],undefined],[[],undefined],[undefined,undefined],['general_info',undefined]]) {
    input.business.business.request_types = types;
    assert.equal(projectPublication(input).flows.find(flow => flow.id === 'product')?.requestType,expected);
  }
});
test('product requests require published store and actual products, independent of featured and AI',() => {
  const input = snapshot(); input.business.business.publication_visibility = {featured:false,assistant:false};
  assert.ok(projectPublication(input).flows.some(flow => flow.id === 'product'));
  for (const mutate of [v => v.catalog.products = [],v => v.catalog.products = publicProducts.map(p => ({...p,published:false})),v => v.catalog.enabled = false,v => v.business.business.public_surfaces = [],v => v.business.business.publication_visibility = {store:false}]) {
    const value = snapshot(); mutate(value); const view = projectPublication(value);
    assert.equal(view.flows.some(flow => flow.id === 'product'),false);
    assert.equal(view.flows.some(flow => flow.id === 'general'),true);
  }
});
test('revoked/missing flags, missing business and unlisted types fail closed; AI remains independent',() => {
  const input = snapshot();
  input.business.business.requests_enabled = false; input.business.business.ai_enabled = true;
  let view = projectPublication(input);
  assert.deepEqual(view.flows.map(flow => flow.id),['chat','parts']);
  assert.equal(assistantPublication(view).requestsEnabled,false);
  input.business.business.requests_enabled = true; delete input.business.business.request_types;
  view = projectPublication(input); assert.deepEqual(view.flows.map(flow => flow.id),['chat','parts']);
  assert.equal(assistantPublication(view).requestsEnabled,true,'published requests flag is not inferred from dealer presence');
  input.business.business.request_types = ['unsupported','location_question'];
  assert.deepEqual(assistantPublication(projectPublication(input)).requestTypes,['location_question']);
  input.business = null; view = projectPublication(input);
  assert.deepEqual(view.flows,[]); assert.deepEqual(assistantPublication(view).requestTypes,[]);
  assert.equal(assistantPublication(view).requestsEnabled,false);
});
test('general and price bodies follow official schema, include selected product context, and omit schedules',() => {
  const view = projectPublication(snapshot());
  const general = customerRequestPayload(view,'general',values,'/magaza/');
  assert.deepEqual(general,{request_type:'general_info',customer_name:'TEST Customer',customer_phone:'+905550000000',message:'Stok var mı?',source:'web_form',guest_count:1,whatsapp_message:'',context:{resourceType:'',resourceId:'',resourceName:'',sourcePath:'/magaza/'}});
  const product = customerRequestPayload(view,'product',values,'/magaza/');
  assert.equal(product.request_type,'price_question');
  assert.equal(product.message,'İlgili ürün: TEST Bosch Pompa (TEST-POM-101)\nStok var mı?');
  assert.deepEqual(product.context,{resourceType:'product',resourceId:'p1',resourceName:'TEST Bosch Pompa',sourcePath:'/magaza/'});
  for (const key of ['date_text','start_date','end_date','time']) assert.equal(key in product,false);
  const input = snapshot(); input.business.business.request_types = ['general_info'];
  assert.equal(customerRequestPayload(projectPublication(input),'product',values,'/').request_type,'general_info');
});
test('payload rechecks current permission, selected public product, required fields and PHP byte limits',() => {
  const input = snapshot(), payload = (overrides = {},id = 'general') => customerRequestPayload(projectPublication(input),id,{...values,...overrides},'/');
  for (const overrides of [{customer_name:'   '},{customer_name:'ğ'.repeat(81)},{customer_phone:'bad'},{message:'   '},{message:'ğ'.repeat(1501)}]) assert.throws(() => payload(overrides));
  assert.throws(() => payload({product_id:'private-dealer-product'},'product'));
  assert.throws(() => payload({message:'x'.repeat(2990)},'product'),'context counts toward PHP byte limit');
  input.business.business.request_types = ['price_question']; assert.throws(() => payload());
  input.business.business.requests_enabled = false; assert.throws(() => payload({},'product'));
});
test('phone validation matches Turkish mobile and international request API formats',() => {
  for (const value of ['0555 000 00 00','5550000000','905550000000','+90 (555) 000-00-00','00905550000000']) assert.equal(requestPhone(value),'+905550000000');
  assert.equal(requestPhone('+44 7700 900123'),'+447700900123');
  for (const value of ['', '123','+90 212 000 00 00','5550000000<script>','+00 5550000000']) assert.equal(requestPhone(value),'');
});
test('ambiguous errors retry identical bodies with stable idempotency, edited and successful intents get new keys',async () => {
  const calls = []; let response, serial = 0;
  const send = createCustomerRequestSender(async (url,options) => { calls.push({url,...options,payload:JSON.parse(options.body)}); if (response instanceof Error) throw response; return response; },() => String(++serial).padStart(32,'0'));
  const payload = customerRequestPayload(projectPublication(snapshot()),'product',values,'/');
  for (const value of [new Error('network lost'),{ok:false,status:503,json:async () => ({ok:false})},{ok:true,status:201,json:async () => ({ok:true})},{ok:true,status:201,json:async () => {throw new Error('invalid JSON');}}]) {
    response = value; await assert.rejects(send('product',payload));
  }
  response = {ok:true,status:201,json:async () => ({ok:true,request_id:'fixture_request'})};
  await send('product',payload);
  assert.ok(calls.every(call => call.body === calls[0].body));
  assert.equal(calls[0].url,'/yardimci-asistan/api/request.php');
  assert.equal(calls[0].redirect,'error'); assert.equal(calls[0].credentials,'same-origin');
  await send('product',payload); assert.notEqual(calls.at(-1).payload.idempotency_key,calls[0].payload.idempotency_key);
  response = {ok:false,status:503,json:async () => ({ok:false})};
  await assert.rejects(send('general',payload)); const before = calls.at(-1).payload.idempotency_key;
  await assert.rejects(send('general',{...payload,message:'Different question'})); assert.notEqual(calls.at(-1).payload.idempotency_key,before);
});
