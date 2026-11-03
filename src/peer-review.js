export const peerReviewLevel={id:'guild-peer-review',number:'1066',kind:'peer-review',name:'仲間と直す薬草の台帳',tag:'コードレビューと再試験',title:'変更を調べ、仲間に伝える',story:'村の薬草台帳に三つの変更が届きました。提案した仲間と協力し、仕様に反する条件を探して直しましょう。'};
export const reviewCases=[
 {name:'袋の上限',requirement:'空きがあるときだけ１個追加します。上限は５個です。',lines:['１．袋の個数を調べる','２．個数が５を超えていたら追加を断る','３．それ以外は１個追加する'],issue:'満杯でも追加でき、上限を超えてしまいます。',other:'空きがある袋でも必ず追加を断ります。',normal:'４個の袋に１個追加',edge:'５個の袋に１個追加',expected:['５個','追加せず５個'],draft:['５個','６個'],fixed:['５個','追加せず５個']},
 {name:'記録を見る権限',requirement:'有効な利用者で、所有者または受付係の場合だけ閲覧できます。',lines:['１．役割と有効状態を調べる','２．所有者、または「受付係かつ有効」なら閲覧を許す','３．それ以外は閲覧を断る'],issue:'無効な所有者でも閲覧できてしまいます。',other:'有効な受付係も必ず閲覧を断られます。',normal:'有効な受付係が閲覧',edge:'無効な所有者が閲覧',expected:['許可','拒否'],draft:['許可','許可'],fixed:['許可','拒否']},
 {name:'配達の失敗',requirement:'配達の確認が成功したときだけ在庫を１個減らします。失敗時は５個のままです。',lines:['１．在庫を１個減らす','２．配達の確認を行う','３．結果を表示する'],issue:'配達が失敗しても在庫が減ってしまいます。',other:'確認が成功したときも在庫が減りません。',normal:'在庫５個で配達成功',edge:'在庫５個で配達失敗',expected:['４個','５個'],draft:['４個','４個'],fixed:['４個','５個']}
];
export function reviewCreate(){return {current:0,cases:reviewCases.map(()=>({draft:[],line:null,comment:null,accepted:false,fixed:[]})),reflection:null};}
export function reviewRun(index,version,test){if(!Number.isInteger(index)||index<0||index>=reviewCases.length||!['draft','fixed'].includes(version)||!['normal','edge'].includes(test))throw new RangeError('試験条件が不正です。');const c=reviewCases[index],i=test==='normal'?0:1;return {actual:c[version][i],expected:c.expected[i],pass:c[version][i]===c.expected[i]};}
export function reviewCommentValid(index,line,comment){return line===(index===2?0:1)&&comment==='issue';}
export function reviewReady(c){return c.draft.includes('normal')&&c.draft.includes('edge')&&c.accepted&&c.fixed.includes('edge')&&c.fixed.includes('normal');}
export function reviewDone(q){return q.cases.every(reviewReady)&&q.reflection==='limits';}
export function reviewRestore(q){
 if(!q||!Number.isInteger(q.current)||q.current<0||q.current>=reviewCases.length||!Array.isArray(q.cases)||q.cases.length!==reviewCases.length||![null,'limits','guarantee'].includes(q.reflection))throw new RangeError('記録が不正です。');
 const cases=q.cases.map((c,i)=>{if(!c||!Array.isArray(c.draft)||!Array.isArray(c.fixed)||c.draft.length>2||c.fixed.length>2||new Set(c.draft).size!==c.draft.length||new Set(c.fixed).size!==c.fixed.length||[...c.draft,...c.fixed].some(x=>!['normal','edge'].includes(x))||![null,0,1,2].includes(c.line)||![null,'issue','other'].includes(c.comment)||typeof c.accepted!=='boolean'||(c.accepted&&(!c.draft.includes('normal')||!c.draft.includes('edge')||!reviewCommentValid(i,c.line,c.comment)))||(!c.accepted&&c.fixed.length))throw new RangeError('レビュー記録が不正です。');return {...c,draft:[...c.draft],fixed:[...c.fixed]};});
 return {current:q.current,cases,reflection:q.reflection};
}
