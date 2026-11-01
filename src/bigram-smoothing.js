export const smoothingWords={fly:{name:'飛ぶ',count:3},sleep:{name:'眠る',count:1},sing:{name:'歌う',count:0}};
export const smoothingModes={raw:'回数そのまま',add:'それぞれに１を加える'};
export const smoothingAnswers={'0':'０','1/4':'１／４','3/4':'３／４','1/7':'１／７','2/7':'２／７','4/7':'４／７'};
export function smoothingFraction(mode,id){if(!Object.hasOwn(smoothingModes,mode)||!Object.hasOwn(smoothingWords,id))throw new RangeError('条件が不正です。');const count=smoothingWords[id].count;return mode==='raw'?(count===0?'0':`${count}/4`):`${count+1}/7`;}
export function createSmoothing(){return {mode:'raw',word:'fly',choices:Object.fromEntries(Object.keys(smoothingModes).map(m=>[m,Object.fromEntries(Object.keys(smoothingWords).map(w=>[w,{answer:'',checked:false}]))]))};}
export function smoothingCorrect(s,mode,id){const c=s.choices[mode][id];return c.checked&&c.answer===smoothingFraction(mode,id);}
export function smoothingComplete(s){return Object.keys(smoothingModes).every(m=>Object.keys(smoothingWords).every(w=>smoothingCorrect(s,m,w)));}
export function restoreSmoothing(saved){if(!saved||!Object.hasOwn(smoothingModes,saved.mode)||!Object.hasOwn(smoothingWords,saved.word)||!saved.choices)throw new RangeError('途中記録が不正です。');const s=createSmoothing();s.mode=saved.mode;s.word=saved.word;for(const mode of Object.keys(smoothingModes))for(const id of Object.keys(smoothingWords)){const c=saved.choices[mode]?.[id];if(!c||!(c.answer===''||Object.hasOwn(smoothingAnswers,c.answer))||typeof c.checked!=='boolean')throw new RangeError('途中記録が不正です。');s.choices[mode][id]={answer:c.answer,checked:c.checked};}return s;}
