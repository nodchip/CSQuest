export const playtestPeople={cue:'音を使えない旅人',control:'一度に１つだけ押せる旅人'};
export const playtestVersions={initial:'最初の試作',revised:'改善した試作'};
export function playtestCreate(){return {person:'cue',version:'initial',seen:[],answer:null};}
export function playtestResult(person,version){if(!Object.hasOwn(playtestPeople,person)||!Object.hasOwn(playtestVersions,version))throw new RangeError('試験条件が不正です。');return version==='revised';}
export function playtestRun(q){const passed=playtestResult(q.person,q.version),key=`${q.person}:${q.version}`;if(!q.seen.includes(key))q.seen.push(key);return passed;}
export function playtestDone(q){return Object.keys(playtestPeople).every(p=>Object.keys(playtestVersions).every(v=>q.seen.includes(`${p}:${v}`)))&&q.answer==='repeat';}
export function playtestRestore(q){if(!q||!Object.hasOwn(playtestPeople,q.person)||!Object.hasOwn(playtestVersions,q.version)||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!['cue:initial','cue:revised','control:initial','control:revised'].includes(k))||![null,'repeat','one','finish'].includes(q.answer))throw new RangeError('試遊の記録が不正です。');return {...q,seen:[...q.seen]};}
