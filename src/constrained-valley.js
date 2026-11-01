import {partialLoss} from './partial-gradient.js';
export const constrainedValleyLevel={id:'archive-constrained-valley',number:'479',kind:'constrained-valley',name:'限られた光の配分',tag:'制約付き最適化',title:'使える光で誤差を小さくしよう',story:'鑑定士は二つの調整に、合計２の光を配分します。前の依頼と同じ誤差の谷で、約束を守る最良の配分を探しましょう。'};
export const valleyPoints={a:{x:0,y:2},b:{x:0.5,y:1.5},c:{x:1,y:1},d:{x:2,y:0},free:{x:1,y:2}};
export function valleyPoint(id){if(!Object.hasOwn(valleyPoints,id))throw new RangeError('配分が不正です。');const {x,y}=valleyPoints[id];return {x,y,feasible:x>=0&&y>=0&&x+y===2,loss:partialLoss(x,y)};}
export function createConstrainedValley(){return {selected:'a',visited:[],best:null,checked:false};}
export function inspectValley(s){if(!Object.hasOwn(valleyPoints,s.selected))throw new RangeError('配分が不正です。');return {...s,visited:[...new Set([...s.visited,s.selected])],checked:false};}
export function constrainedValleyComplete(s){return Object.keys(valleyPoints).every(id=>s.visited.includes(id))&&s.best==='b'&&s.checked;}
export function restoreConstrainedValley(s){if(!s||!Object.hasOwn(valleyPoints,s.selected)||!Array.isArray(s.visited)||s.visited.some(id=>!Object.hasOwn(valleyPoints,id))||new Set(s.visited).size!==s.visited.length||(s.best!==null&&!Object.hasOwn(valleyPoints,s.best))||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です');return {...s,visited:[...s.visited]};}
