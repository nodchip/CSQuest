export const kinematicsLevel={id:'ruin-forward-kinematics',number:'183',kind:'forward-kinematics',name:'二つの関節の灯り',tag:'順運動学',title:'腕を伸ばして灯りを届ける',story:'遺跡の機械の腕には二つの関節があります。二本の角度を調整して、先端の灯りを目標に届けましょう。'};
export const kinematicsAngles=[0,90,180,270];
export const kinematicsTargets={upper:{name:'右上の灯台',x:2,y:1},left:{name:'左上の灯台',x:-1,y:2}};
const vectors=[[1,0],[0,1],[-1,0],[0,-1]];
export function armPosition(base,joint){if(!kinematicsAngles.includes(base)||!kinematicsAngles.includes(joint))throw new RangeError('角度が不正です。');const first=vectors[base/90],second=vectors[((base+joint)%360)/90],elbow={x:2*first[0],y:2*first[1]};return {elbow,tip:{x:elbow.x+second[0],y:elbow.y+second[1]},orientation:(base+joint)%360};}
export function createKinematics(){return {selected:'upper',trials:{upper:{base:0,joint:0,checked:false},left:{base:0,joint:0,checked:false}}};}
export function kinematicsCorrect(s,id){if(!Object.hasOwn(kinematicsTargets,id))throw new RangeError('目標が不正です。');const t=s.trials[id],p=armPosition(t.base,t.joint).tip,target=kinematicsTargets[id];return t.checked&&p.x===target.x&&p.y===target.y;}
export function kinematicsComplete(s){return Object.keys(kinematicsTargets).every(id=>kinematicsCorrect(s,id));}
export function restoreKinematics(saved){if(!saved||!Object.hasOwn(kinematicsTargets,saved.selected)||!saved.trials)throw new RangeError('途中記録が不正です。');const s=createKinematics();s.selected=saved.selected;for(const id of Object.keys(kinematicsTargets)){const t=saved.trials[id];if(!t||!kinematicsAngles.includes(t.base)||!kinematicsAngles.includes(t.joint)||typeof t.checked!=='boolean')throw new RangeError('角度が不正です。');s.trials[id]={base:t.base,joint:t.joint,checked:t.checked};}return s;}
