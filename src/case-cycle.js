export const caseCycleLevel={id:'workshop-case-cycle',number:'1057',kind:'case-cycle',name:'修理の記録を育てる',tag:'事例ベース推論の循環',title:'経験を次の装置へ',story:'灯と鈴の故障を直した経験を、新しい装置にも役立てます。過去の事例を試し、検査と修正を経て記録しましょう。'};
const oldCase={id:'old',power:false,repairs:['battery']},newCase={id:'new',power:true,repairs:['lamp','bell']};
export function caseRecall(stored,power){
 if(typeof stored!=='boolean'||![null,true,false].includes(power))throw new RangeError('事例の検索条件が不正です。');
 return [oldCase,...(stored?[newCase]:[])].filter(c=>power===null||c.power===power).map(c=>({id:c.id,power:c.power,repairs:[...c.repairs]}));
}
export function caseCycleCreate(){return {scene:'first',known:{first:false,later:false},retrieved:[],oldRetrieved:false,wrongTried:false,noMatch:false,repairs:{first:[],later:[]},stored:false,newRetrieved:false,answer:null,history:[]};}
export function caseCycleAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=64)return {ok:false,message:'操作記録がいっぱいです。最初からやり直してください。'};
 const n={...s,known:{...s.known},retrieved:[...s.retrieved],repairs:{first:[...s.repairs.first],later:[...s.repairs.later]},history:[...s.history]};let message='';
 if(action==='retrieve'){
  const matches=caseRecall(s.stored,s.known[s.scene]?true:null);n.retrieved=matches.map(x=>x.id);
  if(s.scene==='first'&&!s.known.first&&n.retrieved.includes('old'))n.oldRetrieved=true;
  if(s.scene==='first'&&s.known.first&&!s.stored&&matches.length===0)n.noMatch=true;
  if(s.scene==='later'&&s.known.later&&n.retrieved.includes('new'))n.newRetrieved=true;
  message=matches.length?`一致する事例：${matches.map(x=>x.id==='old'?'古い魔力石の事例':'新しい導線の事例').join('、')}。`:'現在の観測に一致する事例はありません。';
 }else if(action==='reuse'){
  if(s.scene!=='first'||!s.oldRetrieved||s.known.first||!s.retrieved.includes('old'))return {ok:false,message:'まず魔力石の古い事例を取り出しましょう。'};
  n.wrongTried=true;message='古い事例どおり魔力石を修理しましたが、灯と鈴は止まったままです。';
 }else if(action==='probe'){
  if(s.scene==='first'&&!s.wrongTried)return {ok:false,message:'まず取り出した事例を試しましょう。'};
  n.known[s.scene]=true;n.retrieved=[];message='魔力石は正常です。観測が増えたので、事例を検索し直しましょう。';
 }else if(action==='repair:lamp'||action==='repair:bell'){
  if(s.scene==='first'&&(!s.known.first||!s.noMatch))return {ok:false,message:'魔力石を検査し、現在の観測で事例を検索し直しましょう。'};
  if(s.scene==='later'&&(!s.known.later||!s.newRetrieved))return {ok:false,message:'魔力石の状態を調べ、記録した事例を探しましょう。'};
  const part=action.slice(7);if(n.repairs[s.scene].includes(part))return {ok:false,message:'この導線は修理済みです。'};
  n.repairs[s.scene].push(part);message=part==='lamp'?'灯の導線を修理しました。':'鈴の導線を修理しました。';
 }else if(action==='retain'){
  if(s.scene!=='first'||!['lamp','bell'].every(x=>s.repairs.first.includes(x)))return {ok:false,message:'まず両方が動くところまで修理しましょう。'};
  if(s.stored)return {ok:false,message:'新しい事例は保存済みです。'};
  n.stored=true;message='魔力石が正常で両導線を修理した事例を、この依頼の事例帳に保存しました。';
 }else if(action==='next'){
  if(s.scene!=='first'||!s.stored)return {ok:false,message:'まず修理した事例を保存しましょう。'};
  n.scene='later';n.retrieved=[];message='次の装置が届きました。灯と鈴はどちらも止まっています。';
 }else if(['answer:verify','answer:guarantee','answer:forget'].includes(action)){n.answer=action.slice(7);message='振り返りを選びました。';}
 else return {ok:false,message:'操作を確認しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function caseCycleRestore(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>64)throw new RangeError('途中記録が不正です。');let s=caseCycleCreate();for(const a of saved.history){if(typeof a!=='string')throw new RangeError('途中記録が不正です。');const r=caseCycleAct(s,a);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
export function caseCycleDone(s){return s.scene==='later'&&s.stored&&s.newRetrieved&&['lamp','bell'].every(x=>s.repairs.later.includes(x))&&s.answer==='verify';}
