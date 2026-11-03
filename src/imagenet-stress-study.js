// Table 1 of D'Amour et al. (JMLR 2022), reported to three decimals.
export const stressStudyLevel={id:'archive-imagenet-stress-study',number:'1065',kind:'imagenet-stress-study',name:'写真を見る水晶の試験記録',tag:'実研究と頑健性',title:'変わった写真でも見分けられるか',story:'形と背景を見比べたあなたに、鑑定士が実際の画像分類研究の記録を託しました。異なる写真条件でモデルの正解率を調べ、次の評価を考えましょう。'};
export const studyModels={resnet:'ResNet-50（50個）',bit:'BiT（30個）'};
export const studyConditions={normal:'元の ImageNet',pixel:'画素化',contrast:'コントラスト低下',motion:'動きによるぼけ',brightness:'明るさ変化',object:'ObjectNet'};
export const studyData={resnet:{normal:[.759,.001],pixel:[.197,.024],contrast:[.091,.008],motion:[.100,.007],brightness:[.607,.003],object:[.259,.002]},bit:{normal:[.862,.001],pixel:[.555,.008],contrast:[.462,.019],motion:[.515,.008],brightness:[.723,.002],object:[.520,.005]}};
export const studyRequired=['resnet:normal','resnet:pixel','resnet:contrast','resnet:object','bit:normal','bit:pixel','bit:contrast','bit:object'];
export function studyCreate(){return {model:'resnet',condition:'normal',seen:[],variation:null,meaning:null,plan:null};}
export function studyDone(q){return studyRequired.every(k=>q.seen.includes(k))&&q.variation==='pixel'&&q.meaning==='variation'&&q.plan==='target';}
export function studyRestore(q){
 if(!q||!Object.hasOwn(studyModels,q.model)||!Object.hasOwn(studyConditions,q.condition)||!Array.isArray(q.seen)||q.seen.length>12||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>typeof k!=='string'||! /^(resnet|bit):(normal|pixel|contrast|motion|brightness|object)$/.test(k))||![null,'pixel','normal'].includes(q.variation)||![null,'variation','interval'].includes(q.meaning)||![null,'target','guaranteed'].includes(q.plan))throw new RangeError('研究記録が不正です。');
 return {...q,seen:[...q.seen]};
}
