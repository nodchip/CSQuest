import {createSearchBudget,restoreSearchBudget,budgetComplete} from './search-budget.js';
import {idaTrace} from './ida-star.js';
export const iterativeLevel={id:'forest-iterative-deepening',number:'369',kind:'iterative-deepening',name:'深さを刻む迷宮',tag:'幅優先と反復深化',title:'迷宮の探索を比べよう',story:'森の迷宮で失われた灯火を探します。浅い部屋から調べる方法と、深さの上限を少しずつ広げる方法を比べましょう。'};
// A finite binary tree, named by the left/right turns from its root.
const goal='RRL';
const label=p=>p||'入口';
export function explorationTrace(method){
 if(!['breadth','iterative'].includes(method))throw new RangeError('探索方法が不正です');
 let frontier=[''],limit=method==='iterative'?0:null,checks=0,peak=1,visited=[],trace=[];
 while(frontier.length){
  const next=method==='breadth'?frontier[0]:frontier[frontier.length-1];
  trace.push({frontier:[...frontier],next,limit,checks,peak,visited:[...visited],done:false});
  if(method==='breadth')frontier.shift();else frontier.pop();
  checks++;visited.push(next);
  if(next===goal){trace.push({frontier:[...frontier],next:null,limit,checks,peak,visited:[...visited],done:true});break;}
  if(next.length<3&&(method==='breadth'||next.length<limit)){
   if(method==='breadth')frontier.push(next+'L',next+'R');else frontier.push(next+'R',next+'L');
   peak=Math.max(peak,frontier.length);
  }
  if(method==='iterative'&&frontier.length===0){limit++;frontier=[''];peak=Math.max(peak,frontier.length);}
 }
 return trace;
}
export const traces={breadth:explorationTrace('breadth'),iterative:explorationTrace('iterative')};
export const roomLabel=label;
export const searchStats=Object.fromEntries(Object.keys(traces).map(k=>[k,{checks:traces[k].at(-1).checks,peak:traces[k].at(-1).peak}]));
// A full binary tree with the last (rightmost) leaf as the target.
export function completeTreeSearch(depth,method){
 if(!Number.isInteger(depth)||depth<2||depth>6||!['breadth','depth'].includes(method))throw new RangeError('木の条件が不正です。');
 const goal='R'.repeat(depth),frontier=[''];let checks=0,peak=1;
 while(frontier.length){const node=method==='breadth'?frontier.shift():frontier.pop();checks++;if(node===goal)break;if(node.length<depth){if(method==='breadth')frontier.push(node+'L',node+'R');else frontier.push(node+'R',node+'L');peak=Math.max(peak,frontier.length);}}
 return {checks,peak};
}
export function createIterative(){return {method:'breadth',positions:{breadth:0,iterative:0},answers:{checks:null,space:null,depth:null},idaPosition:0,idaAnswer:null,checked:false,budget:createSearchBudget(),growthDepth:3,growthGuess:null,growthChecked:false};}
export function iterativeComplete(s){return Object.keys(traces).every(k=>traces[k][s.positions[k]].done)&&idaTrace[s.idaPosition].done&&s.idaAnswer==='minimum'&&s.checked&&s.answers.checks==='breadth'&&s.answers.space==='iterative'&&s.answers.depth==='same'&&budgetComplete(s.budget,searchStats);}
export function restoreIterative(s){if(!s||!Object.hasOwn(traces,s.method)||!s.positions||!s.answers||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です');const n=createIterative();n.method=s.method;for(const k of Object.keys(traces)){const v=s.positions[k];if(!Number.isInteger(v)||v<0||v>=traces[k].length)throw new RangeError('途中記録が不正です');n.positions[k]=v;}for(const [k,choices] of Object.entries({checks:[null,'breadth','iterative','same'],space:[null,'breadth','iterative','same'],depth:[null,'breadth','iterative','same']})){if(!choices.includes(s.answers[k]))throw new RangeError('途中記録が不正です');n.answers[k]=s.answers[k];}const position=s.idaPosition??0,answer=s.idaAnswer??null;if(!Number.isInteger(position)||position<0||position>=idaTrace.length||![null,'minimum','maximum'].includes(answer))throw new RangeError('途中記録が不正です');n.idaPosition=position;n.idaAnswer=answer;n.checked=s.checked;const growthDepth=s.growthDepth??3,growthGuess=s.growthGuess??null,growthChecked=s.growthChecked??false;if(!Number.isInteger(growthDepth)||growthDepth<2||growthDepth>6||![null,'all','depth'].includes(growthGuess)||typeof growthChecked!=='boolean'||growthChecked&&growthGuess===null)throw new RangeError('途中記録が不正です');n.growthDepth=growthDepth;n.growthGuess=growthGuess;n.growthChecked=growthChecked;if(s.budget!==undefined)n.budget=restoreSearchBudget(s.budget);return n;}
