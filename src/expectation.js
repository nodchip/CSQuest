export const expectationLevel={id:'treasure-expectation',number:'41',kind:'expectation',name:'三つの宝箱',tag:'期待値とばらつき',title:'宝箱の約束を比べよう',story:'ギルドには三つの宝箱があります。それぞれ等しい確率で４枚の札のうち１枚が選ばれ、札に書かれた数の硬貨を受け取れます。'};
export const chests={steady:{name:'確かな宝箱',rewards:[3,3,3,3]},rare:{name:'星の宝箱',rewards:[0,0,0,12]},higher:{name:'月の宝箱',rewards:[0,0,0,16]}};
export const averages=[0,3,4,6];
export const zeroCounts=[0,1,3,4];
export function chestStats(id){
  if(!Object.hasOwn(chests,id))throw new RangeError('未知の宝箱です。');
  const rewards=chests[id].rewards;
  return {average:rewards.reduce((sum,value)=>sum+value,0)/rewards.length,zero:rewards.filter(value=>value===0).length,total:rewards.length};
}
export function checkChest(id,choice){const expected=chestStats(id);return {average:choice.average===expected.average,zero:choice.zero===expected.zero};}
export function createExpectation(){return {selected:'steady',choices:Object.fromEntries(Object.keys(chests).map(id=>[id,{average:null,zero:null,tested:false}]))};}
export function restoreExpectation(saved){
  if(!saved||!Object.hasOwn(chests,saved.selected)||!saved.choices)throw new RangeError('途中記録が不正です。');
  const state=createExpectation();state.selected=saved.selected;
  for(const id of Object.keys(chests)){
    const c=saved.choices[id];if(!c||!(c.average===null||averages.includes(c.average))||!(c.zero===null||zeroCounts.includes(c.zero))||typeof c.tested!=='boolean')throw new RangeError('途中記録が不正です。');
    state.choices[id]={average:c.average,zero:c.zero,tested:c.tested};
  }return state;
}
export function expectationComplete(state){return Object.keys(chests).every(id=>{const c=state.choices[id],r=checkChest(id,c);return c.tested&&r.average&&r.zero;});}
