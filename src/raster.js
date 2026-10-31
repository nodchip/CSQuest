export const rasterLevel={id:'mosaic-triangle',number:'83',kind:'raster',name:'紋章を映す小さな石',tag:'ラスタ化と標本化',title:'紋章を画素に映そう',story:'遺跡の紋章を、５×５の光る石に映します。石の中心や複数の小さな点を調べ、境界の映り方を比べましょう。'};
export const gridSize=5;
// Triangle vertices (0,0), (4.7,0), (0,4.7); origin is top left.
export function inTriangle(x,y){return x>=0&&y>=0&&x+y<4.7;}
export function centerPixels(){return Array.from({length:25},(_,i)=>i).filter(i=>inTriangle(i%5+0.5,Math.floor(i/5)+0.5));}
export function edgeSamples(){return [[0.25,0.25],[0.75,0.25],[0.25,0.75],[0.75,0.75]].flatMap(([x,y],i)=>inTriangle(4+x,y)?[i]:[]);}
export function rasterCorrect(kind,selection){const expected=kind==='pixels'?centerPixels():kind==='samples'?edgeSamples():null;if(!expected)throw new RangeError('未知の試練です。');return selection.length===expected.length&&expected.every(i=>selection.includes(i));}
export function createRaster(){return {selected:'pixels',choices:{pixels:{items:[],checked:false},samples:{items:[],checked:false}}};}
export function restoreRaster(saved){
  if(!saved||!['pixels','samples'].includes(saved.selected)||!saved.choices)throw new RangeError('途中記録が不正です。');
  const result=createRaster();result.selected=saved.selected;
  for(const kind of ['pixels','samples']){const c=saved.choices[kind],limit=kind==='pixels'?25:4;if(!c||!Array.isArray(c.items)||c.items.some(i=>!Number.isInteger(i)||i<0||i>=limit)||new Set(c.items).size!==c.items.length||typeof c.checked!=='boolean')throw new RangeError('途中記録が不正です。');result.choices[kind]={items:c.items.slice(),checked:c.checked};}return result;
}
export function rasterComplete(state){return ['pixels','samples'].every(kind=>state.choices[kind].checked&&rasterCorrect(kind,state.choices[kind].items));}
