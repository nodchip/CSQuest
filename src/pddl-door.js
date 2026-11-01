// A fixed, propositional PDDL example; the player interprets fragments, not files.
export const pddlQuestions = [
  {fragment:'(:init (key) (closed))', prompt:'この問題の開始時に成り立つことは？', options:['鍵があり、門は閉じている','鍵がなく、門は開いている','門を開くことが目標である'], correct:0},
  {fragment:'(:goal (open))', prompt:'この問題で達成したいことは？', options:['鍵を失う','門が開いている','門が閉じている'], correct:1},
  {fragment:':precondition (and (key) (closed))', prompt:'開門を行うために必要なことは？', options:['鍵があり、門は閉じている','鍵がなく、門は閉じている','鍵があり、門は開いている'], correct:0},
  {fragment:':effect (and (open) (not (closed)))', prompt:'開門の効果は？', options:['門を開き、閉門を取り消す','鍵を消し、閉門を保つ','門を閉め、開門を取り消す'], correct:0}
];
export function createPddlDoor(){return {index:0,answers:[null,null,null,null],checked:[false,false,false,false]};}
export function pddlDoorComplete(s){return pddlQuestions.every((q,i)=>s.checked[i]&&s.answers[i]===q.correct);}
export function restorePddlDoor(s){
 if(!s||!Number.isInteger(s.index)||s.index<0||s.index>=pddlQuestions.length||!Array.isArray(s.answers)||s.answers.length!==pddlQuestions.length||!Array.isArray(s.checked)||s.checked.length!==pddlQuestions.length||s.answers.some((a,i)=>a!==null&&(!Number.isInteger(a)||a<0||a>=pddlQuestions[i].options.length))||s.checked.some((c,i)=>typeof c!=='boolean'||(c&&s.answers[i]===null)))throw new RangeError('途中記録が不正です。');
 return {index:s.index,answers:[...s.answers],checked:[...s.checked]};
}
