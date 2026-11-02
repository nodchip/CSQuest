export const chipletLevel={id:'workshop-chiplet-package',number:'879',kind:'chiplet-package',name:'二つの魔石をつなぐ工房',tag:'チップレットと３次元集積',title:'部品を試して組み立てよう',story:'計算と記録の魔石を一体で作るか、別々に作って組み立てるかを比べます。横に並べる方法と重ねる方法も検討しましょう。'};
export const chipletCases={mono:{name:'一枚で作る',kind:'mono'},side:{name:'２部品を横に並べる',kind:'chiplet',pack:5},stack:{name:'２部品を重ねる',kind:'chiplet',pack:20}};
export function chipletEstimate(id,stage){
 if(!Object.hasOwn(chipletCases,id)||!Number.isInteger(stage)||stage<0||stage>2)throw new RangeError('条件が不正です。');
 const item=chipletCases[id],parts=item.kind==='mono'?100:2*(50/0.8),attempt=item.kind==='mono'?100:parts+item.pack,success=item.kind==='mono'?0.64:0.9;
 return {parts,attempt,success,cost:attempt/success,stage,done:stage===2};
}
export function chipletCreate(){return {scenario:'mono',stages:{mono:0,side:0,stack:0},cost:null,limits:null};}
export function chipletComplete(q){return Object.keys(chipletCases).every(id=>q.stages[id]===2)&&q.cost==='depends'&&q.limits==='thermal';}
export function chipletRestore(q){if(!q||!Object.hasOwn(chipletCases,q.scenario)||![null,'depends','always','never'].includes(q.cost)||![null,'thermal','free','same'].includes(q.limits))throw new RangeError('記録が不正です。');for(const id of Object.keys(chipletCases))chipletEstimate(id,q.stages?.[id]);return {scenario:q.scenario,stages:{mono:q.stages.mono,side:q.stages.side,stack:q.stages.stack},cost:q.cost,limits:q.limits};}
