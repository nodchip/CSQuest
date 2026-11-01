export const triadLevel={id:'castle-security-triad',number:'493',kind:'security-triad',name:'三つの守りと城の記録',tag:'機密性・完全性・可用性',title:'何が損なわれたかを見分けよう',story:'王城から四つの報告が届きました。記録の秘密、正しさ、必要な時に使えることを区別し、次に備えましょう。'};
export const triadCases={
 disclosure:{name:'秘密の地図を読まれた',description:'権限のない人が秘密の地図を読みました。地図は変更されず、持ち主は使えました。',mask:1,explanation:'権限のない人への開示は機密性の問題です。'},
 alteration:{name:'台帳を書き換えられた',description:'権限のない人が台帳の数字を変更しました。秘密の情報は含まれず、台帳は読めました。',mask:2,explanation:'許されない変更は完全性の問題です。'},
 outage:{name:'受付が使えない',description:'受付の装置が故障し、村の人が必要な時に依頼を出せませんでした。情報の開示や変更は観測されていません。',mask:4,explanation:'必要な時にサービスを使えないことは可用性の問題です。'},
 both:{name:'秘密の台帳を読まれ変更された',description:'権限のない人が秘密の台帳を読み、数字も変更しました。持ち主は台帳を開けました。',mask:3,explanation:'秘密の開示と許されない変更が同時に起き、機密性と完全性の両方に関わります。'}
};
export const triadImpacts={1:'機密性：許されていない開示を防ぐ',2:'完全性：許されていない変更などを防ぐ',4:'可用性：必要な時に利用できる'};
export const triadControls={1:'本人確認と権限の確認で、許可のない読取りを拒否する',2:'保護された印を照合し、不正な変更を検出する',4:'独立した予備の受付に切り替え、故障時も利用できるようにする'};
export function createTriad(){return {selected:'disclosure',trials:Object.fromEntries(Object.keys(triadCases).map(id=>[id,{impact:0,controls:0,checked:false}])),answer:null,checked:false};}
export function triadTrialComplete(id,t){return Object.hasOwn(triadCases,id)&&t.checked&&t.impact===triadCases[id].mask&&t.controls===triadCases[id].mask;}
export function triadComplete(s){return Object.keys(triadCases).every(id=>triadTrialComplete(id,s.trials[id]))&&s.answer==='distinct'&&s.checked;}
export function restoreTriad(s){if(!s||!Object.hasOwn(triadCases,s.selected)||!s.trials||![null,'distinct','same','guarantee'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');const n=createTriad();n.selected=s.selected;n.answer=s.answer;n.checked=s.checked;for(const id of Object.keys(triadCases)){const t=s.trials[id];if(!t||!Number.isInteger(t.impact)||t.impact<0||t.impact>7||!Number.isInteger(t.controls)||t.controls<0||t.controls>7||typeof t.checked!=='boolean')throw new RangeError('途中記録が不正です。');n.trials[id]={impact:t.impact,controls:t.controls,checked:t.checked};}return n;}
