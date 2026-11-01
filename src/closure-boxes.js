export const closureBoxesLevel={id:'workshop-closure-boxes',number:'591',kind:'closure-boxes',name:'封印が分け合う箱',tag:'クロージャと変更可能な束縛',title:'封印の箱を読み解こう',story:'精霊が二組の封印を作りました。同じ組の封印が箱を分け合うか、別の組はどうなるか調べましょう。'};
export const closureActions={incA:'Ａを１増やして読む',readA:'Ａを読む',incB:'Ｂを１増やして読む',readB:'Ｂを読む',roomA:'部屋からＡを読む'};
export const closureSequence=['incA','readB','incA','incB','readA','roomA'];
export function closureBoxRun(actions){
 if(!Array.isArray(actions)||actions.length>12)throw new RangeError('操作列が不正です。');
 const boxes={A:0,B:0},outputs=[];
 for(const action of actions){if(!Object.hasOwn(closureActions,action))throw new RangeError('操作が不正です。');const key=action==='incB'||action==='readB'?'B':'A';if(action==='incA'||action==='incB')boxes[key]++;outputs.push(boxes[key]);}
 return {boxes,outputs};
}
export function createClosureBoxes(){return {history:[],action:null,prediction:null,answer:null,checked:false,message:'次の封印と結果を予想しましょう。'};}
export function stepClosureBoxes(s){
 const next=closureSequence[s.history.length];if(!next)throw new RangeError('試行は完了しています。');
 if(s.action!==next)return {...s,message:`今は「${closureActions[next]}」を選びましょう。`};
 const result=closureBoxRun([...s.history,next]),actual=result.outputs.at(-1);
 if(s.prediction!==actual)return {...s,message:`予想と違います。この操作の結果は ${actual}。選んだ組の箱をたどりましょう。予想が合うまで箱は変えません。`};
 return {...s,history:[...s.history,next],action:null,prediction:null,checked:false,message:`結果は ${actual}。操作を記録しました。`};
}
export function closureBoxesComplete(s){return s.history.length===closureSequence.length&&s.answer==='shared'&&s.checked;}
export function restoreClosureBoxes(saved){
 if(!saved||!Array.isArray(saved.history)||saved.history.length>closureSequence.length||saved.history.some((a,i)=>a!==closureSequence[i])||!(saved.action===null||Object.hasOwn(closureActions,saved.action))||![null,0,1,2,3,9].includes(saved.prediction)||![null,'shared','copy','dynamic'].includes(saved.answer)||typeof saved.checked!=='boolean')throw new RangeError('途中記録が不正です。');
 return {...createClosureBoxes(),history:[...saved.history],action:saved.action,prediction:saved.prediction,answer:saved.answer,checked:saved.checked};
}
