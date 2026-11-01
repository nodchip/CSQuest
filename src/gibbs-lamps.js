// A fixed draw sequence makes the finite demonstration reproducible.
export const gibbsDraws=[10,60,80,20,70,40];
export function createGibbs(){return {history:[],answer:null,checked:false};}
export function gibbsState(history){
 if(!Array.isArray(history)||history.length>gibbsDraws.length)throw new RangeError('標本の記録が不正です。');
 let x=0,y=0;const samples=[];
 for(let i=0;i<history.length;i++){
  const p=(i%2===0?y:x)===0?75:25,expected=gibbsDraws[i]<p?1:0;
  if(history[i]!==expected)throw new RangeError('条件付き確率とくじを確認しましょう。');
  if(i%2===0)x=expected;else{y=expected;samples.push({x,y});}
 }
 const other=history.length%2===0?y:x;
 return {x,y,samples,next:history.length%2===0?'X':'Y',chance:other===0?75:25,draw:gibbsDraws[history.length]??null};
}
export function gibbsComplete(s){gibbsState(s.history);return s.history.length===gibbsDraws.length&&s.answer==='finite'&&s.checked;}
export function restoreGibbs(s){if(!s||![null,'finite','exact','independent'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('記録が不正です。');gibbsState(s.history);return {history:[...s.history],answer:s.answer,checked:s.checked};}
