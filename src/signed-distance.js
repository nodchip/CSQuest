import {tetraCreate,tetraRestore} from './tetra-surface.js';
import {contourCreate,contourRestore} from './contour-cell.js';
export const distanceLevel={id:'ruin-signed-distance',number:'723',kind:'signed-distance',name:'境界までの距離',tag:'符号付き距離場',title:'封印の境界を探る',story:'円形の封印からの距離を調べ、内側・境界・外側を見分けましょう。'};
export const distancePoints=Array.from({length:25},(_,i)=>({x:i%5-2,y:2-Math.floor(i/5)}));
export const distanceCases={inside:'内側（負）',boundary:'円周（０）',outside:'外側（正）'};
export function signedDistance(x,y){return Math.hypot(x,y)-2;}
export function implicitValue(x,y){return x*x+y*y-4;}
export function distanceExpected(id){if(!Object.hasOwn(distanceCases,id))throw new RangeError('未知の条件です。');return distancePoints.flatMap(({x,y},i)=>{const n=x*x+y*y;return (id==='inside'?n<4:id==='boundary'?n===4:n>4)?[i]:[];});}
export function distanceCreate(){return {selected:'inside',trials:Object.fromEntries(Object.keys(distanceCases).map(id=>[id,{points:[],checked:false}])),answer:'',answerChecked:false,contour:contourCreate(),tetra:tetraCreate()};}
export function distanceCorrect(t,id){const e=distanceExpected(id);return t.checked&&t.points.length===e.length&&e.every(i=>t.points.includes(i));}
export function distanceComplete(s){return Object.keys(distanceCases).every(id=>distanceCorrect(s.trials[id],id))&&s.answerChecked&&s.answer==='different';}
export function distanceRestore(s){if(!s||!Object.hasOwn(distanceCases,s.selected)||!s.trials||!['','different','same','opposite'].includes(s.answer)||typeof s.answerChecked!=='boolean')throw new RangeError('途中記録が不正です。');const out=distanceCreate();out.selected=s.selected;out.answer=s.answer;out.answerChecked=s.answerChecked;out.contour=s.contour===undefined?contourCreate():contourRestore(s.contour);out.tetra=s.tetra===undefined?tetraCreate():tetraRestore(s.tetra);for(const id of Object.keys(distanceCases)){const t=s.trials[id];if(!t||!Array.isArray(t.points)||new Set(t.points).size!==t.points.length||t.points.some(i=>!Number.isInteger(i)||i<0||i>=25)||typeof t.checked!=='boolean')throw new RangeError('途中記録が不正です。');out.trials[id]={points:[...t.points],checked:t.checked};}return out;}
