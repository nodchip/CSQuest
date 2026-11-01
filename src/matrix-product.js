export const productMatrices={A:[[1,2,0],[0,1,1]],B:[[1,0],[0,1],[1,1]],C:[[2,0],[0,1]]};
export const productCases={ab:{name:'A の後に B を掛ける',left:'A',right:'B'},ba:{name:'B の後に A を掛ける',left:'B',right:'A'},ac:{name:'A の後に C を掛ける',left:'A',right:'C'},ca:{name:'C の後に A を掛ける',left:'C',right:'A'}};
export function multiplyMatrices(a,b){
  const valid=m=>Array.isArray(m)&&m.length>0&&m.every(row=>Array.isArray(row)&&row.length>0&&row.length===m[0].length&&row.every(Number.isFinite));
  if(!valid(a)||!valid(b))throw new RangeError('行列が不正です。');
  if(a[0].length!==b.length)return null;
  return a.map(row=>b[0].map((_,j)=>row.reduce((sum,value,k)=>sum+value*b[k][j],0)));
}
export function productResult(id){if(!Object.hasOwn(productCases,id))throw new RangeError('場面が不正です。');const c=productCases[id];return multiplyMatrices(productMatrices[c.left],productMatrices[c.right]);}
export function createProducts(){return Object.fromEntries(Object.keys(productCases).map(id=>[id,{shape:'',cell:'',checked:false}]));}
export function productCorrect(id,t){if(!t?.checked)return false;const result=productResult(id);return result?t.shape===`${result.length}x${result[0].length}`&&t.cell===String(result[0][0]):t.shape==='none'&&t.cell==='none';}
export function productsComplete(s){return Object.keys(productCases).every(id=>productCorrect(id,s[id]));}
export function restoreProducts(saved){if(saved===undefined)return createProducts();if(!saved||typeof saved!=='object')throw new RangeError('途中記録が不正です。');const s=createProducts();for(const id of Object.keys(s)){const t=saved[id];if(!t||!['','2x2','3x3','2x3','none'].includes(t.shape)||!['','0','1','2','3','none'].includes(t.cell)||typeof t.checked!=='boolean')throw new RangeError('途中記録が不正です。');s[id]={shape:t.shape,cell:t.cell,checked:t.checked};}return s;}
