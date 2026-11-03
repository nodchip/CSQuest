export const scaledSpeedupLevel={id:'forge-scaled-speedup',number:'1052',kind:'scaled-speedup',name:'人数で広がる採掘',tag:'Gustafson の法則',title:'同じ仕事で速さを比べる',story:'精霊たちが鉱石の採掘を始めます。人数に合わせて鉱石を増やし、同じ鉱石を１人で採る場合と比べましょう。'};
export const scaledPreparations=[1,2,4],scaledBatches=[2,4],scaledWorkers=[1,2,4,8],scaledModes={fixed:'全体を８箱に固定',scaled:'１人あたり１箱に固定'};
export function scaledCalculate(mode,preparation,batch,workers){
 if(!Object.hasOwn(scaledModes,mode)||!scaledPreparations.includes(preparation)||!scaledBatches.includes(batch)||!scaledWorkers.includes(workers))throw new RangeError('採掘計画が不正です。');
 const boxes=mode==='fixed'?8:workers,one=preparation+batch*boxes,many=preparation+batch*boxes/workers;
 return {boxes,one,many,speedup:one/many,serialFraction:preparation/many};
}
export function scaledCreate(){return {mode:'fixed',preparation:2,batch:2,workers:1,seen:[],baseline:null,assumption:null};}
export function scaledKey(mode,preparation,batch,workers){scaledCalculate(mode,preparation,batch,workers);return `${mode}:${preparation}:${batch}:${workers}`;}
export function scaledReady(q){return scaledPreparations.some(p=>scaledBatches.some(b=>Object.keys(scaledModes).every(m=>[1,4,8].every(n=>q.seen.includes(scaledKey(m,p,b,n))))&&scaledPreparations.some(other=>other!==p&&q.seen.includes(scaledKey('scaled',other,b,4)))));}
export function scaledDone(q){return scaledReady(q)&&q.baseline==='same'&&q.assumption==='ideal';}
export function scaledRestore(q){
 if(!q||!Array.isArray(q.seen)||q.seen.length>48||new Set(q.seen).size!==q.seen.length||![null,'same','original','parallel'].includes(q.baseline)||![null,'ideal','guaranteed','overhead'].includes(q.assumption))throw new RangeError('途中記録が不正です。');
 scaledCalculate(q.mode,q.preparation,q.batch,q.workers);
 for(const key of q.seen){if(typeof key!=='string')throw new RangeError('途中記録が不正です。');const parts=key.split(':');if(parts.length!==4||key!==scaledKey(parts[0],Number(parts[1]),Number(parts[2]),Number(parts[3])))throw new RangeError('途中記録が不正です。');}
 return {mode:q.mode,preparation:q.preparation,batch:q.batch,workers:q.workers,seen:[...q.seen],baseline:q.baseline,assumption:q.assumption};
}
