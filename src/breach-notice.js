export const breachNoticeLevel={id:'castle-breach-notice',number:'1270',kind:'breach-notice',name:'漏えいの知らせを届ける',tag:'事故対応と通知',title:'分かったことから知らせよう',story:'王国の台帳で個人情報への不正なアクセスが確認されました。架空の通知方針に沿って、影響の抑制と知らせを進めましょう。'};
export function breachCreate(){return {time:0,contained:false,content:null,initial:null,initialCountKnown:false,investigated:false,updated:false,people:false,sawLate:false,reflection:null,history:[]};}
export function breachAct(q,action){if(!q||!Array.isArray(q.history)||q.history.length>=128)return {ok:false,message:'記録がいっぱいです。'};let n={...q,history:[...q.history]},message='';
 if(action==='contain'&&!n.contained){n.contained=true;n.time++;message='公開されていた入口を閉じました。';}
 else if(action==='wait'){n.time+=3;message='調査を待つ間に３刻が過ぎました。';}
 else if(['content:known','content:guess'].includes(action)){n.content=action.slice(8);message='初報の内容を選びました。';}
 else if(action==='initial'&&n.contained&&n.initial===null&&n.content==='known'){n.time++;n.initial=n.time;n.initialCountKnown=n.investigated;if(n.time>3)n.sawLate=true;message=n.time<=3?'その時点の判明分と未確定事項を初報として記録しました。':'初報は架空の期限を過ぎました。やり直して比べましょう。';}
 else if(action==='investigate'&&!n.investigated){n.time++;n.investigated=true;message='追加調査で影響件数が分かりました。';}
 else if(action==='update'&&n.initial!==null&&n.investigated&&!n.updated){n.time++;n.updated=true;message='追加情報を初報に追記しました。';}
 else if(action==='people'&&n.initial!==null&&!n.people){n.time++;n.people=true;message='影響を受けた人への知らせを準備しました。';}
 else if(action==='reset'){const late=n.sawLate,history=n.history;n={...breachCreate(),sawLate:late,history};message='この事故の対応を最初からやり直します。遅れた比較の記録は残ります。';}
 else if(['answer:uncertainty','answer:wait'].includes(action)){n.reflection=action.slice(7);message='振り返りを選びました。';}
 else return {ok:false,message:'入口の対処、初報の内容、調査や知らせの順序を確認しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};}
export function breachRestore(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>128)throw new RangeError('途中記録が不正です。');let q=breachCreate();for(const action of saved.history){if(typeof action!=='string')throw new RangeError('途中記録が不正です。');const r=breachAct(q,action);if(!r.ok)throw new RangeError('途中記録が不正です。');q=r.state;}return q;}
export function breachDone(q){return q.sawLate&&q.initial!==null&&q.initial<=3&&q.investigated&&q.updated&&q.people&&q.reflection==='uncertainty';}
