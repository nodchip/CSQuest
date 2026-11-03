export const squareFeatureLevel={id:'archive-square-features',number:'1070',kind:'square-features',name:'離れた水晶と二乗の印',tag:'機械学習と特徴表現',title:'二乗の印で境を引く',story:'鑑定士は中央から離れた水晶を見分けたいそうです。元の値と二乗の値で境界を動かし、別の記録でも試しましょう。'};
export const featureCuts={original:[-3,-1.5,0,1.5,3],square:[0,2.5,5]};
export const featureData={training:[[-2,true],[-1,false],[1,false],[2,true]],normal:[[-3,true],[0,false],[3,true]],changed:[[-3,false],[0,true],[3,false]]};
export const featureMarkers=['original-above','original-below','square-training','square-normal','square-changed'];
export function featureEvaluate(mode,cut,direction,dataset){
 if(!Object.hasOwn(featureCuts,mode)||!featureCuts[mode].includes(cut)||!['above','below'].includes(direction)||!Object.hasOwn(featureData,dataset))throw new RangeError('条件が不正です。');
 const rows=featureData[dataset].map(([x,label])=>{const feature=mode==='original'?x:x*x,high=feature>cut,prediction=direction==='above'?high:!high;return {x,feature,label,prediction,correct:label===prediction};});
 return {rows,correct:rows.filter(x=>x.correct).length};
}
export function featureMarker(mode,cut,direction,dataset,correct){
 if(dataset==='training'&&mode==='original'&&correct===3)return direction==='above'?'original-above':'original-below';
 if(mode==='square'&&cut===2.5&&direction==='above'&&dataset==='training'&&correct===4)return 'square-training';
 if(mode==='square'&&cut===2.5&&direction==='above'&&dataset==='normal'&&correct===3)return 'square-normal';
 if(mode==='square'&&cut===2.5&&direction==='above'&&dataset==='changed'&&correct===0)return 'square-changed';
 return null;
}
export function featureCreate(){return {mode:'original',cut:0,direction:'above',dataset:'training',seen:[],reflection:null};}
export function featureDone(q){return featureMarkers.every(k=>q.seen.includes(k))&&q.reflection==='limits';}
export function featureRestore(q){
 if(!q||!Object.hasOwn(featureCuts,q.mode)||!featureCuts[q.mode].includes(q.cut)||!['above','below'].includes(q.direction)||!Object.hasOwn(featureData,q.dataset)||!Array.isArray(q.seen)||q.seen.length>featureMarkers.length||new Set(q.seen).size!==q.seen.length||q.seen.some(x=>!featureMarkers.includes(x))||![null,'limits','guarantee'].includes(q.reflection))throw new RangeError('途中記録が不正です。');
 return {...q,seen:[...q.seen]};
}
