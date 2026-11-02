export const pressureLevel={id:'ruin-pressure-projection',number:'850',kind:'pressure-projection',name:'四つの部屋と霧の流れ',tag:'流体の圧力投影',title:'霧の出入りを整えよう',story:'遺跡の四つの部屋に霧が流れています。各部屋の出入りがつり合うよう、圧力の札を置きましょう。'};
export const pressureCases={push:{name:'横へ押す流れ',flows:[1,0,0,1]},swirl:{name:'回る流れを含む',flows:[3,-1,1,1]}};
export const pressureCells=['B','C','D'];
export const pressureValues=[0,1,2,3];
// Flow order: A→B, A→C, B→D, C→D; outside-wall flow is zero.
export function pressureDivergence([ab,ac,bd,cd]){return [ab+ac,bd-ab,cd-ac,-bd-cd].map(x=>x===0?0:x);}
export function pressureResult(id,pressures){
 if(!Object.hasOwn(pressureCases,id)||!pressures||!pressureCells.every(k=>pressureValues.includes(pressures[k])))throw new RangeError('条件が不正です。');
 const p=[0,pressures.B,pressures.C,pressures.D],before=pressureCases[id].flows,gradient=[p[1]-p[0],p[2]-p[0],p[3]-p[1],p[3]-p[2]],after=before.map((f,i)=>f-gradient[i]);
 return {before:[...before],beforeDivergence:pressureDivergence(before),gradient,after,afterDivergence:pressureDivergence(after)};
}
export function pressureCreate(){return {selected:'push',trials:Object.fromEntries(Object.keys(pressureCases).map(id=>[id,{pressures:{B:0,C:0,D:0},checked:false}])),answer:null};}
export function pressureCheck(q){const t=q.trials[q.selected];t.checked=pressureResult(q.selected,t.pressures).afterDivergence.every(x=>x===0);return t.checked;}
export function pressureComplete(q){return Object.keys(pressureCases).every(id=>{const t=q.trials[id];return t.checked&&pressureResult(id,t.pressures).afterDivergence.every(x=>x===0);})&&q.answer==='circulate';}
export function pressureRestore(q){if(!q||!Object.hasOwn(pressureCases,q.selected)||!q.trials||![null,'circulate','stop','smoke'].includes(q.answer))throw new RangeError('記録が不正です。');const n=pressureCreate();n.selected=q.selected;n.answer=q.answer;for(const id of Object.keys(pressureCases)){const t=q.trials[id];if(!t||typeof t.checked!=='boolean')throw new RangeError('記録が不正です。');const r=pressureResult(id,t.pressures);if(t.checked&&!r.afterDivergence.every(x=>x===0))throw new RangeError('記録が不正です。');n.trials[id]={pressures:{B:t.pressures.B,C:t.pressures.C,D:t.pressures.D},checked:t.checked};}return n;}
