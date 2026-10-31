export const gateDelayLevel={id:'workshop-gate-delay',number:'268',kind:'gate-delay',name:'遅れて届く灯り',tag:'ゲートの伝搬遅延',title:'灯りが届くまで待とう',story:'三つの反転門を通る灯りを、記憶石に写す時刻を調べます。'};
export function gateDelayState(tick){if(!Number.isInteger(tick)||tick<0||tick>3)throw new RangeError('時刻が不正です。');return {tick,outputs:[tick>=1?0:1,tick>=2?1:0,tick>=3?0:1],settled:tick===3};}
export function createGateDelay(){return {tick:0,captures:[]};}
export function gateDelayComplete(s){return s.captures.includes(2)&&s.captures.includes(3);}
export function restoreGateDelay(saved){if(!saved||!Number.isInteger(saved.tick)||saved.tick<0||saved.tick>3||!Array.isArray(saved.captures)||saved.captures.length>4||new Set(saved.captures).size!==saved.captures.length||!saved.captures.every(n=>Number.isInteger(n)&&n>=0&&n<=saved.tick))throw new RangeError('途中記録が不正です。');return {tick:saved.tick,captures:[...saved.captures]};}
