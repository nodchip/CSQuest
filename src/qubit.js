export const qubitLevel={id:'moon-qubit',number:'74',kind:'qubit',name:'月光の二つの道',tag:'量子の干渉と観測',title:'月光の行方を確かめよう',story:'遺跡の精霊は量子の灯りを操ります。途中の操作を選び、最後に観測される灯りを予測しましょう。'};
export const qubitCases={restore:{name:'元の灯り',prompt:'途中で観測せず、最後に必ず 0 が出るようにしましょう。',operation:'identity'},opposite:{name:'反対の灯り',prompt:'途中で観測せず、最後に必ず 1 が出るようにしましょう。',operation:'phase'},observed:{name:'観測の影響',prompt:'途中で観測し、その結果を使わずに進めましょう。',operation:'measure'}};
export const qubitOperations={identity:'何もしない',phase:'位相を反転する（Z）',measure:'途中で観測する'};
const hadamard=([a,b,d])=>[(a+d+2*b)/2,(a-d)/2,(a+d-2*b)/2];
export function runQubit(operation){
  if(!Object.hasOwn(qubitOperations,operation))throw new RangeError('未知の操作です。');
  const first=hadamard([1,0,0]);
  const middle=operation==='phase'?[first[0],-first[1],first[2]]:operation==='measure'?[first[0],0,first[2]]:first.slice();
  return [first,middle,hadamard(middle)];
}
export function qubitCorrect(id,choice){return Object.hasOwn(qubitCases,id)&&Object.hasOwn(qubitOperations,choice.operation)&&choice.operation===qubitCases[id].operation&&choice.probability===runQubit(choice.operation)[2][0];}
export function createQubit(){return {selected:'restore',choices:Object.fromEntries(Object.keys(qubitCases).map(id=>[id,{operation:null,probability:null,checked:false,solved:false}]))};}
export function restoreQubit(saved){
  if(!saved||!Object.hasOwn(qubitCases,saved.selected)||!saved.choices)throw new RangeError('途中記録が不正です。');
  const result=createQubit();result.selected=saved.selected;
  for(const id of Object.keys(qubitCases)){
    const c=saved.choices[id];
    if(!c||!(c.operation===null||Object.hasOwn(qubitOperations,c.operation))||![null,0,0.5,1].includes(c.probability)||typeof c.checked!=='boolean'||typeof c.solved!=='boolean'||(c.solved&&!qubitCorrect(id,c)))throw new RangeError('途中記録が不正です。');
    result.choices[id]={operation:c.operation,probability:c.probability,checked:c.checked,solved:c.solved};
  }
  return result;
}
