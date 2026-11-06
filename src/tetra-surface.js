// 四面体の頂点と６辺。値は各頂点で -1 または +1。
export const tetraVertices = [[0,0,0],[2,0,0],[0,2,0],[0,0,2]];
export const tetraEdges = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
export const tetraNames = ['Ａ','Ｂ','Ｃ','Ｄ'];
const edgeId = (a,b)=>tetraEdges.findIndex(([x,y])=>(x===a&&y===b)||(x===b&&y===a));

export function tetraCrossings(mask) {
  if(!Number.isInteger(mask)||mask<0||mask>15)throw new RangeError('頂点の状態が不正です。');
  return tetraEdges.flatMap(([a,b],i)=>Boolean(mask&(1<<a))!==Boolean(mask&(1<<b))?[i]:[]);
}
export function tetraMesh(mask) {
  const crossings=tetraCrossings(mask);
  const points=crossings.map(i=>tetraEdges[i].map(v=>tetraVertices[v]).reduce((a,b)=>a.map((x,j)=>x+b[j])).map(x=>x/2));
  if(crossings.length===0)return {crossings,points,triangles:[]};
  if(crossings.length===3)return {crossings,points,triangles:[[...crossings]]};
  const positive=[0,1,2,3].filter(i=>mask&(1<<i)),negative=[0,1,2,3].filter(i=>!(mask&(1<<i)));
  const [a,b]=positive,[c,d]=negative;
  const ring=[edgeId(a,c),edgeId(a,d),edgeId(b,d),edgeId(b,c)];
  return {crossings,points,triangles:[[ring[0],ring[1],ring[2]],[ring[0],ring[2],ring[3]]]};
}
export function tetraCreate(){return {mask:1,selected:[],checked:[],feedback:false};}
export function tetraSetMask(s,mask){tetraCrossings(mask);s.mask=mask;s.selected=[];s.feedback=false;}
export function tetraToggleEdge(s,edge){if(!Number.isInteger(edge)||edge<0||edge>5)throw new RangeError('辺が不正です。');s.selected=s.selected.includes(edge)?s.selected.filter(i=>i!==edge):[...s.selected,edge];s.feedback=false;}
export function tetraCorrect(s){const expected=tetraCrossings(s.mask);return s.feedback&&s.selected.length===expected.length&&expected.every(i=>s.selected.includes(i));}
export function tetraCheck(s){s.feedback=true;const ok=tetraCorrect(s);if(ok&&!s.checked.includes(s.mask))s.checked.push(s.mask);return ok;}
export function tetraRestore(s){
 if(!s||!Array.isArray(s.selected)||!Array.isArray(s.checked)||typeof s.feedback!=='boolean')throw new RangeError('立体の記録が不正です。');
 tetraCrossings(s.mask);
 const valid=(a,max)=>new Set(a).size===a.length&&a.every(i=>Number.isInteger(i)&&i>=0&&i<=max);
 if(!valid(s.selected,5)||!valid(s.checked,15))throw new RangeError('立体の記録が不正です。');
 return {mask:s.mask,selected:[...s.selected],checked:[...s.checked],feedback:s.feedback};
}
