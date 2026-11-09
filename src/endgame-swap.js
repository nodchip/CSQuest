// Copies preserve the source. An empty box can be copied like any other value.
export const swapBoxes=['A','B','C'];
export const swapCases=[['赤','青'],['青','赤'],['金','緑']];
export function runSwap(program,input){
 if(!Array.isArray(program)||program.length>5||!Array.isArray(input)||input.length!==2||input.some(x=>typeof x!=='string')||program.some(x=>typeof x!=='string'||!/^([ABC]):([ABC])$/.test(x)))return null;
 const boxes={A:input[0],B:input[1],C:'空'},history=[];
 for(const action of program){const [destination,source]=action.split(':');boxes[destination]=boxes[source];history.push({...boxes,action});}
 return {boxes,history,success:boxes.A===input[1]&&boxes.B===input[0]};
}
