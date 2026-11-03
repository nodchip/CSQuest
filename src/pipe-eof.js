export const pipeEofLevel={id:'forge-pipe-eof',number:'1110',kind:'pipe-eof',name:'二人の伝令と空の筒',tag:'パイプと EOF',title:'伝令の終わりを確かめる',story:'二人の伝令が一つの筒に印を送り、書記が順に読み取ります。空の筒と、伝令が全員終えた筒を区別しましょう。'};
export const pipeEofActions={writeA:'甲が印Ａを送る',writeB:'乙が印Ｂを送る',closeA:'甲の書き口を閉じる',closeB:'乙の書き口を閉じる',block:'１印読む：待つ方式',nonblock:'１印読む：待たない方式'};
export function pipeEofReplay(history){
 if(!Array.isArray(history)||history.length>16)throw new RangeError('操作記録が不正です。');const s={open:{A:true,B:true},written:{A:false,B:false},buffer:[],reads:[],last:'',sawWait:false,sawAgain:false,sawBufferedClosed:false,sawEof:false};
 for(const a of history){if(!Object.hasOwn(pipeEofActions,a))throw new RangeError('操作が不正です。');if(a==='writeA'||a==='writeB'){const w=a.at(-1);if(!s.open[w]||s.written[w]||s.buffer.length>=2)throw new RangeError('その伝令は今は送れません。');s.written[w]=true;s.buffer.push(w);s.last=`印${w}を筒に入れました。`;}
 else if(a==='closeA'||a==='closeB'){const w=a.at(-1);if(!s.open[w])throw new RangeError('その書き口は閉じています。');s.open[w]=false;s.last=`${w}の書き口を閉じました。`;}
 else if(s.buffer.length){const v=s.buffer.shift();if(!s.open.A&&!s.open.B)s.sawBufferedClosed=true;s.reads.push(v);s.last=`印${v}を１つ読みました。`;}
 else if(s.open.A||s.open.B){s.last=a==='block'?'空で書き手が残るため、待つ方式の読取りは待ちます。':'空で書き手が残るため、待たない方式の読取りは EAGAIN になります。';if(!s.open.A&&s.open.B){if(a==='block')s.sawWait=true;else s.sawAgain=true;}}
 else{s.last='空で書き口がすべて閉じたため、読取りは EOF（戻り値０）です。';s.sawEof=true;}}
 return s;
}
export function pipeEofCreate(){return {history:[],answer:null,checked:false};}
export function pipeEofAct(q,action){const history=[...q.history,action],s=pipeEofReplay(history);q.history=history;return s;}
export function pipeEofDone(q){const s=pipeEofReplay(q.history);return s.sawWait&&s.sawAgain&&s.sawBufferedClosed&&s.sawEof&&s.reads.join('')==='AB'&&q.answer==='closed'&&q.checked;}
export function pipeEofRestore(q){if(!q||![null,'closed','empty','first'].includes(q.answer)||typeof q.checked!=='boolean')throw new RangeError('途中記録が不正です。');pipeEofReplay(q.history);return {...q,history:[...q.history]};}
