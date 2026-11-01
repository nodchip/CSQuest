export const modelViewMotionLevel={id:'ruin-model-view-motion',number:'636',kind:'model-view-motion',name:'宝石と動くカメラ',tag:'モデル変換とビュー変換',title:'カメラと宝石を動かそう',story:'遺跡を映す魔法の鏡で、宝石だけを動かした時と、鏡を動かした時の見え方を比べましょう。'};
export const modelViewOffsets=[-2,0,2];
export const modelViewRequired=['0,0,0','-2,0,0','-2,-2,0','0,0,2'];
export function modelViewScene(crystalOffset,towerOffset,camera){
 if(![crystalOffset,towerOffset,camera].every(v=>modelViewOffsets.includes(v)))throw new RangeError('移動量が不正です。');
 const world={crystal:4+crystalOffset,tower:7+towerOffset,camera};return {world,view:{crystal:world.crystal-camera,tower:world.tower-camera}};
}
export function createModelViewMotion(){return {crystal:0,tower:0,camera:0,observed:[],answers:{match:null,landmark:null},reflection:null,checked:false};}
export function modelViewMotionComplete(s){return modelViewRequired.every(key=>s.observed.includes(key))&&s.answers.match==='world'&&s.answers.landmark==='different'&&s.reflection==='relative'&&s.checked;}
export function restoreModelViewMotion(s){
 const valid=new Set(modelViewOffsets.flatMap(a=>modelViewOffsets.flatMap(b=>modelViewOffsets.map(c=>`${a},${b},${c}`))));
 if(!s||![s.crystal,s.tower,s.camera].every(v=>modelViewOffsets.includes(v))||!Array.isArray(s.observed)||new Set(s.observed).size!==s.observed.length||s.observed.some(k=>!valid.has(k))||!s.answers||![null,'world','crystal','none'].includes(s.answers.match)||![null,'same','different'].includes(s.answers.landmark)||![null,'relative','absolute','fixed'].includes(s.reflection)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');
 return {...s,observed:[...s.observed],answers:{...s.answers}};
}
