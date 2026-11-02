export const hdlObserveLevel={id:'workshop-hdl-observe',number:'928',kind:'hdl-observe',name:'回路を記す巻物',tag:'ハードウェア記述言語',title:'術式と記憶の違いを確かめる',story:'二つの印を受け取る巻物を組み、出力をすぐに渡す方法と刻で記憶する方法を比べましょう。'};
export const hdlObserveOperators={and:{name:'両方１なら１',symbol:'&'},or:{name:'どちらか１なら１',symbol:'|'},xor:{name:'異なるとき１',symbol:'^'}};
export const hdlObserveModes={direct:'直接出力',clocked:'刻で記憶'};
const sequence=['a','b','clock','b','clock'];
export function hdlObserveLogic(operator,a,b){if(!Object.hasOwn(hdlObserveOperators,operator)||![0,1].includes(a)||![0,1].includes(b))throw new RangeError('条件が不正です。');return operator==='and'?a&b:operator==='or'?a|b:a^b;}
export function hdlObserveState(mode,operator,history){
 if(!Object.hasOwn(hdlObserveModes,mode)||!Object.hasOwn(hdlObserveOperators,operator)||!Array.isArray(history)||history.length>sequence.length)throw new RangeError('記録が不正です。');
 let a=0,b=0,q=0;const trace=[];
 for(const action of history){if(action!==sequence[trace.length])throw new RangeError('操作の順番が不正です。');if(action==='a')a^=1;else if(action==='b')b^=1;const y=hdlObserveLogic(operator,a,b);if(mode==='direct'||action==='clock')q=y;trace.push({action,a,b,y,q});}
 return {a,b,y:hdlObserveLogic(operator,a,b),q,trace,done:history.length===sequence.length};
}
export function hdlObserveCreate(){return {mode:'direct',operator:'or',histories:{direct:[],clocked:[]},reflection:null};}
export function hdlObserveStep(q,action){if(!['a','b','clock'].includes(action))throw new RangeError('操作が不正です。');const h=q.histories[q.mode];try{hdlObserveState(q.mode,q.operator,[...h,action]);h.push(action);return true;}catch{return false;}}
export function hdlObserveComplete(q){return q.operator==='and'&&Object.keys(hdlObserveModes).every(m=>hdlObserveState(m,q.operator,q.histories[m]).done)&&q.reflection==='edge';}
export function hdlObserveRestore(q){if(!q||!Object.hasOwn(hdlObserveModes,q.mode)||!Object.hasOwn(hdlObserveOperators,q.operator)||!q.histories||![null,'edge','always','software'].includes(q.reflection))throw new RangeError('記録が不正です。');const histories={};for(const m of Object.keys(hdlObserveModes)){hdlObserveState(m,q.operator,q.histories[m]);histories[m]=[...q.histories[m]];}return {mode:q.mode,operator:q.operator,histories,reflection:q.reflection};}
