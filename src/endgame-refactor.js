// Finite examples only: each run returns a new array and leaves its input untouched.
const cases={
 structure:[{input:['赤','青']},{input:[]},{input:['青','赤','青']}],
 interface:[{command:'仕分け',input:['赤','青']},{command:'仕分け',input:[]},{command:'仕分け',input:['青','赤','青']}],
 migration:[{command:'仕分け',input:['青','赤']},{command:'整理',input:['青','赤']},{command:'仕分け',input:[]}]
};
export const refactorCases=cases;
export const refactorChoices={structure:['extract','drop','reverse'],interface:['preserve','rename','reverse'],migration:['rename','alias','reverse']};
export function runRefactor(kind,choice,task){
 if(!refactorChoices[kind]?.includes(choice)||!task||!Array.isArray(task.input))return null;
 if(kind!=='structure'){
  const recognized=choice==='rename'?task.command==='整理':kind==='migration'?['仕分け','整理'].includes(task.command):task.command==='仕分け';
  if(!recognized)return {error:'名前が見つかりません'};
 }
 const result=choice==='drop'?task.input.filter(x=>x!=='青'):choice==='reverse'?[...task.input].reverse():choice==='extract'?task.input.reduce((cards,card)=>{cards.push(card);return cards;},[]):[...task.input];
 return {output:result};
}
export function replayRefactor(kind,history){
 const tasks=cases[kind],choices=refactorChoices[kind];if(!tasks||!Array.isArray(history))return null;let selected=null,trials=[],done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action.startsWith('select:')){const id=action.slice(7);if(!choices.includes(id))return null;selected=id;trials=[];continue;}
  const m=/^try:(\d+)$/.exec(action);if(m&&selected){const n=Number(m[1]);if(!tasks[n])return null;if(!trials.includes(n))trials.push(n);continue;}
  if(action==='check'&&selected&&trials.length===tasks.length){const expected=kind==='structure'?'extract':kind==='interface'?'preserve':'alias';if(selected!==expected)return null;done=true;continue;}
  return null;
 }
 return {selected,trials,done};
}
