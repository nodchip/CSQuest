export const dataScaleLevel={id:'village-data-scale-cases',number:'1031',kind:'data-scale-cases',name:'大きな台帳のその先',tag:'大規模データと社会的影響',title:'集めた記録の行方を調べる',story:'薬師の村に三つの実際の記録が届きました。集められた情報が、誰にどんな影響をもたらしたか調べましょう。'};
export const scaleMechanisms={link:'公開された別の記録との照合',friends:'利用者の友人の情報も取得',proxy:'必要な支援の代わりに支出を予測'};
export const scaleMeasures={link:'公開前に外部情報との照合可能性を評価する',friends:'誰の情報を誰が取得・利用するかを見直す',proxy:'目的に対する代理指標と集団別の結果を検証する'};
export const scaleCases={
 film:{name:'映画評価の公開',fact:'Netflix Prize の評価データには約50万人の記録が含まれました。研究者は、名前を除いた記録の一部を公開された映画評価と結び付けられることを示しました。',mechanism:'link',measure:'link',effect:'照合できた記録から、本人が公開を意図しなかった他の評価が分かる可能性があります。すべての人が特定されたという意味ではありません。',source:'https://arxiv.org/abs/cs/0610105'},
 social:{name:'友人の情報と政治目的',fact:'米 FTC の2019年の説明によると、アプリは利用者だけでなく、アプリに接していない友人約5000万〜6500万人の情報も集めました。Cambridge Analytica は政治的な対象選定などを目的としていました。',mechanism:'friends',measure:'friends',effect:'FTC は情報の扱いについての説明が虚偽・誤解を招くと判断し、取得した情報などの削除を命じました。ここで示すのは米国 FTC の事例です。',source:'https://www.ftc.gov/business-guidance/blog/2019/12/commission-issues-opinion-cambridge-analytica-case'},
 health:{name:'医療費を使う支援予測',fact:'2019年の研究は、医療支援の対象を探す予測で、健康状態そのものではなく将来の医療費を予測する代理指標を調べました。',mechanism:'proxy',measure:'proxy',effect:'研究では同じ予測スコアでも黒人患者のほうが白人患者より病状が重く、費用を健康の代理とする選択に伴う偏りが報告されました。',source:'https://pubmed.ncbi.nlm.nih.gov/31649194/'}
};
export function dataScaleCreate(){return {case:'film',mechanism:null,measure:null,seen:[],reflection:null};}
export function dataScaleCheck(q){const c=scaleCases[q.case];if(!c||!Object.hasOwn(scaleMechanisms,q.mechanism)||!Object.hasOwn(scaleMeasures,q.measure))throw new RangeError('２つの選択が必要です。');const ok=q.mechanism===c.mechanism&&q.measure===c.measure;if(ok&&!q.seen.includes(q.case))q.seen.push(q.case);return {ok,effect:c.effect};}
export function dataScaleComplete(q){return Object.keys(scaleCases).every(k=>q.seen.includes(k))&&q.reflection==='context';}
export function dataScaleRestore(q){if(!q||!Object.hasOwn(scaleCases,q.case)||!(q.mechanism===null||Object.hasOwn(scaleMechanisms,q.mechanism))||!(q.measure===null||Object.hasOwn(scaleMeasures,q.measure))||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!Object.hasOwn(scaleCases,k))||![null,'context','names','size'].includes(q.reflection))throw new RangeError('途中記録が不正です。');return {...q,seen:[...q.seen]};}
