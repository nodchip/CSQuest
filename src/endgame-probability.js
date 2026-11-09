// Each numbered card is one equally likely outcome in these finite models.
function weather(redRain,blueRain,redClear,blueClear){
 return [['雨','赤',redRain],['雨','青',blueRain],['晴れ','赤',redClear],['晴れ','青',blueClear]].flatMap(([sky,color,n])=>Array.from({length:n},()=>({sky,color})));
}
const first=weather(2,1,1,2),second=weather(1,3,1,1);
const reports1=[...Array(3).fill(['雨','雲あり']),...Array(1).fill(['雨','雲なし']),...Array(6).fill(['晴れ','雲あり']),...Array(10).fill(['晴れ','雲なし'])].map(([sky,cloud])=>({sky,cloud}));
const reports2=[...Array(8).fill(['雨','雲あり']),...Array(2).fill(['雨','雲なし']),...Array(3).fill(['晴れ','雲あり']),...Array(7).fill(['晴れ','雲なし'])].map(([sky,cloud])=>({sky,cloud}));
const make=(cards,scope,target,prompt)=>({cards:cards.map((card,id)=>({...card,id})).filter(scope),target,prompt});
export const eventCases={
 weather:[
  make(first,()=>true,c=>c.sky==='雨','箱１：雨の札をすべて選びましょう。'),
  make(first,c=>c.sky==='雨',c=>c.color==='赤','箱１：雨の札だけの中から、赤い札をすべて選びましょう。'),
  make(second,()=>true,c=>c.sky==='雨','箱２：雨の札をすべて選びましょう。'),
  make(second,c=>c.sky==='雨',c=>c.color==='赤','箱２：雨の札だけの中から、赤い札をすべて選びましょう。')
 ],
 reports:[
  make(reports1,c=>c.cloud==='雲あり',c=>c.sky==='雨','模型１：雲ありの札の中で、雨の札をすべて選びましょう。'),
  make(reports1,c=>c.sky==='雨',c=>c.cloud==='雲あり','模型１：雨の札の中で、雲ありの札をすべて選びましょう。'),
  make(reports2,c=>c.cloud==='雲あり',c=>c.sky==='雨','模型２：雲ありの札の中で、雨の札をすべて選びましょう。'),
  make(reports2,c=>c.sky==='雨',c=>c.cloud==='雲あり','模型２：雨の札の中で、雲ありの札をすべて選びましょう。')
 ]
};
export function replayEvents(kind,history){
 const cases=eventCases[kind];if(!cases||!Array.isArray(history))return null;
 let scene=0,selected=[];const results=[];
 for(const action of history){
  const task=cases[scene];if(!task||typeof action!=='string')return null;
  if(action==='check'){
   const answer=task.cards.filter(task.target).map(c=>c.id);
   if(answer.length!==selected.length||answer.some(id=>!selected.includes(id)))return null;
   results.push({numerator:answer.length,denominator:task.cards.length});scene++;selected=[];
  }else{
   const m=/^toggle:(\d+)$/.exec(action),id=m?Number(m[1]):-1;
   if(!task.cards.some(c=>c.id===id))return null;
   selected=selected.includes(id)?selected.filter(x=>x!==id):[...selected,id];
  }
 }
 return {scene,selected,results,done:scene===cases.length};
}
export const drawCases=[['赤','青'],['赤','青','青']].map(cards=>cards.flatMap((a,i)=>cards.map((b,j)=>({id:`${i}-${j}`,a,b,count:Number(a==='赤')+Number(b==='赤')}))));
export function replayDraws(history){
 if(!Array.isArray(history))return null;let scene=0,active=null,placed={};const results=[];
 for(const action of history){
  const cards=drawCases[scene];if(!cards||typeof action!=='string')return null;
  if(action==='check'){
   if(cards.some(c=>placed[c.id]!==c.count))return null;
   const counts=[0,1,2].map(n=>cards.filter(c=>c.count===n).length);
   results.push({counts,total:cards.length,redTotal:cards.reduce((sum,c)=>sum+c.count,0)});scene++;active=null;placed={};
  }else if(action.startsWith('pick:')){
   const id=action.slice(5);if(!cards.some(c=>c.id===id))return null;active=id;
  }else if(/^put:[012]$/.test(action)&&active!==null){placed[active]=Number(action.slice(4));active=null;}
  else return null;
 }
 return {scene,active,placed,results,done:scene===drawCases.length};
}
