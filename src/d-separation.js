import {createBlanket,restoreBlanket,blanketComplete} from './markov-blanket.js';
export const dsepLevel={id:'forest-d-separation',number:'562',kind:'d-separation',name:'観測が変える道',tag:'ベイズネットワークと d 分離',title:'知らせの道を見極めよう',story:'森の観測塔では、二つの知らせの関係を矢印で記します。どの場所を観測すると、関係が保証されるでしょう。'};
export const dsepGraphs={chain:{name:'連鎖',drawing:'X → Y → Z',observations:['none','middle']},fork:{name:'共通原因',drawing:'X ← Y → Z',observations:['none','middle']},collider:{name:'共通結果',drawing:'X → Y ← Z、Y → D',observations:['none','middle','child']}};
export const dsepObservations={none:'観測なし',middle:'Y を観測',child:'D を観測'};
export const dsepCases=Object.entries(dsepGraphs).flatMap(([g,v])=>v.observations.map(o=>`${g}:${o}`));
export function dsepBlocked(graph,obs){if(!Object.hasOwn(dsepGraphs,graph)||!dsepGraphs[graph].observations.includes(obs))throw new RangeError('図か観測が不正です。');return graph==='collider'?obs==='none':obs==='middle';}
export function createDsep(){return {graph:'chain',obs:'none',guess:null,visited:0,checked:false,answer:null,finished:false,blanket:createBlanket()};}
export function dsepComplete(s){return s.visited===127&&s.answer==='guarantee'&&s.finished&&blanketComplete(s.blanket);}
export function restoreDsep(s){if(!s||!Object.hasOwn(dsepGraphs,s.graph)||!dsepGraphs[s.graph].observations.includes(s.obs)||![null,'blocked','open'].includes(s.guess)||!Number.isInteger(s.visited)||s.visited<0||s.visited>127||typeof s.checked!=='boolean'||![null,'guarantee','always','causal'].includes(s.answer)||typeof s.finished!=='boolean')throw new RangeError('途中記録が不正です。');return {...s,blanket:s.blanket===undefined?createBlanket():restoreBlanket(s.blanket)};}
