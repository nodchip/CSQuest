export const shapleyLabLevel={id:'archive-shapley-lab',number:'1081',kind:'shapley-lab',name:'三つの手がかりの分け前',tag:'特徴の寄与と Shapley 値',title:'水晶の予測を分け合う',story:'鑑定士の水晶が３つの手がかりから得点を出します。加える順番を変えて各手がかりの増分を調べましょう。'};
export const shapleyFeatures={A:'光の強さ',B:'石の模様',C:'風の向き'};
export const shapleyOrders=['ABC','ACB','BAC','BCA','CAB','CBA'];
export const shapleyValues=[0,2,2,6,1,5,3,9];
export function shapleyReplay(order,history){
 if(!shapleyOrders.includes(order)||!Array.isArray(history)||history.length>3)throw new RangeError('記録が不正です');
 let mask=0;const steps=[];for(let i=0;i<history.length;i++){const event=history[i],feature=order[i],bit=1<<'ABC'.indexOf(feature),before=shapleyValues[mask],after=shapleyValues[mask|bit],delta=after-before;if(!event||event.feature!==feature||event.guess!==delta)throw new RangeError('増分の記録が不正です');steps.push({feature,before,after,delta});mask|=bit;}return {mask,score:shapleyValues[mask],steps,done:history.length===3};
}
export function shapleyCreate(){return {order:'ABC',guess:null,histories:Object.fromEntries(shapleyOrders.map(o=>[o,[]])),reflection:null,causal:null};}
export function shapleyAverage(histories){
 const totals={A:0,B:0,C:0};for(const o of shapleyOrders){const r=shapleyReplay(o,histories[o]);if(!r.done)return null;for(const s of r.steps)totals[s.feature]+=s.delta;}return Object.fromEntries(Object.entries(totals).map(([k,v])=>[k,v/6]));
}
export function shapleyDone(q){return shapleyAverage(q.histories)!==null&&q.reflection==='average'&&q.causal==='not-causal';}
export function shapleyRestore(q){
 if(!q||!shapleyOrders.includes(q.order)||![null,0,1,2,3,4,5,6,7,8,9].includes(q.guess)||!q.histories||![null,'average','single'].includes(q.reflection)||![null,'not-causal','causal'].includes(q.causal))throw new RangeError('途中記録が不正です');
 const histories={};for(const o of shapleyOrders){shapleyReplay(o,q.histories[o]);histories[o]=q.histories[o].map(e=>({...e}));}return {order:q.order,guess:q.guess,histories,reflection:q.reflection,causal:q.causal};
}
