import {studyModels,studyData} from './imagenet-stress-study.js';
export const disagreementLevel={id:'archive-model-disagreement',number:'1138',kind:'model-disagreement',name:'鑑定水晶の意見のずれ',tag:'実研究・評価と社会的文脈',title:'水晶の一致を調べよう',story:'村で画像を分類する水晶の採用を検討しています。書庫にある研究の実測を調べ、一致と正しさ、利用前の追加検査を区別しましょう。'};
export const disagreementSets={normal:'元の ImageNet 全体',subset:'ObjectNet と共通する種類の ImageNet 部分集合',object:'ObjectNet'};
// D'Amour et al. (2022), Table 2: mean and standard deviation of pairwise disagreement.
export const disagreementData={resnet:{normal:[.160,.001],subset:[.245,.005],object:[.509,.003]},bit:{normal:[.064,.004],subset:[.094,.006],object:[.253,.012]}};
export {studyModels,studyData};
export function disagreementCreate(){return {model:'resnet',dataset:'normal',seen:[],largest:null,meaning:null,plan:null,checked:false};}
export function disagreementDone(q){return Object.keys(studyModels).every(m=>Object.keys(disagreementSets).every(d=>q.seen.includes(`${m}:${d}`)))&&q.largest==='object'&&q.meaning==='different'&&q.plan==='evaluate'&&q.checked;}
export function disagreementRestore(q){if(!q||!Object.hasOwn(studyModels,q.model)||!Object.hasOwn(disagreementSets,q.dataset)||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!Object.keys(studyModels).some(m=>Object.keys(disagreementSets).some(d=>`${m}:${d}`===k)))||![null,'normal','subset','object'].includes(q.largest)||![null,'different','wrong','proof'].includes(q.meaning)||![null,'evaluate','deploy','guarantee'].includes(q.plan)||typeof q.checked!=='boolean')throw new RangeError('研究の記録が不正です。');return {...q,seen:[...q.seen]};}
