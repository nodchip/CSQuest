export const vectorsLevel={id:'light-vectors',number:'50',kind:'vectors',name:'光の矢印を比べよう',tag:'ベクトルと内積',title:'遺跡の光を合わせる',story:'遺跡に基準の光の矢印があります。別の光を選び、同じ側、直角、反対側に向く場合を調べましょう。'};
export const anchor=[2,1];
export const rays={sun:{name:'太陽',vector:[1,0]},moon:{name:'月',vector:[1,-2]},shadow:{name:'影',vector:[-2,-1]}};
export const vectorCases={positive:{name:'同じ側に向く',sign:'positive'},zero:{name:'直角に向く',sign:'zero'},negative:{name:'反対側に向く',sign:'negative'}};
export const dotOptions=[-5,0,2,5];
export function dot(a,b){
  if(!Array.isArray(a)||!Array.isArray(b)||a.length!==2||b.length!==2||![...a,...b].every(Number.isFinite))throw new RangeError('２次元の数の組が必要です。');
  return a[0]*b[0]+a[1]*b[1];
}
export function checkVector(id,choice){
  if(!Object.hasOwn(vectorCases,id))throw new RangeError('未知の試練です。');
  if(!Object.hasOwn(rays,choice.ray))return {ray:false,value:false,dot:null};
  const value=dot(anchor,rays[choice.ray].vector),sign=value>0?'positive':value<0?'negative':'zero';
  return {ray:sign===vectorCases[id].sign,value:choice.value===value,dot:value};
}
export function createVectors(){return {selected:'positive',choices:Object.fromEntries(Object.keys(vectorCases).map(id=>[id,{ray:'',value:null,tested:false}]))};}
export function restoreVectors(saved){
  if(!saved||!Object.hasOwn(vectorCases,saved.selected)||!saved.choices)throw new RangeError('途中記録が不正です。');
  const state=createVectors();state.selected=saved.selected;
  for(const id of Object.keys(vectorCases)){
    const c=saved.choices[id];if(!c||typeof c.ray!=='string'||!(c.ray===''||Object.hasOwn(rays,c.ray))||!(c.value===null||dotOptions.includes(c.value))||typeof c.tested!=='boolean')throw new RangeError('途中記録が不正です。');
    state.choices[id]={ray:c.ray,value:c.value,tested:c.tested};
  }return state;
}
export function vectorsComplete(state){return Object.keys(vectorCases).every(id=>{const c=state.choices[id],r=checkVector(id,c);return c.tested&&r.ray&&r.value;});}
