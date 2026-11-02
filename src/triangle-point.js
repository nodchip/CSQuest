export const trianglePointLevel={id:'ruin-triangle-point',number:'847',kind:'triangle-point',name:'三角の封印と光の粒',tag:'点と三角形の判定',title:'光の粒の場所を見分けよう',story:'遺跡の三角の封印に光の粒が近づいています。粒を動かし、内側、境界、外側を確かめましょう。'};
export const trianglePointGoals={inside:{name:'内側',target:'inside'},edge:{name:'辺の上（頂点以外）',target:'edge'},vertex:{name:'頂点',target:'vertex'},outside:{name:'外側',target:'outside'}};
export const trianglePointLabels={inside:'内側',edge:'辺の上（頂点以外）',vertex:'頂点',outside:'外側'};
// Counterclockwise vertices A=(0,0), B=(4,0), C=(1,3).
export function trianglePointResult(x,y){
 if(!Number.isInteger(x)||!Number.isInteger(y)||x<0||x>4||y<0||y>3)throw new RangeError('座標が不正です。');
 const sides=[4*y,12-3*x-3*y,3*x-y],zero=sides.filter(v=>v===0).length;
 const status=sides.some(v=>v<0)?'outside':zero>=2?'vertex':zero===1?'edge':'inside';return {sides,status};
}
export function trianglePointCreate(){return {selected:'inside',trials:Object.fromEntries(Object.keys(trianglePointGoals).map(id=>[id,{x:4,y:3,checked:false}]))};}
export function trianglePointComplete(q){return Object.entries(trianglePointGoals).every(([id,goal])=>q.trials[id].checked&&trianglePointResult(q.trials[id].x,q.trials[id].y).status===goal.target);}
export function trianglePointRestore(q){if(!q||!Object.hasOwn(trianglePointGoals,q.selected)||!q.trials)throw new RangeError('記録が不正です。');const n=trianglePointCreate();n.selected=q.selected;for(const [id,goal] of Object.entries(trianglePointGoals)){const t=q.trials[id];if(!t||typeof t.checked!=='boolean')throw new RangeError('記録が不正です。');const result=trianglePointResult(t.x,t.y);if(t.checked&&result.status!==goal.target)throw new RangeError('記録が不正です。');n.trials[id]={x:t.x,y:t.y,checked:t.checked};}return n;}
