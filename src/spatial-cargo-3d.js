import {spaceTransform} from './transform-space.js';
export const spaceMoveLevel={id:'ruin-spatial-cargo-3d',number:'1180',kind:'spatial-cargo-3d',name:'三方向の水晶運び',tag:'３次元の移動と向き',title:'奥行きのある門に水晶を置く',story:'立体の倉庫にある水晶を壁にぶつけずに運び、矢印を門に合わせましょう。'};
export const cargoMoves={xp:[1,0,0],xm:[-1,0,0],yp:[0,1,0],ym:[0,-1,0],zp:[0,0,1],zm:[0,0,-1]};
export const cargoWalls=[[1,1,0],[1,1,1]];
export const cargoTarget=[2,2,2],cargoDirection=[0,0,-1];
const same=(a,b)=>a.every((v,i)=>v===b[i]);
export function cargoStep(state,action){if(Object.hasOwn(cargoMoves,action)){const p=state.position.map((x,i)=>x+cargoMoves[action][i]);if(p.some(v=>v<0||v>2))return {ok:false,reason:'outside'};if(cargoWalls.some(w=>same(w,p)))return {ok:false,reason:'wall'};return {ok:true,state:{position:p,direction:[...state.direction]}};}if(['ry','rz'].includes(action))return {ok:true,state:{position:[...state.position],direction:spaceTransform([state.direction],action)[0]}};throw new RangeError('操作が不正です');}
export function cargoReplay(history){if(!Array.isArray(history)||history.length>128)throw new RangeError('記録が不正です');let s={position:[0,0,0],direction:[1,0,0]};for(const action of history){const r=cargoStep(s,action);if(!r.ok)throw new RangeError('通れない操作です');s=r.state;}return s;}
export const cargoAtGoal=s=>same(s.position,cargoTarget)&&same(s.direction,cargoDirection);
export function cargoCreate(){return {history:[],goalChecked:false,answer:null,answerChecked:false};}
export function cargoDone(q){return q.goalChecked&&cargoAtGoal(cargoReplay(q.history))&&q.answerChecked&&q.answer==='direction';}
export function cargoRestore(q){if(!q||typeof q.goalChecked!=='boolean'||![null,'direction','full'].includes(q.answer)||typeof q.answerChecked!=='boolean')throw new RangeError('途中記録が不正です');const s=cargoReplay(q.history);if(q.goalChecked&&!cargoAtGoal(s))throw new RangeError('達成記録が不正です');return {...q,history:[...q.history]};}
