export function markovWeight(bits){
 if(!Number.isInteger(bits)||bits<0||bits>7)throw new RangeError('灯りの状態が不正です。');
 const x=bits&1,y=(bits>>1)&1,z=(bits>>2)&1;
 return (x===y?3:1)*(y===z?3:1);
}
export function createMarkovNetwork(){return {selected:0,answers:Array(8).fill(null),checked:Array(8).fill(false),reflection:null,finished:false};}
export function markovCorrect(s,i){return s.checked[i]&&s.answers[i]===markovWeight(i);}
export function markovNetworkComplete(s){return Array.from({length:8},(_,i)=>i).every(i=>markovCorrect(s,i))&&s.reflection==='potential'&&s.finished;}
export function restoreMarkovNetwork(s){
 if(!s||!Number.isInteger(s.selected)||s.selected<0||s.selected>7||!Array.isArray(s.answers)||s.answers.length!==8||s.answers.some(a=>![null,1,3,9].includes(a))||!Array.isArray(s.checked)||s.checked.length!==8||s.checked.some((v,i)=>typeof v!=='boolean'||(v&&s.answers[i]===null))||![null,'potential','directed','normalized'].includes(s.reflection)||typeof s.finished!=='boolean')throw new RangeError('記録が不正です。');
 return {selected:s.selected,answers:[...s.answers],checked:[...s.checked],reflection:s.reflection,finished:s.finished};
}
