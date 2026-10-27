// Synthetic TEST data only. This fixture never connects to a live API.
import http from 'node:http';
import {publicProducts} from './api.mjs';
export const freshState = () => ({surfaces:['store'],enabled:true,products:publicProducts.map(p=>({...p,image_url:'https://images.example.com/TEST-site-logo.webp',image_urls:['https://images.example.com/TEST-site-logo.webp']})),delivery:['pickup'],account:true,requests:true,catalogError:false,businessError:false,localization:null,businessPublication:{enabled:false,fields:[]},business:{},announcements:[],reviews:[],calls:[]});
export async function fixtureServer(state) {
  const server=http.createServer((req,res)=>{
    const path=new URL(req.url,'http://fixture.test').pathname.replace('/yardimci-asistan/api/','').replace(/\.php$/,'');
    state.calls.push(path); let status=200,data={ok:true};
    if(path==='business') {status=state.businessError?503:200;data={ok:!state.businessError,business_publication:state.businessPublication,business:{display_name:'TEST Teknikel',public_surfaces:state.surfaces,ai_enabled:false,requests_enabled:state.requests,request_types:state.requests?['general_info']:[],whatsapp_enabled:false,phone:'',email:'',address:'',social_links:[],...state.business},...(state.localization?{localization:state.localization}:{})};}
    else if(path==='catalog'){status=state.catalogError?503:200;data={ok:!state.catalogError,enabled:state.enabled,products:state.products,categories:[{id:'c1',name:'TEST Pompalar'},{id:'c2',name:'TEST Kartlar'}],delivery_methods:state.delivery};}
    else if(path==='account/config')data={ok:true,enabled:state.account,passwordRegistration:state.account,providers:[]};
    else if(path==='marketing')data={ok:true,publications:state.announcements};
    else if(path==='google-reviews')data={available:true,reviews:state.reviews};
    else if(['account/session','account/refresh'].includes(path)){status=401;data={ok:false,code:'login_required'};}
    else {status=404;data={ok:false};}
    res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));
  });
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  return {server,origin:`http://127.0.0.1:${server.address().port}`};
}
export async function proxyServer(phpOrigin,apiOrigin){
  const server=http.createServer((req,res)=>{
    const destination=req.url.startsWith('/yardimci-asistan/api/')?apiOrigin:phpOrigin;
    const upstream=http.request(destination+req.url,{method:req.method,headers:{...req.headers,host:new URL(destination).host}},reply=>{res.writeHead(reply.statusCode,reply.headers);reply.pipe(res);});
    upstream.on('error',()=>{res.writeHead(502);res.end('TEST fixture upstream unavailable');});req.pipe(upstream);
  });await new Promise(r=>server.listen(0,'127.0.0.1',r));
  return {server,origin:`http://127.0.0.1:${server.address().port}`};
}
