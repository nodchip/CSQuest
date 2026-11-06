export const solidModes = {union:'ＡまたはＢ', intersection:'ＡかつＢ', aMinusB:'ＡからＢを引く', bMinusA:'ＢからＡを引く'};

// A = [0,1]^3、B = 中心(1,1,1)、半径１の球。境界も各集合に含める。
export function solidContains(x,y,z) {
  if (![x,y,z].every(n=>Number.isInteger(n)&&n>=0&&n<=2)) throw new RangeError('座標が不正です。');
  return {a:x<=1&&y<=1&&z<=1, b:(x-1)**2+(y-1)**2+(z-1)**2<=1};
}
export function solidExpected(mode,z) {
  if (!Object.hasOwn(solidModes,mode) || !Number.isInteger(z) || z<0 || z>2) throw new RangeError('操作が不正です。');
  return Array.from({length:9},(_,i)=>i).filter(i=>{
    const {a,b}=solidContains(i%3,Math.floor(i/3),z);
    return mode==='union'?a||b:mode==='intersection'?a&&b:mode==='aMinusB'?a&&!b:b&&!a;
  });
}
export function solidCreate() {
  return {mode:'union',z:0,trials:Object.fromEntries(Object.keys(solidModes).map(m=>[m,Array.from({length:3},()=>({selected:[],checked:false}))]))};
}
export function solidCorrect(mode,z,trial) {
  const expected=solidExpected(mode,z);
  return trial.checked && trial.selected.length===expected.length && expected.every(i=>trial.selected.includes(i));
}
export function solidRestore(saved) {
  if (!saved||!Object.hasOwn(solidModes,saved.mode)||!Number.isInteger(saved.z)||saved.z<0||saved.z>2||!saved.trials) throw new RangeError('立体の記録が不正です。');
  const out=solidCreate();out.mode=saved.mode;out.z=saved.z;
  for(const mode of Object.keys(solidModes)) {
    const rows=saved.trials[mode];
    if(!Array.isArray(rows)||rows.length!==3)throw new RangeError('立体の記録が不正です。');
    out.trials[mode]=rows.map(t=>{
      if(!t||!Array.isArray(t.selected)||new Set(t.selected).size!==t.selected.length||t.selected.some(i=>!Number.isInteger(i)||i<0||i>8)||typeof t.checked!=='boolean')throw new RangeError('立体の記録が不正です。');
      return {selected:[...t.selected],checked:t.checked};
    });
  }
  return out;
}
