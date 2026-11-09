const example1=[{value:3,id:'3'},{value:1,id:'1'},{value:2,id:'2'}];
const equal=[{value:2,id:'2A'},{value:2,id:'2B'},{value:1,id:'1'}];
const ordered=[{value:1,id:'1'},{value:2,id:'2'},{value:3,id:'3'}];
export const sortingCases={
 insertion:[{method:'insertion',cards:example1},{method:'insertion',cards:equal}],
 selection:[{method:'selection',cards:example1},{method:'selection',cards:equal}],
 compare:[{method:'insertion',cards:equal},{method:'selection',cards:equal},{method:'insertion',cards:ordered},{method:'selection',cards:ordered}]
};
export function replaySorting(kind,history){
 const cases=sortingCases[kind];if(!cases||!Array.isArray(history))return null;
 let scene=0,cards=cases[0].cards.map(c=>({...c})),i=1,pos=1,min=0,j=1,phase='compare',comparisons=0,last='';const results=[];
 if(cases[0].method==='selection')i=0;
 const next=()=>{scene++;if(scene<cases.length){cards=cases[scene].cards.map(c=>({...c}));i=cases[scene].method==='selection'?0:1;pos=1;min=0;j=1;phase='compare';comparisons=0;}};
 const finish=()=>{results.push({method:cases[scene].method,order:cards.map(c=>c.id),comparisons});last='この組の札が並びました。';next();};
 for(const action of history){
  const task=cases[scene];if(!task||typeof action!=='string')return null;
  if(phase==='compare'){
   if(action!=='compare')return null;comparisons++;
   if(task.method==='insertion'){
    last=`${cards[pos-1].id}と${cards[pos].id}を比べました。`;phase='decision';
   }else{
    const prior=min;if(cards[j].value<cards[min].value)min=j;
    last=`${cards[prior].id}と${cards[j].id}を比べ、最小候補は${cards[min].id}です。`;j++;
    if(j===cards.length)phase='decision';
   }
  }else if(task.method==='insertion'){
   const swap=cards[pos-1].value>cards[pos].value;
   if(action!==(swap?'swap':'keep'))return null;
   if(swap){[cards[pos-1],cards[pos]]=[cards[pos],cards[pos-1]];pos--;last='隣の札を入れ替えました。';}
   else last='同じか小さいので入れ替えません。';
   if(!swap||pos===0){i++;pos=i;}
   if(i>=cards.length)finish();else phase='compare';
  }else{
   const swap=min!==i;if(action!==(swap?'swap':'keep'))return null;
   if(swap)[cards[i],cards[min]]=[cards[min],cards[i]];
   last=swap?'最小の札を先頭と入れ替えました。':'先頭が最小なのでそのままにしました。';i++;
   if(i>=cards.length-1)finish();else{min=i;j=i+1;phase='compare';}
  }
 }
 return {scene,cards,i,pos,min,j,phase,comparisons,last,results,done:scene===cases.length};
}
