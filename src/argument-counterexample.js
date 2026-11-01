export const argumentLabLevel={id:'guild-argument-counterexample',number:'499',kind:'argument-counterexample',name:'承認の札と四つの可能性',tag:'前提・結論と反例',title:'議論が成り立つか調べよう',story:'ギルドの展示を承認する理由について、三つの議論が届きました。前提と結論を分け、結論が必ず導かれるか調べましょう。'};
export const argumentCases={
 affirm:{name:'承認されたから検査済み？',second:'展示は承認された',conclusion:'検査は終わった',kind:'affirm'},
 modus:{name:'検査済みなら承認？',second:'検査は終わった',conclusion:'展示は承認された',kind:'modus'},
 deny:{name:'未検査なら未承認？',second:'検査は終わっていない',conclusion:'展示は承認されていない',kind:'deny'}
};
export function argumentValue(id,p,q){if(!Object.hasOwn(argumentCases,id)||typeof p!=='boolean'||typeof q!=='boolean')throw new RangeError('議論または条件が不正です。');const conditional=!p||q;const second=id==='affirm'?q:id==='modus'?p:!p;const conclusion=id==='affirm'?p:id==='modus'?q:!q;return {conditional,second,conclusion,counterexample:conditional&&second&&!conclusion};}
export function argumentHasCounterexample(id){return [false,true].some(p=>[false,true].some(q=>argumentValue(id,p,q).counterexample));}
export function createArgumentLab(){return {selected:'affirm',p:false,q:false,trials:Object.fromEntries(Object.keys(argumentCases).map(id=>[id,{visited:0,choice:null,checked:false}])),answer:null,checked:false};}
export function argumentTrialComplete(id,t){return t.visited===15&&t.checked&&t.choice===(argumentHasCounterexample(id)?'exists':'none');}
export function argumentLabComplete(s){return Object.keys(argumentCases).every(id=>argumentTrialComplete(id,s.trials[id]))&&s.answer==='validity'&&s.checked;}
export function restoreArgumentLab(s){if(!s||!Object.hasOwn(argumentCases,s.selected)||typeof s.p!=='boolean'||typeof s.q!=='boolean'||!s.trials||![null,'validity','false','ethical'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');const n=createArgumentLab();n.selected=s.selected;n.p=s.p;n.q=s.q;n.answer=s.answer;n.checked=s.checked;for(const id of Object.keys(argumentCases)){const t=s.trials[id];if(!t||!Number.isInteger(t.visited)||t.visited<0||t.visited>15||![null,'exists','none'].includes(t.choice)||typeof t.checked!=='boolean')throw new RangeError('途中記録が不正です。');n.trials[id]={visited:t.visited,choice:t.choice,checked:t.checked};}return n;}
