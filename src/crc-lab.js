export const crcGenerator=[1,0,1,1];
export const crcData=[0,1,0,1];
function validate(bits,length){if(!Array.isArray(bits)||bits.length!==length||bits.some(b=>b!==0&&b!==1))throw new RangeError('ビット列が不正です。');}
export function crcDivision(bits){validate(bits,7);let work=bits.slice();const trace=[work.slice()];for(let i=0;i<4;i++){if(work[i]===1)for(let j=0;j<crcGenerator.length;j++)work[i+j]^=crcGenerator[j];trace.push(work.slice());}return trace;}
export function crcBitXorCount(bits){const trace=crcDivision(bits);return trace.slice(0,4).filter((row,i)=>row[i]===1).length*crcGenerator.length;}
export function crcEncode(data){validate(data,4);const remainder=crcDivision([...data,0,0,0]).at(-1).slice(-3);return [...data,...remainder];}
export const crcOriginal=crcEncode(crcData);
export function createCrcLab(){return {flips:[],stage:null,seen:[],answer:null,checked:false,history:[]};}
export function crcReceived(s){return crcOriginal.map((bit,i)=>s.flips.includes(i+1)?bit^1:bit);}
export function crcLabAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=200)return {ok:false,message:'操作記録がいっぱいです。最初からやり直してください。'};
 const n={...s,flips:[...s.flips],seen:[...s.seen],history:[...s.history],checked:false};let message='';
 if(/^flip:[1-7]$/.test(action)){const i=Number(action.slice(5));n.flips=n.flips.includes(i)?n.flips.filter(x=>x!==i):[...n.flips,i].sort((a,b)=>a-b);n.stage=null;message='受け取る灯りを変えました。';}
 else if(action==='start'){n.stage=0;message='左端から割り算を始めます。';}
 else if(['step:xor','step:skip'].includes(action)&&Number.isInteger(s.stage)&&s.stage<4){const trace=crcDivision(crcReceived(s)),expected=trace[s.stage][s.stage]?'step:xor':'step:skip';if(action!==expected)return {ok:false,message:'現在の位置が１なら XOR、０ならそのまま次へ進みます。'};n.stage=s.stage+1;message='次の位置へ進みました。';if(n.stage===4){const remainder=trace[4].slice(-3),zero=remainder.every(x=>x===0),count=s.flips.length,key=count===0?'clean':zero?'undetected':count===1?'single':count===2?'double':null;if(key&&!n.seen.includes(key))n.seen.push(key);message=zero?'剰余は０です。':'剰余が０でなく、変化を検出しました。';}}
 else if(['answer:limits','answer:guarantee'].includes(action)){n.answer=action.slice(7);message='剰余の意味を選びました。';}
 else if(action==='check'){n.checked=true;message='記録と答えを確認しました。';}
 else return {ok:false,message:'割り算の操作を確認しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function crcLabComplete(s){return ['clean','single','double','undetected'].every(k=>s.seen.includes(k))&&s.answer==='limits'&&s.checked;}
export function restoreCrcLab(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>200)throw new RangeError('途中記録が不正です。');let s=createCrcLab();for(const action of saved.history){if(typeof action!=='string')throw new RangeError('途中記録が不正です。');const r=crcLabAct(s,action);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
