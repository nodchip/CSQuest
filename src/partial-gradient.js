export const partialGradientLevel={id:'crystal-partial-gradient',number:'477',kind:'partial-gradient',name:'二つの調整と誤差の谷',tag:'偏微分と勾配',title:'二方向の傾きで谷を進もう',story:'鑑定士は水晶の二つの調整値を使い、誤差を小さくします。一方を固定してもう一方を調べ、谷を下りましょう。'};
export function partialLoss(x,y){if(!Number.isFinite(x)||!Number.isFinite(y))throw new RangeError('調整値が不正です。');return (x-1)**2+(y-2)**2;}
export function partialState(steps){if(!Number.isInteger(steps)||steps<0||steps>3)throw new RangeError('歩数が不正です。');let x=3,y=3;for(let i=0;i<steps;i++){x-=0.25*2*(x-1);y-=0.25*2*(y-2);}return {x,y,loss:partialLoss(x,y),gx:2*(x-1),gy:2*(y-2)};}
export function createPartialGradient(){return {steps:0,gx:null,gy:null,answer:null,checked:false};}
export function stepPartialGradient(s){const p=partialState(s.steps);if(s.steps===3)throw new RangeError('３歩進みました。');if(s.gx!==p.gx||s.gy!==p.gy)throw new RangeError('片方を固定したそれぞれの傾きを確認しましょう。');return {...s,steps:s.steps+1,gx:null,gy:null,checked:false};}
export function partialGradientComplete(s){return s.steps===3&&s.answer==='both'&&s.checked;}
export function restorePartialGradient(s){if(!s||![null,-2,0,0.5,1,2,4].includes(s.gx)||![null,-2,0,0.5,1,2,4].includes(s.gy)||![null,'both','one','up'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');partialState(s.steps);return {...s};}
