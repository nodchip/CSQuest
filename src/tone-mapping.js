export const toneMappingLevel={id:'ruin-tone-mapping',number:'952',kind:'tone-mapping',name:'明暗の広い絵を写す',tag:'ダイナミックレンジとトーンマッピング',title:'光の幅を窓に収める',story:'洞窟の暗い道からまぶしい出口までを一枚の絵に残します。光の強さを窓に写す方法を比べましょう。'};
export const toneInputs=[0.05,0.25,1,4,16];
export const toneExposures=[0.25,1,4];
export const toneMethods={clip:'上限で切る',compress:'明るさを圧縮'};
export function toneLinear(value,exposure,method){if(!Number.isFinite(value)||value<0||!toneExposures.includes(exposure)||!Object.hasOwn(toneMethods,method))throw new RangeError('明るさの条件が不正です。');const scaled=value*exposure;return method==='clip'?Math.min(1,scaled):scaled/(1+scaled);}
// sRGB encoding is for the displayed swatch; it does not model perception.
export function toneEncode(linear){if(!Number.isFinite(linear)||linear<0||linear>1)throw new RangeError('表示の範囲が不正です。');return Math.round(255*(linear<=0.0031308?12.92*linear:1.055*linear**(1/2.4)-0.055));}
export function toneValues(exposure,method){return toneInputs.map(value=>toneEncode(toneLinear(value,exposure,method)));}
export function toneCreate(){return {exposure:1,method:'clip',seen:[],clipping:null,reflection:null};}
export function toneObserve(q){if(!toneExposures.includes(q.exposure)||!Object.hasOwn(toneMethods,q.method))throw new RangeError('条件が不正です。');const k=`${q.exposure}:${q.method}`;if(!q.seen.includes(k))q.seen.push(k);}
export function toneComplete(q){return toneExposures.every(e=>Object.keys(toneMethods).every(m=>q.seen.includes(`${e}:${m}`)))&&q.clipping==='same'&&q.reflection==='tradeoff';}
export function toneRestore(q){const keys=toneExposures.flatMap(e=>Object.keys(toneMethods).map(m=>`${e}:${m}`));if(!q||!toneExposures.includes(q.exposure)||!Object.hasOwn(toneMethods,q.method)||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!keys.includes(k))||![null,'same','different','dark'].includes(q.clipping)||![null,'tradeoff','perfect','allclip'].includes(q.reflection))throw new RangeError('記録が不正です。');return {exposure:q.exposure,method:q.method,seen:[...q.seen],clipping:q.clipping,reflection:q.reflection};}
