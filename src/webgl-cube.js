export const cubeLevel={id:'ruin-webgl-cube',number:'871',kind:'webgl-cube',name:'立体を映す三つの道具',tag:'WebGL と３次元描画',title:'水晶の立方体を映そう',story:'遺跡の水晶を立体に映すには、形の点・点のつなぎ方・色を決める術式が必要です。道具を用意して描き、深さの判定を比べましょう。'};
export const cubeParts={vertices:'頂点の座標と色',indices:'三角形の索引',shader:'頂点と色のシェーダー'};
export const cubeRequired=['face:0:on','solid:0:on','solid:45:on','solid:0:off'];
export function cubeCreate(){return {shape:'face',angle:0,depth:true,parts:{vertices:false,indices:false,shader:false},observed:[],answer:null};}
export function cubeReady(q){return Object.keys(cubeParts).every(key=>q.parts[key]===true);}
export function cubeKey(q){return `${q.shape}:${q.angle}:${q.depth?'on':'off'}`;}
export function cubeRecord(q){if(!cubeReady(q))throw new RangeError('必要な道具が不足しています。');const key=cubeKey(q);if(!q.observed.includes(key))q.observed.push(key);}
export function cubeComplete(q){return cubeRequired.every(key=>q.observed.includes(key))&&q.answer==='depth';}
export function cubeRestore(q){
 if(!q||!['face','solid'].includes(q.shape)||![0,45].includes(q.angle)||typeof q.depth!=='boolean'||!q.parts||!Object.keys(cubeParts).every(k=>typeof q.parts[k]==='boolean')||!Array.isArray(q.observed)||new Set(q.observed).size!==q.observed.length||q.observed.length>8||![null,'depth','order','shader'].includes(q.answer))throw new RangeError('記録が不正です。');
 const valid=new Set(['face','solid'].flatMap(shape=>[0,45].flatMap(angle=>['on','off'].map(depth=>`${shape}:${angle}:${depth}`))));if(q.observed.some(key=>!valid.has(key)))throw new RangeError('試行が不正です。');
 return {shape:q.shape,angle:q.angle,depth:q.depth,parts:{vertices:q.parts.vertices,indices:q.parts.indices,shader:q.parts.shader},observed:[...q.observed],answer:q.answer};
}
