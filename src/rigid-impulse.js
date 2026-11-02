export const rigidLevel={id:'ruin-rigid-impulse',number:'853',kind:'rigid-impulse',name:'回る天秤と光の衝撃',tag:'剛体の並進と回転',title:'衝撃の場所を選ぼう',story:'遺跡の空中に、両端に珠をつけた棒が浮かんでいます。光の衝撃を加える場所と向きを変え、棒の移動と回転を比べましょう。'};
export const rigidPlaces={left:{name:'左端',x:-1},center:{name:'中心',x:0},right:{name:'右端',x:1}};
export const rigidDirections={up:{name:'上向き',impulse:2},down:{name:'下向き',impulse:-2}};
export const rigidTurns={ccw:'反時計回り',cw:'時計回り',none:'回転しない'};
export function rigidResult(place,direction){
 if(!Object.hasOwn(rigidPlaces,place)||!Object.hasOwn(rigidDirections,direction))throw new RangeError('条件が不正です。');
 const impulse=rigidDirections[direction].impulse,angularImpulse=rigidPlaces[place].x===0?0:rigidPlaces[place].x*impulse,vy=impulse/2,omega=angularImpulse/2,angle=omega*0.5,centerY=vy*0.5;
 return {impulse,angularImpulse,vy,omega,angle,centerY,turn:omega>0?'ccw':omega<0?'cw':'none'};
}
export function rigidCreate(){return {place:'left',direction:'up',trials:Object.fromEntries(Object.keys(rigidPlaces).flatMap(p=>Object.keys(rigidDirections).map(d=>[`${p}:${d}`,{guess:null,checked:false}]))),answer:null};}
export function rigidCheck(q){const t=q.trials[`${q.place}:${q.direction}`];t.checked=t.guess===rigidResult(q.place,q.direction).turn;return t.checked;}
export function rigidComplete(q){return Object.keys(rigidPlaces).every(p=>Object.keys(rigidDirections).every(d=>{const t=q.trials[`${p}:${d}`];return t.checked&&t.guess===rigidResult(p,d).turn;}))&&q.answer==='both';}
export function rigidRestore(q){
 if(!q||!Object.hasOwn(rigidPlaces,q.place)||!Object.hasOwn(rigidDirections,q.direction)||!q.trials||![null,'both','center','rotation'].includes(q.answer))throw new RangeError('記録が不正です。');
 const n=rigidCreate();n.place=q.place;n.direction=q.direction;n.answer=q.answer;
 for(const p of Object.keys(rigidPlaces))for(const d of Object.keys(rigidDirections)){const key=`${p}:${d}`,t=q.trials[key];if(!t||![null,...Object.keys(rigidTurns)].includes(t.guess)||typeof t.checked!=='boolean'||t.checked&&t.guess!==rigidResult(p,d).turn)throw new RangeError('記録が不正です。');n.trials[key]={guess:t.guess,checked:t.checked};}
 return n;
}
