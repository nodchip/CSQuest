export const raceCowLevel={id:'castle-race-cow',number:'491',kind:'race-cow',name:'入れ替わる写しと封印',tag:'競合と保護の境界',title:'書込みの途中で頁が変わったら？',story:'王城の書庫では、魔術師は原本を読むだけで写しに書き込めます。書込みの途中で参照先が入れ替わる場合を調べ、原本を守りましょう。'};
export const raceModes={unchecked:'確認後の変化を見ない係',recheck:'書込み直前に確認する係'};
export function createRaceRun(){return {stage:0,mapping:'private',observed:null,original:7,copy:7,outcome:null,history:[]};}
export function raceStep(mode,state,action){
 if(!Object.hasOwn(raceModes,mode)||!['check','remap','write'].includes(action)||state.outcome!==null)throw new RangeError('この操作はできません。');
 const n={...state,history:[...state.history,action]};
 if(action==='check'&&n.stage===0){n.observed=n.mapping;n.stage=1;}
 else if(action==='remap'&&n.stage===1){n.mapping='original';n.stage=2;}
 else if(action==='write'&&(n.stage===1||n.stage===2)){
  if(mode==='recheck'&&n.mapping!==n.observed)n.outcome='blocked';
  else if(n.mapping==='original'){n.original=9;n.outcome='changed';}
  else {n.copy=9;n.outcome='private';}n.stage=3;
 }else throw new RangeError('先に係の確認を行い、必要なら参照先を入れ替えてから書き込みましょう。');
 return n;
}
export function replayRace(mode,history){if(!Array.isArray(history)||history.length>3)throw new RangeError('履歴が不正です。');return history.reduce((s,action)=>raceStep(mode,s,action),createRaceRun());}
export function createRaceCow(){return {selected:'unchecked',histories:{unchecked:[],recheck:[]},answer:null,checked:false};}
export function raceCowComplete(s){const a=replayRace('unchecked',s.histories.unchecked),b=replayRace('recheck',s.histories.recheck);return a.outcome==='changed'&&b.outcome==='blocked'&&s.answer==='recheck'&&s.checked;}
export function restoreRaceCow(s){if(!s||!Object.hasOwn(raceModes,s.selected)||!s.histories||![null,'recheck','once','copy'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');const n=createRaceCow();n.selected=s.selected;n.answer=s.answer;n.checked=s.checked;for(const id of Object.keys(raceModes)){replayRace(id,s.histories[id]);n.histories[id]=[...s.histories[id]];}return n;}
