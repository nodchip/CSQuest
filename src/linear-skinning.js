export const skinningLevel={id:'ruin-linear-skinning',number:'185',kind:'linear-skinning',name:'曲がる魔法の布',tag:'線形ブレンドスキニング',title:'二つの骨で形を動かす',story:'遺跡の旗が二つの骨につながっています。点ごとの重みを調整し、曲がったときの形を目標に合わせましょう。'};
export const skinningWeights=[0,0.25,0.75,1];
export const skinningVertices=[{name:'A',x:0,target:{x:0,y:0}},{name:'B',x:1,target:{x:1.25,y:-0.25}},{name:'C',x:3,target:{x:2.25,y:0.75}},{name:'D',x:4,target:{x:2,y:2}}];
// Bone A leaves the point in place; bone B rotates it 90 degrees around (2, 0).
export function skinVertex(x,weight){if(!Number.isFinite(x)||!skinningWeights.includes(weight))throw new RangeError('点または重みが不正です。');return {x:(1-weight)*x+weight*2,y:weight*(x-2)||0};}
export function createSkinning(){return {weights:[0,0,0,0],checked:false};}
export function skinningComplete(s){return s.checked&&skinningVertices.every((v,i)=>{const p=skinVertex(v.x,s.weights[i]);return p.x===v.target.x&&p.y===v.target.y;});}
export function restoreSkinning(saved){if(!saved||!Array.isArray(saved.weights)||saved.weights.length!==skinningVertices.length||saved.weights.some(w=>!skinningWeights.includes(w))||typeof saved.checked!=='boolean')throw new RangeError('途中記録が不正です。');return {weights:saved.weights.slice(),checked:saved.checked};}
