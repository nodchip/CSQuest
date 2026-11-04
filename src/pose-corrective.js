export const poseCorrectiveLevel={id:'ruins-pose-corrective',number:'1250',kind:'pose-corrective',name:'曲がる腕と補正の形',tag:'姿勢空間変形',title:'腕の姿勢に合わせて形を直す',story:'人形師が精霊の腕を曲げると、ひじの輪郭を姿勢に合わせて調整したくなりました。補正の形を手で選ぶ方法と、角度に連動する方法を比べましょう。'};
export const poseCorrectiveAngles=[0,45,90];
export const poseCorrectiveModes={manual:'手動で補正を選ぶ',driven:'角度に連動する'};
export function poseCorrectiveWeight(angle){if(!poseCorrectiveAngles.includes(angle))throw new RangeError('角度が不正です。');return angle/45;}
export function poseCorrectiveGeometry(angle,weight){if(!poseCorrectiveAngles.includes(angle)||![0,1,2].includes(weight))throw new RangeError('姿勢か補正が不正です。');const rad=angle*Math.PI/180;return {wristX:85+45*Math.cos(rad),wristY:100-45*Math.sin(rad),markerY:88-8*weight};}
export function poseCorrectiveCreate(){return {angle:0,mode:'manual',weight:2,seen:[],reflection:null};}
export function poseCorrectiveCheck(q){const effective=q.mode==='manual'?q.weight:poseCorrectiveWeight(q.angle),ok=effective===poseCorrectiveWeight(q.angle),key=`${q.mode}:${q.angle}`;if(ok&&!q.seen.includes(key))q.seen.push(key);return ok;}
export function poseCorrectiveDone(q){return Object.keys(poseCorrectiveModes).every(m=>poseCorrectiveAngles.every(a=>q.seen.includes(`${m}:${a}`)))&&q.reflection==='pose';}
export function poseCorrectiveRestore(q){const valid=Object.keys(poseCorrectiveModes).flatMap(m=>poseCorrectiveAngles.map(a=>`${m}:${a}`));if(!q||!poseCorrectiveAngles.includes(q.angle)||!Object.hasOwn(poseCorrectiveModes,q.mode)||![0,1,2].includes(q.weight)||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!valid.includes(k))||![null,'pose','fixed'].includes(q.reflection))throw new RangeError('記録が不正です。');return {...q,seen:[...q.seen]};}
