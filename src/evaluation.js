import {examples,compareExamples} from './classification.js';

export const evaluationLevel={
  id:'crystal-evaluation',number:'18',kind:'evaluation',name:'鑑定の確かめ',tag:'学習の評価',
  title:'予測を確かめる',
  story:'鑑定士は、似た水晶から種類を推測する方法がどれほど当たるのか知りたがっています。既知の記録と別に取っておいた記録で確かめましょう。',
};

// These labels are fictional and intentionally contain one held-out mismatch.
export const heldOut=[
  {id:'X',brightness:2,warmth:1,label:'青の水晶'},
  {id:'Y',brightness:4,warmth:2,label:'赤の水晶'},
  {id:'Z',brightness:4,warmth:4,label:'赤の水晶'},
];

export function evaluateRows(rows,training=examples) {
  if(!training.length) throw new RangeError('既知の記録が必要です。');
  const results=rows.map(row=>{
    const nearest=compareExamples(row,training).filter(item=>item.nearest);
    if(nearest.length!==1) throw new RangeError('この例では最近傍の同距離は扱いません。');
    const predicted=nearest[0].label;
    return {id:row.id,actual:row.label,predicted,neighbor:nearest[0].id,correct:predicted===row.label};
  });
  return {rows:results,correct:results.filter(row=>row.correct).length,total:results.length};
}

export function evaluateSet(kind) {
  if(kind==='known') return evaluateRows(examples);
  if(kind==='heldout') return evaluateRows(heldOut);
  throw new RangeError('未知の記録の集合です。');
}
