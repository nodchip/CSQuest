export const speculativeLevel={id:'workshop-speculative-path',number:'160',kind:'speculative-path',name:'先読みする魔導機械',tag:'投機実行と確定',title:'仮の道を確かめよう',story:'魔導機械は道が決まる前に、予測した先の作業を仮に進めます。道が違ったとき、宝石の記録を正しく確定しましょう。'};
export const speculativeCases={hit:{name:'予測が当たる場合',matches:true},miss:{name:'予測が外れる場合',matches:false}};
export const speculativeActions={left:'左の道を予測',right:'右の道を予測',speculate:'予測した道を仮に実行',resolve:'実際の道を確かめる',replay:'正しい道を実行し直す',commit:'結果を確定'};
const actual='left',values={left:2,right:5};
export function createSpeculativeTrial(id){if(!Object.hasOwn(speculativeCases,id))throw new RangeError('条件が不正です。');return {id,phase:'predict',predicted:null,tentative:null,visible:0,actual:null,squashed:false,history:[],message:'まず道を予測しましょう。'};}
export function stepSpeculative(s,action){if(!Object.hasOwn(speculativeActions,action))throw new RangeError('操作が不正です。');const n={...s,history:s.history.slice()};
  if(s.phase==='predict'&&['left','right'].includes(action)){n.predicted=action;n.phase='speculate';n.message=`${action==='left'?'左':'右'}を予測しました。`;}
  else if(s.phase==='speculate'&&action==='speculate'){n.tentative=values[s.predicted];n.phase='resolve';n.message='予測した道の結果を仮に用意しました。まだ記録には反映されません。';}
  else if(s.phase==='resolve'&&action==='resolve'){n.actual=actual;if(s.predicted===actual){n.phase='commit';n.message='予測は当たりでした。仮の結果を確定できます。';}else{n.tentative=null;n.squashed=true;n.phase='replay';n.message='予測が外れました。仮の結果を取り消し、正しい道を実行し直します。';}}
  else if(s.phase==='replay'&&action==='replay'){n.tentative=values[actual];n.phase='commit';n.message='正しい道の結果を用意しました。';}
  else if(s.phase==='commit'&&action==='commit'){n.visible=s.tentative;n.phase='done';n.message='確定した結果を宝石の記録に反映しました。';}
  else return {...s,message:'今の段階を確認し、次の操作を選びましょう。'};
  n.history.push(action);return n;
}
export function speculativeCorrect(s){return s.phase==='done'&&(s.predicted===actual)===speculativeCases[s.id].matches;}
export function createSpeculative(){return {selected:'hit',trials:Object.fromEntries(Object.keys(speculativeCases).map(id=>[id,createSpeculativeTrial(id)]))};}
export function speculativeComplete(s){return Object.keys(speculativeCases).every(id=>speculativeCorrect(s.trials[id]));}
export function restoreSpeculative(saved){if(!saved||!Object.hasOwn(speculativeCases,saved.selected)||!saved.histories)throw new RangeError('途中記録が不正です。');const r=createSpeculative();r.selected=saved.selected;for(const id of Object.keys(speculativeCases)){const h=saved.histories[id];if(!Array.isArray(h)||h.length>5)throw new RangeError('途中記録が不正です。');for(const action of h){const before=r.trials[id],after=stepSpeculative(before,action);if(after.history.length!==before.history.length+1)throw new RangeError('途中記録が不正です。');r.trials[id]=after;}}return r;}
