export const matrices={shear:[[1,2],[0,1]],rotate:[[0,-1],[1,0]]};
export const matrixCases={
 shear:[{matrix:'shear',input:[2,1]},{matrix:'shear',input:[-1,2]}],
 rotate:[{matrix:'rotate',input:[2,1]},{matrix:'rotate',input:[-2,1]}],
 compare:[{matrix:'shear',input:[2,1],route:'先に傾ける'}, {matrix:'rotate',input:[4,1],route:'続けて回す'}, {matrix:'rotate',input:[2,1],route:'先に回す'}, {matrix:'shear',input:[-1,2],route:'続けて傾ける'}]
};
export function replayMatrix(kind,history){
 const cases=matrixCases[kind];if(!cases||!Array.isArray(history))return null;
 let scene=0,axis=0,chosen=[],finished=false,done=false,results=[];
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='next'&&finished){scene++;done=scene===cases.length;if(!done){axis=0;chosen=[];finished=false;}continue;}
  if(finished)return null;
  const m=/^answer:(-?[0-5])$/.exec(action);if(!m)return null;
  const task=cases[scene],row=matrices[task.matrix][axis],expected=row[0]*task.input[0]+row[1]*task.input[1];if(Number(m[1])!==expected)return null;
  chosen.push(expected);axis++;if(axis===2){finished=true;results.push({matrix:task.matrix,input:[...task.input],output:[...chosen]});}
 }
 return {scene,axis,chosen,finished,done,results};
}
