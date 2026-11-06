// 明るさだけを持つ４×４の固定画像。表示順は左上から行ごと。
export const mipBase=[0,0,0,0, 0,0,0,8, 0,0,0,0, 0,0,0,0];
export const mipLods=[0,0.5,1];
export const mipAnswers=[0,0.25,0.5,1];

export function mipReduce(image,width){
 if(!Number.isInteger(width)||width<2||width%2||!Array.isArray(image)||image.length!==width*width||!image.every(Number.isFinite))throw new RangeError('画像が不正です。');
 const out=[];
 for(let y=0;y<width;y+=2)for(let x=0;x<width;x+=2)out.push((image[y*width+x]+image[y*width+x+1]+image[(y+1)*width+x]+image[(y+1)*width+x+1])/4);
 return out;
}
// 中央座標 (u,v)=(0.5,0.5) で、各層の４画素を等重みに線形補間。
export function mipCenter(lod){
 if(!mipLods.includes(lod))throw new RangeError('詳細度が不正です。');
 const level1=mipReduce(mipBase,4),v0=(mipBase[5]+mipBase[6]+mipBase[9]+mipBase[10])/4,v1=level1.reduce((a,b)=>a+b,0)/4;
 return (1-lod)*v0+lod*v1;
}
export function mipCreate(){return {cell:0,values:[null,null,null,null],gridChecked:false,lod:0,guess:null,checked:[],feedback:false};}
export function mipSetCell(s,i,value){if(!Number.isInteger(i)||i<0||i>3||![0,2,8].includes(value))throw new RangeError('画素が不正です。');s.values[i]=value;s.gridChecked=false;}
export function mipGridCorrect(s){const expected=mipReduce(mipBase,4);return s.gridChecked&&s.values.every((v,i)=>v===expected[i]);}
export function mipChooseLod(s,lod){if(!mipLods.includes(lod))throw new RangeError('詳細度が不正です。');s.lod=lod;s.guess=null;s.feedback=false;}
export function mipChooseGuess(s,guess){if(!mipAnswers.includes(guess))throw new RangeError('予想が不正です。');s.guess=guess;s.feedback=false;}
export function mipCorrect(s){return s.feedback&&s.guess!==null&&s.guess===mipCenter(s.lod);}
export function mipCheck(s){if(s.guess===null)throw new RangeError('明るさを選びましょう。');s.feedback=true;const ok=mipCorrect(s);if(ok&&!s.checked.includes(s.lod))s.checked.push(s.lod);return ok;}
export function mipRestore(s){
 if(!s||!Number.isInteger(s.cell)||s.cell<0||s.cell>3||!Array.isArray(s.values)||s.values.length!==4||s.values.some(v=>![null,0,2,8].includes(v))||typeof s.gridChecked!=='boolean'||!mipLods.includes(s.lod)||![null,...mipAnswers].includes(s.guess)||!Array.isArray(s.checked)||new Set(s.checked).size!==s.checked.length||s.checked.some(v=>!mipLods.includes(v))||typeof s.feedback!=='boolean'||(s.feedback&&s.guess===null))throw new RangeError('途中記録が不正です。');
 return {cell:s.cell,values:[...s.values],gridChecked:s.gridChecked,lod:s.lod,guess:s.guess,checked:[...s.checked],feedback:s.feedback};
}
