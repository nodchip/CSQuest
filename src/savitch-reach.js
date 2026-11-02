export const savitchLevel={id:'archive-savitch-reach',number:'866',kind:'savitch-reach',name:'中継点で道を分ける',tag:'領域計算量と Savitch の定理',title:'限られた記録で道を調べよう',story:'書庫の五つの門を結ぶ道を、少ない記録を使って調べます。出発と到着の間に中継点を試し、短い問いに分けましょう。'};
export const savitchNodes=['A','B','C','D','E'];
export const savitchEdges=[['A','B'],['A','C'],['B','D'],['C','A'],['D','E']];
export const savitchCases={short:{name:'AからEへ２歩以内',from:'A',to:'E',k:1},long:{name:'AからEへ４歩以内',from:'A',to:'E',k:2},back:{name:'EからAへ４歩以内',from:'E',to:'A',k:2}};
export function savitchTrace(from,to,k){
 if(!savitchNodes.includes(from)||!savitchNodes.includes(to)||!Number.isInteger(k)||k<0||k>2)throw new RangeError('条件が不正です。');
 const events=[];let calls=0,peak=0;
 function* reach(u,v,depth,parents){
  const frame={from:u,to:v,k:depth},stack=[...parents,frame];calls++;peak=Math.max(peak,stack.length);yield {type:'enter',stack,calls,peak};
  if(depth===0){const result=u===v||savitchEdges.some(([a,b])=>a===u&&b===v);yield {type:'base',stack,calls,peak,result};return result;}
  for(const midpoint of savitchNodes){
   yield {type:'try',stack,calls,peak,midpoint};
   const left=yield* reach(u,midpoint,depth-1,stack);
   if(left){const right=yield* reach(midpoint,v,depth-1,stack);if(right){yield {type:'found',stack,calls,peak,midpoint};return true;}}
  }
  yield {type:'none',stack,calls,peak};return false;
 }
 const walk=reach(from,to,k,[]);let step=walk.next();while(!step.done){events.push(step.value);step=walk.next();}events.push({type:'result',stack:[],calls,peak,result:step.value});return events;
}
export function savitchCreate(){return {selected:'short',positions:{short:0,long:0,back:0},answers:{short:null,long:null,back:null},reflection:null};}
export function savitchFrames(id){if(!Object.hasOwn(savitchCases,id))throw new RangeError('依頼が不正です。');const c=savitchCases[id];return savitchTrace(c.from,c.to,c.k);}
export function savitchAdvance(q,count){if(![1,10,1000].includes(count))throw new RangeError('刻数が不正です。');const frames=savitchFrames(q.selected);q.positions[q.selected]=Math.min(frames.length-1,q.positions[q.selected]+count);}
export function savitchComplete(q){return Object.keys(savitchCases).every(id=>{const frames=savitchFrames(id);return q.positions[id]===frames.length-1&&q.answers[id]===(frames.at(-1).result?'yes':'no');})&&q.reflection==='reuse';}
export function savitchRestore(q){
 if(!q||!Object.hasOwn(savitchCases,q.selected)||!q.positions||!q.answers||![null,'reuse','store','instant'].includes(q.reflection))throw new RangeError('記録が不正です。');const copy=savitchCreate();copy.selected=q.selected;copy.reflection=q.reflection;
 for(const id of Object.keys(savitchCases)){const length=savitchFrames(id).length,n=q.positions[id];if(!Number.isInteger(n)||n<0||n>=length||![null,'yes','no'].includes(q.answers[id]))throw new RangeError('試行が不正です。');copy.positions[id]=n;copy.answers[id]=q.answers[id];}
 return copy;
}
