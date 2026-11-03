export const darkSiliconLevel={id:'forge-dark-silicon',number:'1082',kind:'dark-silicon',name:'炉の八つの計算核',tag:'電力制約とダークシリコン',title:'電力の枠で計算核を動かす',story:'工房の計算炉には８つの核があります。電力の上限を守りながら、動かす核と速さを選びましょう。'};
export const darkModes={fast:'通常の速さ',slow:'低い速さ'};
export const darkRequired=['fast:5','fast:6','fast:8','slow:5','slow:8'];
export function darkEvaluate(mode,count){if(!Object.hasOwn(darkModes,mode)||!Number.isInteger(count)||count<0||count>8)throw new RangeError('炉の条件が不正です');const power10=40+(mode==='fast'?25:15)*count,work10=(mode==='fast'?10:6)*count;return {power10,work10,within:power10<=165,inactive:8-count};}
export function darkCreate(){return {mode:'fast',count:0,guess:null,seen:[],best:null,reason:null};}
export function darkRestore(q){
 if(!q||!Object.hasOwn(darkModes,q.mode)||!Number.isInteger(q.count)||q.count<0||q.count>8||![null,'fit','over'].includes(q.guess)||!Array.isArray(q.seen)||q.seen.length>18||new Set(q.seen).size!==q.seen.length||q.seen.some(x=>typeof x!=='string'||!Object.keys(darkModes).some(m=>Array.from({length:9},(_,n)=>`${m}:${n}`).includes(x)))||![null,'fast5','slow8'].includes(q.best)||![null,'limit','always'].includes(q.reason))throw new RangeError('炉の記録が不正です');
 return {...q,seen:[...q.seen]};
}
export function darkDone(q){return darkRequired.every(k=>q.seen.includes(k))&&q.best==='fast5'&&q.reason==='limit';}
