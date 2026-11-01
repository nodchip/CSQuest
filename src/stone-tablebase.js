export function createStoneTable(){return {entries:[{winning:false,winningMoves:[]}],history:[],answer:null,checked:false};}
export function nextStoneEntry(entries){
 const n=entries.length;if(n<1||n>8)throw new RangeError('表の範囲外です。');
 const winningMoves=[1,2].filter(take=>take<=n&&!entries[n-take].winning);return {winning:winningMoves.length>0,winningMoves};
}
export function recordStoneEntry(state,choice){
 if(state.history.length>=8||![0,1,2].includes(choice))return {ok:false,message:'この状態は記録できません。'};
 const entry=nextStoneEntry(state.entries),correct=entry.winning?entry.winningMoves.includes(choice):choice===0;
 if(!correct)return {ok:false,message:'残した石の数の行を見て、相手に負けの状態を渡せるか確かめましょう。'};
 return {ok:true,state:{...state,entries:[...state.entries,entry],history:[...state.history,choice],checked:false},message:entry.winning?'相手に負けの状態を渡せる手を記録しました。':'どの手でも相手に勝ちの状態を渡します。'};
}
export function stoneTableComplete(s){return s.history.length===8&&s.answer==='limits'&&s.checked;}
export function restoreStoneTable(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>8||![null,'limits','universal'].includes(saved.answer)||typeof saved.checked!=='boolean')throw new RangeError('途中記録が不正です。');let s=createStoneTable();for(const choice of saved.history){const r=recordStoneEntry(s,choice);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}s.answer=saved.answer;s.checked=saved.checked;return s;}
