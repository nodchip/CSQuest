export const textureFilterLevel={id:'ruin-texture-filter',number:'638',kind:'texture-filter',name:'遺跡の絵布と光',tag:'テクスチャと標本化',title:'絵布の模様を灯そう',story:'遺跡の壁を飾る絵布がぼやけています。絵布のどこを読み取るか、どの方法で色を決めるかを調べましょう。'};
export const textureCoords=[25,50,75];
export const textureMethods=['nearest','linear'];
export const textureRequired=textureMethods.flatMap(m=>[[25,25],[50,25],[50,50]].map(([u,v])=>`${m},${u},${v}`));
export function textureSample(method,u,v){
 if(!textureMethods.includes(method)||!Number.isFinite(u)||!Number.isFinite(v)||u<25||u>75||v<25||v>75)throw new RangeError('標本の設定が不正です。');
 const x=(u-25)/50,y=(v-25)/50;
 if(method==='nearest')return (x>0.5?80:0)+(y>0.5?160:0);
 return 80*x+160*y;
}
export function createTextureFilter(){return {method:'nearest',u:25,v:25,observed:[],answer:null,reflection:null,checked:false};}
export function textureFilterComplete(s){return textureRequired.every(k=>s.observed.includes(k))&&s.answer==='mix'&&s.reflection==='coordinates'&&s.checked;}
export function restoreTextureFilter(s){
 const valid=new Set(textureMethods.flatMap(m=>textureCoords.flatMap(u=>textureCoords.map(v=>`${m},${u},${v}`))));
 if(!s||!textureMethods.includes(s.method)||!textureCoords.includes(s.u)||!textureCoords.includes(s.v)||!Array.isArray(s.observed)||new Set(s.observed).size!==s.observed.length||s.observed.some(k=>!valid.has(k))||![null,'mix','same','invent'].includes(s.answer)||![null,'coordinates','position','magic'].includes(s.reflection)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');
 return {...s,observed:[...s.observed]};
}
