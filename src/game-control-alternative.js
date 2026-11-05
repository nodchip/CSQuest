export const controlSchemes={chord:'２つを同時に押す',sequence:'順に押す設定'};
export const controlLimits={one:'一度に１つだけ',two:'２つ同時も可能'};

// Virtual press/release events; they do not emulate a real input device.
export function controlReplay(scheme,limit,history){
 if(!Object.hasOwn(controlSchemes,scheme)||!Object.hasOwn(controlLimits,limit)||!Array.isArray(history)||history.length>40)throw new RangeError('操作記録が不正です。');
 const s={down:[],armed:false,activated:false,blocked:false,message:'札を押して試しましょう。'};
 for(const button of history){
  if(!['a','b'].includes(button))throw new RangeError('操作記録が不正です。');
  if(s.down.includes(button)){s.down=s.down.filter(k=>k!==button);s.message=`${button.toUpperCase()} を離しました。`;continue;}
  if(limit==='one'&&s.down.length){s.blocked=true;s.message='先に押している札を離してください。';continue;}
  s.down.push(button);s.message=`${button.toUpperCase()} を押しました。`;
  if(scheme==='sequence'&&button==='a')s.armed=true;
  if(scheme==='chord'&&s.down.length===2||scheme==='sequence'&&button==='b'&&s.armed){s.activated=true;s.armed=false;s.message='守りの術が発動しました。';}
 }
 return s;
}
export function createControlTrial(){return {scheme:'chord',limit:'one',history:[],observed:{chord:false,sequence:false},answer:null,checked:false};}
export function restoreControlTrial(saved){
 if(!saved)throw new RangeError('操作記録が不正です。');
 controlReplay(saved.scheme,saved.limit,saved.history);
 const observed=saved.observed??{chord:false,sequence:false},answer=saved.answer??null,checked=saved.checked??false;
 if(!observed||typeof observed.chord!=='boolean'||typeof observed.sequence!=='boolean'||![null,'chord','sequence','both'].includes(answer)||typeof checked!=='boolean'||checked&&(answer===null||!observed.chord||!observed.sequence))throw new RangeError('操作記録が不正です。');
 return {scheme:saved.scheme,limit:saved.limit,history:[...saved.history],observed:{chord:observed.chord,sequence:observed.sequence},answer,checked};
}
