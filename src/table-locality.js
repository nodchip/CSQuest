export const localityLabLevel={id:'archive-table-locality',number:'488',kind:'table-locality',name:'星図を読む順番',tag:'表の走査と頁の局所性',title:'星図の合計を効率よく調べよう',story:'星図の数字の合計を調べる精霊は、何度も頁を取り寄せています。同じ星図を異なる順番で読み、頁を使いやすい順を探しましょう。'};
export const traversalModes={rows:'行ごと',columns:'列ごと',tiles:'２×２の区画ごと'};
export function traversal(mode){
 if(!Object.hasOwn(traversalModes,mode))throw new RangeError('巡り方が不正です。');
 const coords=[];
 if(mode==='rows')for(let r=0;r<4;r++)for(let c=0;c<4;c++)coords.push([r,c]);
 if(mode==='columns')for(let c=0;c<4;c++)for(let r=0;r<4;r++)coords.push([r,c]);
 if(mode==='tiles')for(let br=0;br<4;br+=2)for(let bc=0;bc<4;bc+=2)for(let r=br;r<br+2;r++)for(let c=bc;c<bc+2;c++)coords.push([r,c]);
 return coords;
}
export function traversalSnapshot(mode,index){
 const path=traversal(mode);if(!Number.isInteger(index)||index<0||index>16)throw new RangeError('手順が不正です。');
 let order=[],faults=0,sum=0;const history=[];
 for(const [r,c] of path.slice(0,index)){
  const page=r+1,hit=order.includes(page);let victim=null;
  if(hit)order=order.filter(p=>p!==page);else {faults++;if(order.length===2)victim=order.shift();}
  order.push(page);const value=r*4+c+1;sum+=value;history.push({row:r,column:c,page,value,hit,victim});
 }
 return {order,faults,sum,history};
}
export function createTraversalQuest(){return {selected:'rows',indices:{rows:0,columns:0,tiles:0},answer:null,checked:false};}
export function traversalComplete(s){return Object.keys(traversalModes).every(id=>s.indices[id]===16)&&s.answer==='order'&&s.checked;}
export function restoreTraversalQuest(s){
 if(!s||!Object.hasOwn(traversalModes,s.selected)||!s.indices||![null,'order','same','always'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');
 const result=createTraversalQuest();result.selected=s.selected;result.answer=s.answer;result.checked=s.checked;
 for(const id of Object.keys(traversalModes)){traversalSnapshot(id,s.indices[id]);result.indices[id]=s.indices[id];}return result;
}
