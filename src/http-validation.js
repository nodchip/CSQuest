export const httpValidationLevel={id:'forest-http-validation',number:'670',kind:'http-validation',name:'地図の版を確かめる返事',tag:'HTTP 条件付き GET とキャッシュ',title:'変わらない地図を確かめよう',story:'森の旅人は同じ地図を何度も書庫に求めます。手元の写しの目印を使い、変更の有無と返事を確かめましょう。'};
export const httpValidationModes={full:'毎回地図を取得',conditional:'写しの目印で条件付き取得'};
const etag=version=>`"map-v${version}"`;
export function createHttpValidationTrial(mode){if(!Object.hasOwn(httpValidationModes,mode))throw new RangeError('方式が不正です。');return {mode,version:1,cache:null,reports:[],seen:[],units:0,history:[]};}
export function httpValidationAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=64)return {ok:false,message:'操作記録がいっぱいです。この方式をやり直してください。'};
 const n={...s,reports:s.reports.map(r=>({...r})),seen:[...s.seen],history:[...s.history]};let message='';const mark=k=>{if(!n.seen.includes(k))n.seen.push(k);};
 if(action==='update'&&s.version===1){n.version=2;message='書庫の地図と目印が版２に変わりました。旅人の写しはまだ変わりません。';}
 else if(action==='get'){
  const sent=s.mode==='conditional'&&s.cache!==null?etag(s.cache):null,serverTag=etag(s.version),status=sent===serverTag?304:200,body=status===200?8:0;
  if(status===200)n.cache=s.version;n.units+=body;n.reports.push({sent,serverTag,status,body,cache:n.cache});
  if(s.version===1&&s.cache===null&&status===200)mark('initial');
  if(s.version===1&&s.cache===1&&((s.mode==='full'&&status===200)||(s.mode==='conditional'&&status===304)))mark('repeat');
  if(s.version===2&&s.cache===1&&status===200)mark('changed');
  if(s.version===2&&s.cache===2&&s.mode==='conditional'&&status===304)mark('revalidated');
  message=status===200?'200：地図本体と新しい目印を受け取りました。':'304：本体は送られず、手元の写しを使います。';
 }
 else return {ok:false,message:'書庫の状態と操作を確認しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function createHttpValidation(){return {selected:'full',trials:{full:createHttpValidationTrial('full'),conditional:createHttpValidationTrial('conditional')},answer:null,checked:false};}
export function httpValidationComplete(s){return ['initial','repeat','changed'].every(k=>s.trials.full.seen.includes(k))&&['initial','repeat','changed','revalidated'].every(k=>s.trials.conditional.seen.includes(k))&&s.answer==='validate'&&s.checked;}
export function restoreHttpValidation(saved){if(!saved||!Object.hasOwn(httpValidationModes,saved.selected)||!saved.trials||![null,'validate','body','forever'].includes(saved.answer)||typeof saved.checked!=='boolean')throw new RangeError('途中記録が不正です。');const n=createHttpValidation();n.selected=saved.selected;n.answer=saved.answer;n.checked=saved.checked;for(const mode of Object.keys(httpValidationModes)){const h=saved.trials[mode]?.history;if(!Array.isArray(h)||h.length>64)throw new RangeError('途中記録が不正です。');for(const a of h){if(typeof a!=='string')throw new RangeError('途中記録が不正です。');const r=httpValidationAct(n.trials[mode],a);if(!r.ok)throw new RangeError('途中記録が不正です。');n.trials[mode]=r.state;}}return n;}
