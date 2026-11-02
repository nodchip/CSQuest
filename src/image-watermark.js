import {dctTransform,dctInverse} from './image-dct.js';
export const watermarkLevel={id:'ruin-watermark',number:'813',kind:'image-watermark',name:'絵巻の隠れた印',tag:'画像の透かしと耐性',title:'印が残るか確かめよう',story:'絵巻の四つの画素に印を入れ、届け先で読み取ります。変更や変換を受けた絵巻、別の絵巻を試しましょう。'};
export const watermarkBase=[8,12,8,12],watermarkBits=[1,0,1,0];
export const watermarkCases={plain:'そのまま届ける',change:'１画素の最下位ビットを反転',quantize:'DCT の模様を刻み８で量子化',forge:'別の絵巻に同じ印を入れる'};
export function watermarkSet(value,bit){if(!Number.isInteger(value)||value<0||value>255||![0,1].includes(bit))throw new RangeError('画素またはビットが不正です');return Math.floor(value/2)*2+bit;}
export function watermarkEmbed(pixels,bits){if(!Array.isArray(pixels)||pixels.length!==4||!Array.isArray(bits)||bits.length!==4)throw new RangeError('絵巻が不正です');return pixels.map((value,i)=>watermarkSet(value,bits[i]));}
export function watermarkRead(pixels){if(!Array.isArray(pixels)||pixels.length!==4||pixels.some(x=>!Number.isInteger(x)||x<0||x>255))throw new RangeError('絵巻が不正です');return pixels.map(x=>x%2);}
export function watermarkResult(id){if(!Object.hasOwn(watermarkCases,id))throw new RangeError('場面が不正です');const marked=watermarkEmbed(watermarkBase,watermarkBits);let pixels;
 if(id==='plain')pixels=marked;
 else if(id==='change')pixels=marked.map((x,i)=>i===0?watermarkSet(x,1-x%2):x);
 else if(id==='forge')pixels=watermarkEmbed([14,14,14,14],watermarkBits);
 else{const coefficients=dctTransform(marked),quantized=coefficients.map((x,i)=>i===0?x:(Math.sign(x)*Math.floor(Math.abs(x/8)+0.5)||0)*8);pixels=dctInverse(quantized).map(x=>Math.max(0,Math.min(255,Math.floor(x+0.5))));}
 const bits=watermarkRead(pixels);return {marked,pixels,bits,mismatches:bits.filter((x,i)=>x!==watermarkBits[i]).length};}
export function watermarkCreate(){return {selected:0,bits:[null,null,null,null],verified:false,tested:[],last:null,answer:null};}
export function watermarkWrite(q,bit){if(![0,1].includes(bit))throw new RangeError('ビットが不正です');q.bits[q.selected]=bit;q.verified=false;q.tested=[];q.last=null;}
export function watermarkVerify(q){if(q.bits.some((x,i)=>x!==watermarkBits[i]))throw new RangeError('四つの印を順番に見直しましょう。');q.verified=true;}
export function watermarkTest(q,id){if(!q.verified)throw new RangeError('先に印を入れて確認しましょう。');if(!Object.hasOwn(watermarkCases,id))throw new RangeError('場面が不正です');if(!q.tested.includes(id))q.tested.push(id);q.last=id;}
export function watermarkComplete(q){return q.verified&&Object.keys(watermarkCases).every(k=>q.tested.includes(k))&&q.answer==='not-proof';}
export function watermarkRestore(q){if(!q||!Number.isInteger(q.selected)||q.selected<0||q.selected>3||!Array.isArray(q.bits)||q.bits.length!==4||!q.bits.every(x=>[null,0,1].includes(x))||typeof q.verified!=='boolean'||q.verified&&q.bits.some((x,i)=>x!==watermarkBits[i])||!Array.isArray(q.tested)||q.tested.length>4||new Set(q.tested).size!==q.tested.length||!q.tested.every(x=>Object.hasOwn(watermarkCases,x))||q.tested.length&&!q.verified||!(q.last===null||q.tested.includes(q.last))||![null,'not-proof','proof','always'].includes(q.answer))throw new RangeError('記録が不正です');return {selected:q.selected,bits:[...q.bits],verified:q.verified,tested:[...q.tested],last:q.last,answer:q.answer};}
