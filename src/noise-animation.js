export const noiseLevel={id:'workshop-noise-animation',number:'854',kind:'noise-animation',name:'揺れる灯りの道しるべ',tag:'ノイズと手続き型アニメーション',title:'灯りの揺れを作ろう',story:'工房の灯りを、時間に応じて上下に揺らします。決められた値の間をどうつなぐかで、動きがどう変わるか比べましょう。'};
export const noiseModes={hold:'値を保持',linear:'直線で補間',smooth:'滑らかに補間'};
export const noiseTimes={before:{name:'１の手前（0.75）',tick:3},at:{name:'境界（1.00）',tick:4},after:{name:'１の後（1.25）',tick:5}};
export const noiseGuesses=[0,1,2,3,3.375,4];
// Fixed sample values, rather than a random number generator or gradient noise.
export function noiseSample(mode,tick){
 if(!Object.hasOwn(noiseModes,mode)||!Number.isInteger(tick)||tick<0||tick>8)throw new RangeError('条件が不正です。');
 const samples=[0,4,0];if(tick===8)return samples[2];const cell=Math.floor(tick/4),u=(tick%4)/4;
 const weight=mode==='hold'?0:mode==='linear'?u:u*u*(3-2*u);
 return samples[cell]+(samples[cell+1]-samples[cell])*weight;
}
export function noiseCreate(){return {mode:'hold',time:'before',trials:Object.fromEntries(Object.keys(noiseModes).flatMap(m=>Object.keys(noiseTimes).map(t=>[`${m}:${t}`,{guess:null,checked:false}]))),shape:null,repeat:null};}
export function noiseCheck(q){const t=q.trials[`${q.mode}:${q.time}`];t.checked=t.guess===noiseSample(q.mode,noiseTimes[q.time].tick);return t.checked;}
export function noiseComplete(q){return Object.keys(noiseModes).every(m=>Object.keys(noiseTimes).every(id=>{const t=q.trials[`${m}:${id}`];return t.checked&&t.guess===noiseSample(m,noiseTimes[id].tick);}))&&q.shape==='smooth'&&q.repeat==='same';}
export function noiseRestore(q){
 if(!q||!Object.hasOwn(noiseModes,q.mode)||!Object.hasOwn(noiseTimes,q.time)||!q.trials||![null,'smooth','hold','linear'].includes(q.shape)||![null,'same','random','real'].includes(q.repeat))throw new RangeError('記録が不正です。');
 const n=noiseCreate();n.mode=q.mode;n.time=q.time;n.shape=q.shape;n.repeat=q.repeat;
 for(const m of Object.keys(noiseModes))for(const id of Object.keys(noiseTimes)){const key=`${m}:${id}`,t=q.trials[key];if(!t||![null,...noiseGuesses].includes(t.guess)||typeof t.checked!=='boolean'||t.checked&&t.guess!==noiseSample(m,noiseTimes[id].tick))throw new RangeError('記録が不正です。');n.trials[key]={guess:t.guess,checked:t.checked};}
 return n;
}
