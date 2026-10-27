// Synthetic TEST data only; real HTTP fixture for the canonical PHP site, never a live API.
import http from 'node:http';
import assert from 'node:assert/strict';
import {FixtureApi,A,B} from './api.mjs';
import {freshState} from './canonical-api.mjs';
export {proxyServer} from './canonical-api.mjs';
export const identities={retail:'TEST-retail',a:A,b:B};
export function commerceState(){
  const state=Object.assign(new FixtureApi(),freshState());
  state.requests=[];state.identities=identities;state.sessionStatus=0;state.catalogStatus=0;state.receiptStatus=0;state.delayCatalog=null;state.delayOrders=null;state.profile={};state.historyStatus='confirmed';state.fixtureError=undefined;
  state.products=state.products.map((p,i)=>({...p,brand:i?'TEST Siemens':'TEST Bosch',category_name:i?'TEST Kartlar':'TEST Pompalar'}));
  state.historyItems=[{product_id:'p1',name:'TEST Bosch Pompa',quantity:2}];
  state.catalog=function(owner){return FixtureApi.prototype.catalog.call(this,owner);};
  state.history=function(owner){return FixtureApi.prototype.history.call(this,owner).map(order=>order.order_id==='web_dealer_order_history_'+(owner===A?'a':'b')?{...order,items:this.historyItems.map(item=>({...item}))}:order);};
  return state;
}
const read=async req=>{let raw='';for await(const chunk of req)raw+=chunk;return {raw,payload:raw?JSON.parse(raw):null};};
export async function commerceFixtureServer(state){
  const server=http.createServer(async(req,res)=>{
    try {
      const path=new URL(req.url,'http://fixture.test').pathname.replace('/yardimci-asistan/api/','').replace(/\.php$/,'');
      const {raw,payload}=await read(req),cookie=/(?:^|;\s*)TEST_identity=([^;]+)/.exec(req.headers.cookie||'')?.[1];
      const owner=identities[cookie]||null,dealer=owner===A||owner===B;
      state.calls.push(path);state.requests.push({path,raw,payload,owner,headers:req.headers});
      let status=200,data={ok:true};
      if(path==='business')data={ok:true,business:{display_name:'TEST Teknikel',public_surfaces:['store'],ai_enabled:false,requests_enabled:false,phone:'',email:'',address:'',...state.business},...(state.localization?{localization:state.localization}:{})};
      else if(path==='catalog')data={ok:true,enabled:state.enabled,products:state.products,categories:[{id:'c1',name:'TEST Pompalar'},{id:'c2',name:'TEST Kartlar'}],delivery_methods:state.delivery};
      else if(path==='marketing')data={ok:true,publications:[]};
      else if(path==='google-reviews')data={available:false,reviews:[]};
      else if(path==='account/config')data={ok:true,enabled:true,passwordRegistration:true,providers:[]};
      else if(path==='account/logout'){res.setHeader('Set-Cookie','TEST_identity=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax');data={ok:true};}
      else if(path==='account/login'){
        const identity=payload.email==='retail@example.test'?'retail':payload.email==='a@example.test'?'a':payload.email==='b@example.test'?'b':null;
        if(!identity||payload.password!=='Fixture-account-Password123'){status=401;data={ok:false,code:'invalid_credentials'};}
        else res.setHeader('Set-Cookie',`TEST_identity=${identity}; Path=/; HttpOnly; SameSite=Lax`);
      }
      else if(path.startsWith('account/')){
        if(path==='account/refresh'||!owner||state.sessionStatus){status=state.sessionStatus||401;data={ok:false,code:status===403?'account_disabled':'login_required'};}
        else if(path==='account/session')data={ok:true,account:{id:owner,email:dealer?(owner===A?'a@example.test':'b@example.test'):'retail@example.test',fullName:'TEST '+(dealer?(owner===A?'BAYİ A':'BAYİ B'):'PERAKENDE'),phone:'+905550000000',methods:['password'],dealer:dealer?{access_id:owner,display_name:owner===A?'TEST BAYİ A':'TEST BAYİ B'}:null}};
        else if(path==='account/receipt'){status=state.receiptStatus||200;data=status===200?{ok:true,receipt:state.receipts.get(owner+':'+payload.idempotencyKey)?.receipt||null}:{ok:false,code:'receipt_unavailable'};}
        else if(path==='account/orders'){
          const delay=state.delayOrders;if(delay){state.delayOrders=null;delay.started();await delay.promise;}
          data={ok:true,orders:state.history(owner)};
        }
        else if(path==='account/profile'){state.profile={...state.profile,...payload};data={ok:true,...state.profile};}
      }
      else if(path.startsWith('dealer/')&&!dealer){status=401;data={ok:false,code:'login_required'};}
      else if(path==='dealer/catalog'){
        const delay=state.delayCatalog;if(delay){state.delayCatalog=null;delay.started();await delay.promise;}
        status=state.catalogStatus||200;data=status===200?{ok:true,catalog:{...state.catalog(owner),products:state.catalog(owner).products.map((p,i)=>({...p,image_url:state.products[i%2].image_url,image_urls:state.products[i%2].image_urls}))}}:{ok:false,code:status===403?'access_revoked':'catalog_unavailable'};
      }
      else if(path==='dealer/receipt')data={ok:true,receipt:state.receipts.get(owner+':'+payload.idempotencyKey)?.receipt||null};
      else if(path==='order'||path==='dealer/order'){
        assert.ok(payload.items.length);assert.ok(payload.items.every(item=>Object.keys(item).sort().join(',')==='productId,quantity'));
        for(const forbidden of ['unitPrice','total','priceGroup','customerId','dealerAccessId'])assert.equal(forbidden in payload,false);
        if(dealer&&path==='dealer/order')assert.equal('buyer' in payload,false);else assert.ok(payload.buyer?.name&&payload.buyer?.phone);
        const key=(owner||'public')+':'+payload.idempotencyKey,previous=state.receipts.get(key);
        if(previous){assert.equal(previous.raw,raw,'retry replays exact request bytes');data=previous.receipt;}
        else {const receipt={ok:true,order_id:'web_'+(dealer?'dealer_':'')+'order_TEST_'+(state.created.length+1),accepted_at:'2026-10-26T12:00:00Z',message:'TEST Sipariş talebiniz alındı.',...(dealer?{quoted_total:owner===A?80:60,currency:'TRY'}:{})};state.receipts.set(key,{raw,receipt});state.created.push({owner,payload,receipt});data=receipt;}
        status=201;
        if(state.lossNext===path){state.lossNext='';res.destroy();return;}
        if(state.malformedNext===path){state.malformedNext='';res.writeHead(201,{'Content-Type':'text/html'});res.end('<html>TEST interrupted response</html>');return;}
      }
      else {status=404;data={ok:false,code:'TEST_unknown_endpoint'};}
      res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));
    }catch(error){state.fixtureError=error;res.writeHead(500,{'Content-Type':'application/json'});res.end(JSON.stringify({ok:false,message:String(error)}));}
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));return {server,origin:`http://127.0.0.1:${server.address().port}`};
}
