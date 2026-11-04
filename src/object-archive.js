export const archiveObjects=['north/map.png','north/report.txt','northwest/map.png','south/map.png'];
export const archiveCases={
  north:{question:'接頭辞 north/ で探すと、どの鍵が見つかるでしょう？',answer:'two',explanation:'north/ で始まる２件です。northwest/ は途中の文字が違うため含みません。'},
  identity:{question:'同じ保管庫にある north/map.png と south/map.png は同じ鍵でしょうか？',answer:'different',explanation:'鍵は接頭辞を含む文字列全体です。同じ末尾でも鍵は異なります。'}
};
export function archiveMatches(prefix){return archiveObjects.filter(key=>key.startsWith(prefix));}
export function createArchiveAnswers(){return Object.fromEntries(Object.keys(archiveCases).map(id=>[id,{choice:null,checked:false}]));}
export function restoreArchiveAnswers(saved){
 if(saved===undefined)return createArchiveAnswers();
 if(!saved||typeof saved!=='object')throw new RangeError('保管庫の記録が不正です。');
 const s=createArchiveAnswers();
 for(const id of Object.keys(s)){const a=saved[id],allowed=id==='north'?['one','two','three']:['same','different'];if(!a||!(a.choice===null||allowed.includes(a.choice))||typeof a.checked!=='boolean'||(a.checked&&a.choice===null))throw new RangeError('保管庫の記録が不正です。');s[id]={choice:a.choice,checked:a.checked};}
 return s;
}
