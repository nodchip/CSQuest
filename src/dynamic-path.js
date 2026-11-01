export function createDynamicPath(){return {place:'S',closed:false,attempted:false,arrived:false,answer:null,checked:false,history:[]};}
export function dynamicPathAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=80)return {ok:false,message:'記録がいっぱいです。この試験を最初からやり直してください。'};
 const n={...s,history:[...s.history],checked:false};let message='';
 if(action==='move:A'&&s.place==='S'&&!s.arrived){n.place='A';n.closed=true;message='分かれ道に着くと、門への橋が閉じたと観測しました。';}
 else if(action==='move:G'&&s.place==='A'&&s.closed&&!s.arrived){n.attempted=true;message='橋は閉じているため進めません。別の道を探しましょう。';}
 else if(action==='move:B'&&s.place==='A'&&!s.arrived){n.place='B';message='回り道へ進みました。';}
 else if(action==='move:A'&&s.place==='B'&&!s.arrived){n.place='A';message='分かれ道へ戻りました。';}
 else if(action==='move:G'&&s.place==='B'&&!s.arrived){n.place='G';n.arrived=true;message='回り道から門に到着しました。';}
 else if(['answer:replan','answer:unchanged','answer:guarantee'].includes(action)){n.answer=action.slice(7);message='道が変わったときの対応を選びました。';}
 else if(action==='check'){n.checked=true;message='道の変化と判断を確認しました。';}
 else return {ok:false,message:'現在地と通れる道を確認しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function dynamicPathComplete(s){return s.attempted&&s.arrived&&s.answer==='replan'&&s.checked;}
export function restoreDynamicPath(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>80)throw new RangeError('途中記録が不正です。');let s=createDynamicPath();for(const a of saved.history){if(typeof a!=='string')throw new RangeError('途中記録が不正です。');const r=dynamicPathAct(s,a);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
