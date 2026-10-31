export const stereoLevel={id:'ruin-stereo-depth',number:'216',kind:'stereo-depth',name:'二つの水晶の景色',tag:'両眼視差と奥行き',title:'左右の景色を合わせよう',story:'遺跡の二つの水晶が同じ灯火を映します。左右の映る位置を選び、灯火の距離と視点のずれの関係を調べましょう。'};
export const stereoCases={near:{name:'近くの灯火',depth:2,baseline:2},far:{name:'遠くの灯火',depth:4,baseline:2},same:{name:'同じ位置の水晶',depth:2,baseline:0}};
export const stereoPositions=[-1,-.5,0,.5,1];
export const stereoDisparities=[0,1,2];
export function stereoExpected(id){if(!Object.hasOwn(stereoCases,id))throw new RangeError('試行が不正です。');const c=stereoCases[id],left=c.baseline===0?0:c.baseline/c.depth,right=left===0?0:-left;return {left,right,disparity:left-right};}
export function stereoCorrect(id,choice){const e=stereoExpected(id);return choice.left===e.left&&choice.right===e.right&&choice.disparity===e.disparity;}
export function createStereo(){return {selected:'near',trials:Object.fromEntries(Object.keys(stereoCases).map(id=>[id,{left:0,right:0,disparity:0,checked:false}]))};}
export function stereoComplete(s){return Object.keys(stereoCases).every(id=>s.trials[id].checked&&stereoCorrect(id,s.trials[id]));}
export function restoreStereo(saved){if(!saved||!Object.hasOwn(stereoCases,saved.selected)||!saved.trials)throw new RangeError('途中記録が不正です。');const s=createStereo();s.selected=saved.selected;for(const id of Object.keys(stereoCases)){const t=saved.trials[id];if(!t||!stereoPositions.includes(t.left)||!stereoPositions.includes(t.right)||!stereoDisparities.includes(t.disparity)||typeof t.checked!=='boolean'||(t.checked&&!stereoCorrect(id,t)))throw new RangeError('途中記録が不正です。');s.trials[id]={left:t.left,right:t.right,disparity:t.disparity,checked:t.checked};}return s;}
