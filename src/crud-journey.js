export const crudActions={create:'作成 Create',read:'取得 Read',update:'更新 Update',delete:'削除 Delete'};
export const crudTasks=[
  {goal:'台帳にない黄の薬草を１個として登録する',action:'create',result:'黄の薬草を１個として登録しました。'},
  {goal:'黄の薬草の数を調べる',action:'read',result:'黄の薬草は１個です。'},
  {goal:'黄の薬草の数を３個に変更する',action:'update',result:'黄の薬草を３個に変更しました。'},
  {goal:'不要になった黄の薬草の記録を削除する',action:'delete',result:'黄の薬草の記録を削除しました。'},
  {goal:'削除後に黄の薬草の記録があるか確かめる',action:'read',result:'黄の薬草の記録は見つかりません。０個の記録とは異なります。'}
];
export function replayCrud(history){
  if(!Array.isArray(history)||history.length>crudTasks.length)throw new RangeError('台帳の履歴が不正です。');
  let value=null;
  const trace=history.map((action,index)=>{
    const task=crudTasks[index];if(action!==task.action)throw new RangeError('台帳の操作順が不正です。');
    if(action==='create')value=1;else if(action==='update')value=3;else if(action==='delete')value=null;
    return {action,result:task.result,value};
  });
  return {value,trace,complete:history.length===crudTasks.length};
}
