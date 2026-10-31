export const automatonLevel={id:'memory-gate',number:'31',kind:'automaton',name:'記憶する灯りの門',tag:'有限状態機械',title:'印の数を覚える門',story:'遺跡の門は印を一つずつ受け取り、太陽の印を奇数回受け取ったときに開くはずです。二つの灯りの状態をつなぎ直しましょう。'};
export const machineStates={dark:'消えた灯り',lit:'光る灯り'};
export const symbols={sun:'太陽',moon:'月'};
export function defaultTransitions(){return {dark:{sun:'dark',moon:'dark'},lit:{sun:'dark',moon:'dark'}};}
export function validateMachine(table){
  if(!table||typeof table!=='object')throw new RangeError('遷移の記録が不正です。');
  for(const state of Object.keys(machineStates))for(const symbol of Object.keys(symbols))if(!table[state]||!Object.hasOwn(machineStates,table[state][symbol]))throw new RangeError('遷移の記録が不正です。');
}
export function simulateMachine(table,word){
  validateMachine(table);
  if(!Array.isArray(word)||word.length>6||word.some(symbol=>!Object.hasOwn(symbols,symbol)))throw new RangeError('印の列が不正です。');
  let state='dark';const trace=[state];for(const symbol of word){state=table[state][symbol];trace.push(state);}
  return {trace,accept:state==='lit',expected:word.filter(symbol=>symbol==='sun').length%2===1};
}
export function checkMachine(table){
  validateMachine(table);let words=[[]];const examples=[];
  for(let length=0;length<=4;length++){
    for(const word of words){const result=simulateMachine(table,word);examples.push({word,...result});}
    words=words.flatMap(word=>['sun','moon'].map(symbol=>[...word,symbol]));
  }
  return {tested:examples.length,failed:examples.filter(example=>example.accept!==example.expected)};
}
export function restoreMachine(saved){
  if(!saved||typeof saved.checked!=='boolean')throw new RangeError('途中記録が不正です。');validateMachine(saved.table);simulateMachine(saved.table,saved.word);
  return {table:Object.fromEntries(Object.keys(machineStates).map(state=>[state,{sun:saved.table[state].sun,moon:saved.table[state].moon}])),word:saved.word.slice(),checked:saved.checked};
}
