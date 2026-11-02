export const tileLevel={id:'forge-tile-rendering',number:'869',kind:'tile-rendering',name:'二つの石と描画の順番',tag:'即時描画とタイル',title:'重なった紋章を描こう',story:'鍛冶場の二つの光る石に三枚の紋章を重ねます。描く順番と一時的な棚の使い方を変え、同じ絵までの仕事を比べましょう。'};
export const tileObjects={far:{name:'遠い金の紋章',depth:9,color:'金',pixels:[0,1]},mid:{name:'中間の青い紋章',depth:4,color:'青',pixels:[0,1]},near:{name:'近い赤い紋章',depth:1,color:'赤',pixels:[0]}};
export const tileModes={immediate:'通過ごとに外へ書く',tiled:'タイル内にまとめる'};
export const tileOrders={far:'遠い順',near:'近い順'};
const sequence={far:['far','mid','near'],near:['near','mid','far']};
export function tileReplay(mode,order,history){
 if(!Object.hasOwn(tileModes,mode)||!Object.hasOwn(tileOrders,order)||!Array.isArray(history))throw new RangeError('記録が不正です。');
 const actions=[...sequence[order].map(id=>`draw:${id}`),...(mode==='tiled'?['flush']:[])];if(history.length>actions.length)throw new RangeError('記録が長すぎます。');
 const pixels=[{depth:Infinity,color:'空'},{depth:Infinity,color:'空'}];let tested=0,shaded=0,writes=0;
 for(let i=0;i<history.length;i++){
  if(history[i]!==actions[i])throw new RangeError('次の紋章を確認しましょう。');
  if(history[i]==='flush'){writes+=pixels.filter(p=>p.depth<Infinity).length;continue;}
  const obj=tileObjects[history[i].slice(5)];for(const pixel of obj.pixels){tested++;if(obj.depth<pixels[pixel].depth){pixels[pixel]={depth:obj.depth,color:obj.color};shaded++;if(mode==='immediate')writes++;}}
 }
 return {pixels,tested,shaded,writes,next:actions[history.length]??null,finished:history.length===actions.length};
}
export function tileCreate(){return {mode:'immediate',order:'far',histories:{'immediate:far':[],'immediate:near':[],'tiled:far':[],'tiled:near':[]},reflection:null};}
export function tileStep(q,action){const history=q.histories[`${q.mode}:${q.order}`];tileReplay(q.mode,q.order,[...history,action]);history.push(action);}
export function tileComplete(q){return Object.keys(tileModes).every(mode=>Object.keys(tileOrders).every(order=>tileReplay(mode,order,q.histories[`${mode}:${order}`]).finished))&&q.reflection==='order';}
export function tileRestore(q){
 if(!q||!Object.hasOwn(tileModes,q.mode)||!Object.hasOwn(tileOrders,q.order)||!q.histories||![null,'order','fixed','same'].includes(q.reflection))throw new RangeError('記録が不正です。');const copy=tileCreate();copy.mode=q.mode;copy.order=q.order;copy.reflection=q.reflection;
 for(const mode of Object.keys(tileModes))for(const order of Object.keys(tileOrders)){const key=`${mode}:${order}`,history=q.histories[key];tileReplay(mode,order,history);copy.histories[key]=[...history];}return copy;
}
