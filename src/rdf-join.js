export const rdfJoinLevel={id:'archive-rdf-join',number:'1055',kind:'rdf-join',name:'書庫を結ぶ識別子',tag:'RDF・識別子と結合',title:'二つの書庫から薬草を探す',story:'採集の記録と植物の記録を結びます。同じ名前の札だけでなく、識別子と関係を確認しましょう。'};
export const rdfIri={person:'https://csquest.example/person/mina',plant:'https://csquest.example/plant/moon',other:'https://other.example/plant/moon',forest:'https://csquest.example/place/north',gathered:'https://csquest.example/vocab/gathered',grows:'https://csquest.example/vocab/growsIn'};
export const rdfModes={shared:'同じ識別子を使う記録',distinct:'別の識別子を使う記録'};
export function rdfGraph(mode){
 if(!Object.hasOwn(rdfModes,mode))throw new RangeError('書庫の記録が不正です。');
 return [[rdfIri.person,rdfIri.gathered,rdfIri.plant],[mode==='shared'?rdfIri.plant:rdfIri.other,rdfIri.grows,rdfIri.forest]];
}
// Fixed SELECT DISTINCT-style join over these IRI-only triples, not a general SPARQL engine.
export function rdfJoin(graph){
 if(!Array.isArray(graph)||graph.some(t=>!Array.isArray(t)||t.length!==3||t.some(x=>typeof x!=='string')))throw new RangeError('グラフが不正です。');
 const results=[];
 for(const a of graph)for(const b of graph)if(a[0]===rdfIri.person&&a[1]===rdfIri.gathered&&a[2]===b[0]&&b[1]===rdfIri.grows&&!results.some(x=>x.plant===a[2]&&x.place===b[2]))results.push({plant:a[2],place:b[2]});
 return results;
}
export function rdfCreate(){return {mode:'shared',guess:null,seen:[],reflection:null};}
export function rdfRestore(q){
 if(!q||!Object.hasOwn(rdfModes,q.mode)||![null,'one','none'].includes(q.guess)||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(m=>!Object.hasOwn(rdfModes,m))||![null,'unknown','different','name'].includes(q.reflection))throw new RangeError('途中記録が不正です。');
 return {mode:q.mode,guess:q.guess,seen:[...q.seen],reflection:q.reflection};
}
export function rdfDone(q){return Object.keys(rdfModes).every(m=>q.seen.includes(m))&&q.reflection==='unknown';}
