export const mmapPageLevel={id:'archive-mmap-page-lab',number:'977',kind:'mmap-page-lab',name:'頁にそろえる記憶の地図',tag:'メモリマップ・頁境界・コピーオンライト',title:'同じ頁と写しを比べる',story:'二人の鑑定士が記録の一頁を映します。書き換えがどこに見えるか調べましょう。'};
export const mmapPageCases=['shared:0','shared:4','private:0','private:4'];
export function mmapPageTrial(id){if(!mmapPageCases.includes(id))throw new RangeError('条件が不正です');return {id,mapped:false,wrote:false,predicted:false,seen:false,synced:false,history:[]};}
export function mmapPageStep(s,action){
 const [mode,offsetText]=s.id.split(':'),offset=Number(offsetText),n={...s,history:[...s.history]};let message;
 if(action.startsWith('map:')&&!s.mapped){const pos=Number(action.slice(4));if(![0,2,4].includes(pos))return {ok:false,message:'位置が不正です。'};if(pos%4!==0)return {ok:false,message:'開始位置を４バイトのページ境界にそろえましょう。'};if(pos!==offset)return {ok:false,message:'指定された頁の開始位置を選びましょう。'};n.mapped=true;message='二人が同じ頁を映しました。';}
 else if(action==='write'&&s.mapped&&!s.wrote){n.wrote=true;message='Ａが頁の２文字目を X に変更しました。Ｂの読みを予測しましょう。';}
 else if(action.startsWith('guess:')&&s.wrote&&!s.predicted){const expected=mode==='shared'?'X':offset===0?'B':'F';if(action.slice(6)!==expected)return {ok:false,message:'共有と私的な写しの違いを考えましょう。'};n.predicted=true;message='予測が合いました。Ｂから読みましょう。';}
 else if(action==='read'&&s.predicted&&!s.seen){n.seen=true;message='Ｂが読みました。';}
 else if(action==='sync'&&mode==='shared'&&s.seen&&!s.synced){n.synced=true;message='この模型では同期要求が成功し、書戻しが完了しました。';}
 else return {ok:false,message:'順番に操作しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function mmapPageViews(s){const [mode,off]=s.id.split(':'),original=Number(off)===0?'ABCD':'EFGH',changed=original[0]+'X'+original.slice(2);return {a:s.wrote?changed:original,b:s.wrote&&mode==='shared'?changed:original,backing:s.synced?changed:original,copies:s.wrote&&mode==='private'?1:0};}
export function mmapPageDone(s){return s.mapped&&s.wrote&&s.predicted&&s.seen&&(s.id.startsWith('private:')||s.synced);}
export function mmapPageCreate(){return {selected:mmapPageCases[0],trials:Object.fromEntries(mmapPageCases.map(id=>[id,[]])),reflection:null};}
export function mmapPageReplay(id,history){if(!Array.isArray(history)||history.length>5)throw new RangeError('履歴が不正です');let s=mmapPageTrial(id);for(const action of history){if(typeof action!=='string')throw new RangeError('履歴が不正です');const r=mmapPageStep(s,action);if(!r.ok)throw new RangeError('履歴が不正です');s=r.state;}return s;}
export function mmapPageComplete(q){return q.reflection==='limits'&&mmapPageCases.every(id=>mmapPageDone(mmapPageReplay(id,q.trials[id])));}
export function mmapPageRestore(saved){if(!saved||!mmapPageCases.includes(saved.selected)||![null,'limits','always','private'].includes(saved.reflection))throw new RangeError('途中記録が不正です');const q=mmapPageCreate();q.selected=saved.selected;q.reflection=saved.reflection;for(const id of mmapPageCases)q.trials[id]=mmapPageReplay(id,saved.trials?.[id]).history;return q;}
