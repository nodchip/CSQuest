export const futureLevel={id:'forge-future-delivery',number:'157',kind:'future-delivery',name:'届くまで待つ魔法の箱',tag:'非同期の結果と待機',title:'伝令を待ちながら仕事をしよう',story:'遠くへ頼んだ宝石の結果はすぐには届きません。待っている間に灯りを準備し、届いた結果に応じて対応しましょう。'};
export const futureCases={success:{name:'宝石が届く',outcome:'fulfilled'},failure:{name:'伝令が失敗する',outcome:'rejected'}};
export const futureActions={start:'伝令を出す',await:'結果を待つ',early:'届く前に宝石を使おうとする',other:'待っている間に灯りを準備する',complete:'伝令の結果を届ける',use:'届いた宝石を使う',recover:'失敗を受け止めて代わりの依頼を用意する'};
export function createFutureTrial(id){if(!Object.hasOwn(futureCases,id))throw new RangeError('条件が不正です。');return {id,result:'not-started',waiting:false,resumed:false,early:false,other:false,done:false,history:[],message:'まず伝令を出しましょう。'};}
export function stepFuture(s,action){
  if(!Object.hasOwn(futureActions,action))throw new RangeError('操作が不正です。');if(s.done)return {...s,message:'この依頼は終わっています。'};if(s.history.length>=30)return {...s,message:'操作が多くなりました。最初から試しましょう。'};
  const n={...s,history:s.history.slice()};
  if(action==='start'&&s.result==='not-started'){n.result='pending';n.message='伝令を出しました。結果はまだ届いていません。';}
  else if(action==='await'&&s.result==='pending'&&!s.waiting){n.waiting=true;n.message='この仕事は結果を待ちます。他の仕事は進められます。';}
  else if(action==='early'&&s.result==='pending'&&!s.early){n.early=true;n.message='結果がまだないため、宝石を使えません。';}
  else if(action==='other'&&s.result==='pending'&&s.waiting&&!s.other){n.other=true;n.message='待っている間に、別の仕事で灯りを準備しました。';}
  else if(action==='complete'&&s.result==='pending'){n.result=futureCases[s.id].outcome;if(s.waiting){n.waiting=false;n.resumed=true;}n.message=n.result==='fulfilled'?'伝令が成功し、宝石が届きました。':'伝令は失敗しました。成功した宝石としては使えません。';}
  else if(action==='await'&&['fulfilled','rejected'].includes(s.result)&&!s.resumed){n.resumed=true;n.message=s.result==='fulfilled'?'届いた結果を受け取りました。':'失敗を受け取りました。';}
  else if(action==='use'&&s.result==='fulfilled'&&s.resumed){n.done=true;n.message='届いた宝石を使って仕事を終えました。';}
  else if(action==='recover'&&s.result==='rejected'&&s.resumed){n.done=true;n.message='失敗を受け止め、別の依頼を用意しました。';}
  else return {...s,message:'現在の結果と仕事の状態を見て、次の操作を選びましょう。'};
  n.history.push(action);return n;
}
export function futureTrialCorrect(s){return s.done&&s.early&&s.other;}
export function createFutures(){return {selected:'success',trials:Object.fromEntries(Object.keys(futureCases).map(id=>[id,createFutureTrial(id)]))};}
export function futuresComplete(s){return Object.keys(futureCases).every(id=>futureTrialCorrect(s.trials[id]));}
export function restoreFutures(saved){if(!saved||!Object.hasOwn(futureCases,saved.selected)||!saved.histories)throw new RangeError('途中記録が不正です。');const r=createFutures();r.selected=saved.selected;for(const id of Object.keys(futureCases)){const h=saved.histories[id];if(!Array.isArray(h)||h.length>30)throw new RangeError('途中記録が不正です。');for(const action of h){const before=r.trials[id],next=stepFuture(before,action);if(next.history.length!==before.history.length+1)throw new RangeError('途中記録が不正です。');r.trials[id]=next;}}return r;}
