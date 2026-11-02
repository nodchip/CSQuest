export const casLevel={id:'forge-cas-counter',number:'814',kind:'cas-counter',name:'二人と止まらない台帳',tag:'比較交換と進行保証',title:'鍵と比較交換で台帳を守ろう',story:'二人の精霊が同じ台帳に一つずつ印を加えます。一人を待たせて、鍵と比較交換の進み方を調べましょう。'};
export const casCases={lock:'鍵で守る',cas:'比較交換で更新'};
export function casInitial(id){if(!Object.hasOwn(casCases,id))throw new RangeError('方式が不正です');return {id,value:0,owner:null,workers:{A:{stage:'ready',local:null,failed:false},B:{stage:'ready',local:null,failed:false}},blocked:false,otherProgress:false,retried:false,message:'二人の仕事を選びましょう。'};}
export function casExecute(s,action){if(typeof action!=='string'||!/^\w+:[AB]$/.test(action))throw new RangeError('操作が不正です');const [op,id]=action.split(':'),w=s.workers[id],other=s.workers[id==='A'?'B':'A'];if(w.stage==='done')throw new RangeError('この精霊の更新は終わっています。');
 if(s.id==='lock'){
  if(op==='acquire'&&w.stage==='ready'){if(s.owner!==null){s.blocked=true;s.message=`${id} は ${s.owner} の鍵が空くまで進めません。`;}else{s.owner=id;w.stage='holding';s.message=`${id} が鍵を取りました。`;}}
  else if(op==='read'&&w.stage==='holding'&&s.owner===id){w.local=s.value;w.stage='read';s.message=`${id} は ${s.value} を読みました。`;}
  else if(op==='write'&&w.stage==='read'&&s.owner===id){s.value=w.local+1;w.stage='written';s.message=`${id} が ${s.value} に更新しました。`;}
  else if(op==='release'&&w.stage==='written'&&s.owner===id){s.owner=null;w.stage='done';s.message=`${id} が鍵を返しました。`;}
  else throw new RangeError('鍵を取ってから読み、書いて、最後に返しましょう。');
 }else{
  if(op==='read'&&w.stage==='ready'){w.local=s.value;w.stage='read';s.message=`${id} は ${s.value} を読み、次は ${s.value+1} を提案します。`;}
  else if(op==='swap'&&w.stage==='read'){const expected=w.local,observed=s.value;if(expected===observed){s.value=expected+1;w.stage='done';if(w.failed)s.retried=true;if(other.stage==='read')s.otherProgress=true;s.message=`${id} の比較交換は成功し、${s.value} になりました。`;}else{w.stage='ready';w.local=null;w.failed=true;s.message=`${id} が期待した ${expected} と現在の ${observed} が違い、更新されません。読み直しましょう。`;}}
  else throw new RangeError('まだ終わっていない精霊が読み、その値で比較交換しましょう。');
 }
 return s;}
export function casReplay(id,history){if(!Array.isArray(history)||history.length>30)throw new RangeError('記録が不正です');const s=casInitial(id);for(const a of history)casExecute(s,a);return s;}
export function casCreate(){return {selected:'lock',trials:{lock:[],cas:[]},answer:null};}
export function casStep(q,action){const h=q.trials[q.selected];if(h.length>=30)throw new RangeError('操作は30回までです。この方式を最初からやり直せます。');casExecute(casReplay(q.selected,h),action);h.push(action);}
export function casTrialDone(id,history){const s=casReplay(id,history);return s.value===2&&Object.values(s.workers).every(w=>w.stage==='done')&&(id==='lock'?s.blocked:s.otherProgress&&s.retried);}
export function casComplete(q){return Object.keys(casCases).every(id=>casTrialDone(id,q.trials[id]))&&q.answer==='system';}
export function casRestore(q){if(!q||!Object.hasOwn(casCases,q.selected)||!q.trials||![null,'system','everyone','lock'].includes(q.answer))throw new RangeError('記録が不正です');const n=casCreate();n.selected=q.selected;n.answer=q.answer;for(const id of Object.keys(casCases)){casReplay(id,q.trials[id]);n.trials[id]=[...q.trials[id]];}return n;}
