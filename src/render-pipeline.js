export const renderPipelineLevel={id:'ruin-render-pipeline',number:'639',kind:'render-pipeline',name:'灯りを映す５つの門',tag:'描画パイプライン',title:'遺跡の窓に景色を映そう',story:'遺跡の窓に映る旗が、遠い壁に隠されてしまいました。光の通り道を一段ずつ通し、正しい景色を取り戻しましょう。'};
export const pipelineStages=['transform','project','raster','shade','depth'];
export const pipelineLabels={transform:'物体とカメラの位置',project:'投影と画面端での切取り',raster:'画素候補を作る',shade:'候補に色を付ける',depth:'深度を比べて画面に残す'};
export const pipelineRequired=['0,0,on','-1,1,off','-1,1,on'];
const centers=[-2/3,0,2/3];
export function renderPipelineScene(shift,camera,depth){
 if(![-1,0,1].includes(shift)||![0,1].includes(camera)||!['on','off'].includes(depth))throw new RangeError('窓の設定が不正です。');
 const banners=[{id:'A',color:'朱',z:2,local:[-1,1],shift},{id:'B',color:'青',z:4,local:[-2,2],shift:0}].map(b=>{
  const world=b.local.map(x=>x+b.shift),view=world.map(x=>x-camera),projected=view.map(x=>x/b.z),clipped=[Math.max(-1,projected[0]),Math.min(1,projected[1])];
  const covered=centers.map(x=>clipped[0]<=x&&x<=clipped[1]);return {...b,world,view,projected,clipped,covered};
 });
 const fragments=centers.map((_,i)=>banners.filter(b=>b.covered[i]).map(b=>({id:b.id,color:b.color,z:b.z})));
 const pixels=fragments.map(fs=>{if(!fs.length)return '空';const selected=depth==='on'?fs.reduce((a,b)=>a.z<b.z?a:b):fs[fs.length-1];return selected.color;});
 return {banners,fragments,pixels};
}
export function createRenderPipeline(){return {shift:0,camera:0,depth:'on',stage:0,observed:[],answer:null,checked:false};}
export function renderPipelineComplete(s){return pipelineRequired.every(k=>s.observed.includes(k))&&s.answer==='order'&&s.checked;}
export function restoreRenderPipeline(s){
 const valid=new Set([-1,0,1].flatMap(a=>[0,1].flatMap(b=>['on','off'].map(c=>`${a},${b},${c}`))));
 if(!s||![-1,0,1].includes(s.shift)||![0,1].includes(s.camera)||!['on','off'].includes(s.depth)||!Number.isInteger(s.stage)||s.stage<0||s.stage>pipelineStages.length||!Array.isArray(s.observed)||new Set(s.observed).size!==s.observed.length||s.observed.some(k=>!valid.has(k))||![null,'order','depth-first','camera-last'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');
 return {...s,observed:[...s.observed]};
}
