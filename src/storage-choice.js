// These are capabilities of the two fictional systems in this exercise, not categories of databases.
export const storageChoiceCases={
  lookup:{name:'旅人のしるしを鍵で探す',need:'鍵が分かる１件を読み書きできればよく、表を結び付けた集計や複数記録の同時更新は必要ありません。',answer:'key',explanation:'この箱は鍵を使った１件の読み書きを備え、依頼の条件を満たします。表の結合や複数記録の取引を持たない前提にも合います。'},
  orders:{name:'薬草の注文と残りを同時に記録',need:'注文と在庫を別の記録で管理し、２つを一緒に確定します。村ごとに注文と薬草名を結び付けて集計します。',answer:'relational',explanation:'この台帳は複数記録の取引と表の結合を備えます。鍵の箱だけでは、この前提の下で必要な機能が足りません。'}
};
export function createStorageChoices(){return Object.fromEntries(Object.keys(storageChoiceCases).map(id=>[id,{choice:null,checked:false}]));}
export function restoreStorageChoices(saved){
  if(saved===undefined)return createStorageChoices();
  if(!saved||typeof saved!=='object')throw new RangeError('保存方法の記録が不正です。');
  const s=createStorageChoices();
  for(const id of Object.keys(s)){const a=saved[id];if(!a||![null,'key','relational'].includes(a.choice)||typeof a.checked!=='boolean'||(a.checked&&a.choice===null))throw new RangeError('保存方法の記録が不正です。');s[id]={choice:a.choice,checked:a.checked};}
  return s;
}
