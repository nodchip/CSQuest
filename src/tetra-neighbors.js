import {tetraEdges,tetraMesh} from './tetra-surface.js';

export const neighborNames=['Ａ','Ｂ','Ｃ','Ｄ','Ｅ'];
export const neighborSharedEdges=[[0,1],[0,2],[1,2]];
const cells=[[0,1,2,3],[0,1,2,4]];
const edgeKey=(a,b)=>[a,b].sort((x,y)=>x-y).join(':');

export function neighborMesh(mask) {
 if(!Number.isInteger(mask)||mask<0||mask>31)throw new RangeError('頂点の状態が不正です。');
 const pieces=cells.map(cell=>{
  const localMask=cell.reduce((m,v,i)=>m|((mask&(1<<v))?1<<i:0),0),mesh=tetraMesh(localMask);
  const key=i=>{const [a,b]=tetraEdges[i];return edgeKey(cell[a],cell[b]);};
  return {crossings:mesh.crossings.map(key),triangles:mesh.triangles.map(t=>t.map(key))};
 });
 const vertices=[...new Set(pieces.flatMap(p=>p.crossings))].sort();
 const shared=neighborSharedEdges.flatMap(([a,b],i)=>Boolean(mask&(1<<a))!==Boolean(mask&(1<<b))?[i]:[]);
 return {pieces,vertices,shared};
}
export function neighborCreate(){return {mask:1,selected:[],checked:[],feedback:false};}
export function neighborSetMask(s,mask){neighborMesh(mask);s.mask=mask;s.selected=[];s.feedback=false;}
export function neighborToggle(s,i){if(!Number.isInteger(i)||i<0||i>2)throw new RangeError('辺が不正です。');s.selected=s.selected.includes(i)?s.selected.filter(n=>n!==i):[...s.selected,i];s.feedback=false;}
export function neighborCorrect(s){const expected=neighborMesh(s.mask).shared;return s.feedback&&s.selected.length===expected.length&&expected.every(i=>s.selected.includes(i));}
export function neighborCheck(s){s.feedback=true;const ok=neighborCorrect(s);if(ok&&!s.checked.includes(s.mask))s.checked.push(s.mask);return ok;}
export function neighborRestore(s){
 if(!s||!Array.isArray(s.selected)||!Array.isArray(s.checked)||typeof s.feedback!=='boolean')throw new RangeError('途中記録が不正です。');
 neighborMesh(s.mask);const valid=(a,max)=>new Set(a).size===a.length&&a.every(n=>Number.isInteger(n)&&n>=0&&n<=max);
 if(!valid(s.selected,2)||!valid(s.checked,31))throw new RangeError('途中記録が不正です。');
 return {mask:s.mask,selected:[...s.selected],checked:[...s.checked],feedback:s.feedback};
}
