export const lsystemLevel={id:'ruin-lsystem-garden',number:'845',kind:'lsystem-garden',name:'枝分かれする光の庭',tag:'L システムと規則系',title:'光の木を育てよう',story:'遺跡の庭で、精霊が短い札の規則から光の木を描きます。札を世代ごとに置き換え、枝の増え方を予想しましょう。'};
export const lsystemRule='F[+F]F[-F]F';
export function lsystemWord(depth){if(!Number.isInteger(depth)||depth<0||depth>3)throw new RangeError('世代が不正です。');let word='F';for(let i=0;i<depth;i++)word=[...word].map(c=>c==='F'?lsystemRule:c).join('');return word;}
export function lsystemSegments(word){
 if(typeof word!=='string'||!/^[F+\-\[\]]+$/.test(word)||word.length>1000)throw new RangeError('札が不正です。');
 let x=0,y=0,angle=-Math.PI/2;const stack=[],lines=[];
 for(const c of word){if(c==='F'){const nx=x+Math.cos(angle),ny=y+Math.sin(angle);lines.push([x,y,nx,ny]);x=nx;y=ny;}else if(c==='+')angle+=Math.PI/4;else if(c==='-')angle-=Math.PI/4;else if(c==='[')stack.push([x,y,angle]);else {if(!stack.length)throw new RangeError('枝の札が不正です。');[x,y,angle]=stack.pop();}}
 if(stack.length)throw new RangeError('枝の札が不正です。');return lines;
}
export function lsystemCreate(){return {history:[],guess:null,answer:null};}
export function lsystemGuessOptions(q){const current=5**q.history.length;return [current*2,current*5,current*10];}
export function lsystemAdvance(q){if(q.history.length>=3||!lsystemGuessOptions(q).includes(q.guess))return false;if(q.guess!==5**(q.history.length+1))return false;q.history.push(q.guess);q.guess=null;return true;}
export function lsystemComplete(q){return q.history.length===3&&q.answer==='parallel';}
export function lsystemRestore(q){if(!q||!Array.isArray(q.history)||q.history.length>3||![null,'parallel','single','recursive'].includes(q.answer))throw new RangeError('記録が不正です。');const n=lsystemCreate();for(const guess of q.history){n.guess=guess;if(!lsystemAdvance(n))throw new RangeError('記録が不正です。');}if(q.guess!==null&&(n.history.length===3||!lsystemGuessOptions(n).includes(q.guess)))throw new RangeError('予想が不正です。');n.guess=q.guess;n.answer=q.answer;return n;}
