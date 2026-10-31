export const mappedLevel={id:'archive-mapped-file',number:'292',kind:'mapped-file',name:'二人で見る記憶の地図',tag:'メモリマップと共有',title:'同じ記録がどう見えるか調べよう',story:'二人の鑑定士が一つの記録を記憶に映しました。片方が書き換えたとき、もう片方に何が見えるか確かめましょう。'};
export const mappedModes={shared:{name:'共有する映し方',expected:7},private:{name:'それぞれの写し',expected:3}};
export function createMappedTrial(id){if(!Object.hasOwn(mappedModes,id))throw new RangeError('試行が不正です');return {id,a:3,b:3,wrote:false,predicted:false,seen:false,synced:false,history:[],message:'二人の値は３です。'};}
export function mappedStep(s,action){if(!['write','three','seven','read','sync'].includes(action))throw new RangeError('操作が不正です');if(s.history.length>=24)return {...s,message:'操作の上限です。最初からやり直しましょう。'};const n={...s,history:[...s.history]};let message='';
 if(action==='write'&&!s.wrote){n.a=7;n.b=s.id==='shared'?7:3;n.wrote=true;message='Ａが自分の対応領域に７を書きました。Ｂに見える値を予測しましょう。';}
 else if(['three','seven'].includes(action)&&s.wrote&&!s.predicted){const guess=action==='three'?3:7;if(guess!==mappedModes[s.id].expected)return {...s,message:'その予測ではありません。共有するか、各自の写しかを考えましょう。'};n.predicted=true;message='予測しました。Ｂから読みましょう。';}
 else if(action==='read'&&s.predicted&&!s.seen){n.seen=true;message=`Ｂから ${s.b} が見えました。`;}
 else if(action==='sync'&&s.id==='shared'&&s.seen&&!s.synced){n.synced=true;message='共有領域の更新を保管先に反映する要求を行い、完了を待ちました。';}
 else return {...s,message:'今できる操作を選びましょう。'};n.history.push(action);n.message=message;return n;}
export function mappedTrialComplete(s){return s.wrote&&s.predicted&&s.seen&&(s.id==='private'||s.synced);}
export function createMapped(){return {selected:'shared',trials:{shared:createMappedTrial('shared'),private:createMappedTrial('private')}};}
export function mappedComplete(s){return Object.keys(mappedModes).every(id=>mappedTrialComplete(s.trials[id]));}
export function restoreMapped(saved){if(!saved||!Object.hasOwn(mappedModes,saved.selected)||!saved.histories)throw new RangeError('途中記録が不正です');const s=createMapped();s.selected=saved.selected;for(const id of Object.keys(mappedModes)){const h=saved.histories[id];if(!Array.isArray(h)||h.length>24)throw new RangeError('履歴が不正です');for(const action of h){const prev=s.trials[id],next=mappedStep(prev,action);if(next.history.length!==prev.history.length+1)throw new RangeError('履歴が不正です');s.trials[id]=next;}}return s;}
