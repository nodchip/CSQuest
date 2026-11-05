export const languageStacksLevel={id:'archive-language-stacks',number:'644',kind:'language-stacks',name:'対になる文字の門',tag:'正規言語と文脈自由言語',title:'文字の列を二つの門に通そう',story:'書庫の門は、a を並べた後に同じ数の b が続く列だけを通します。有限の札で数える門と、山札を使う門を調べましょう。'};
export const languageModes=['finite','stack'];
export const languageRequired=['finite,3,3','finite,4,4','stack,4,4','stack,4,3'];
export function languageTrace(mode,n,m,step){
 if(!languageModes.includes(mode)||![0,1,2,3,4].includes(n)||![0,1,2,3,4].includes(m)||!Number.isInteger(step)||step<0||step>n+m)throw new RangeError('文字列の設定が不正です。');
 let phase='a',count=0;const text='a'.repeat(n)+'b'.repeat(m);
 for(const ch of text.slice(0,step)){
  if(phase==='dead')continue;
  if(ch==='a'){if(phase==='b'||(mode==='finite'&&count===3))phase='dead';else count++;}
  else if(count===0)phase='dead';else {count--;phase='b';}
 }
 const outcome=step===text.length?(phase!=='dead'&&count===0?'accept':'reject'):null;
 return {text,phase,count,outcome};
}
export function languageProof(states,i,j,decision){
 if(!Array.isArray(states)||states.length!==4||states.some(n=>![0,1,2].includes(n))||![0,1,2,3].includes(i)||![0,1,2,3].includes(j)||i>=j||states[i]!==states[j]||!['accept','reject'].includes(decision))throw new RangeError('証拠の選択が不正です。');
 return {left:'a'.repeat(i)+'b'.repeat(i),right:'a'.repeat(j)+'b'.repeat(i),leftCorrect:decision==='accept',rightCorrect:decision==='reject'};
}
export const hierarchyClasses={regular:'正規言語',contextFree:'文脈自由言語',contextSensitive:'文脈依存言語',recognizable:'チューリング認識可能な言語'};
export const hierarchyExamples={star:{name:'a を０個以上並べた列',minimum:0},pairs:{name:'aⁿbⁿ（n は０以上）',minimum:1},triples:{name:'aⁿbⁿcⁿ（n は１以上）',minimum:2},halting:{name:'停止する機械と入力の符号の組',minimum:3}};
export function hierarchyMembership(example,category){const examples=Object.keys(hierarchyExamples),classes=Object.keys(hierarchyClasses);if(!examples.includes(example)||!classes.includes(category))throw new RangeError('階層の選択が不正です。');return classes.indexOf(category)>=hierarchyExamples[example].minimum;}
export function createLanguageStacks(){return {mode:'finite',n:3,m:3,step:0,observed:[],states:[0,0,0,0],i:null,j:null,proof:[],answer:null,checked:false,hierarchy:{example:'star',category:'regular',guess:null,observed:[],checked:false}};}
export function languageStacksComplete(s){return languageRequired.every(k=>s.observed.includes(k))&&['accept','reject'].every(k=>s.proof.includes(k))&&s.answer==='memory'&&s.checked;}
export function restoreLanguageStacks(s){
 const valid=new Set(languageModes.flatMap(mode=>[0,1,2,3,4].flatMap(n=>[0,1,2,3,4].map(m=>`${mode},${n},${m}`))));
 if(!s||!Array.isArray(s.observed)||new Set(s.observed).size!==s.observed.length||s.observed.some(k=>!valid.has(k))||!Array.isArray(s.states)||s.states.length!==4||s.states.some(n=>![0,1,2].includes(n))||![null,0,1,2,3].includes(s.i)||![null,0,1,2,3].includes(s.j)||!Array.isArray(s.proof)||new Set(s.proof).size!==s.proof.length||s.proof.some(k=>!['accept','reject'].includes(k))||![null,'memory','finite','equal'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');
 languageTrace(s.mode,s.n,s.m,s.step);for(const d of s.proof)languageProof(s.states,s.i,s.j,d);
 const h=Object.hasOwn(s,'hierarchy')?s.hierarchy:createLanguageStacks().hierarchy;
 if(!h||!Object.hasOwn(hierarchyExamples,h.example)||!Object.hasOwn(hierarchyClasses,h.category)||![null,'yes','no'].includes(h.guess)||!Array.isArray(h.observed)||new Set(h.observed).size!==h.observed.length||h.observed.some(key=>{const parts=key.split(':');return parts.length!==2||!Object.hasOwn(hierarchyExamples,parts[0])||!Object.hasOwn(hierarchyClasses,parts[1]);})||typeof h.checked!=='boolean'||(h.checked&&h.guess===null))throw new RangeError('階層の途中記録が不正です。');
 return {...s,observed:[...s.observed],states:[...s.states],proof:[...s.proof],hierarchy:{...h,observed:[...h.observed]}};
}
