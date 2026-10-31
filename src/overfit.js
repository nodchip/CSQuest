export const overfitLevel={id:'crystal-overfit',number:'70',kind:'overfit',name:'覚えた鑑定と新しい水晶',tag:'過学習と評価',title:'書庫の鑑定を比べよう',story:'鑑定士は二つの方法で水晶の種類を予測しました。覚えた記録と、まだ見せていない記録で結果を比べましょう。'};
export const trainingCrystals=[{id:'A',warm:true,label:'red'},{id:'B',warm:true,label:'red'},{id:'C',warm:true,label:'blue'},{id:'D',warm:false,label:'blue'},{id:'E',warm:false,label:'blue'},{id:'F',warm:false,label:'blue'}];
export const testCrystals=[{id:'G',warm:true,label:'red'},{id:'H',warm:false,label:'blue'},{id:'I',warm:true,label:'red'},{id:'J',warm:false,label:'blue'}];
export const overfitModels={memory:{name:'記号を覚える',description:'訓練記録の記号を丸ごと覚えます。未知の記号には、訓練記録で多い青を返します。'},rule:{name:'温かさの規則',description:'温かいなら赤、温かくないなら青を返します。'}};
export const overfitSets={training:{name:'訓練記録',rows:trainingCrystals},test:{name:'未使用の記録',rows:testCrystals}};
export const overfitCounts=[0,1,2,3,4,5,6];
export function predictCrystal(model,row){
  if(!Object.hasOwn(overfitModels,model))throw new RangeError('未知の方法です。');
  if(model==='rule')return row.warm?'red':'blue';
  return trainingCrystals.find(item=>item.id===row.id)?.label??'blue';
}
export function evaluateCrystals(model,set){if(!Object.hasOwn(overfitSets,set))throw new RangeError('未知の記録です。');const rows=overfitSets[set].rows.map(row=>{const predicted=predictCrystal(model,row);return {...row,predicted,correct:predicted===row.label};});return {rows,correct:rows.filter(row=>row.correct).length};}
export function createOverfit(){return {model:'memory',set:'training',trials:Object.fromEntries(Object.keys(overfitModels).map(m=>[m,Object.fromEntries(Object.keys(overfitSets).map(s=>[s,{prediction:null,checked:false}]))])),conclusion:''};}
export function restoreOverfit(saved){
  if(!saved||!Object.hasOwn(overfitModels,saved.model)||!Object.hasOwn(overfitSets,saved.set)||!saved.trials||!['','limited','training','universal'].includes(saved.conclusion))throw new RangeError('途中記録が不正です。');const result=createOverfit();result.model=saved.model;result.set=saved.set;result.conclusion=saved.conclusion;
  for(const m of Object.keys(overfitModels))for(const s of Object.keys(overfitSets)){const t=saved.trials[m]?.[s];if(!t||![null,...overfitCounts].includes(t.prediction)||typeof t.checked!=='boolean')throw new RangeError('途中記録が不正です。');result.trials[m][s]={prediction:t.prediction,checked:t.checked};}return result;
}
export function overfitTrialsComplete(state){return Object.keys(overfitModels).every(m=>Object.keys(overfitSets).every(s=>{const t=state.trials[m][s];return t.checked&&t.prediction===evaluateCrystals(m,s).correct;}));}
export function overfitComplete(state){return overfitTrialsComplete(state)&&state.conclusion==='limited';}
