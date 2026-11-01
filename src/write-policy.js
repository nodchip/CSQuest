export const writePolicyLevel={id:'forge-write-policy',number:'574',kind:'write-policy',name:'写しを戻す時',tag:'キャッシュの書込み方針',title:'書庫に戻す時を比べよう',story:'工房の記録係は手元の写しを何度も更新します。書庫にいつ戻すかを二つの方法で確かめましょう。'};
export const writePolicyModes={through:{name:'毎回書く（ライトスルー）'},back:{name:'後で戻す（ライトバック）'}};
export function createWritePolicyTrial(mode){if(!Object.hasOwn(writePolicyModes,mode))throw new RangeError('方式が不正です。');return {mode,history:[],cache:null,memory:{A:0,B:0},observed:0,writes:0,message:'棚は空で、書庫の A と B は０です。'};}
export function writePolicyStep(t,action){
 const stage=t.history.length;
 if(stage>=7)throw new RangeError('操作は完了しています。');
 const expected=['readA','write1','write2',`before:${t.memory.A}`,'readB',`after:${t.memory.A}`,`count:${t.writes}`][stage];
 if(action!==expected)return {...t,message:stage===3||stage===5?'書込み方式と棚から外した時の動きを見直しましょう。':stage===6?'書庫への書込みだけを数えましょう。':'順番に操作しましょう。'};
 const n={...t,history:[...t.history,action],memory:{...t.memory},cache:t.cache&&{...t.cache}};
 if(stage===0){n.cache={tag:'A',value:n.memory.A,dirty:false};n.message='A を書庫から棚に置きました。';}
 if(stage===1||stage===2){n.cache.value=stage;if(t.mode==='through'){n.memory.A=stage;n.writes++;n.message='棚と書庫の A に書きました。';}else{n.cache.dirty=true;n.message='棚の A を更新し、未反映の印を付けました。';}}
 if(stage===3||stage===5){n.observed=n.memory.A;n.message=`書庫の A は ${n.memory.A} でした。`;}
 if(stage===4){if(n.cache.dirty){n.memory.A=n.cache.value;n.writes++;}n.cache={tag:'B',value:n.memory.B,dirty:false};n.message='A を棚から外し、B を置きました。未反映の A があれば外す前に書庫へ戻します。';}
 if(stage===6)n.message=`書庫への書込みは ${n.writes} 回でした。`;
 return n;
}
export function createWritePolicy(){return {selected:'through',trials:Object.fromEntries(Object.keys(writePolicyModes).map(k=>[k,createWritePolicyTrial(k)])),answer:null,checked:false};}
export function writePolicyComplete(s){return Object.keys(writePolicyModes).every(k=>s.trials[k].history.length===7)&&s.answer==='coalesce'&&s.checked;}
export function restoreWritePolicy(s){if(!s||!Object.hasOwn(writePolicyModes,s.selected)||!s.histories||![null,'coalesce','always','never'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');const n=createWritePolicy();n.selected=s.selected;n.answer=s.answer;n.checked=s.checked;for(const k of Object.keys(writePolicyModes)){const h=s.histories[k];if(!Array.isArray(h)||h.length>7)throw new RangeError('履歴が不正です。');for(const action of h){const before=n.trials[k],after=writePolicyStep(before,action);if(after.history.length!==before.history.length+1)throw new RangeError('履歴が不正です。');n.trials[k]=after;}}return n;}
