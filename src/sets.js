export const setsLevel={id:'guild-sets',number:'46',kind:'sets',name:'ギルドの仲間を集めよう',tag:'集合と数え方',title:'二つの印と仲間たち',story:'ギルドの７人には薬草の印と魔法の印があります。依頼の条件に合う仲間を選んで、隊を作りましょう。'};
export const members=[
  {id:'A',name:'アオ',herb:true,magic:true},{id:'B',name:'ビオ',herb:true,magic:false},
  {id:'C',name:'クル',herb:true,magic:true},{id:'D',name:'ディ',herb:true,magic:false},
  {id:'E',name:'エル',herb:false,magic:true},{id:'F',name:'フィ',herb:false,magic:true},
  {id:'G',name:'ギル',herb:false,magic:false}
];
export const setCases={
  union:{name:'どちらかの印',description:'薬草の印か魔法の印を少なくとも一つ持つ仲間を選ぶ。'},
  intersection:{name:'両方の印',description:'薬草と魔法の印を両方持つ仲間を選ぶ。'},
  difference:{name:'薬草だけ',description:'薬草の印は持ち、魔法の印は持たない仲間を選ぶ。'},
  complement:{name:'魔法以外',description:'７人の中から、魔法の印を持たない仲間を選ぶ。'}
};
export function setMembers(id){
  if(!Object.hasOwn(setCases,id))throw new RangeError('未知の依頼です。');
  return members.filter(m=>id==='union'?m.herb||m.magic:id==='intersection'?m.herb&&m.magic:id==='difference'?m.herb&&!m.magic:!m.magic).map(m=>m.id);
}
export function checkSet(id,choice){
  const expected=setMembers(id),selected=choice.members;
  return {members:selected.length===expected.length&&expected.every(value=>selected.includes(value)),count:id!=='union'||choice.count===expected.length};
}
export function createSets(){return {selected:'union',choices:Object.fromEntries(Object.keys(setCases).map(id=>[id,{members:[],count:null,tested:false}]))};}
export function restoreSets(saved){
  if(!saved||!Object.hasOwn(setCases,saved.selected)||!saved.choices)throw new RangeError('途中記録が不正です。');
  const state=createSets();state.selected=saved.selected;
  for(const id of Object.keys(setCases)){
    const c=saved.choices[id];if(!c||!Array.isArray(c.members)||new Set(c.members).size!==c.members.length||c.members.some(member=>!members.some(m=>m.id===member))||!(c.count===null||[4,6,8,10].includes(c.count))||typeof c.tested!=='boolean')throw new RangeError('途中記録が不正です。');
    state.choices[id]={members:c.members.slice(),count:c.count,tested:c.tested};
  }return state;
}
export function setsComplete(state){return Object.keys(setCases).every(id=>{const c=state.choices[id],result=checkSet(id,c);return c.tested&&result.members&&result.count;});}
