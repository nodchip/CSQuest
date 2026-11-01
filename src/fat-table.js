export const fatLevel={id:'archive-fat-table',number:'577',kind:'fat-table',name:'書庫のつながり表',tag:'FAT と空き領域',title:'表を直して棚を再利用しよう',story:'巻物の頁が離れた棚に置かれています。つながり表を更新し、使い終えた棚を別の巻物に渡しましょう。'};
// null is free, -1 is end of chain; other values are the next slot.
export function createFat(){return {table:[2,3,4,-1,-1,null],heads:{A:0,B:1,C:null},pending:null,lastC:null,cursor:null,stage:0,history:[],answer:null,checked:false,message:'A は棚０から、B は棚１から始まります。'};}
export function fatStep(s,slot){
 if(!Number.isInteger(slot)||slot<0||slot>=s.table.length||s.stage>=9)throw new RangeError('棚が不正です。');
 const stage=s.stage,expected=stage===0?s.table[slot]===null:stage===1?slot===s.heads.B:stage===2?slot===s.pending:stage===3||stage===4?s.table[slot]===null:slot===s.cursor;
 if(!expected)return {...s,message:stage===0||stage===3||stage===4?'空きと表示された棚を選びましょう。':stage===1||stage===2?'B の先頭、または直前に覚えた次の棚を確認しましょう。':'表の次の番号をたどりましょう。'};
 const n={...s,table:s.table.slice(),heads:{...s.heads},history:[...s.history,slot],stage:stage+1,checked:false};
 if(stage===0){n.table[4]=slot;n.table[slot]=-1;n.message=`A の最後を棚 ${slot} につなぎました。`;}
 if(stage===1||stage===2){const next=n.table[slot];n.table[slot]=null;n.pending=next===-1?null:next;if(stage===1)n.heads.B=null;n.message=`棚 ${slot} を空きにしました。${n.pending===null?'B の解放は終わりです。':`次の棚 ${n.pending} を先に覚えています。`}`;}
 if(stage===3){n.heads.C=slot;n.lastC=slot;n.table[slot]=-1;n.message=`C の先頭に棚 ${slot} を使います。`;}
 if(stage===4){n.table[n.lastC]=slot;n.table[slot]=-1;n.lastC=slot;n.cursor=n.heads.A;n.message=`C に棚 ${slot} をつなぎました。次は A を先頭からたどります。`;}
 if(stage>=5){n.cursor=stage===8?null:n.table[slot];n.message=stage===8?`A の４頁目は棚 ${slot} です。`:`棚 ${slot} を確認しました。次は棚 ${n.cursor} です。`;}
 return n;
}
export function fatComplete(s){return s.stage===9&&s.answer==='table'&&s.checked;}
export function restoreFat(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>9||![null,'table','data','adjacent'].includes(saved.answer)||typeof saved.checked!=='boolean')throw new RangeError('途中記録が不正です。');let s=createFat();for(const slot of saved.history){const next=fatStep(s,slot);if(next.history.length!==s.history.length+1)throw new RangeError('履歴が不正です。');s=next;}s.answer=saved.answer;s.checked=saved.checked;return s;}
