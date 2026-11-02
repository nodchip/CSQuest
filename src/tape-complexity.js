import {createTape,tapeExpected,tapeStep} from './turing-tape.js';

export const tapeCostLevel={id:'archive-tape-complexity',number:'865',kind:'tape-complexity',name:'記録帯の長さと仕事量',tag:'機械の時間・領域計算量',title:'精霊が使う刻と帯を数えよう',story:'依頼417の精霊は印を一つ増やして戻ります。巻物の長さを変え、何回動き、何マスを使うか調べましょう。'};
export const tapeCostSizes=[0,2,4,8];
export function tapeCostReplay(length,history){
 if(!tapeCostSizes.includes(length)||!Array.isArray(history)||history.length>2*length+2)throw new RangeError('記録が不正です。');
 let state=createTape(length);const visited=new Set([state.head]);for(const action of history){state=tapeStep(state,action);visited.add(state.head);}
 return {state,visited:[...visited].sort((a,b)=>a-b),time:history.length,space:visited.size,finished:state.state==='done'};
}
export function tapeCostCreate(){return {length:0,histories:{0:[],2:[],4:[],8:[]},growth:null,spaceAnswer:null};}
export function tapeCostAdvance(q,count){
 if(![1,4].includes(count))throw new RangeError('刻数が不正です。');const h=q.histories[q.length];for(let i=0;i<count;i++){const r=tapeCostReplay(q.length,h);if(r.finished)break;h.push(tapeExpected(r.state));}
}
export function tapeCostComplete(q){return tapeCostSizes.every(n=>tapeCostReplay(n,q.histories[n]).finished)&&q.growth==='linear'&&q.spaceAnswer==='distinct';}
export function tapeCostRestore(q){
 if(!q||!tapeCostSizes.includes(q.length)||!q.histories||![null,'linear','quadratic','constant'].includes(q.growth)||![null,'distinct','visits','written'].includes(q.spaceAnswer))throw new RangeError('記録が不正です。');const copy=tapeCostCreate();copy.length=q.length;copy.growth=q.growth;copy.spaceAnswer=q.spaceAnswer;
 for(const n of tapeCostSizes){tapeCostReplay(n,q.histories[n]);copy.histories[n]=[...q.histories[n]];}return copy;
}
