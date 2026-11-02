export const sessionLevel={id:'village-web-session',number:'804',kind:'web-session',name:'旅人のしおり',tag:'Web の状態維持',title:'二人の旅人の記録を守ろう',story:'薬師の受付で、旅人ごとの薬草の記録が混ざらない仕組みを調べます。'};
export const sessionActions={'visit:A':'旅人 A が受付を訪ねる','visit:B':'旅人 B が受付を訪ねる','add:A':'A の記録に薬草を加える','add:B':'B の記録に薬草を加える','clear:A':'A のしおりを消す','expire:A':'受付が A の記録を期限切れにする'};
export function sessionInitial(){return {cookies:{A:null,B:null},shown:{A:null,B:null},sessions:{},next:1,cleared:null,expired:null,evidence:{resume:false,isolation:false,clear:false,expiry:false},message:'受付を訪ねると、しおりを受け取れます。'};}
export function sessionExecute(s,action){
 if(!Object.hasOwn(sessionActions,action))throw new RangeError('操作が不正です');
 const [op,who]=action.split(':'),id=s.cookies[who],exists=id!==null&&Object.hasOwn(s.sessions,id);
 if(op==='visit'){
  let current=id;
  if(!exists){current=`S${s.next++}`;s.sessions[current]=0;s.cookies[who]=current;
   if(who==='A'&&id===null&&s.cleared&&Object.hasOwn(s.sessions,s.cleared))s.evidence.clear=true;
   if(who==='A'&&id!==null&&id===s.expired)s.evidence.expiry=true;
   if(who==='B'&&s.cookies.A&&Object.hasOwn(s.sessions,s.cookies.A)&&s.sessions[s.cookies.A]>0)s.evidence.isolation=true;
   s.message=`有効なしおりがないため、新しい ${current} と空の記録を用意しました。`;
  }else{if(who==='A'&&s.sessions[current]>0)s.evidence.resume=true;s.message=`しおり ${current} を手がかりに、受付が記録を読みました。`;}
  s.shown[who]=s.sessions[current];
 }else if(op==='add'){
  if(!exists)throw new RangeError('先に受付を訪ねて、有効なしおりを受け取りましょう。');
  s.sessions[id]++;s.shown[who]=s.sessions[id];s.message=`${id} の記録に薬草を加え、結果を返しました。`;
 }else if(op==='clear'){
  if(id===null)throw new RangeError('A のしおりは既にありません。');
  s.cleared=exists&&s.sessions[id]>0?id:null;s.cookies.A=null;s.message='A のしおりを端末から消しました。受付の記録は消していません。';
 }else{
  if(!exists||s.sessions[id]===0)throw new RangeError('先に A の有効な記録へ薬草を加えましょう。');
  s.expired=id;delete s.sessions[id];s.message=`受付が ${id} の記録を期限切れにしました。端末には古いしおりが残っています。`;
 }
 return s;
}
export function sessionReplay(history){if(!Array.isArray(history)||history.length>60)throw new RangeError('記録が不正です');const s=sessionInitial();for(const a of history)sessionExecute(s,a);return s;}
export function sessionCreate(){return {history:[],answer:null};}
export function sessionStep(q,action){if(q.history.length>=60)throw new RangeError('操作は60回までです。最初からやり直せます。');sessionExecute(sessionReplay(q.history),action);q.history.push(action);}
export function sessionComplete(q){return Object.values(sessionReplay(q.history).evidence).every(Boolean)&&q.answer==='linked';}
export function sessionRestore(q){if(!q||![null,'linked','automatic','cookie-data'].includes(q.answer))throw new RangeError('記録が不正です');sessionReplay(q.history);return {history:[...q.history],answer:q.answer};}
