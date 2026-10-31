export const catalogLevel = {
  id:'herb-catalog', number:'12', kind:'catalog', name:'薬師の台帳', tag:'データの絞り込み',
  title:'必要な薬草を探せ',
  story:'東の村の薬師から、東で採れた在庫のある薬草を探してほしいと頼まれました。台帳から条件に合う記録を探しましょう。',
};

export const filters = {
  herb: '種類が薬草', east: '産地が東', available: '在庫がある',
};

export const ledgers = [
  { name:'春の台帳', rows:[
    {id:'A',name:'白葉草',kind:'薬草',region:'東',stock:'あり'},
    {id:'B',name:'青葉草',kind:'薬草',region:'西',stock:'あり'},
    {id:'C',name:'月見草',kind:'薬草',region:'東',stock:'なし'},
    {id:'D',name:'星草',kind:'薬草',region:'東',stock:'あり'},
    {id:'E',name:'赤きのこ',kind:'きのこ',region:'東',stock:'あり'},
  ], expected:['A','D'] },
  { name:'秋の台帳', rows:[
    {id:'F',name:'霧草',kind:'薬草',region:'東',stock:'あり'},
    {id:'G',name:'金きのこ',kind:'きのこ',region:'東',stock:'あり'},
    {id:'H',name:'風草',kind:'薬草',region:'西',stock:'あり'},
    {id:'I',name:'雨草',kind:'薬草',region:'東',stock:'なし'},
  ], expected:['F'] },
];

export function queryRows(rows, selected) {
  return rows.filter(row => (!selected.herb || row.kind==='薬草') && (!selected.east || row.region==='東') && (!selected.available || row.stock==='あり'));
}

export function evaluateQuery(selected) {
  return ledgers.map(ledger=>{
    const rows=queryRows(ledger.rows,selected);
    const ids=rows.map(row=>row.id);
    return {name:ledger.name,rows,correct:ids.length===ledger.expected.length && ids.every((id,index)=>id===ledger.expected[index])};
  });
}
