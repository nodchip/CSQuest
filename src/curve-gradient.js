export const curveGradientLevel={id:'ruin-curve-gradient',number:'1101',kind:'curve-gradient',name:'曲線を進む光と勾配',tag:'ベクトル値関数・勾配・連鎖律',title:'光の道と明るさの変化を調べよう',story:'遺跡を進む光は曲線に沿って動き、場所によって明るさが変わります。動く向きと明るさの勾配を比べましょう。'};
export const curveTimes=[0,1,2];
export const curveVelocityChoices={0:'(1, 0)',1:'(1, 2)',2:'(1, 4)'};
export const curveGradientChoices={0:'(0, 0)',1:'(2, 2)',2:'(4, 8)'};
export const curveRateChoices=[0,2,6,12,20,36];
export function curveGradientState(t){if(!curveTimes.includes(t))throw new RangeError('時刻が不正です');const point=[t,t*t],velocity=[1,2*t],gradient=[2*t,2*t*t],brightness=point[0]**2+point[1]**2,rate=gradient[0]*velocity[0]+gradient[1]*velocity[1];return {point,velocity,gradient,brightness,rate};}
export function curveGradientCreate(){return {t:0,trials:Object.fromEntries(curveTimes.map(t=>[t,{velocity:null,gradient:null,rate:null,checked:false}])),reflection:null};}
export function curveGradientPass(t,trial){if(!curveTimes.includes(t)||!trial)return false;return trial.checked&&trial.velocity===t&&trial.gradient===t&&trial.rate===curveGradientState(t).rate;}
export function curveGradientDone(q){return curveTimes.every(t=>curveGradientPass(t,q.trials[t]))&&q.reflection==='dot';}
export function curveGradientRestore(q){if(!q||!curveTimes.includes(q.t)||!q.trials||![null,'dot','sum'].includes(q.reflection))throw new RangeError('途中記録が不正です');const s=curveGradientCreate();s.t=q.t;s.reflection=q.reflection;for(const t of curveTimes){const r=q.trials[t];if(!r||![null,...curveTimes].includes(r.velocity)||![null,...curveTimes].includes(r.gradient)||![null,...curveRateChoices].includes(r.rate)||typeof r.checked!=='boolean')throw new RangeError('途中記録が不正です');s.trials[t]={velocity:r.velocity,gradient:r.gradient,rate:r.rate,checked:r.checked};}return s;}
