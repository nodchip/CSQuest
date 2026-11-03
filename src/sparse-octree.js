import {volumeSamples} from './volume-ray.js';
export const octreeLevel={id:'ruin-sparse-octree',number:'1174',kind:'sparse-octree',name:'水晶の空間を分ける',tag:'ボクセルと八分木',title:'空の領域を省いて水晶を記録',story:'依頼1173の光線が通った霧を、小さな立方体の地図に記録します。空間を８分割し、霧のある部分だけを細かく調べましょう。'};
export const octreeVoxels=[...volumeSamples.map((s,z)=>({x:0,y:0,z,value:s.value})),{x:3,y:3,z:3,value:1},{x:3,y:0,z:3,value:2}];
export const octant=(x,y,z)=>Math.floor(x/2)+2*Math.floor(y/2)+4*Math.floor(z/2);
export const localOctant=(x,y,z)=>x%2+2*(y%2)+4*(z%2);
export const octantLabel=i=>`x${i%2} y${Math.floor(i/2)%2} z${Math.floor(i/4)}`;
export const occupiedOctants=()=>[...new Set(octreeVoxels.map(v=>octant(v.x,v.y,v.z)))].sort((a,b)=>a-b);
export const occupiedChildren=i=>octreeVoxels.filter(v=>octant(v.x,v.y,v.z)===i).map(v=>localOctant(v.x,v.y,v.z)).sort((a,b)=>a-b);
export const octreeSame=(a,b)=>a.length===b.length&&a.every(x=>b.includes(x));
export function octreeCreate(){return {parents:[],parentsChecked:false,group:0,children:Object.fromEntries(occupiedOctants().map(i=>[i,[]])),checked:Object.fromEntries(occupiedOctants().map(i=>[i,false])),answer:null,answerChecked:false};}
export const parentsCorrect=q=>q.parentsChecked&&octreeSame(q.parents,occupiedOctants());
export const childCorrect=(q,i)=>q.checked[i]&&octreeSame(q.children[i],occupiedChildren(i));
export const octreeDone=q=>parentsCorrect(q)&&occupiedOctants().every(i=>childCorrect(q,i))&&q.answerChecked&&q.answer==='overhead';
export function octreeRestore(q){const valid=a=>Array.isArray(a)&&new Set(a).size===a.length&&a.every(i=>Number.isInteger(i)&&i>=0&&i<8);const groups=occupiedOctants();if(!q||!valid(q.parents)||typeof q.parentsChecked!=='boolean'||!groups.includes(q.group)||!q.children||!q.checked||![null,'overhead','guaranteed'].includes(q.answer)||typeof q.answerChecked!=='boolean'||groups.some(i=>!valid(q.children[i])||typeof q.checked[i]!=='boolean'))throw new RangeError('途中記録が不正です');return {...q,parents:[...q.parents],children:Object.fromEntries(groups.map(i=>[i,[...q.children[i]]])),checked:Object.fromEntries(groups.map(i=>[i,q.checked[i]]))};}
