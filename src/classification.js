export const classificationLevel={
  id:'crystal-neighbors',number:'17',kind:'classification',name:'水晶の鑑定',tag:'最近傍による分類',
  title:'似ている水晶を探せ',
  story:'鑑定士が新しい水晶の種類を推測したいそうです。種類がわかっている水晶の記録と、二つの特徴を比べましょう。',
};

export const examples=[
  {id:'A',brightness:1,warmth:1,label:'青の水晶'},
  {id:'B',brightness:4,warmth:1,label:'赤の水晶'},
  {id:'C',brightness:3,warmth:4,label:'青の水晶'},
];
export const unknowns=[
  {id:'X',brightness:2,warmth:1},
  {id:'Y',brightness:4,warmth:2},
];

export function distance(a,b) {
  return Math.abs(a.brightness-b.brightness)+Math.abs(a.warmth-b.warmth);
}

export function compareExamples(target,points=examples) {
  const compared=points.map(point=>({...point,distance:distance(target,point)}));
  const minimum=Math.min(...compared.map(point=>point.distance));
  return compared.map(point=>({...point,nearest:point.distance===minimum}));
}

export function chooseExample(target,id) {
  const compared=compareExamples(target);
  const chosen=compared.find(point=>point.id===id);
  if(!chosen) throw new RangeError('未知の水晶です。');
  return {chosen,compared,correct:chosen.nearest};
}
