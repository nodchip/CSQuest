export const roverSlipLevel={id:'forest-rover-slip',number:'1281',kind:'rover-slip',name:'火星の轍をたどる',tag:'実ロボットと移動の誤差',title:'車輪は回ったけれど',story:'森の工房に、NASA の火星探査車の資料が届きました。車輪による移動の見積もりと、滑りのある道を比べましょう。'};
export const roverGrounds={firm:'滑らない道',slip:'２・３歩目で滑る道'};
export const roverMethods={blind:'車輪の回転だけで進む',inspect:'各歩の後に位置を照合する'};
const roverMoves={firm:[2,2,2],slip:[2,1,1]}; // half-units
export function roverReplay(ground,method,history){
 if(!Object.hasOwn(roverGrounds,ground)||!Object.hasOwn(roverMethods,method)||!Array.isArray(history)||history.length>7)throw new RangeError('条件が不正です。');
 let actual=0,estimate=0,steps=0,checked=false,stopped=false;
 for(const a of history){
  if(a==='step'&&!stopped&&steps<3&&!(method==='inspect'&&steps>0&&!checked)){actual+=roverMoves[ground][steps];estimate+=2;steps++;checked=false;}
  else if(a==='inspect'&&method==='inspect'&&!stopped&&steps>0&&!checked){checked=true;}
  else if(a==='stop'&&method==='inspect'&&!stopped&&checked&&actual!==estimate){stopped=true;}
  else throw new RangeError('操作の順序が不正です。');
 }
 const complete=method==='blind'?steps===3:ground==='firm'?steps===3&&checked:stopped&&steps===2;
 return {actual:actual/2,estimate:estimate/2,steps,checked,stopped,complete};
}
export function roverSlipCreate(){return {ground:'firm',method:'blind',runs:Object.fromEntries(Object.keys(roverGrounds).flatMap(g=>Object.keys(roverMethods).map(m=>[`${g}:${m}`,[]]))),reflection:null};}
export function roverSlipAct(q,action){const key=`${q.ground}:${q.method}`,next=[...q.runs[key],action];try{const result=roverReplay(q.ground,q.method,next);q.runs[key]=next;return result;}catch{return null;}}
export function roverSlipRetry(q){q.runs[`${q.ground}:${q.method}`]=[];}
export function roverSlipDone(q){return Object.keys(roverGrounds).every(g=>Object.keys(roverMethods).every(m=>roverReplay(g,m,q.runs[`${g}:${m}`]).complete))&&q.reflection==='limits';}
export function roverSlipRestore(q){if(!q||!Object.hasOwn(roverGrounds,q.ground)||!Object.hasOwn(roverMethods,q.method)||![null,'limits','perfect'].includes(q.reflection)||!q.runs)throw new RangeError('記録が不正です。');const runs={};for(const g of Object.keys(roverGrounds))for(const m of Object.keys(roverMethods)){const k=`${g}:${m}`;roverReplay(g,m,q.runs[k]);runs[k]=[...q.runs[k]];}return {ground:q.ground,method:q.method,runs,reflection:q.reflection};}
