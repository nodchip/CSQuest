export const scalarFieldLevel={id:'ruin-scalar-field',number:'721',kind:'scalar-field',name:'温もりの地図',tag:'スカラー場の可視化',title:'石床の温もりを調べる',story:'遺跡の16枚の石は、それぞれ温もりの強さを記録しています。色と数値を手がかりに、指定した強さ以上の場所を探しましょう。'};
export const scalarValues=[0,1,2,3,1,2,3,4,2,3,4,5,3,4,5,6],scalarThresholds=[2,4];
export function scalarExpected(threshold){if(!scalarThresholds.includes(threshold))throw new RangeError('未知のしきい値です。');return scalarValues.flatMap((value,index)=>value>=threshold?[index]:[]);}
export function scalarCreate(){return {threshold:2,trials:{2:{selected:[],checked:false},4:{selected:[],checked:false}}};}
export function scalarCorrect(t,threshold){const expected=scalarExpected(threshold);return t.checked&&t.selected.length===expected.length&&expected.every(i=>t.selected.includes(i));}
export function scalarComplete(s){return scalarThresholds.every(n=>scalarCorrect(s.trials[n],n));}
export function scalarRestore(s){if(!s||!scalarThresholds.includes(s.threshold)||!s.trials)throw new RangeError('途中記録が不正です。');const r=scalarCreate();r.threshold=s.threshold;for(const n of scalarThresholds){const t=s.trials[n];if(!t||!Array.isArray(t.selected)||new Set(t.selected).size!==t.selected.length||t.selected.some(i=>!Number.isInteger(i)||i<0||i>=scalarValues.length)||typeof t.checked!=='boolean')throw new RangeError('途中記録が不正です。');r.trials[n]={selected:[...t.selected],checked:t.checked};}return r;}
