// Two descriptor changes applied left to right before either message is sent.
export const redirectCases={both:{name:'両方を記録する',goal:'通常の伝言と警告の両方を巻物に残す',order:['file','copy']},split:{name:'警告を広場に残す',goal:'通常の伝言を巻物に、警告を広場に届ける',order:['copy','file']}};
export const redirectActions={file:'通常の出口を巻物につなぐ',copy:'警告の出口を、今の通常の出口と同じにする'};
export function redirectResult(order){
  if(!Array.isArray(order)||order.length>2||order.some(x=>!Object.hasOwn(redirectActions,x)))throw new RangeError('操作が不正です。');
  let out='広場',err='広場';const trace=[{out,err}];
  for(const action of order){if(action==='file')out='巻物';else err=out;trace.push({out,err});}
  return {out,err,trace};
}
export function createRedirect(){return Object.fromEntries(Object.keys(redirectCases).map(id=>[id,{order:[],checked:false}]));}
export function redirectCorrect(id,trial){if(!Object.hasOwn(redirectCases,id)||!trial?.checked||trial.order.length!==2)return false;const actual=redirectResult(trial.order),expected=redirectResult(redirectCases[id].order);return actual.out===expected.out&&actual.err===expected.err;}
export function redirectComplete(trials){return Object.keys(redirectCases).every(id=>redirectCorrect(id,trials[id]));}
export function restoreRedirect(saved){if(saved===undefined)return createRedirect();if(!saved||typeof saved!=='object')throw new RangeError('途中記録が不正です。');const result=createRedirect();for(const id of Object.keys(result)){const item=saved[id];if(!item||!Array.isArray(item.order)||item.order.length>2||item.order.some(x=>!Object.hasOwn(redirectActions,x))||typeof item.checked!=='boolean')throw new RangeError('途中記録が不正です。');result[id]={order:item.order.slice(),checked:item.checked};}return result;}
