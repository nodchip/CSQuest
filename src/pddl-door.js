// A fixed, propositional PDDL example; the player interprets fragments, not files.
export const pddlQuestions = [
  {fragment:'(:init (key) (closed))', prompt:'この問題の開始時に成り立つことは？', options:['鍵があり、門は閉じている','鍵がなく、門は開いている','門を開くことが目標である'], correct:0},
  {fragment:'(:goal (open))', prompt:'この問題で達成したいことは？', options:['鍵を失う','門が開いている','門が閉じている'], correct:1},
  {fragment:':precondition (and (key) (closed))', prompt:'開門を行うために必要なことは？', options:['鍵があり、門は閉じている','鍵がなく、門は閉じている','鍵があり、門は開いている'], correct:0},
  {fragment:':effect (and (open) (not (closed)))', prompt:'開門の効果は？', options:['門を開き、閉門を取り消す','鍵を消し、閉門を保つ','門を閉め、開門を取り消す'], correct:0}
];
export const doorProblems={without:{name:'鍵なしで出発',initial:2},with:{name:'鍵ありで出発',initial:3}};
export function doorStep(bits,action){
 if(!Number.isInteger(bits)||bits<0||bits>7)throw new RangeError('状態が不正です。');
 if(action==='take')return bits|1;
 if(action==='open')return (bits&3)===3?(bits&~2)|4:null;
 throw new RangeError('行動が不正です。');
}
export function doorPlanState(id,path){
 if(!Object.hasOwn(doorProblems,id)||!Array.isArray(path)||path.length>2)throw new RangeError('計画が不正です。');
 let bits=doorProblems[id].initial;
 for(const action of path){const next=doorStep(bits,action);if(next===null||next===bits||(bits&4))throw new RangeError('計画が不正です。');bits=next;}
 return bits;
}
export function createPddlDoor(){return {index:0,answers:[null,null,null,null],checked:[false,false,false,false],problem:'without',paths:{without:[],with:[]}};}
export function pddlDoorComplete(s){return pddlQuestions.every((q,i)=>s.checked[i]&&s.answers[i]===q.correct)&&Object.keys(doorProblems).every(id=>!!(doorPlanState(id,s.paths[id])&4));}
export function restorePddlDoor(s){
 if(!s||!Number.isInteger(s.index)||s.index<0||s.index>=pddlQuestions.length||!Array.isArray(s.answers)||s.answers.length!==pddlQuestions.length||!Array.isArray(s.checked)||s.checked.length!==pddlQuestions.length||s.answers.some((a,i)=>a!==null&&(!Number.isInteger(a)||a<0||a>=pddlQuestions[i].options.length))||s.checked.some((c,i)=>typeof c!=='boolean'||(c&&s.answers[i]===null)))throw new RangeError('途中記録が不正です。');
 const problem=s.problem??'without',paths=s.paths??{without:[],with:[]};
 if(!Object.hasOwn(doorProblems,problem)||!paths)throw new RangeError('計画が不正です。');
 for(const id of Object.keys(doorProblems))doorPlanState(id,paths[id]);
 return {index:s.index,answers:[...s.answers],checked:[...s.checked],problem,paths:{without:[...paths.without],with:[...paths.with]}};
}
