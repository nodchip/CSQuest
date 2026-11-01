export const partialPlanLevel={id:'village-partial-plan',number:'541',kind:'partial-plan',name:'薬草運びの順序を結ぶ',tag:'半順序計画',title:'必要な順序だけを結ぼう',story:'薬師たちは二種類の薬草を集め、薬を調合して村へ届けます。余計な順番を決めずに計画を作りましょう。'};
export const planActions={moon:'月草を集める',star:'星草を集める',mix:'二つを調合する',deliver:'薬を届ける'};
export const planEdges=Object.keys(planActions).flatMap(a=>Object.keys(planActions).filter(b=>a!==b).map(b=>[a,b]));
function permutations(xs){if(!xs.length)return [[]];return xs.flatMap((x,i)=>permutations(xs.filter((_,j)=>i!==j)).map(rest=>[x,...rest]));}
export const planOrders=permutations(Object.keys(planActions));
export function validActionOrder(order){const seen=new Set();for(const action of order){if(action==='mix'&&(!seen.has('moon')||!seen.has('star')))return false;if(action==='deliver'&&!seen.has('mix'))return false;seen.add(action);}return true;}
export function evaluatePartialPlan(mask){if(!Number.isInteger(mask)||mask<0||mask>=1<<planEdges.length)throw new RangeError('順序が不正です。');const permits=order=>planEdges.every(([a,b],i)=>!(mask&(1<<i))||order.indexOf(a)<order.indexOf(b));const accepted=planOrders.filter(permits),unsafe=accepted.filter(o=>!validActionOrder(o)),excluded=planOrders.filter(o=>validActionOrder(o)&&!permits(o));return {accepted,unsafe,excluded};}
export function createPartialPlan(){return {mask:0,checked:false,reflection:null,finished:false};}
export function partialPlanComplete(s){const r=evaluatePartialPlan(s.mask);return s.checked&&r.accepted.length>0&&r.unsafe.length===0&&r.excluded.length===0&&s.reflection==='flexible'&&s.finished;}
export function restorePartialPlan(s){if(!s||!Number.isInteger(s.mask)||s.mask<0||s.mask>=1<<planEdges.length||typeof s.checked!=='boolean'||![null,'flexible','simultaneous','cycle'].includes(s.reflection)||typeof s.finished!=='boolean')throw new RangeError('途中記録が不正です。');return {...s};}
