export const videoPreservationLevel={id:'ruin-video-preservation',number:'950',kind:'video-preservation',name:'映像の記録を守る',tag:'アナログとデジタル動画',title:'古い映像を未来へ',story:'遺跡の祭りを記録した映像を、未来の書庫へ届けます。記録と複製の方法を比べましょう。'};

// Brightness at four chosen positions and times. These are illustrative values,
// not an implementation of an analog video or codec.
export const videoOriginal=[2.2,5.1,8.4,4.3];
export const videoCases={
  analog:{name:'アナログ信号を２回複製',before:videoOriginal,after:[2.6,4.7,8.8,3.9],answer:'changed',explanation:'この模型では、各複製で信号に誤差が加わり、値が変わりました。'},
  exact:{name:'デジタルの値をそのまま２回複製',before:[2,5,8,4],after:[2,5,8,4],answer:'same',explanation:'標本化・量子化した値を、誤りなくそのままコピーしたので、記録された値は同じです。'},
  transcode:{name:'デジタルを粗く再符号化',before:[2,5,8,4],after:[2,6,8,4],answer:'changed',explanation:'この再符号化は値を２刻みに丸めるため、５が６に変わりました。'},
  damage:{name:'デジタル記録の一部を失う',before:[2,5,8,4],after:[2,5,null,4],answer:'missing',explanation:'この模型では記録の一部が失われ、その値を読めません。'}
};
export function videoCreate(){return {scenario:'analog',answer:null,checked:null,seen:[],reflection:null};}
export function videoCheck(q){if(!Object.hasOwn(videoCases,q.scenario)||!['same','changed','missing'].includes(q.answer))throw new RangeError('予想が不正です。');const correct=q.answer===videoCases[q.scenario].answer;q.checked={scenario:q.scenario,answer:q.answer,correct};if(correct&&!q.seen.includes(q.scenario))q.seen.push(q.scenario);}
export function videoComplete(q){return Object.keys(videoCases).every(id=>q.seen.includes(id))&&q.reflection==='stages';}
export function videoRestore(q){if(!q||!Object.hasOwn(videoCases,q.scenario)||![null,'same','changed','missing'].includes(q.answer)||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(id=>!Object.hasOwn(videoCases,id))||![null,'stages','perfect','same'].includes(q.reflection))throw new RangeError('記録が不正です。');let checked=null;if(q.checked!==null){const c=q.checked;if(!c||!Object.hasOwn(videoCases,c.scenario)||!['same','changed','missing'].includes(c.answer)||c.correct!==(c.answer===videoCases[c.scenario].answer))throw new RangeError('記録が不正です。');checked={...c};}return {scenario:q.scenario,answer:q.answer,checked,seen:[...q.seen],reflection:q.reflection};}
