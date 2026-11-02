export const segmentLevel={id:'ruin-segment-contact',number:'848',kind:'segment-contact',name:'交わる二本の光',tag:'線分同士の接触',title:'二本の光の行方を調べよう',story:'遺跡の扉には二本の光の道があります。片方を動かし、交差や接触、重なりを見分けましょう。'};
export const segmentGoals={cross:{name:'内部で交差',target:'cross'},touch:{name:'一点で端に接する',target:'touch'},overlap:{name:'同一直線で重なる',target:'overlap'},separate:{name:'接しない',target:'separate'}};
export const segmentLabels={cross:'互いの内部で交差',touch:'一点で端に接する',overlap:'同一直線で長さを持って重なる',separate:'接しない',invalid:'C と D が同じ点'};
const a={x:0,y:1},b={x:4,y:1};
const orient=(p,q,r)=>(q.x-p.x)*(r.y-p.y)-(q.y-p.y)*(r.x-p.x);
const on=(p,q,r)=>orient(p,q,r)===0&&Math.min(p.x,q.x)<=r.x&&r.x<=Math.max(p.x,q.x)&&Math.min(p.y,q.y)<=r.y&&r.y<=Math.max(p.y,q.y);
export function segmentResult(c,d){
 if(!c||!d||![c.x,d.x].every(x=>Number.isInteger(x)&&x>=0&&x<=4)||![c.y,d.y].every(y=>Number.isInteger(y)&&y>=0&&y<=3))throw new RangeError('座標が不正です。');
 const signs=[orient(a,b,c),orient(a,b,d),orient(c,d,a),orient(c,d,b)];
 if(c.x===d.x&&c.y===d.y)return {signs,status:'invalid'};
 const [u,v,w,z]=signs;let status;
 if(u===0&&v===0){const left=Math.max(0,Math.min(c.x,d.x)),right=Math.min(4,Math.max(c.x,d.x));status=left<right?'overlap':left===right?'touch':'separate';}
 else if(u*v<0&&w*z<0)status='cross';
 else if(on(a,b,c)||on(a,b,d)||on(c,d,a)||on(c,d,b))status='touch';
 else status='separate';
 return {signs,status};
}
export function segmentCreate(){return {selected:'cross',endpoint:'c',trials:Object.fromEntries(Object.keys(segmentGoals).map(id=>[id,{c:{x:0,y:0},d:{x:4,y:0},checked:false}]))};}
export function segmentComplete(q){return Object.entries(segmentGoals).every(([id,goal])=>{const t=q.trials[id];return t.checked&&segmentResult(t.c,t.d).status===goal.target;});}
export function segmentRestore(q){if(!q||!Object.hasOwn(segmentGoals,q.selected)||!['c','d'].includes(q.endpoint)||!q.trials)throw new RangeError('記録が不正です。');const n=segmentCreate();n.selected=q.selected;n.endpoint=q.endpoint;for(const [id,goal] of Object.entries(segmentGoals)){const t=q.trials[id];if(!t||typeof t.checked!=='boolean')throw new RangeError('記録が不正です。');const r=segmentResult(t.c,t.d);if(t.checked&&r.status!==goal.target)throw new RangeError('記録が不正です。');n.trials[id]={c:{...t.c},d:{...t.d},checked:t.checked};}return n;}
