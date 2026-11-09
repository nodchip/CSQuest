export const librarySteps={
 list:[
  {op:'insert',index:1,value:'A',prompt:'１番目に札 A を入れる'},
  {op:'insert',index:2,value:'B',prompt:'２番目に札 B を入れる'},
  {op:'insert',index:3,value:'A',prompt:'３番目にもう一枚の札 A を入れる'},
  {op:'read',index:2,prompt:'２番目の札を読む'},
  {op:'delete',index:2,prompt:'２番目の札を取り除く'},
  {op:'read',index:4,prompt:'４番目を読もうとする'},
  {op:'read',index:2,prompt:'今の２番目の札を読む'}
 ],
 map:[
  {op:'put',key:'11',value:'moon',prompt:'番号11に「月の本」を登録する'},
  {op:'put',key:'12',value:'empty',prompt:'番号12に空の名前を登録する'},
  {op:'put',key:'11',value:'star',prompt:'番号11の名前を「星の本」に更新する'},
  {op:'read',key:'12',prompt:'番号12を調べる'},
  {op:'read',key:'13',prompt:'未登録の番号13を調べる'},
  {op:'delete',key:'13',prompt:'未登録の番号13を取り除こうとする'},
  {op:'read',key:'11',prompt:'番号11の現在の名前を調べる'}
 ]
};
export const selectionCases=[
 {need:'来た順に旅人を呼びたい',answer:'queue'},
 {need:'貸出番号から本の名前を調べて更新したい',answer:'map'},
 {need:'参加者の名前を重複なく集めたい',answer:'set'}
];
export const trialOperations={
 queue:[['addA','アオイを入れる'],['addB','ナギを入れる'],['take','先頭を取り出す']],
 map:[['putMoon','11に月の本を登録'],['putStar','11を星の本に更新'],['get','11を調べる']],
 set:[['addA','アオイを加える'],['addB','ナギを加える'],['addA','もう一度アオイを加える']]
};
export function replayCollections(kind,history){
 if(!['list','map','choose'].includes(kind)||!Array.isArray(history))return null;
 let scene=0,op=null,index=null,key=null,value=null,items=[],entries={},last=null,selection=null,trialStep=0,trialItems=[],trialEntries={},trialLast=null;const results=[];
 for(const action of history){
  if(typeof action!=='string')return null;
  if(kind==='choose'){
   const task=selectionCases[scene];if(!task)return null;
   if(/^choose:(queue|map|set)$/.test(action)){selection=action.slice(7);trialStep=0;trialItems=[];trialEntries={};trialLast=null;}
   else if(selection&&trialStep<trialOperations[selection].length&&action===`trial:${trialOperations[selection][trialStep][0]}`){
    const command=trialOperations[selection][trialStep][0];
    if(selection==='queue'){
     if(command==='addA'||command==='addB'){trialItems.push(command==='addA'?'アオイ':'ナギ');trialLast='順番待ちに加えました。';}
     else trialLast=`${trialItems.shift()}を取り出しました。`;
    }else if(selection==='map'){
     if(command==='putMoon'||command==='putStar'){trialEntries['11']=command==='putMoon'?'月の本':'星の本';trialLast='番号11の名前を記録しました。';}
     else trialLast=`番号11は${trialEntries['11']}です。`;
    }else{const name=command==='addA'?'アオイ':'ナギ';if(!trialItems.includes(name))trialItems.push(name);trialLast=`${name}を加えました。`;}trialStep++;
   }
   else if(action==='check'&&selection===task.answer&&trialStep===trialOperations[selection].length){results.push(selection);scene++;selection=null;trialStep=0;trialItems=[];trialEntries={};trialLast=null;}
   else return null;
   continue;
  }
  const task=librarySteps[kind][scene];if(!task)return null;
  if(/^op:(insert|put|read|delete)$/.test(action)){
   const next=action.slice(3);if(!(kind==='list'?['insert','read','delete']:['put','read','delete']).includes(next))return null;op=next;
  }else if(kind==='list'&&/^index:[1-4]$/.test(action))index=Number(action.slice(6));
  else if(kind==='map'&&/^key:(11|12|13)$/.test(action))key=action.slice(4);
  else if(/^value:(A|B|moon|star|empty)$/.test(action)){
   const next=action.slice(6);if(!(kind==='list'?['A','B']:['moon','star','empty']).includes(next))return null;value=next;
  }else if(action==='run'){
   if(op!==task.op||(kind==='list'?index!==task.index:key!==task.key)||(task.value!==undefined&&value!==task.value))return null;
   if(kind==='list'){
    if(op==='insert'){items.splice(index-1,0,value);last=`${index}番目に${value}を入れました。`;}
    else if(op==='read')last=index<=items.length?`${index}番目は${items[index-1]}です。`:`${index}番目は範囲外です。`;
    else{const removed=items.splice(index-1,1)[0];last=`${index}番目の${removed}を取り除きました。`;}
   }else{
    const exists=Object.hasOwn(entries,key);
    if(op==='put'){entries[key]=value;last=`番号${key}を${value==='empty'?'空の名前':value==='moon'?'月の本':'星の本'}に${exists?'更新':'登録'}しました。`;}
    else if(op==='read')last=exists?`番号${key}は${entries[key]==='empty'?'空の名前':entries[key]==='moon'?'月の本':'星の本'}です。`:`番号${key}は未登録です。`;
    else if(exists){delete entries[key];last=`番号${key}を取り除きました。`;}else last=`番号${key}は未登録なので、何も取り除きません。`;
   }
   results.push({op,index,key,value,last});scene++;op=null;index=null;key=null;value=null;
  }else return null;
 }
 return {scene,op,index,key,value,items,entries,last,selection,trialStep,trialItems,trialEntries,trialLast,results,done:scene===(kind==='choose'?selectionCases.length:librarySteps[kind].length)};
}
