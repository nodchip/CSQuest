export const paradigmInventoryLevel={id:'village-paradigm-inventory',number:'593',kind:'paradigm-inventory',name:'薬草箱の三つの作り方',tag:'プログラミングパラダイムの比較',title:'薬草の数を三つの方法で守ろう',story:'薬師の箱には薬草を三つまで入れられます。同じ仕事を、三つの異なる作り方で試しましょう。'};
export const inventoryDesigns={procedural:'共有箱と手続き',object:'非公開箱を持つ物体',functional:'変更しない値と関数'};
export const inventoryActions={add:'薬草を１つ追加',direct:'箱に５を直接書く',old:'追加前の入口を読む'};
export const inventorySequence=['add','add','direct','old'];
export const inventoryPredictions=['3','full','5','blocked','2'];
export function runParadigmInventory(mode,actions){
 if(!Object.hasOwn(inventoryDesigns,mode)||!Array.isArray(actions)||actions.length>12||actions.some(x=>!Object.hasOwn(inventoryActions,x)))throw new RangeError('試行が不正です。');
 let current=2,old=2;const results=[];
 for(const action of actions){
  if(action==='add'){if(current>=3){results.push('full');continue;}current++;if(mode!=='functional')old=current;results.push(String(current));}
  else if(action==='direct'){if(mode==='procedural'){current=5;old=5;results.push('5');}else results.push('blocked');}
  else results.push(String(old));
 }
 return {current,old,results};
}
const trial=()=>({history:[],prediction:null});
export function createParadigmInventory(){return {mode:'procedural',trials:{procedural:trial(),object:trial(),functional:trial()},answer:null,checked:false,message:'操作の結果を予想しましょう。'};}
export function stepParadigmInventory(s){
 const t=s.trials[s.mode],action=inventorySequence[t.history.length];if(!action)throw new RangeError('試行は完了しています。');
 const expected=runParadigmInventory(s.mode,[...t.history,action]).results.at(-1);
 if(t.prediction!==expected)return {...s,message:`結果は「${predictionLabels[expected]}」です。予想が合うまで操作は行いません。仕組みを見て選び直しましょう。`};
 return {...s,trials:{...s.trials,[s.mode]:{history:[...t.history,action],prediction:null}},checked:false,message:`結果「${predictionLabels[expected]}」を確かめました。`};
}
export const predictionLabels={'3':'３','full':'満杯で追加できない','5':'５','blocked':'直接書き換えられない','2':'２'};
export function paradigmInventoryComplete(s){return Object.keys(inventoryDesigns).every(k=>s.trials[k].history.length===inventorySequence.length)&&s.answer==='designs'&&s.checked;}
export function restoreParadigmInventory(saved){
 if(!saved||!Object.hasOwn(inventoryDesigns,saved.mode)||!saved.trials||![null,'designs','always','identity'].includes(saved.answer)||typeof saved.checked!=='boolean')throw new RangeError('途中記録が不正です。');
 const s=createParadigmInventory();s.mode=saved.mode;s.answer=saved.answer;s.checked=saved.checked;
 for(const mode of Object.keys(inventoryDesigns)){const t=saved.trials[mode];if(!t||!Array.isArray(t.history)||t.history.length>inventorySequence.length||t.history.some((a,i)=>a!==inventorySequence[i])||!(t.prediction===null||inventoryPredictions.includes(t.prediction)))throw new RangeError('試行が不正です。');s.trials[mode]={history:[...t.history],prediction:t.prediction};}
 return s;
}
