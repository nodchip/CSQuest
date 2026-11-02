export const cookLevel={id:'archive-cook-tableau',number:'867',kind:'cook-tableau',name:'計算の記録を論理の門へ',tag:'Cook–Levin の定理',title:'計算の記録を条件に変えよう',story:'書庫の精霊は、分かれ道のある計算を論理の門に写します。受理できる道があるときだけ、すべての条件が満たされるか調べましょう。'};
export const cookCases={pass:{name:'入力１・受理条件あり',input:1,goal:true},block:{name:'入力０・受理条件あり',input:0,goal:true},noGoal:{name:'入力０・受理条件なし',input:0,goal:false}};
export const cookBits=[['X',8],['C',4],['A',2],['R',1]];
export function cookEvaluate(id,mask){
 if(!Object.hasOwn(cookCases,id)||!Number.isInteger(mask)||mask<0||mask>15)throw new RangeError('条件が不正です。');
 const c=cookCases[id],X=!!(mask&8),C=!!(mask&4),A=!!(mask&2),R=!!(mask&1);
 const clauses=[X===!!c.input,!A||X,!A||C,A||!X||!C,!R||!A,R||A];if(c.goal)clauses.push(A);
 return {X,C,A,R,clauses,valid:clauses.every(Boolean)};
}
export function cookScan(id,cursor){
 if(!Number.isInteger(cursor)||cursor<0||cursor>16)throw new RangeError('記録が不正です。');const matches=[];for(let mask=0;mask<cursor;mask++)if(cookEvaluate(id,mask).valid)matches.push(mask);return matches;
}
export function cookCreate(){return {selected:'pass',trials:Object.fromEntries(Object.keys(cookCases).map(id=>[id,{mask:0,cursor:0,checked:[],answer:null}])),reflection:null};}
export function cookToggle(q,bit){if(!cookBits.some(([,v])=>v===bit))throw new RangeError('印が不正です。');q.trials[q.selected].mask^=bit;}
export function cookCheck(q){const t=q.trials[q.selected];cookEvaluate(q.selected,t.mask);if(!t.checked.includes(t.mask))t.checked.push(t.mask);}
export function cookAdvance(q,count){if(![1,4,16].includes(count))throw new RangeError('個数が不正です。');const t=q.trials[q.selected];t.cursor=Math.min(16,t.cursor+count);}
export function cookComplete(q){return Object.keys(cookCases).every(id=>{const t=q.trials[id];return t.cursor===16&&t.answer===String(cookScan(id,16).length);})&&q.trials.pass.checked.some(mask=>cookEvaluate('pass',mask).valid)&&q.reflection==='goal';}
export function cookRestore(q){
 if(!q||!Object.hasOwn(cookCases,q.selected)||!q.trials||![null,'goal','same','free'].includes(q.reflection))throw new RangeError('記録が不正です。');const copy=cookCreate();copy.selected=q.selected;copy.reflection=q.reflection;
 for(const id of Object.keys(cookCases)){const t=q.trials[id];if(!t||!Array.isArray(t.checked)||t.checked.length>16||new Set(t.checked).size!==t.checked.length||![null,'0','1','2','4'].includes(t.answer))throw new RangeError('試行が不正です。');cookEvaluate(id,t.mask);cookScan(id,t.cursor);for(const mask of t.checked)cookEvaluate(id,mask);copy.trials[id]={mask:t.mask,cursor:t.cursor,checked:[...t.checked],answer:t.answer};}return copy;
}
