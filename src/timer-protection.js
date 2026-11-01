export const timerProtectionLevel={id:'forge-timer-protection',number:'672',kind:'timer-protection',name:'時計を守る魔法盤',tag:'タイマー割込みと特権',title:'譲らない術師から盤を取り戻そう',story:'術師 A が魔法盤を使い続け、B の短い仕事が待っています。時計と権限の仕組みを変え、司令室がいつ盤を取り戻せるか調べましょう。'};
export const timerProtectionModes={cooperative:'時計なし・自発的な返却を待つ',unprotected:'時計あり・利用者も停止できる',protected:'時計あり・司令室だけが停止できる'};
export function createTimerTrial(mode){if(!Object.hasOwn(timerProtectionModes,mode))throw new RangeError('仕組みが不正です。');return {mode,timer:mode!=='cooperative',attempted:false,tick:0,phase:'user',running:'A',bDone:false,history:[]};}
export function timerTrialAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=12||s.phase==='done')return {ok:false,message:'この仕組みの観察は終わっています。必要ならやり直してください。'};
 const n={...s,history:[...s.history]};let message='';
 if(action==='disable'&&!s.attempted&&s.tick===0){n.attempted=true;if(s.mode==='cooperative')message='時計がないため止めるものはありません。A は盤を返しません。';else if(s.mode==='unprotected'){n.timer=false;message='利用者の A が時計を止めました。';}else message='時計を止める操作は司令室専用のため、利用者の A は止められません。';}
 else if(action==='tick'&&s.attempted&&s.phase==='user'){
  n.tick++;if(s.running==='B'){n.bDone=true;message='B の１刻の仕事が終わりました。';}else message='A が１刻だけ実行しました。';
  if(n.tick===2&&s.timer){n.phase='interrupt';message+=' 時計が割込みを起こし、司令室に制御が戻りました。';}
  if(n.tick===3){n.phase='done';message+=n.bDone?' B の仕事を完了しました。':' B はまだ待っています。';}
 }
 else if(action==='dispatch'&&s.phase==='interrupt'){n.running='B';n.phase='user';message='司令室が B を選び、利用者の仕事に戻りました。';}
 else return {ok:false,message:'まず時計を止める試みを行い、割込み中は B を選んでから進めましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function createTimerProtection(){return {selected:'cooperative',trials:Object.fromEntries(Object.keys(timerProtectionModes).map(k=>[k,createTimerTrial(k)])),answer:null,checked:false};}
export function timerProtectionComplete(s){return Object.keys(timerProtectionModes).every(k=>s.trials[k].phase==='done')&&s.answer==='hardware'&&s.checked;}
export function restoreTimerProtection(saved){if(!saved||!Object.hasOwn(timerProtectionModes,saved.selected)||!saved.trials||![null,'hardware','fairness','always'].includes(saved.answer)||typeof saved.checked!=='boolean')throw new RangeError('途中記録が不正です。');const n=createTimerProtection();n.selected=saved.selected;n.answer=saved.answer;n.checked=saved.checked;for(const mode of Object.keys(timerProtectionModes)){const h=saved.trials[mode]?.history;if(!Array.isArray(h)||h.length>12)throw new RangeError('途中記録が不正です。');for(const a of h){if(typeof a!=='string')throw new RangeError('途中記録が不正です。');const r=timerTrialAct(n.trials[mode],a);if(!r.ok)throw new RangeError('途中記録が不正です。');n.trials[mode]=r.state;}}return n;}
