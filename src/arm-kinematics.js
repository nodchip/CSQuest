export const baseAngles=[0,90,180,270];
export const elbowAngles=[-180,-90,0,90];
const directions=[[1,0],[0,1],[-1,0],[0,-1]];
export function armPose(base,elbow){if(!baseAngles.includes(base)||!elbowAngles.includes(elbow))throw new RangeError('角度が不正です。');const first=directions[base/90],second=directions[((base+elbow)/90%4+4)%4];return {joint:[...first],tip:[first[0]+second[0],first[1]+second[1]]};}
export function createArm(){return {base:0,elbow:0,found:[],unreachable:false,message:'２つの角度を選び、手先の位置を確かめましょう。'};}
export function armCheck(s){const pose=armPose(s.base,s.elbow),key=`${s.base},${s.elbow}`,matches=pose.tip[0]===1&&pose.tip[1]===1;return {...s,found:matches&&!s.found.includes(key)?[...s.found,key]:[...s.found],message:matches?'目標に届きました。この角度の組を記録しました。':`手先は (${pose.tip.join(', ')}) です。目標 (1, 1) を探しましょう。`};}
export function armComplete(s){return s.found.length===2&&s.unreachable;}
export function restoreArm(saved){if(!saved||!baseAngles.includes(saved.base)||!elbowAngles.includes(saved.elbow)||!Array.isArray(saved.found)||new Set(saved.found).size!==saved.found.length||typeof saved.unreachable!=='boolean')throw new RangeError('途中記録が不正です。');for(const key of saved.found){if(typeof key!=='string'||!['0,90','90,-90'].includes(key))throw new RangeError('角度の記録が不正です。');}if(saved.unreachable&&saved.found.length!==2)throw new RangeError('途中記録が不正です。');return {base:saved.base,elbow:saved.elbow,found:[...saved.found],unreachable:saved.unreachable,message:'途中の角度を読み込みました。'};}
