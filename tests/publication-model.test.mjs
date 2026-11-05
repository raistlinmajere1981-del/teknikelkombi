import test from 'node:test';
import assert from 'node:assert/strict';
import {projectPublication,publicationEndpoints} from '../assets/publication-model.js';
import {mapEmbedUrl} from '../assets/public-info.js';
import {catalogFrom} from '../assets/commerce.js';
import {assistantPublication} from '../assets/assistant/presentation.js';
import {publicProducts,roomPublication,tablePublication,menuPublication,reviewsPublication,campaignPublication} from './fixtures/api.mjs';

const snapshot = () => ({business:{business:{display_name:'Published business',public_surfaces:['store','rooms','restaurant','qr_menu'],ai_enabled:true,requests_enabled:true,request_types:['dealer_application','pension_reservation','restaurant_reservation'],dealer_application_enabled:true,google_reviews_enabled:true,phone:'+905550000000',description:'Published description',gallery:[{url:'https://images.example.com/gallery.jpg',title:'Published image'}]}},catalog:{enabled:true,products:publicProducts,categories:[{id:'c1',name:'Pumps'}]},publications:{rooms:{enabled:true,rooms:roomPublication},tables:{enabled:true,tables:tablePublication},menu:menuPublication,marketing:{publications:[campaignPublication]},'google-reviews':reviewsPublication}});
test('one projection handles store, rooms, tables, menu, campaigns, reviews, contact and widget flows',() => {
  const view = projectPublication(snapshot());
  for (const key of ['store','featured','rooms','restaurant','qr_menu','campaigns','reviews','gallery','contact','dealer','support']) assert.equal(view.sections[key],true,key);
  assert.equal(view.rooms.length,2); assert.equal(view.tables.length,1); assert.equal(view.menu.items.length,3);
  assert.deepEqual(view.flows.map(flow => flow.id),['chat','parts','dealer','reservation','table']);
});
test('capability without data never reveals a content block, and profile names never grant a surface',() => {
  const value = snapshot(); value.catalog.products = []; value.catalog.categories = []; value.publications = {}; value.business.business.gallery = []; value.business.business.phone = '';
  const view = projectPublication(value);
  for (const key of ['featured','categories','brands','rooms','restaurant','qr_menu','campaigns','reviews','gallery','contact']) assert.equal(view.sections[key],false,key);
  value.business.business.public_surfaces = []; value.business.business.profile_id = 'pension_restaurant'; value.publications = snapshot().publications;
  assert.equal(projectPublication(value).sections.rooms,false);
});
test('publication visibility only restricts active data, shared by pages and widget',() => {
  const value = snapshot(); value.business.business.publication_visibility = Object.fromEntries(['store','rooms','restaurant','qr_menu','gallery','campaigns','reviews','contact','dealer','assistant'].map(key => [key,false]));
  const view = projectPublication(value);
  for (const key of ['store','featured','rooms','restaurant','qr_menu','campaigns','reviews','gallery','contact','dealer','support']) assert.equal(view.sections[key],false,key);
  assert.deepEqual(view.flows,[]); assert.deepEqual(publicationEndpoints(value.business),['marketing']);
  value.business.business.public_surfaces = []; value.business.business.publication_visibility.store = true;
  assert.equal(projectPublication(value).store,false);
});
test('failed business and endpoint values cannot resurrect published content',() => {
  const value = snapshot(); value.business = null;
  const view = projectPublication(value);
  assert.equal(view.store,false); assert.equal(view.sections.campaigns,false);
});
test('empty reviews do not create a homepage/navigation block or invented rating',() => {
  const value = snapshot(); value.publications['google-reviews'] = {available:true,reviews:[],rating:20};
  const view = projectPublication(value); assert.equal(view.sections.reviews,false); assert.equal(view.reviews.rating,null);
});
test('malformed optional arrays and explicitly disabled campaigns stay empty',() => {
  const value = snapshot(); value.publications.rooms.rooms = {}; value.publications.tables.tables = 'bad'; value.publications.marketing.enabled = false;
  const view = projectPublication(value); assert.deepEqual(view.rooms,[]); assert.deepEqual(view.tables,[]); assert.deepEqual(view.campaigns,[]);
});
test('widget contains only direct assistant actions, never duplicate site navigation',() => {
  const value = snapshot(); value.business.business.ai_enabled = false; value.business.business.phone = ''; value.business.business.requests_enabled = false;
  const view = projectPublication(value); assert.equal(view.flows.some(flow => flow.id === 'parts'),false); assert.equal(view.flows.some(flow => flow.kind === 'link'),false); assert.equal(view.sections.support,false);
});
test('current backend flags keep dealer and WhatsApp on while AI is off; future toggles revoke only their flows',() => {
  const value = {business:{ok:true,business:{display_name:'Test',public_surfaces:['store','directions'],
    ai_enabled:false,requests_enabled:true,request_types:['dealer_application'],dealer_application_enabled:true,dealer_portal_enabled:true,
    whatsapp_enabled:true,whatsapp:'905550000000'}},catalog:snapshot().catalog};
  const check = () => { const view = projectPublication(value); return {view,config:assistantPublication(view)}; };
  let result = check();
  assert.deepEqual(result.view.flows.map(flow => flow.id),['dealer','whatsapp']);
  assert.equal(result.config.dealerApplicationEnabled,true); assert.equal(result.config.whatsappEnabled,true); assert.equal(result.config.aiEnabled,false);
  value.business.business.dealer_application_enabled = false;
  result = check(); assert.deepEqual(result.view.flows.map(flow => flow.id),['whatsapp']);
  assert.equal(result.config.dealerApplicationEnabled,false); assert.equal(result.config.requestsEnabled,true);
  value.business.business.whatsapp_enabled = false;
  result = check(); assert.deepEqual(result.view.flows,[]); assert.equal(result.config.whatsappEnabled,false); assert.equal(result.config.whatsappPhone,'');
  value.business.business.ai_enabled = true;
  assert.deepEqual(check().view.flows.map(flow => flow.id),['chat','parts']);
  value.business.business.ai_enabled = false;
  assert.deepEqual(check().view.flows,[]);
  value.business = null;
  result = check(); assert.deepEqual(result.view.flows,[]);
  for (const key of ['aiEnabled','requestsEnabled','dealerApplicationEnabled','whatsappEnabled']) assert.equal(result.config[key],false,key);
});
test('catalog ignores explicitly unpublished/inactive records without altering accepted prices',() => {
  const value = catalogFrom({enabled:true,products:[publicProducts[0],{...publicProducts[1],published:false}],categories:[],delivery_methods:[]});
  assert.deepEqual(value.products.map(product => product.product_id),['p1']); assert.equal(value.products[0].price,100);
});
test('malformed catalog records remain an error instead of becoming a successful empty catalog',() => {
  assert.throws(() => catalogFrom({enabled:true,products:[null],delivery_methods:[]}));
});
test('map rendering uses canonical embed mode, rejects hostile embed URLs, and validates numeric coordinates',() => {
  const url = 'https://www.google.com/maps/embed?pb=test';
  assert.equal(mapEmbedUrl({mapDisplayMode:'google_maps_embed',googleMapsEmbedUrl:url}),url);
  assert.match(mapEmbedUrl({latitude:41,longitude:29}),/openstreetmap.org/);
  for (const googleMapsEmbedUrl of ['javascript:alert(1)','https://evil.example/maps/embed?pb=x','https://www.google.com/other?pb=x','https://user:pw@www.google.com/maps/embed?pb=x']) assert.equal(mapEmbedUrl({mapDisplayMode:'google_maps_embed',googleMapsEmbedUrl}), '');
  assert.equal(mapEmbedUrl({latitude:null,longitude:null}),''); assert.equal(mapEmbedUrl({latitude:91,longitude:29}),'');
});
