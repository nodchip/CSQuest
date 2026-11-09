// A small, deliberately bounded instruction set for counting blue petals.
export const flowerCommands=['clear','loop','take','blue','again','report'];
export const flowerCases=[['blue','red','blue'],['red','red'],[],['blue']];
export const flowerExpected=[2,0,0,1];

export function runFlowers(program,input,limit=60){
 if(!Array.isArray(program)||program.length>8||program.some(x=>!flowerCommands.includes(x))||!Array.isArray(input)||input.some(x=>!['blue','red'].includes(x)))return null;
 const loops=program.filter(x=>x==='loop').length,ends=program.filter(x=>x==='again').length;
 if(loops!==ends||loops>1||(loops===1&&program.indexOf('loop')>program.indexOf('again')))return {output:null,reason:'繰り返しは一組だけ使い、始まりを終わりより先に置きます。',history:[]};
 let queue=[...input],count=0,current=null,pc=0,output=null,reason='',steps=0;
 const history=[];
 while(steps<limit&&pc<program.length){
  const command=program[pc];steps++;
  if(command==='clear'){count=0;pc++;}
  else if(command==='loop'){
   const end=program.indexOf('again',pc+1);
   if(end<0){reason='繰り返しの終わりがありません。';break;}
   pc=queue.length?pc+1:end+1;
  }else if(command==='take'){
   if(!queue.length){reason='残りの札がありません。';break;}
   current=queue.shift();pc++;
  }else if(command==='blue'){
   if(current===null){reason='先に札を一枚取りましょう。';break;}
   if(current==='blue')count++;pc++;
  }else if(command==='again'){
   const begin=program.lastIndexOf('loop',pc-1);
   if(begin<0){reason='繰り返しの始まりがありません。';break;}
   pc=begin;
  }else if(command==='report'){output=count;pc=program.length;}
  history.push({command,count,current,remaining:[...queue],pc,output});
 }
 if(!reason&&output===null)reason=steps>=limit?'手順が長く続いたため止めました。':'結果を知らせる手順がありません。';
 return {output,reason,history};
}
