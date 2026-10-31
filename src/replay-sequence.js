export const replayLevel={id:'castle-replay-sequence',number:'263',kind:'replay-sequence',name:'伝令の番号を守る',tag:'再送と認証された番号',title:'古い伝令の再利用を防ごう',story:'依頼262の受け手に番号の記録を加え、伝令を一度ずつ受け取ります。'};
export const replayModes={unbound:'番号を印に含めない',bound:'番号も印に含める'};
export const replayActions={one:'番号１の正しい伝令',two:'番号２の正しい伝令',forged:'番号１を２に書き換えた伝令'};
// Both authentic messages request one packet. The forged message retains
// message 1's tag. A tag protects the number only in the bound model.
export function replayRun(mode,history){
 if(!Object.hasOwn(replayModes,mode)||!Array.isArray(history)||history.length>30||!history.every(a=>Object.hasOwn(replayActions,a)))throw new RangeError('操作が不正です。');
 let next=1,stock=0;const events=[];
 for(const action of history){const number=action==='one'?1:2,valid=!(mode==='bound'&&action==='forged');let result;
  if(!valid)result='invalid';else if(number!==next)result=number<next?'old':'early';else{result='accepted';next++;stock++;}
  events.push({action,number,result,next,stock});
 }
 return {next,stock,events};
}
export function createReplay(){return {mode:'unbound',histories:{unbound:[],bound:[]}};}
export function replayComplete(s){const u=replayRun('unbound',s.histories.unbound).events,b=replayRun('bound',s.histories.bound).events;return u.some(e=>e.action==='forged'&&e.result==='accepted')&&b.some(e=>e.action==='forged'&&e.result==='invalid')&&b.some(e=>e.action==='two'&&e.result==='accepted')&&b.some(e=>e.action==='one'&&e.result==='old');}
export function restoreReplay(saved){if(!saved||!Object.hasOwn(replayModes,saved.mode)||!saved.histories)throw new RangeError('途中記録が不正です。');for(const mode of Object.keys(replayModes))replayRun(mode,saved.histories[mode]);return {mode:saved.mode,histories:{unbound:[...saved.histories.unbound],bound:[...saved.histories.bound]}};}
