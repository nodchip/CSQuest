import {roiCreate,roiRestore} from './inclusion-roi.js';
export const inclusiveCycleLevel={id:'guild-inclusive-cycle',number:'793',kind:'inclusive-cycle',name:'みんなの掲示板を作る',tag:'参加型設計と評価',title:'旅人と掲示板を育てよう',story:'ギルドの依頼掲示板を作り直します。異なる方法で利用する旅人と、設計から改善まで一緒に進めましょう。'};
export const inclusiveSteps=[
 {title:'設計を始める',prompt:'掲示板を作る前に、まず何をしますか。',choices:[['invite','障害のある人を含む多様な旅人を招き、使い方や困りごとを聞く'],['assume','作り手の使い方だけを前提に決める'],['finish','完成まで利用者には見せない']],correct:'invite',feedback:'早い段階で多様な利用者と話し、思い込みを見直します。一人の声を全員の経験と考えてはいけません。'},
 {title:'試作品を作る',prompt:'読み上げやキーボードを使う旅人にも操作を試してもらうには？',choices:[['prototype','操作名とキーボード操作を備えた試作品を用意し、旅人の希望も聞く'],['picture','見た目の絵だけで実際の操作を省く'],['color','色の違いだけで操作を伝える']],correct:'prototype',feedback:'操作可能な試作品で実際の経路を試します。旅人によって使う技術や希望は異なります。'},
 {title:'試して改善する',prompt:'一人の旅人が確認操作にたどり着けないと分かりました。次に何をしますか。',choices:[['iterate','本人と障壁を確認し、修正して再び試してもらう'],['ignore','別の旅人が操作できたので報告を退ける'],['generalize','一人の経験だけで全員の利用方法を決める']],correct:'iterate',feedback:'困りごとを確認し、変更を試して改善を重ねます。異なる経験を持つ人の意見も集めます。'},
 {title:'評価を重ねる',prompt:'試作品を使えた人がいました。公開前の評価はどうしますか。',choices:[['combine','多様な人との評価を続け、適用する標準にも照らして検証する'],['pass','一人が使えたので規格に適合したと宣言する'],['standard','標準を見れば人との評価は不要とする']],correct:'combine',feedback:'利用者との評価と標準に照らした検証は補い合います。どちらか片方だけで全てを保証できません。'}
];
export function cycleCreate(){return {roi:roiCreate(),history:[],prototype:{keyboard:{fixed:false,seen:false,result:null},name:{fixed:false,seen:false,result:null}}};}
export function cycleStep(q,choice){const step=inclusiveSteps[q.history.length];if(!step||!step.choices.some(([id])=>id===choice))throw new RangeError('選択肢が不正です');if(choice!==step.correct)return false;q.history.push(choice);return true;}
// These are two deliberately limited observations, not a browser or assistive technology simulation.
export function cyclePrototypeStep(q,kind,action){
 if(q.history.length!==inclusiveSteps.length||!Object.hasOwn(q.prototype,kind))throw new RangeError('まだ調べられません');
 const item=q.prototype[kind];
 if(action==='test'){item.result=item.fixed?'pass':'fail';if(!item.fixed)item.seen=true;return;}
 if(action==='fix'&&item.seen&&!item.fixed){item.fixed=true;item.result=null;return;}
 throw new RangeError('まず旅人の操作を確認しましょう');
}
export function cycleComplete(q){return q.history.length===inclusiveSteps.length&&Object.values(q.prototype).every(item=>item.seen&&item.fixed&&item.result==='pass');}
export function cycleRestore(q){
 if(!q||!Array.isArray(q.history)||q.history.length>inclusiveSteps.length)throw new RangeError('記録が不正です');
 const n=cycleCreate();n.roi=q.roi===undefined?roiCreate():roiRestore(q.roi);for(const c of q.history)if(!cycleStep(n,c))throw new RangeError('記録が不正です');
 // Drafts created before the prototype activity still retain their completed choices.
 if(q.prototype===undefined)return n;
 for(const kind of ['keyboard','name']){
  const item=q.prototype?.[kind];
  if(!item||typeof item.fixed!=='boolean'||typeof item.seen!=='boolean'||![null,'pass','fail'].includes(item.result)||
   (item.fixed&&!item.seen)||(item.result==='pass'&&!item.fixed)||(item.result==='fail'&&(item.fixed||!item.seen))||
   (q.history.length<inclusiveSteps.length&&(item.fixed||item.seen||item.result!==null)))throw new RangeError('記録が不正です');
  n.prototype[kind]={fixed:item.fixed,seen:item.seen,result:item.result};
 }
 return n;
}
