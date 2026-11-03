export const coalescedLoadLevel={id:'forge-coalesced-load',number:'1085',kind:'coalesced-load',name:'精霊たちの宝石の受け取り',tag:'GPU のメモリアクセス',title:'まとめて宝石を運ぶ',story:'前の依頼で宝石を分担した精霊たちが、今度は保管棚から宝石を読みます。場所の選び方と運搬回数を比べましょう。'};
export const coalescedPatterns={packed:{label:'連続 ０・１・２・３',indices:[0,1,2,3]},reverse:{label:'逆順 ３・２・１・０',indices:[3,2,1,0]},cross:{label:'境界をまたぐ ７・８・９・10',indices:[7,8,9,10]},stride:{label:'飛び飛び ０・８・16・24',indices:[0,8,16,24]},shared:{label:'同じ場所 ２・２・２・２',indices:[2,2,2,2]}};
export function coalescedEvaluate(indices){
 if(!Array.isArray(indices)||indices.length!==4||indices.some(x=>!Number.isInteger(x)||x<0||x>31))throw new RangeError('棚の位置が不正です');
 const sectors=[...new Set(indices.map(x=>Math.floor(x/8)))].sort((a,b)=>a-b);return {sectors,transactions:sectors.length,transferred:sectors.length*32,uniqueBytes:new Set(indices).size*4};
}
export function coalescedMarker(indices){return Object.keys(coalescedPatterns).find(k=>coalescedPatterns[k].indices.every((x,i)=>x===indices[i]))??null;}
export function coalescedCreate(){return {lane:0,indices:[0,0,0,0],guess:null,seen:[],reflection:null,limits:null};}
export function coalescedRestore(q){
 if(!q||!Number.isInteger(q.lane)||q.lane<0||q.lane>3||![null,1,2,3,4].includes(q.guess)||!Array.isArray(q.seen)||q.seen.length>5||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!Object.hasOwn(coalescedPatterns,k))||![null,'same','sequential'].includes(q.reflection)||![null,'measure','guarantee'].includes(q.limits))throw new RangeError('記録が不正です');coalescedEvaluate(q.indices);return {...q,indices:[...q.indices],seen:[...q.seen]};
}
export function coalescedDone(q){return Object.keys(coalescedPatterns).every(k=>q.seen.includes(k))&&q.reflection==='same'&&q.limits==='measure';}
