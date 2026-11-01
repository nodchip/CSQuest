export const distributedFileLevel={id:'archive-distributed-file',number:'739',kind:'distributed-file',name:'二つの村と共有の巻物',tag:'分散ファイルとキャッシュ',title:'同じ巻物の新しい知らせ',story:'二つの村が遠くの書庫の巻物を使っています。知らせの更新を、双方がいつ読めるか確かめましょう。'};
export const distributedCases=['initial','dirty','stale','fresh'];
export function distributedCreate(){return {dirty:false,closed:false,reader:1,seen:[],guess:'',answer:'',checked:false};}
export function distributedCase(s){if(s.closed)return s.reader===1?'stale':'fresh';return s.dirty?'dirty':'initial';}
export function distributedAction(s,action){distributedRestore(s);if(action==='write'&&!s.dirty&&!s.closed){s.dirty=true;return true;}if(action==='close'&&s.dirty&&!s.closed){s.closed=true;return true;}if(action==='reopen'){s.reader=s.closed?2:1;return true;}return false;}
export function distributedObserve(s){distributedRestore(s);if(s.guess!==String(s.reader))return false;const c=distributedCase(s);if(!s.seen.includes(c))s.seen.push(c);return true;}
export function distributedReset(s){distributedRestore(s);s.dirty=false;s.closed=false;s.reader=1;s.guess='';}
export function distributedComplete(s){return s.seen.length===4&&s.checked&&s.answer==='boundary';}
export function distributedRestore(s){if(!s||typeof s.dirty!=='boolean'||typeof s.closed!=='boolean'||(s.closed&&!s.dirty)||![1,2].includes(s.reader)||(!s.closed&&s.reader!==1)||!Array.isArray(s.seen)||new Set(s.seen).size!==s.seen.length||s.seen.some(c=>!distributedCases.includes(c))||!['','1','2'].includes(s.guess)||!['','boundary','immediate','offline'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');return {...s,seen:[...s.seen]};}
