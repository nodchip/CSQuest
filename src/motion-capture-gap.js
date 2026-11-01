export const motionCaptureGapLevel={id:'ruin-motion-capture-gap',number:'635',kind:'motion-capture-gap',name:'見えなくなった灯り',tag:'動きの収録と欠測',title:'隠れた動きを確かめよう',story:'精霊の動きを記録する装置で、一瞬だけ灯りが柱の陰に隠れました。記録を補い、その確かさを調べましょう。'};
export const captureCases={high:{name:'収録 A',truth:2},low:{name:'収録 B',truth:0}};
export const captureObserved=[0,1,null,1,0];
export function captureEstimate(){return (captureObserved[1]+captureObserved[3])/2;}
export function captureResult(id){if(!Object.hasOwn(captureCases,id))throw new RangeError('収録が不正です。');const estimate=captureEstimate(),truth=captureCases[id].truth;return {estimate,truth,absoluteError:Math.abs(estimate-truth)};}
export function createCaptureTrial(){return {scanned:0,guess:null,filled:false,revealed:false};}
export function createMotionCaptureGap(){return {selected:'high',trials:{high:createCaptureTrial(),low:createCaptureTrial()},permission:null,answer:null,checked:false};}
export function motionCaptureGapComplete(s){return Object.keys(captureCases).every(id=>s.trials[id].revealed)&&s.permission==='ask'&&s.answer==='uncertain'&&s.checked;}
export function restoreMotionCaptureGap(s){
 if(!s||!Object.hasOwn(captureCases,s.selected)||!s.trials||![null,'ask','assume','ignore'].includes(s.permission)||![null,'uncertain','certain','same'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');
 const r=createMotionCaptureGap();r.selected=s.selected;r.permission=s.permission;r.answer=s.answer;r.checked=s.checked;
 for(const id of Object.keys(captureCases)){const t=s.trials[id];if(!t||!Number.isInteger(t.scanned)||t.scanned<0||t.scanned>5||![null,0,1,2].includes(t.guess)||typeof t.filled!=='boolean'||typeof t.revealed!=='boolean'||(t.scanned<5&&(t.guess!==null||t.filled||t.revealed))||(t.filled&&t.guess!==captureEstimate())||(t.revealed&&!t.filled))throw new RangeError('途中記録が不正です。');r.trials[id]={...t};}return r;
}
