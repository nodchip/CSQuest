import {sceneWorkshopResult} from './game-scene-workshop.js';

export function sceneTestingCreate(){return {wall:false,seen:[],answer:null};}
export function sceneTestingResult(wall,updates){if(typeof wall!=='boolean'||![1,2].includes(updates))throw new RangeError('試験条件が不正です。');const result=sceneWorkshopResult({asset:'gold',speed:2,wall,frame:updates});return {position:result.hero,passes:result.hero<=2};}
export function sceneTestingRun(q,updates){const result=sceneTestingResult(q.wall,updates),key=`${q.wall}:${updates}`;if(!q.seen.includes(key))q.seen.push(key);return result;}
export function sceneTestingDone(q){return ['false:1','false:2','true:1','true:2'].every(k=>q.seen.includes(k))&&q.answer==='both';}
export function sceneTestingRestore(q){if(!q||typeof q.wall!=='boolean'||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!['false:1','false:2','true:1','true:2'].includes(k))||![null,'both','first','proof'].includes(q.answer))throw new RangeError('試験の記録が不正です。');return {...q,seen:[...q.seen]};}
