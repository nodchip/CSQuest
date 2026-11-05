import {tCases,tResult} from './paired-t-lab.js';
export const effectScales={'1':'元の秒数','2':'全員の差を２倍にした秒数'};
export const effectMeanChoices=[5,10];
export const effectChoices={high:'約 2.739',low:'約 0.645'};
export function effectResult(id,scale){if(!Object.hasOwn(tCases,id)||!Object.hasOwn(effectScales,scale))throw new RangeError('条件が不正です');const base=tResult(id),factor=Number(scale),mean=base.mean*factor,sd=base.sd*factor,d=mean/sd;return {mean,sd,d,t:base.t,answer:id==='close'?'high':'low'};}
export function effectCreate(){return {selected:'close',scale:'1',mean:null,effect:'',checked:false,seen:[],reflection:'',reflectionChecked:false};}
export function effectRestore(s){const keys=Object.keys(tCases).flatMap(k=>Object.keys(effectScales).map(n=>`${k}:${n}`));if(!s||!Object.hasOwn(tCases,s.selected)||!Object.hasOwn(effectScales,s.scale)||![null,...effectMeanChoices].includes(s.mean)||!['',...Object.keys(effectChoices)].includes(s.effect)||typeof s.checked!=='boolean'||s.checked&&(s.mean===null||!s.effect)||!Array.isArray(s.seen)||new Set(s.seen).size!==s.seen.length||!s.seen.every(k=>keys.includes(k))||!['','context','probability','same'].includes(s.reflection)||typeof s.reflectionChecked!=='boolean')throw new RangeError('効果量の記録が不正です');return {...s,seen:[...s.seen]};}
