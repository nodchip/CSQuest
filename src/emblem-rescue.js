import {morphTransform} from './morph-sequence.js';
export const emblemRescueLevel={id:'ruin-emblem-rescue',number:'728',kind:'emblem-rescue',name:'遺跡の紋章を取り戻す',tag:'分割と形の修復',title:'祭壇の紋章を読み解く',story:'霞んだ二つの紋章を灯して、遺跡の扉を開きましょう。明るさで分けた後、形を整える術を組み合わせます。'};
const base=Array.from({length:7},(_,r)=>Array.from({length:7},(_,c)=>r>=2&&r<=4&&c>=2&&c<=4?4:1));
const noise=base.map(row=>[...row]);noise[0][0]=4;const hole=base.map(row=>[...row]);hole[3][3]=1;
const square=Array.from({length:7},(_,r)=>Array.from({length:7},(_,c)=>Number(r>=2&&r<=4&&c>=2&&c<=4)));
const cross=Array.from({length:7},(_,r)=>Array.from({length:7},(_,c)=>Number(Math.abs(r-3)+Math.abs(c-3)<=1)));
export const rescueCases={noise:{name:'離れた光',image:noise,target:cross},hole:{name:'紋章の穴',image:hole,target:square}};
export const rescueThresholds=[2,3,4,5];export const rescueActions={erode:'収縮',dilate:'膨張'};
export function rescueImage(id,threshold,history){if(!Object.hasOwn(rescueCases,id)||!rescueThresholds.includes(threshold)||!Array.isArray(history)||history.length>3||history.some(a=>!Object.hasOwn(rescueActions,a)))throw new RangeError('術の条件が不正です。');return history.reduce((image,a)=>morphTransform(image,a),rescueCases[id].image.map(row=>row.map(v=>Number(v>=threshold))));}
export function rescueCreate(){return {selected:'noise',trials:Object.fromEntries(Object.keys(rescueCases).map(id=>[id,{threshold:2,started:false,history:[],checked:false}]))};}
export function rescueCorrect(id,t){return t.started&&t.checked&&JSON.stringify(rescueImage(id,t.threshold,t.history))===JSON.stringify(rescueCases[id].target);}
export function rescueComplete(s){return Object.keys(rescueCases).every(id=>rescueCorrect(id,s.trials[id]));}
export function rescueRestore(s){if(!s||!Object.hasOwn(rescueCases,s.selected)||!s.trials)throw new RangeError('途中記録が不正です。');const out=rescueCreate();out.selected=s.selected;for(const id of Object.keys(rescueCases)){const t=s.trials[id];if(!t||typeof t.started!=='boolean'||typeof t.checked!=='boolean'||(!t.started&&t.history?.length))throw new RangeError('途中記録が不正です。');rescueImage(id,t.threshold,t.history);out.trials[id]={threshold:t.threshold,started:t.started,history:[...t.history],checked:t.checked};}return out;}
