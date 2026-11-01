export const imageHueLevel={id:'ruin-image-hue',number:'726',kind:'image-hue',name:'色を巡る紋章',tag:'HSV と画像の色相',title:'紋章の色を合わせる',story:'祭壇の色褪せた紋章に、依頼された色の魔法をかけましょう。色の向き、鮮やかさ、明るさを調節します。'};
const colors=[{h:0,s:1,v:1},{h:120,s:1,v:1},{h:240,s:1,v:1},{h:0,s:0,v:1}];
const gray=Array.from({length:4},()=>({h:0,s:0,v:1}));
export const hueCases={rotate:{name:'色を巡らせる',image:colors,target:{shift:120,sat:100,val:100}},soft:{name:'薄い色に変える',image:colors,target:{shift:240,sat:50,val:100}},dim:{name:'光を弱める',image:colors,target:{shift:0,sat:100,val:50}},gray:{name:'灰色の紋章',image:gray,target:{shift:180,sat:100,val:100}}};
export const hueShifts=Array.from({length:12},(_,i)=>i*30);export const hueSats=[0,50,100];export const hueVals=[50,100];
export function hsvRgb(h,s,v){if(!Number.isFinite(h)||!Number.isFinite(s)||!Number.isFinite(v)||s<0||s>1||v<0||v>1)throw new RangeError('色が不正です。');h=((h%360)+360)%360;const c=v*s,x=c*(1-Math.abs((h/60)%2-1)),m=v-c;const [r,g,b]=h<60?[c,x,0]:h<120?[x,c,0]:h<180?[0,c,x]:h<240?[0,x,c]:h<300?[x,0,c]:[c,0,x];return [r,g,b].map(n=>Math.round((n+m)*255));}
export function hueImage(id,setting){if(!Object.hasOwn(hueCases,id)||!setting||!hueShifts.includes(setting.shift)||!hueSats.includes(setting.sat)||!hueVals.includes(setting.val))throw new RangeError('設定が不正です。');return hueCases[id].image.map(p=>hsvRgb(p.h+setting.shift,p.s*setting.sat/100,p.v*setting.val/100));}
export function hueCreate(){return {selected:'rotate',trials:Object.fromEntries(Object.keys(hueCases).map(id=>[id,{shift:0,sat:100,val:100,checked:false}]))};}
export function hueCorrect(id,t){return t.checked&&JSON.stringify(hueImage(id,t))===JSON.stringify(hueImage(id,hueCases[id].target));}
export function hueComplete(s){return Object.keys(hueCases).every(id=>hueCorrect(id,s.trials[id]));}
export function hueRestore(s){if(!s||!Object.hasOwn(hueCases,s.selected)||!s.trials)throw new RangeError('途中記録が不正です。');const out=hueCreate();out.selected=s.selected;for(const id of Object.keys(hueCases)){const t=s.trials[id];if(!t||typeof t.checked!=='boolean')throw new RangeError('途中記録が不正です。');hueImage(id,t);out.trials[id]={shift:t.shift,sat:t.sat,val:t.val,checked:t.checked};}return out;}
