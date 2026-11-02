export const fixationLevel={id:'castle-session-fixation',number:'805',kind:'session-fixation',name:'偽りのしおり',tag:'認証とセッション固定',title:'受付のしおりを取り替えよう',story:'王城の薬草受付で、旅人の認証前後にしおりがどう扱われるか調べます。'};
export const fixationCases={keep:'認証後も番号を使い続ける',rotate:'認証時に番号を取り替える'};
export const fixationActions={plant:'既知の番号を旅人に持たせる',login:'旅人が正しく認証する',old:'以前の番号で試す',leak:'新しい番号が漏れたと仮定',fresh:'漏れた番号で試す',logout:'旅人がログアウト',after:'最後に持つ番号で再び試す'};
export function fixationInitial(id){if(!Object.hasOwn(fixationCases,id))throw new RangeError('場面が不正です');return {id,stage:'plant',victim:null,attacker:null,valid:null,authenticated:false,oldResult:null,newResult:null,afterResult:null};}
export function fixationExecute(s,action,guess=null){
 if(action!==s.stage||s.stage==='done')throw new RangeError('次に行う操作を確かめましょう。');
 if(['old','fresh','after'].includes(action)){
  if(!['allowed','denied'].includes(guess))throw new RangeError('先に受付が許可するか予想しましょう。');
  const actual=s.authenticated&&s.attacker===s.valid?'allowed':'denied';
  if(guess!==actual)throw new RangeError('番号と受付の認証状態を見比べ、予想を選び直しましょう。');
  if(action==='old'){s.oldResult=actual;s.stage=s.id==='rotate'?'leak':'logout';}
  else if(action==='fresh'){s.newResult=actual;s.stage='logout';}
  else{s.afterResult=actual;s.stage='done';}
 }else{
  if(guess!==null)throw new RangeError('操作が不正です。');
  if(action==='plant'){s.victim='S0';s.attacker='S0';s.valid='S0';s.stage='login';}
  if(action==='login'){s.valid=s.id==='rotate'?'S1':'S0';s.victim=s.valid;s.authenticated=true;s.stage='old';}
  if(action==='leak'){s.attacker=s.victim;s.stage='fresh';}
  if(action==='logout'){s.valid=null;s.authenticated=false;s.victim=null;s.stage='after';}
 }
 return s;
}
export function fixationReplay(id,history){if(!Array.isArray(history)||history.length>7)throw new RangeError('記録が不正です');const s=fixationInitial(id);for(const item of history){if(typeof item!=='string')throw new RangeError('記録が不正です');const [a,g,...extra]=item.split(':');if(extra.length)throw new RangeError('記録が不正です');fixationExecute(s,a,g??null);}return s;}
export function fixationCreate(){return {selected:'keep',trials:{keep:[],rotate:[]},answer:null,logout:null};}
export function fixationStep(q,action,guess=null){const h=q.trials[q.selected];fixationExecute(fixationReplay(q.selected,h),action,guess);h.push(guess===null?action:`${action}:${guess}`);}
export function fixationComplete(q){return Object.keys(fixationCases).every(id=>fixationReplay(id,q.trials[id]).stage==='done')&&q.answer==='old'&&q.logout==='invalidate';}
export function fixationRestore(q){if(!q||!Object.hasOwn(fixationCases,q.selected)||!q.trials||![null,'old','all','irrelevant'].includes(q.answer)||![null,'invalidate','browser','forever'].includes(q.logout))throw new RangeError('記録が不正です');const n=fixationCreate();n.selected=q.selected;n.answer=q.answer;n.logout=q.logout;for(const id of Object.keys(fixationCases)){fixationReplay(id,q.trials[id]);n.trials[id]=[...q.trials[id]];}return n;}
