export const sceneHierarchyLevel={id:'ruin-scene-hierarchy',number:'637',kind:'scene-hierarchy',name:'台座と灯りの親子',tag:'シーングラフと座標変換',title:'台座を動かして灯りを導こう',story:'遺跡の台座に腕と旗が付き、腕の先には灯りがあります。親子のつながりを動かして位置を調べましょう。'};
export const hierarchyRequired=['0,0,1','0,90,1','0,0,2','2,0,1','2,90,2'];
export function hierarchyPositions(shift,angle,length){
 if(![0,2].includes(shift)||![0,90].includes(angle)||![1,2].includes(length))throw new RangeError('配置が不正です。');
 const rotate=([x,y])=>angle===0?[x,y]:[-y,x],add=([x,y],[a,b])=>[x+a,y+b],parent=[2+shift,2],arm=add(parent,rotate([length,0])),flag=add(parent,rotate([0,1])),light=add(arm,rotate([0,1]));
 return {parent,arm,flag,light};
}
export function createSceneHierarchy(){return {shift:0,angle:0,length:1,observed:[],answers:{parent:null,arm:null},reflection:null,checked:false};}
export function sceneHierarchyComplete(s){return hierarchyRequired.every(k=>s.observed.includes(k))&&s.answers.parent==='all'&&s.answers.arm==='branch'&&s.reflection==='relative'&&s.checked;}
export function restoreSceneHierarchy(s){const valid=new Set([0,2].flatMap(a=>[0,90].flatMap(b=>[1,2].map(c=>`${a},${b},${c}`))));if(!s||![0,2].includes(s.shift)||![0,90].includes(s.angle)||![1,2].includes(s.length)||!Array.isArray(s.observed)||new Set(s.observed).size!==s.observed.length||s.observed.some(k=>!valid.has(k))||!s.answers||![null,'all','one','none'].includes(s.answers.parent)||![null,'branch','all','flag'].includes(s.answers.arm)||![null,'relative','independent','same'].includes(s.reflection)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');return {...s,observed:[...s.observed],answers:{...s.answers}};}
