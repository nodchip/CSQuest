import {edges,places} from './horn-routes.js';
export const hornMeaningLevel={id:'ruin-horn-meaning',number:'1171',kind:'horn-meaning',name:'道の約束を読み解く',tag:'一階論理と Horn 節',title:'二歩の道の規則を確かめる',story:'遺跡の二歩の道を表す約束を、論理の札と道の記録の両方で確かめましょう。'};
export const hmPlaces=places;
export function hmTruth(a,b,c){if(![a,b,c].every(x=>typeof x==='boolean'))throw new RangeError('真偽値が不正です');return {rule:!(a&&b)||c,clause:!a||!b||c,converse:!c||(a&&b)};}
export function hmProof(from,middle,to){if(![from,middle,to].every(k=>Object.hasOwn(places,k)))throw new RangeError('場所が不正です');return edges.some(([x,y])=>x===from&&y===middle)&&edges.some(([x,y])=>x===middle&&y===to);}
export function hmKey(a,b,c){return `${Number(a)}${Number(b)}${Number(c)}`;}
export function hmCreate(){return {a:false,b:false,c:false,guess:null,seen:[],show:false,from:'a',middle:'a',to:'a',proofs:[],reflection:null,checked:false};}
export function hmDone(q){return q.seen.length===8&&['a:b:c','a:d:e'].every(k=>q.proofs.includes(k))&&q.reflection==='one-way'&&q.checked;}
export function hmRestore(q){if(!q||![q.a,q.b,q.c,q.show,q.checked].every(x=>typeof x==='boolean')||![null,'true','false'].includes(q.guess)||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!/^[01]{3}$/.test(k))||q.show&&(!q.seen.includes(hmKey(q.a,q.b,q.c))||q.guess!==(hmTruth(q.a,q.b,q.c).rule?'true':'false'))||![q.from,q.middle,q.to].every(k=>Object.hasOwn(places,k))||!Array.isArray(q.proofs)||new Set(q.proofs).size!==q.proofs.length||q.proofs.some(k=>!['a:b:c','a:d:e'].includes(k))||![null,'one-way','reverse'].includes(q.reflection))throw new RangeError('途中記録が不正です');return {...q,seen:[...q.seen],proofs:[...q.proofs]};}
