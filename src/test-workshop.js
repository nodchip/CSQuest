export const testWorkshopLevel={id:'village-test-workshop',number:'660',kind:'test-workshop',name:'倉庫と試験の巻物',tag:'製品の処理とテスト',title:'薬の受け渡しと試験を組み立てよう',story:'村の薬倉庫に新しい受け渡しの仕組みが届きました。倉庫を動かす仕組みと、それを確かめる試験の巻物を別々に選んで調べましょう。'};
export const testVersions={correct:'約束どおりの倉庫',double:'２個減らす変更',empty:'空でも渡す変更'};
export function warehouseOutcome(version,initial){
 if(!Object.hasOwn(testVersions,version)||![0,3].includes(initial))throw new RangeError('倉庫の条件が不正です。');
 if(initial===0)return version==='empty'?{status:'issued',remaining:-1}:{status:'refused',remaining:0};
 return {status:'issued',remaining:version==='double'?1:2};
}
export function createTestWorkshop(){return {version:'correct',initial:3,expectedStatus:'issued',expectedRemaining:2,seen:[],report:null,answer:null,checked:false,history:[]};}
export function testWorkshopAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=128)return {ok:false,message:'記録がいっぱいです。最初からやり直してください。'};
 const n={...s,seen:[...s.seen],history:[...s.history],checked:false};let message='';const mark=k=>{if(!n.seen.includes(k))n.seen.push(k);};
 if(action.startsWith('version:')&&Object.hasOwn(testVersions,action.slice(8))){n.version=action.slice(8);n.report=null;message='倉庫の仕組みを選びました。';}
 else if(['initial:0','initial:3'].includes(action)){n.initial=Number(action.slice(8));n.report=null;message='試験の準備を選びました。';}
 else if(['status:issued','status:refused'].includes(action)){n.expectedStatus=action.slice(7);n.report=null;message='試験が期待する受け渡し結果を選びました。';}
 else if(['remaining:0','remaining:1','remaining:2'].includes(action)){n.expectedRemaining=Number(action.slice(10));n.report=null;message='試験が期待する残数を選びました。';}
 else if(action==='run'){
  const actual=warehouseOutcome(s.version,s.initial),spec=s.initial===0?{status:'refused',remaining:0}:{status:'issued',remaining:2},pass=actual.status===s.expectedStatus&&actual.remaining===s.expectedRemaining,oracleCorrect=spec.status===s.expectedStatus&&spec.remaining===s.expectedRemaining;
  n.report={actual,pass,oracleCorrect,spec};
  if(s.initial===3&&s.expectedStatus==='issued'&&s.expectedRemaining===1){if(s.version==='correct')mark('false-alarm');if(s.version==='double')mark('false-pass');}
  if(oracleCorrect){if(s.initial===3&&s.version==='correct')mark('correct3');if(s.initial===3&&s.version==='double')mark('detect3');if(s.initial===0&&s.version==='correct')mark('correct0');if(s.initial===0&&s.version==='empty')mark('detect0');}
  message=pass?'試験の期待値と実際の結果は一致しました。':'試験の期待値と実際の結果は一致しません。';
 }
 else if(['answer:separate','answer:identical','answer:always'].includes(action)){n.answer=action.slice(7);message='振り返りを選びました。';}
 else if(action==='check'){n.checked=true;message='記録と答えを確認しました。';}
 else return {ok:false,message:'試験の条件を確認しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function restoreTestWorkshop(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>128)throw new RangeError('途中記録が不正です。');let s=createTestWorkshop();for(const a of saved.history){if(typeof a!=='string')throw new RangeError('途中記録が不正です。');const r=testWorkshopAct(s,a);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
export function testWorkshopComplete(s){return ['false-alarm','false-pass','correct3','detect3','correct0','detect0'].every(k=>s.seen.includes(k))&&s.answer==='separate'&&s.checked;}
