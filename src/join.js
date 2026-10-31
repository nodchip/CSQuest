export const joinLevel = {
  id:'village-join', number:'13', kind:'join', name:'届け先の手がかり', tag:'データの結合',
  title:'二つの台帳をつなぐ',
  story:'薬師の配達先が番号だけで記録されています。村の台帳と照らし合わせ、手紙を届ける場所を見つけましょう。',
};

export const villages = [
  {id:'V1', name:'東の村'}, {id:'V2', name:'西の村'}, {id:'V3', name:'山の村'},
];
export const orders = [
  {id:'O1', item:'白葉草', villageId:'V1'},
  {id:'O2', item:'青葉草', villageId:'V2'},
  {id:'O3', item:'星草', villageId:'V1'},
  {id:'O4', item:'霧草', villageId:'V9'},
];

// Inner equijoin on the village identifier; unmatched orders do not produce rows.
export function joinOrders(orderRows,villageRows) {
  return orderRows.flatMap(order=>villageRows.filter(village=>village.id===order.villageId).map(village=>({orderId:order.id,item:order.item,villageId:village.id,village:village.name})));
}

export function evaluateMatches(selections) {
  return orders.map(order=>{
    const expected=villages.some(village=>village.id===order.villageId)?order.villageId:'none';
    const actual=selections[order.id] || '';
    return {order,expected,actual,correct:actual===expected};
  });
}
