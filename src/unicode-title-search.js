export const unicodeSearchLevel={id:'archive-unicode-title-search',number:'1345',kind:'unicode-title-search',name:'同じ名の巻物を探す',tag:'Unicode・検索・正規化',title:'文字の形と大文字を比べよう',story:'書庫に似た名前の巻物が並んでいます。比較する方法を選び、どの巻物が一致するか確かめましょう。'};
export const unicodeSearchDocs=[{id:'lower',name:'café'},{id:'upper',name:'CAFÉ'},{id:'plain',name:'cafe'}];
export const unicodeSearchQueries={decomposed:{name:'小文字・分解されたアクセント',text:'cafe\u0301'},upper:{name:'大文字・合成されたアクセント',text:'CAFÉ'}};
export const unicodeSearchModes={raw:'そのまま比較',nfc:'NFC に正規化して比較',lower:'フランス語の小文字化と NFC で比較'};
function transform(s,mode){if(mode==='raw')return s;if(mode==='nfc')return s.normalize('NFC');if(mode==='lower')return s.toLocaleLowerCase('fr').normalize('NFC');throw new RangeError('比較方法が不正です。');}
export function unicodeSearchTrace(query,mode){
 if(!Object.hasOwn(unicodeSearchQueries,query)||!Object.hasOwn(unicodeSearchModes,mode))throw new RangeError('条件が不正です。');
 const needle=transform(unicodeSearchQueries[query].text,mode);
 const points=s=>Array.from(s,c=>'U+'+c.codePointAt(0).toString(16).toUpperCase().padStart(4,'0'));
 return {needle:points(needle),docs:unicodeSearchDocs.map(d=>{const value=transform(d.name,mode);return {id:d.id,points:points(value),matches:value===needle};})};
}
export function unicodeSearchRun(query,mode){return unicodeSearchTrace(query,mode).docs.filter(d=>d.matches).map(d=>d.id);}
export function unicodeSearchCreate(){return {query:'decomposed',mode:'raw',guess:null,seen:[],reflection:null,checked:false};}
export function unicodeSearchCheck(q){if(![0,1,2].includes(q.guess))throw new RangeError('一致する巻物の数を選びましょう。');const matches=unicodeSearchRun(q.query,q.mode),ok=q.guess===matches.length,key=q.query+':'+q.mode;if(ok&&!q.seen.includes(key))q.seen.push(key);return {matches,ok};}
export function unicodeSearchDone(q){return Object.keys(unicodeSearchQueries).every(id=>Object.keys(unicodeSearchModes).every(m=>q.seen.includes(id+':'+m)))&&q.reflection==='requirements'&&q.checked;}
export function unicodeSearchRestore(q){const keys=Object.keys(unicodeSearchQueries).flatMap(id=>Object.keys(unicodeSearchModes).map(m=>id+':'+m));if(!q||!Object.hasOwn(unicodeSearchQueries,q.query)||!Object.hasOwn(unicodeSearchModes,q.mode)||![null,0,1,2].includes(q.guess)||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!keys.includes(k))||![null,'requirements','same','strip'].includes(q.reflection)||typeof q.checked!=='boolean'||q.checked&&q.reflection!=='requirements')throw new RangeError('途中記録が不正です。');return {...q,seen:[...q.seen]};}
