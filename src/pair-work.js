import {reviewCases,reviewRun} from './peer-review.js';
export const pairWorkLevel={id:'guild-pair-work',number:'1111',kind:'pair-work',name:'仲間と交代する工房',tag:'ペア作業と群作業',title:'一つの台帳を仲間と直す',story:'ギルドの仲間が一つの台帳の変更に集まりました。操作役と確認役を交代しながら、問題を探して直しましょう。'};
export const pairModes={pair:{name:'二人組',members:['ノノ','ミラ'],cases:[0,1]},group:{name:'三人組',members:['ノノ','ミラ','ルカ'],cases:[0,1,2]}};
export const pairActions={normal:'通常の条件を試す',edge:'問題が現れる条件を試す',listen:'仲間の意見を聞く',dismiss:'修正せず進もうとする',repair:'指摘に沿って修正する',rotate:'操作役を交代する'};
export function pairReplay(mode,history){
 if(!Object.hasOwn(pairModes,mode)||!Array.isArray(history)||history.length>40)throw new RangeError('作業記録が不正です。');const m=pairModes[mode],s={round:0,draft:[],fixed:[],heard:0,repaired:false,done:false,last:''};
 for(const a of history){if(!Object.hasOwn(pairActions,a)||s.done)throw new RangeError('操作が不正です。');const i=m.cases[s.round],c=reviewCases[i];if(a==='normal'||a==='edge'){const version=s.repaired?'fixed':'draft',list=s.repaired?s.fixed:s.draft;if(list.includes(a))throw new RangeError('その条件は確認済みです。');list.push(a);const r=reviewRun(i,version,a);s.last=`期待：${r.expected}。結果：${r.actual}。${r.pass?'一致します。':'約束と違います。'}`;}
 else if(a==='listen'){if(s.repaired||s.draft.length!==2||s.heard>=m.members.length-1)throw new RangeError('まず修正前の２条件を試し、まだ聞いていない仲間を確認しましょう。');s.heard++;const speaker=m.members.filter((_,n)=>n!==s.round)[s.heard-1];s.last=s.heard===1?`${speaker}：${c.issue}`:`${speaker}：修正後も通常の条件を確かめましょう。`;}
 else if(a==='dismiss'){if(s.repaired||s.draft.length!==2||s.heard!==m.members.length-1)throw new RangeError('まず２条件と仲間の意見を確認しましょう。');s.last='問題が残ったままです。修正して再試験しましょう。';}
 else if(a==='repair'){if(s.repaired||s.draft.length!==2||s.heard!==m.members.length-1)throw new RangeError('まず２条件と仲間の意見を確認しましょう。');s.repaired=true;s.last='操作役が修正しました。２条件をもう一度試します。';}
 else if(a==='rotate'){if(!s.repaired||s.fixed.length!==2)throw new RangeError('修正後の２条件を試してから交代しましょう。');if(s.round===m.cases.length-1){s.done=true;s.last='この人数での作業を終えました。';}else{s.round++;s.draft=[];s.fixed=[];s.heard=0;s.repaired=false;s.last='操作役を交代しました。';}}}
 return s;
}
export function pairCreate(){return {mode:'pair',runs:{pair:[],group:[]},benefit:null,risk:null,checked:false};}
export function pairAct(q,a){const h=[...q.runs[q.mode],a],s=pairReplay(q.mode,h);q.runs[q.mode]=h;return s;}
export function pairDone(q){return Object.keys(pairModes).every(k=>pairReplay(k,q.runs[k]).done)&&q.benefit==='sharing'&&q.risk==='participation'&&q.checked;}
export function pairRestore(q){if(!q||!Object.hasOwn(pairModes,q.mode)||!q.runs||![null,'sharing','guarantee'].includes(q.benefit)||![null,'participation','none'].includes(q.risk)||typeof q.checked!=='boolean')throw new RangeError('途中記録が不正です。');const runs={};for(const k of Object.keys(pairModes)){pairReplay(k,q.runs[k]);runs[k]=[...q.runs[k]];}return {mode:q.mode,runs,benefit:q.benefit,risk:q.risk,checked:q.checked};}
