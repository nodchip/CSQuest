export const environmentLevel={id:'guild-environment-matrix',number:'801',kind:'environment-matrix',name:'四つの窓と依頼札',tag:'実行環境のテスト範囲',title:'限られた試験で掲示板を確かめよう',story:'ギルドの掲示板を机と携帯で使います。二つの閲覧器と二つの操作を、４回分の試験で調べましょう。'};
export const environmentRows=[{id:'deskMoon',name:'机・月の閲覧器'},{id:'deskStar',name:'机・星の閲覧器'},{id:'mobileMoon',name:'携帯・月の閲覧器'},{id:'mobileStar',name:'携帯・星の閲覧器'}];
export const environmentActions=[{id:'send',name:'依頼を送る'},{id:'resume',name:'途中から再開'}];
export const environmentFailures=['deskMoon:resume','mobileStar:send'];
const validIds=environmentRows.flatMap(r=>environmentActions.map(a=>`${r.id}:${a.id}`));
export function environmentCreate(){return {selected:[],ran:false,answer:null};}
export function environmentToggle(q,id){if(!validIds.includes(id))throw new RangeError('試験が不正です');if(q.selected.includes(id))q.selected=q.selected.filter(x=>x!==id);else{if(q.selected.length===4)throw new RangeError('試験は４回までです。選択を外して入れ替えましょう');q.selected.push(id);}q.ran=false;}
export function environmentRun(q){if(q.selected.length!==4)return false;q.ran=true;return true;}
export function environmentResult(q){if(!q.ran)return null;const covered=environmentRows.filter(r=>q.selected.some(x=>x.startsWith(`${r.id}:`))).map(r=>r.id);return {covered,failed:q.selected.filter(x=>environmentFailures.includes(x)),passed:q.selected.filter(x=>!environmentFailures.includes(x)),untested:validIds.filter(x=>!q.selected.includes(x))};}
export function environmentComplete(q){const result=environmentResult(q);return !!result&&result.covered.length===4&&result.failed.length===2&&q.answer==='limits';}
export function environmentRestore(q){if(!q||!Array.isArray(q.selected)||q.selected.length>4||new Set(q.selected).size!==q.selected.length||q.selected.some(x=>!validIds.includes(x))||typeof q.ran!=='boolean'||q.ran&&q.selected.length!==4||![null,'limits','covered','passed'].includes(q.answer))throw new RangeError('記録が不正です');return {selected:[...q.selected],ran:q.ran,answer:q.answer};}
