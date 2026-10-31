export const toonLevel={id:'ruin-toon-shading',number:'186',kind:'toon-shading',name:'三色の魔法の盾',tag:'光とトゥーン調の描画',title:'灯りで盾を塗り分けよう',story:'遺跡の盾に灯りを当て、面の向きによって明るさを変えます。滑らかな明暗と三段階の塗り分けを比べましょう。'};
export const toonFaces=[{name:'A',normal:[0,1]},{name:'B',normal:[0.6,0.8]},{name:'C',normal:[0.8,0.6]},{name:'D',normal:[1,0]}];
export const toonBands={dark:'暗い',mid:'中間',bright:'明るい'};
export function toonLight(normal){if(!Array.isArray(normal)||normal.length!==2||!normal.every(Number.isFinite))throw new RangeError('法線が不正です。');return Math.max(0,normal[1]);}
export function toonBand(intensity){if(!Number.isFinite(intensity)||intensity<0||intensity>1)throw new RangeError('明るさが不正です。');return intensity<0.25?'dark':intensity<0.75?'mid':'bright';}
export function createToon(){return {choices:[null,null,null,null],mode:'smooth',seen:{smooth:true,toon:false},checked:false};}
export function toonComplete(s){return s.checked&&s.seen.smooth&&s.seen.toon&&toonFaces.every((f,i)=>s.choices[i]===toonBand(toonLight(f.normal)));}
export function restoreToon(saved){if(!saved||!Array.isArray(saved.choices)||saved.choices.length!==toonFaces.length||saved.choices.some(x=>x!==null&&!Object.hasOwn(toonBands,x))||!['smooth','toon'].includes(saved.mode)||!saved.seen||typeof saved.seen.smooth!=='boolean'||typeof saved.seen.toon!=='boolean'||!saved.seen[saved.mode]||typeof saved.checked!=='boolean')throw new RangeError('途中記録が不正です。');return {choices:saved.choices.slice(),mode:saved.mode,seen:{smooth:saved.seen.smooth,toon:saved.seen.toon},checked:saved.checked};}
