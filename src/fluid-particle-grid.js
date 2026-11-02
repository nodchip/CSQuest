export const fluidGridLevel={id:'ruin-fluid-particle-grid',number:'855',kind:'fluid-particle-grid',name:'水の粒と格子の伝言',tag:'粒子と格子の流体表現',title:'二粒の速度を比べよう',story:'遺跡の水の粒が、格子の灯りと速度をやり取りします。粒を独立に動かす方法と、格子を介する二つの方法を比べましょう。'};
export const fluidGridCases={push:{name:'右向きの変化',velocities:[1,3],change:1},pull:{name:'左向きの変化',velocities:[0,4],change:-1}};
export const fluidGridModes={ballistic:'粒を独立に動かす',pic:'PIC：格子の新しい速度を使う',flip:'FLIP：格子の速度変化を加える'};
export const fluidGridValues=[-1,0,1,2,3,4];
// Two equal-mass particles have weight one at the same fixed grid node; dt=1.
export function fluidGridResult(id,mode){
 if(!Object.hasOwn(fluidGridCases,id)||!Object.hasOwn(fluidGridModes,mode))throw new RangeError('条件が不正です。');
 const c=fluidGridCases[id],gridBefore=(c.velocities[0]+c.velocities[1])/2,gridAfter=gridBefore+c.change;
 const velocities=mode==='pic'?[gridAfter,gridAfter]:c.velocities.map(v=>v+c.change),positions=velocities.map((v,i)=>i+v);
 return {gridBefore,gridAfter,velocities,positions};
}
export function fluidGridCreate(){return {selected:'push',mode:'ballistic',trials:Object.fromEntries(Object.keys(fluidGridCases).flatMap(id=>Object.keys(fluidGridModes).map(m=>[`${id}:${m}`,{guess:[null,null],checked:false}]))),representation:null,transfer:null};}
export function fluidGridCheck(q){const t=q.trials[`${q.selected}:${q.mode}`],r=fluidGridResult(q.selected,q.mode);t.checked=t.guess.every((v,i)=>v===r.velocities[i]);return t.checked;}
export function fluidGridComplete(q){return Object.keys(fluidGridCases).every(id=>Object.keys(fluidGridModes).every(m=>{const t=q.trials[`${id}:${m}`],r=fluidGridResult(id,m);return t.checked&&t.guess.every((v,i)=>v===r.velocities[i]);}))&&q.representation==='particle'&&q.transfer==='difference';}
export function fluidGridRestore(q){
 if(!q||!Object.hasOwn(fluidGridCases,q.selected)||!Object.hasOwn(fluidGridModes,q.mode)||!q.trials||![null,'particle','fixed','identical'].includes(q.representation)||![null,'difference','always','stop'].includes(q.transfer))throw new RangeError('記録が不正です。');
 const n=fluidGridCreate();n.selected=q.selected;n.mode=q.mode;n.representation=q.representation;n.transfer=q.transfer;
 for(const id of Object.keys(fluidGridCases))for(const mode of Object.keys(fluidGridModes)){const key=`${id}:${mode}`,t=q.trials[key],r=fluidGridResult(id,mode);if(!t||!Array.isArray(t.guess)||t.guess.length!==2||!t.guess.every(v=>v===null||fluidGridValues.includes(v))||typeof t.checked!=='boolean'||t.checked&&!t.guess.every((v,i)=>v===r.velocities[i]))throw new RangeError('記録が不正です。');n.trials[key]={guess:[...t.guess],checked:t.checked};}
 return n;
}
