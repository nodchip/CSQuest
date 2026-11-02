export const wannacryLevel={id:'castle-wannacry-evidence',number:'986',kind:'wannacry-evidence',name:'診療を止めた暗号の記録',tag:'実例・セキュリティと社会への影響',title:'報告書の根拠を確かめよう',story:'王城の記録係が、2017年に英国の医療サービスを混乱させた WannaCry の公的報告を調べています。影響と、報告だけでは分からないことを区別しましょう。'};
export const wannacryEvidence={
 scope:{name:'影響を受けた組織',text:'英国会計検査院（NAO）の報告書本文には、イングランドの236トラストのうち少なくとも80が影響を受けたとある。５月12日には当初37トラストが感染したとされたが、そのうち３つは後に感染ではなく業務への影響と分類し直された。NAO の紹介ページには少なくとも81と記されている。影響の全体像は分かっていない。'},
 care:{name:'予約と診療',text:'５月12〜18日の情報収集では6,912件の予約取消しが確認され、全体は約19,494件と推計された。調査対象に全種類の予約は含まれず、実数は特定されていない。５地域では救急患者の搬送先変更もあった。'},
 data:{name:'患者情報について',text:'報告書は、NHS Digital が患者データの侵害・盗難はなかったと考えていると記す。報告書中のこの記述は、あらゆる可能性を独立に証明した結果として書かれていない。'},
 planning:{name:'事前の備えと連絡',text:'事前に更新を促す警告と対応計画はあったが、地域レベルで計画を試していなかった。報告書は対応時の指揮や連絡に混乱があったことも記している。'}
};
export const wannacryQuestions={
 scope:{name:'組織への影響',prompt:'報告書本文の数と、その限界について言えることは？',evidence:'scope',answer:'minimum',choices:{minimum:'本文では少なくとも80トラストに影響があったが、全体像は分かっていない。',all:'236トラストすべてが感染したと確定している。',infected:'影響を受けた80トラストはすべて感染したと、この数だけで断定できる。'}},
 care:{name:'診療への影響',prompt:'予約の取消しについて、確認数と推計をどう扱う？',evidence:'care',answer:'estimate',choices:{estimate:'6,912件は確認された数で、約19,494件は全体の推計である。',exact:'6,912件が全種類を含む確定した総数である。',none:'報告書は診療や予約への影響を示していない。'}},
 data:{name:'患者情報',prompt:'患者情報について、報告書の記述から言えることは？',evidence:'data',answer:'belief',choices:{belief:'NHS Digital は侵害・盗難はなかったと考えていたが、この記述だけで全可能性を証明したとは言えない。',proof:'報告書は、すべての患者情報が絶対に侵害されていないと証明した。',stolen:'報告書は、すべての患者情報が盗まれたと確定した。'}},
 planning:{name:'対応の備え',prompt:'事前計画と訓練についての報告は？',evidence:'planning',answer:'untested',choices:{untested:'計画はあったが地域レベルで試されておらず、対応時に指揮や連絡の混乱があった。',noPlan:'計画は一切存在しなかった。',tested:'すべての地域で計画の訓練を完了していた。'}}
};
export function wannacryCreate(){return {selected:'scope',trials:Object.fromEntries(Object.keys(wannacryQuestions).map(id=>[id,{evidence:null,answer:null,checked:false}])),reflection:null};}
export function wannacryTrialDone(id,t){const q=wannacryQuestions[id];return !!q&&!!t&&t.checked&&t.evidence===q.evidence&&t.answer===q.answer;}
export function wannacryComplete(s){return s.reflection==='uncertainty'&&Object.keys(wannacryQuestions).every(id=>wannacryTrialDone(id,s.trials[id]));}
export function wannacryRestore(saved){if(!saved||!Object.hasOwn(wannacryQuestions,saved.selected)||![null,'uncertainty','exact','single'].includes(saved.reflection))throw new RangeError('途中記録が不正です');const s=wannacryCreate();s.selected=saved.selected;s.reflection=saved.reflection;for(const [id,q] of Object.entries(wannacryQuestions)){const t=saved.trials?.[id];if(!t||!(t.evidence===null||Object.hasOwn(wannacryEvidence,t.evidence))||!(t.answer===null||Object.hasOwn(q.choices,t.answer))||typeof t.checked!=='boolean')throw new RangeError('途中記録が不正です');s.trials[id]={evidence:t.evidence,answer:t.answer,checked:t.checked};}return s;}
