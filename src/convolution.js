export const convolutionLevel={id:'ruin-convolution',number:'661',kind:'convolution',name:'動く紋章と小さな窓',tag:'畳み込みとプーリング',title:'同じ窓で紋章の境目を見つけよう',story:'遺跡の紋章は並ぶ石の位置が変わります。同じ窓を少しずつ動かし、明るさの変化を見つける魔法を試しましょう。'};
export const convolutionPatterns={early:{name:'左寄りの紋章',pixels:[0,1,1,0,0,0]},late:{name:'右寄りの紋章',pixels:[0,0,0,1,1,0]}};
export const convolutionFilters={rise:{name:'暗から明へ',weights:[-1,1]},fall:{name:'明から暗へ',weights:[1,-1]}};
export function convolutionWindow(pattern,filter,index){
 if(!Object.hasOwn(convolutionPatterns,pattern)||!Object.hasOwn(convolutionFilters,filter)||!Number.isInteger(index)||index<0||index>=5)throw new RangeError('窓の条件が不正です。');
 const pixels=convolutionPatterns[pattern].pixels.slice(index,index+2),weights=convolutionFilters[filter].weights,raw=pixels[0]*weights[0]+pixels[1]*weights[1];return {pixels,raw,activation:Math.max(0,raw)};
}
export function poolPairs(values){if(!Array.isArray(values)||values.length!==5||values.some(v=>!Number.isFinite(v)))throw new RangeError('活性の列が不正です。');return [Math.max(values[0],values[1]),Math.max(values[2],values[3])];}
export function createConvolution(){return {pattern:'early',filter:'rise',run:null,results:{},answerShare:null,answerPool:null,checked:false,history:[]};}
export function convolutionAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=128)return {ok:false,message:'操作記録がいっぱいです。最初からやり直してください。'};
 const n={...s,results:{...s.results},history:[...s.history],checked:false,run:s.run?{...s.run,raw:[...s.run.raw],activations:[...s.run.activations]}:null};let message='';
 if(action.startsWith('pattern:')&&Object.hasOwn(convolutionPatterns,action.slice(8))){n.pattern=action.slice(8);message='調べる紋章を選びました。実行中の窓は開始時のままです。';}
 else if(action.startsWith('filter:')&&Object.hasOwn(convolutionFilters,action.slice(7))){n.filter=action.slice(7);message='窓に使う重みを選びました。実行中の窓は開始時のままです。';}
 else if(action==='start'){n.run={pattern:s.pattern,filter:s.filter,index:0,raw:[],activations:[],pooled:null};message='選んだ紋章と重みで左端から始めます。';}
 else if(action==='step'&&s.run&&s.run.index<5){const r=n.run,v=convolutionWindow(r.pattern,r.filter,r.index);r.raw.push(v.raw);r.activations.push(v.activation);r.index++;message=`窓 ${r.index} の重み付き和は ${v.raw}、０未満を０にした値は ${v.activation} です。`;}
 else if(action==='pool'&&s.run&&s.run.index===5&&!s.run.pooled){n.run.pooled=poolPairs(n.run.activations);n.results[`${s.run.pattern}-${s.run.filter}`]={raw:[...s.run.raw],activations:[...s.run.activations],pooled:[...n.run.pooled]};message='隣り合う２個ずつの最大値を取りました。最後の１個は組がないため使いません。';}
 else if(['share:same','share:different','share:input'].includes(action)){n.answerShare=action.slice(6);message='窓の重みについて選びました。';}
 else if(['pool:loss','pool:exact','pool:always'].includes(action)){n.answerPool=action.slice(5);message='プーリングについて選びました。';}
 else if(action==='check'){n.checked=true;message='観察した記録と答えを確認しました。';}
 else return {ok:false,message:'窓を開始し、５か所を順に調べてから次へ進みましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function restoreConvolution(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>128)throw new RangeError('途中記録が不正です。');let s=createConvolution();for(const a of saved.history){if(typeof a!=='string')throw new RangeError('途中記録が不正です。');const r=convolutionAct(s,a);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
export function convolutionComplete(s){return ['early-rise','late-rise','early-fall','late-fall'].every(k=>Object.hasOwn(s.results,k))&&s.answerShare==='same'&&s.answerPool==='loss'&&s.checked;}
