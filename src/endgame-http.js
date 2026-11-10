// A fixed, read-only application-layer model; no real network requests are sent.
export const records = {river:'水辺の水位は穏やか',hill:'丘の道は通れます'};
export const paths = {river:'/reports/river',hill:'/reports/hill',missing:'/reports/old'};
export const httpCases = {
 request:[{target:'river'},{target:'hill'},{target:'missing'}],
 compare:[{target:'river'},{target:'hill'}],
 repair:[{target:'hill',fault:'missing'},{target:'river',fault:'content'}],
};
export function responseFor(method,path) {
 if(!['GET','HEAD'].includes(method)||!Object.hasOwn(paths,path))return null;
 const found=Object.hasOwn(records,path),status=found?200:404;
 return {method,path,status,contentType:'text/plain',body:method==='HEAD'?null:found?records[path]:'見つかりません'};
}
export function replayHttp(kind,history) {
 const cases=httpCases[kind];
 if(!cases||!Array.isArray(history))return null;
 let scene=0,path=null,method=null,response=null,seen=[],observed={},diagnosed=false,done=false;
 const reset=()=>{path=null;method=null;response=null;seen=[];observed={};diagnosed=false;};
 for(const action of history){
  if(done||typeof action!=='string')return null;
  if(action==='reset'){reset();continue;}
  const c=cases[scene];
  if(kind==='repair'&&!diagnosed){if(action===`judge:${c.fault}`){diagnosed=true;continue;}return null;}
  let m=/^path:(river|hill|missing)$/.exec(action);
  if(m){path=m[1];continue;}
  m=/^method:(GET|HEAD)$/.exec(action);
  if(m){method=m[1];continue;}
  if(action==='send'&&path&&method){response=responseFor(method,path);if(path===c.target&&response.status===200){observed[method]=response;if(!seen.includes(method))seen.push(method);}continue;}
  if(action==='check'&&response&&response.path===c.target&&(kind==='compare'?seen.includes('GET')&&seen.includes('HEAD'):response.method==='GET')){scene++;done=scene===cases.length;if(!done)reset();continue;}
  return null;
 }
 return {scene,path,method,response,seen,observed,diagnosed,done};
}
