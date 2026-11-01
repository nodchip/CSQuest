export const motionBlendLevel={id:'ruin-motion-blend',number:'729',kind:'motion-blend',name:'二つの動きをつなぐ',tag:'動作のブレンド',title:'精霊の動きをつなぐ',story:'二つの動作の記録を引き継ぎ、精霊が飛び移らずに目標の位置を通れるよう重みを調節しましょう。'};
export const blendA=[0,1,2,3,4],blendB=[6,7,8,9,10],blendTargets=[0,2.5,5,7.5,10],blendWeights=[0,25,50,75,100];
export function blendPosition(index,weight){if(!Number.isInteger(index)||index<0||index>=5||!blendWeights.includes(weight))throw new RangeError('刻か重みが不正です。');return blendA[index]*(1-weight/100)+blendB[index]*weight/100;}
export function blendCreate(){return {tick:0,weights:Array(5).fill(null),answer:'',checked:false};}
export function blendComplete(s){return s.checked&&s.answer==='limits'&&s.weights.every((w,i)=>w!==null&&blendPosition(i,w)===blendTargets[i]);}
export function blendRestore(s){if(!s||!Number.isInteger(s.tick)||s.tick<0||s.tick>=5||!Array.isArray(s.weights)||s.weights.length!==5||s.weights.some(w=>w!==null&&!blendWeights.includes(w))||!['','limits','always','identical'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');return {tick:s.tick,weights:[...s.weights],answer:s.answer,checked:s.checked};}
