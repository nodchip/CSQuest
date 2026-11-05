export const ethicsActions={prepare:'目的・参加・記録・保護策を計画する',submit:'担当窓口に計画を提出する',revise:'求められた修正を反映し再提出する',notice:'審査結果を確認する',start:'参加者への募集を始める'};
export const ethicsStages=[
 {expected:'prepare',text:'研究の目的や参加者への説明、記録と保護の方法を計画します。',why:'窓口が確認できるよう、参加と記録の扱いを計画に含めます。'},
 {expected:'submit',text:'この工房では募集前に担当窓口の確認が必要です。',why:'計画を提出すると、担当窓口が確認します。'},
 {expected:'revise',text:'窓口から「個別記録の公開を取りやめ、アクセス範囲を限定して再提出」と連絡が届きました。',why:'指摘を反映し、修正後の計画を提出します。'},
 {expected:'notice',text:'修正した計画を再提出しました。審査の結果を待っています。',why:'この架空の例では修正後の計画について承認の通知が届きます。'},
 {expected:'start',text:'承認通知を受けました。承認された計画と参加者への説明に沿って募集します。',why:'承認後も説明と同意、承認条件に沿った記録管理が必要です。'}
];
export function ethicsCreate(){return {history:[],message:''};}
export function ethicsStep(s,action){if(!Object.hasOwn(ethicsActions,action))throw new RangeError('操作が不正です');const stage=ethicsStages[s.history.length];if(!stage)return {...s,message:'この例の手順は完了しています。'};if(action!==stage.expected)return {...s,message:'今の段階と窓口からの指示を確認しましょう。'};return {history:[...s.history,action],message:stage.why};}
export function ethicsRestore(s){if(!s||!Array.isArray(s.history)||s.history.length>ethicsStages.length)throw new RangeError('手順の記録が不正です');let result=ethicsCreate();for(const action of s.history){const next=ethicsStep(result,action);if(next.history.length!==result.history.length+1)throw new RangeError('手順の記録が不正です');result=next;}return result;}
