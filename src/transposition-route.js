export const transpositionLevel={id:'archive-transposition-route',number:'991',kind:'transposition-route',name:'列を並べる暗号の巻物',tag:'古典暗号・転置',title:'巻物の列を並べ替えよう',story:'古文書の番人が、文字を変えずに列の順番を入れ替える封印を調べています。'};
export const transposeCases={
 unique:{name:'違う列',rows:[['火','水','木','土'],['月','星','風','海']],key:[2,0,3,1]},
 duplicate:{name:'同じ列',rows:[['火','水','火','土'],['月','星','月','海']],key:[2,0,3,1]}
};
export function transpose(rows,key){return key.flatMap(column=>rows.map(row=>row[column]));}
export function transposeKeys(){const out=[];function visit(key){if(key.length===4){out.push(key);return;}for(let i=0;i<4;i++)if(!key.includes(i))visit([...key,i]);}visit([]);return out;}
export function transposeMatches(id){const c=transposeCases[id],target=transpose(c.rows,c.key).join('');return transposeKeys().filter(key=>transpose(c.rows,key).join('')===target);}
export function transposeCorrect(id,key){const c=transposeCases[id];return !!c&&Array.isArray(key)&&key.length===4&&new Set(key).size===4&&key.every(i=>[0,1,2,3].includes(i))&&transpose(c.rows,key).join('')===transpose(c.rows,c.key).join('');}
export function transposeCreate(){return {selected:'unique',trials:Object.fromEntries(Object.keys(transposeCases).map(id=>[id,{key:[],inspected:false,answer:null,checked:false}])),reflection:null};}
export function transposeDone(id,t){return !!transposeCases[id]&&!!t&&t.checked&&t.inspected&&transposeCorrect(id,t.key)&&t.answer===(transposeMatches(id).length===1?'one':'many');}
export function transposeComplete(s){return s.reflection==='same'&&Object.keys(transposeCases).every(id=>transposeDone(id,s.trials[id]));}
export function transposeRestore(saved){if(!saved||!Object.hasOwn(transposeCases,saved.selected)||![null,'same','hidden','secure'].includes(saved.reflection))throw new RangeError('途中記録が不正です');const s=transposeCreate();s.selected=saved.selected;s.reflection=saved.reflection;for(const id of Object.keys(transposeCases)){const t=saved.trials?.[id];if(!t||!Array.isArray(t.key)||t.key.length>4||t.key.some(i=>![0,1,2,3].includes(i))||new Set(t.key).size!==t.key.length||typeof t.inspected!=='boolean'||(t.inspected&&!transposeCorrect(id,t.key))||![null,'one','many'].includes(t.answer)||typeof t.checked!=='boolean')throw new RangeError('途中記録が不正です');s.trials[id]={key:[...t.key],inspected:t.inspected,answer:t.answer,checked:t.checked};}return s;}
