export const bridgeTeamLevel={id:'village-bridge-team',number:'650',kind:'bridge-team',name:'橋を直す話し合い',tag:'チームの対立・参加・役割',title:'皆の道を守る修理計画',story:'村の橋に修理が必要です。橋の安全を守りつつ、薬の配達と通行を続けられるよう、関係者の話を聞いて計画を整えましょう。'};
export const bridgeAgenda={hear:'関係者の事情を聞く',constraints:'安全と時間の制約を整理する',options:'代替案を比べる',roles:'担当と次の確認を決める'};
export const bridgeAgendaOrder=['hear','constraints','options','roles'];
export const bridgePeople={
 engineer:{name:'ラウル（橋の技師）',message:'橋は安全上、修理中の３時間は通れません。作業員は９〜16時に働けます。安全確認は私が担当できます。'},
 courier:{name:'ミラ（薬の伝令）',message:'薬の荷車は10時に橋を渡る必要があります。代替の小舟には荷車を載せられません。通行の案内は私が担当できます。'},
 resident:{name:'ナギ（通行者）',message:'私は車いすで13時に渡る必要があります。昇降機付きの小舟が使えれば試したいです。予約と訓練済みの係を確認してください。私の経験が全員の事情を代表するとは限りません。'}
};
export const bridgeRoles={engineer:'橋の技師ラウル',courier:'伝令ミラ',operator:'小舟の訓練済み係',resident:'通行者ナギ'};
export const meetingCases={onsite:{name:'対面',story:'集会所の入口には階段しかなく、参加したいナギは車いすを使っています。',help:'本人と相談し、車いすで入れる場所を選ぶ',why:'参加する場所へのアクセスを確認します。'},distributed:{name:'分散',story:'伝令は遠方にいて、提案された会議は現地の深夜です。',help:'時間を相談し、後から読める議事を用意する',why:'時差や同時参加できない事情を考えます。'},hybrid:{name:'対面と遠隔の混合',story:'集会所の人だけが紙の図を見て話し、遠隔の技師には図が伝わりません。',help:'図を共有し、遠隔の技師にも確認と発言の機会を設ける',why:'会場と遠隔で見聞きできる情報の差を減らします。'},virtual:{name:'仮想空間',story:'身振りだけで意思表示する会議では、操作できない人の発言が伝わりません。',help:'本人と相談し、文字や音声など別の意思表示も用意する',why:'同じ表現方法を全員が使えると決めつけません。'}};
export function createMeetingReview(){return {selected:'onsite',answers:{onsite:null,distributed:null,hybrid:null,virtual:null}};}
export function restoreMeetingReview(saved){if(saved===undefined)return createMeetingReview();if(!saved||!Object.hasOwn(meetingCases,saved.selected)||!saved.answers)throw new RangeError('会議の記録が不正です');const result=createMeetingReview();result.selected=saved.selected;for(const k of Object.keys(meetingCases)){if(![null,'adapt','ignore'].includes(saved.answers[k]))throw new RangeError('会議の記録が不正です');result.answers[k]=saved.answers[k];}return result;}
export function createBridgeTeam(){return {agenda:[],heard:[],schedule:null,alternative:null,roles:{safety:null,notice:null,ferry:null},checked:false,meeting:createMeetingReview()};}
export function bridgeTeamReview(s){
 const issues=[];
 if(JSON.stringify(s.agenda)!==JSON.stringify(bridgeAgendaOrder))issues.push('agenda');
 if(!Object.keys(bridgePeople).every(k=>s.heard.includes(k)))issues.push('heard');
 if(!['early','late'].includes(s.schedule))issues.push('schedule');
 if(!['none','boat'].includes(s.alternative))issues.push('alternative');
 if(s.schedule==='early')issues.push('courier');
 if(s.schedule==='late'&&s.alternative==='none')issues.push('resident');
 if(s.roles.safety!=='engineer')issues.push('safety');
 if(s.roles.notice!=='courier')issues.push('notice');
 if(s.alternative==='boat'&&s.roles.ferry!=='operator')issues.push('ferry');
 return {issues,ready:issues.length===0};
}
export function bridgeTeamComplete(s){return s.checked&&bridgeTeamReview(s).ready;}
export function restoreBridgeTeam(s){
 const unique=(a,keys)=>Array.isArray(a)&&new Set(a).size===a.length&&a.every(k=>keys.includes(k));
 if(!s||!unique(s.agenda,Object.keys(bridgeAgenda))||!unique(s.heard,Object.keys(bridgePeople))||![null,'early','late'].includes(s.schedule)||![null,'none','boat'].includes(s.alternative)||!s.roles||!['safety','notice','ferry'].every(k=>[null,...Object.keys(bridgeRoles)].includes(s.roles[k]))||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');
 return {...s,agenda:[...s.agenda],heard:[...s.heard],roles:{...s.roles},meeting:restoreMeetingReview(s.meeting)};
}
