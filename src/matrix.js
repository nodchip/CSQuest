import {createProducts,restoreProducts,productsComplete} from './matrix-product.js';
export const matrixLevel={id:'matrix-mirror',number:'86',kind:'matrix',name:'二本の矢印と変換鏡',tag:'行列と線形変換',title:'鏡の四つの数を組もう',story:'遺跡の変換鏡は二本の基準矢印を映します。鏡の四つの数を選び、指定された向きへ二本を同時に動かしましょう。'};
export const matrixCases={rotation:{name:'左への回転',e1:[0,1],e2:[-1,0]},shear:{name:'傾ける鏡',e1:[1,0],e2:[1,1]},collapse:{name:'重なる鏡',e1:[1,0],e2:[1,0]}};
export const matrixValues=[-1,0,1];
export function applyMatrix(matrix,vector){
  if(!Array.isArray(matrix)||matrix.length!==4||matrix.some(n=>!Number.isFinite(n))||!Array.isArray(vector)||vector.length!==2||vector.some(n=>!Number.isFinite(n)))throw new RangeError('行列または矢印が不正です。');
  const [a,b,c,d]=matrix,[x,y]=vector;return [a*x+b*y,c*x+d*y];
}
export function matrixDet(matrix){if(!Array.isArray(matrix)||matrix.length!==4||matrix.some(n=>!Number.isFinite(n)))throw new RangeError('行列が不正です。');return matrix[0]*matrix[3]-matrix[1]*matrix[2];}
export function matrixCorrect(id,trial){if(!Object.hasOwn(matrixCases,id))throw new RangeError('未知の鏡です。');const target=matrixCases[id];return [[1,0],[0,1]].every((v,i)=>applyMatrix(trial.matrix,v).every((x,j)=>x===(i===0?target.e1:target.e2)[j]));}
export function createMatrix(){return {products:createProducts(),selected:'rotation',trials:Object.fromEntries(Object.keys(matrixCases).map(id=>[id,{matrix:[1,0,0,1],cell:0,checked:false}]))};}
export function restoreMatrix(saved){
  if(!saved||!Object.hasOwn(matrixCases,saved.selected)||!saved.trials)throw new RangeError('途中記録が不正です。');const result=createMatrix();result.products=restoreProducts(saved.products);result.selected=saved.selected;
  for(const id of Object.keys(matrixCases)){const t=saved.trials[id];if(!t||!Array.isArray(t.matrix)||t.matrix.length!==4||t.matrix.some(n=>!matrixValues.includes(n))||!Number.isInteger(t.cell)||t.cell<0||t.cell>3||typeof t.checked!=='boolean')throw new RangeError('途中記録が不正です。');result.trials[id]={matrix:t.matrix.slice(),cell:t.cell,checked:t.checked};}return result;
}
export function matrixComplete(state){return Object.keys(matrixCases).every(id=>state.trials[id].checked&&matrixCorrect(id,state.trials[id]))&&productsComplete(state.products);}
