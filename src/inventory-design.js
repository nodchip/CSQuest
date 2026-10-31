export const designLevel={id:'village-inventory-design',number:'228',kind:'inventory-design',name:'薬草の番号帳',tag:'API とデータ構造の設計',title:'増える薬草を記録しよう',story:'薬草の種類が増え、番号15の薬草も扱うことになりました。倉庫の番号帳を選び、登録と照会を試しましょう。'};
export const designModes={slots:'番号０〜９の固定棚',records:'番号と在庫の記録表'};
export const designActions={add:'２個で新規登録',read:'在庫を読む',withdraw:'１個取り出す'};
export const designKeys=[2,7,15];
export function createDesign(mode='slots'){if(!Object.hasOwn(designModes,mode))throw new RangeError('記録方式が不正です。');return {mode,records:{2:3},observed:{duplicate:false,missing:false,read15:false},history:[],message:'番号と操作を選びましょう。'};}
export function stepDesign(s,action,key){if(!Object.hasOwn(designActions,action)||!designKeys.includes(key)||!Object.hasOwn(designModes,s.mode)||s.history.length>=30)throw new RangeError('操作が不正です。');const n={...s,records:{...s.records},observed:{...s.observed},history:[...s.history,[action,key]]};const present=Object.hasOwn(n.records,key);
 if(s.mode==='slots'&&key>9){n.message=`番号${key}の棚はありません。`;return n;}
 if(action==='add'){if(present){if(key===2)n.observed.duplicate=true;n.message=`番号${key}は登録済みです。在庫は変わりません。`;}else{n.records[key]=2;n.message=`番号${key}を２個で登録しました。`;}}
 else if(action==='read'){if(!present){if(key===7)n.observed.missing=true;n.message=`番号${key}は未登録です。`;}else{if(key===15&&n.records[key]===1)n.observed.read15=true;n.message=`番号${key}の在庫は${n.records[key]}個です。`;}}
 else if(!present)n.message=`番号${key}は未登録のため取り出せません。`;else if(n.records[key]<1)n.message=`番号${key}は在庫不足です。`;else{n.records[key]--;if(key===15)n.observed.read15=false;n.message=`番号${key}を１個取り出しました。`;}
 return n;}
export function designComplete(s){return s.records[2]===3&&!Object.hasOwn(s.records,7)&&s.records[15]===1&&s.observed.duplicate&&s.observed.missing&&s.observed.read15;}
export function restoreDesign(saved){if(!saved||!Object.hasOwn(designModes,saved.mode)||!Array.isArray(saved.history)||saved.history.length>30)throw new RangeError('途中記録が不正です。');let s=createDesign(saved.mode);for(const item of saved.history){if(!Array.isArray(item)||item.length!==2)throw new RangeError('途中記録が不正です。');s=stepDesign(s,...item);}return s;}
