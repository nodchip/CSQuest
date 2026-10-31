export const projectionLevel={id:'lantern-projection',number:'64',kind:'projection',name:'遠近の灯りを映す鏡',tag:'投影とカメラ',title:'遠くの灯りを映そう',story:'遺跡の鏡に、同じ横位置で奥行きの違う二つの灯りを映します。鏡の映し方で位置はどう変わるでしょう。'};
export const projectionPoints={near:{name:'近い灯り',x:8,z:4},far:{name:'遠い灯り',x:8,z:8}};
export const projectionCases={parallel:{name:'平行投影',type:'parallel',f:2},wide:{name:'透視・鏡が近い',type:'perspective',f:1},narrow:{name:'透視・鏡が遠い',type:'perspective',f:2}};
export const projectionOptions=[0,1,2,3,4,8];
export function projectX(point,mode){if(!point||!Number.isFinite(point.x)||!Number.isFinite(point.z)||point.z<=0||!mode||!['parallel','perspective'].includes(mode.type)||!Number.isFinite(mode.f)||mode.f<=0)throw new RangeError('投影の条件が不正です。');return mode.type==='parallel'?point.x:mode.f*point.x/point.z;}
export function projectionResult(id,selection){if(!Object.hasOwn(projectionCases,id))throw new RangeError('未知の鏡です。');return Object.fromEntries(Object.entries(projectionPoints).map(([key,point])=>[key,selection[key]===projectX(point,projectionCases[id])]));}
export function createProjection(){return {selected:'parallel',choices:Object.fromEntries(Object.keys(projectionCases).map(id=>[id,{near:null,far:null,checked:false}]))};}
export function restoreProjection(saved){
  if(!saved||!Object.hasOwn(projectionCases,saved.selected)||!saved.choices)throw new RangeError('途中記録が不正です。');const s=createProjection();s.selected=saved.selected;
  for(const id of Object.keys(projectionCases)){const c=saved.choices[id];if(!c||![null,...projectionOptions].includes(c.near)||![null,...projectionOptions].includes(c.far)||typeof c.checked!=='boolean')throw new RangeError('途中記録が不正です。');s.choices[id]={near:c.near,far:c.far,checked:c.checked};}return s;
}
export function projectionComplete(s){return Object.keys(projectionCases).every(id=>{const c=s.choices[id],r=projectionResult(id,c);return c.checked&&r.near&&r.far;});}
