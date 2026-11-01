export const visibilityPathsLevel={id:'ruin-visibility-paths',number:'641',kind:'visibility-paths',name:'二つの道で見る遺跡',tag:'描画方法と交差判定',title:'朱と青の旗を映し出そう',story:'遺跡の見張り窓に、重なった２枚の旗を映します。物体から窓へ描く方法と、窓から視線を伸ばす方法の両方を試しましょう。'};
export const visibilitySamples=[-0.6,-0.2,0.2,0.6];
export const visibilityRequired=['raster,0,0','ray,0,0','raster,1,0','ray,1,0','raster,0,1','ray,0,1'];
export const visibilityMethods=['raster','ray'];
export function visibilityScene(shift,camera){
 if(![0,1].includes(shift)||![0,1].includes(camera))throw new RangeError('配置が不正です。');
 return [{id:'A',label:'朱',z:2,start:-1+shift,end:0.5+shift},{id:'B',label:'青',z:4,start:-1,end:3}].map(o=>({...o,projected:[(o.start-camera)/o.z,(o.end-camera)/o.z]}));
}
export function visibilityRaster(shift,camera,steps){
 const scene=visibilityScene(shift,camera);if(!Number.isInteger(steps)||steps<0||steps>scene.length)throw new RangeError('描画段階が不正です。');
 const result=visibilitySamples.map(()=>null);
 for(const object of scene.slice(0,steps))visibilitySamples.forEach((u,i)=>{if(object.projected[0]<=u&&u<=object.projected[1]&&(!result[i]||object.z<result[i].z))result[i]={id:object.id,label:object.label,z:object.z};});
 return result;
}
export function visibilityRay(shift,camera,steps){
 const scene=visibilityScene(shift,camera);if(!Number.isInteger(steps)||steps<0||steps>visibilitySamples.length)throw new RangeError('視線の本数が不正です。');
 return visibilitySamples.map((u,i)=>{if(i>=steps)return null;const hits=scene.map(o=>({...o,at:camera+u*o.z})).filter(o=>o.start<=o.at&&o.at<=o.end).sort((a,b)=>a.z-b.z);return hits.length?{id:hits[0].id,label:hits[0].label,z:hits[0].z}:{id:'empty',label:'空',z:null};});
}
export function createVisibilityPaths(){return {shift:0,camera:0,method:'raster',step:0,observed:[],answer:null,checked:false};}
export function visibilityPathsComplete(s){return visibilityRequired.every(k=>s.observed.includes(k))&&s.answer==='same'&&s.checked;}
export function restoreVisibilityPaths(s){
 const valid=new Set(visibilityMethods.flatMap(m=>[0,1].flatMap(a=>[0,1].map(b=>`${m},${a},${b}`))));
 if(!s||![0,1].includes(s.shift)||![0,1].includes(s.camera)||!visibilityMethods.includes(s.method)||!Number.isInteger(s.step)||s.step<0||s.step>(s.method==='raster'?2:4)||!Array.isArray(s.observed)||new Set(s.observed).size!==s.observed.length||s.observed.some(k=>!valid.has(k))||![null,'same','always','none'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');
 return {...s,observed:[...s.observed]};
}
