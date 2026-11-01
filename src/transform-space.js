export const transformSpaceLevel={id:'ruin-transform-space',number:'640',kind:'transform-space',name:'三軸の星門',tag:'２次元から３次元の変換',title:'二つの星を門の印へ導こう',story:'星門には３方向に動く二つの星が封じられています。回転と移動を組み合わせ、４つの印を灯しましょう。'};
export const spaceOperations=['rz','rx','ry','tx'];
export const spaceLabels={rz:'z 軸の正回転 90°',rx:'x 軸の正回転 90°',ry:'y 軸の正回転 90°',tx:'x 方向へ１移動'};
export const spaceTargets={
 flat:{label:'平面から始める',points:[[0,1,0],[-1,0,1]],hint:'z 軸の正回転を１回。'},
 tilt:{label:'奥行きへ回す',points:[[1,0,0],[0,-1,1]],hint:'x 軸の正回転を１回。'},
 sideways:{label:'横から回す',points:[[0,0,-1],[1,1,0]],hint:'y 軸の正回転を１回。'},
 order:{label:'回してから動かす',points:[[1,1,0],[0,0,1]],hint:'z 軸の正回転の後、x 方向へ１移動。'}
};
export const spaceInitial=[[1,0,0],[0,1,1]];
export function spaceTransform(points,op){
 if(!spaceOperations.includes(op)||!Array.isArray(points)||points.some(p=>!Array.isArray(p)||p.length!==3||p.some(n=>!Number.isFinite(n))))throw new RangeError('変換が不正です。');
 return points.map(([x,y,z])=>({rz:[-y,x,z],rx:[x,-z,y],ry:[z,y,-x],tx:[x+1,y,z]})[op].map(n=>n===0?0:n));
}
export function spaceReplay(history){if(!Array.isArray(history)||history.length>12||history.some(op=>!spaceOperations.includes(op)))throw new RangeError('操作の記録が不正です。');return history.reduce(spaceTransform,spaceInitial.map(p=>[...p]));}
export function spaceMatches(target,history){if(!Object.hasOwn(spaceTargets,target))throw new RangeError('目標が不正です。');return history.length>0&&JSON.stringify(spaceReplay(history))===JSON.stringify(spaceTargets[target].points);}
export function createTransformSpace(){return {target:'flat',history:[],solved:[],answer:null,checked:false};}
export function transformSpaceComplete(s){return Object.keys(spaceTargets).every(k=>s.solved.includes(k))&&s.answer==='extra'&&s.checked;}
export function restoreTransformSpace(s){
 if(!s||!Object.hasOwn(spaceTargets,s.target)||!Array.isArray(s.solved)||new Set(s.solved).size!==s.solved.length||s.solved.some(k=>!Object.hasOwn(spaceTargets,k))||![null,'extra','same','z-only'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');spaceReplay(s.history);return {...s,history:[...s.history],solved:[...s.solved]};
}
