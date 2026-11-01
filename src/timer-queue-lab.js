export function createTimerQueueLab(){return {now:0,queue:[{id:'A',due:3},{id:'B',due:7},{id:'D',due:7}],armed:null,inserted:false,interrupt:false,delivered:[],history:[]};}
export function timerQueueDone(s){return s.inserted&&s.queue.length===0&&!s.interrupt;}
export function timerQueueAct(s,action){
  if(!s||!Array.isArray(s.history)||s.history.length>=32||timerQueueDone(s))return {ok:false,message:'この試験は終わっています。'};
  const n={...s,queue:s.queue.map(x=>({...x})),delivered:[...s.delivered],history:[...s.history]};let message='';
  if(['arm:2','arm:3','arm:7'].includes(action)&&!s.interrupt&&s.queue.length){const time=Number(action.slice(4)),next=Math.min(...s.queue.map(x=>x.due));if(time!==next||time<=s.now)return {ok:false,message:'待つ予定のうち、まだ来ていない最も早い時刻に合わせましょう。'};n.armed=time;message=`時計を時刻 ${time} に設定しました。`;}
  else if(action==='tick'&&!s.inserted&&s.now===0&&s.armed===3&&!s.interrupt){n.now=1;message='時刻１になり、新しい予定が届きました。';}
  else if(action==='insert'&&!s.inserted&&s.now===1&&!s.interrupt){n.inserted=true;n.queue.push({id:'C',due:2});message='時刻２の予定 C を追加しました。次の鐘の設定を確認しましょう。';}
  else if(action==='advance'&&s.inserted&&!s.interrupt&&s.armed!==null&&s.armed===Math.min(...s.queue.map(x=>x.due))&&s.armed>s.now){n.now=s.armed;n.armed=null;n.interrupt=true;message=`時刻 ${n.now} に鐘が鳴りました。満了した予定を処理しましょう。`;}
  else if(action==='service'&&s.interrupt){const due=s.queue.filter(x=>x.due<=s.now);if(!due.length)return {ok:false,message:'まだ満了した予定はありません。'};n.queue=n.queue.filter(x=>x.due>s.now);n.delivered.push(...due.map(x=>x.id));n.interrupt=false;message=`${due.map(x=>x.id).join('・')} を知らせました。`;}
  else return {ok:false,message:'予定の追加、最も早い時刻への設定、鐘と満了処理の順を確認しましょう。'};
  n.history.push(action);return {ok:true,state:n,message};
}
export function restoreTimerQueueLab(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>32)throw new RangeError('時計の記録が不正です。');let s=createTimerQueueLab();for(const action of saved.history){if(typeof action!=='string')throw new RangeError('時計の記録が不正です。');const r=timerQueueAct(s,action);if(!r.ok)throw new RangeError('時計の記録が不正です。');s=r.state;}return s;}
