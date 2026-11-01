export const teleportLevel={id:'ruin-teleport',number:'678',kind:'teleport',name:'離れた塔への光の伝言',tag:'量子テレポーテーション・古典通信',title:'測定結果を届けて水晶の状態を移そう',story:'二つの塔は、依頼677で作ったような水晶の組を分け持っています。送り手の測定結果を届け、受け手の水晶に元の状態を再現しましょう。'};
const q=1/Math.sqrt(2);
export const teleportInputs={zero:{name:'0 の状態',vector:[1,0]},one:{name:'1 の状態',vector:[0,1]},plus:{name:'正の重ね合わせ',vector:[q,q]},minus:{name:'負の重ね合わせ',vector:[q,-q]}};
export const teleportCases={c00:{input:'zero',bits:'00'},c01:{input:'one',bits:'01'},c10:{input:'plus',bits:'10'},c11:{input:'minus',bits:'11'}};
function h(v,bit){const out=v.slice();for(let i=0;i<8;i++)if(!(i&bit)){out[i]=(v[i]+v[i|bit])*q;out[i|bit]=(v[i]-v[i|bit])*q;}return out;}
function cx(v,control,target){return v.map((_,i)=>v[i^((i&control)?target:0)]);}
export function teleportBranch(input,bits){
 if(!Object.hasOwn(teleportInputs,input)||!['00','01','10','11'].includes(bits))throw new RangeError('状態か測定結果が不正です。');
 const [a,b]=teleportInputs[input].vector;
 let v=[a,0,0,0,b,0,0,0];v=h(v,2);v=cx(v,2,1);v=cx(v,4,2);v=h(v,4);
 const start=Number.parseInt(bits,2)*2,raw=v.slice(start,start+2),probability=raw.reduce((sum,x)=>sum+x*x,0);
 return {probability,before:raw.map(x=>x/Math.sqrt(probability))};
}
export function teleportCorrect(vector,x,z){if(!Array.isArray(vector)||vector.length!==2||!vector.every(Number.isFinite)||typeof x!=='boolean'||typeof z!=='boolean')throw new RangeError('修正が不正です。');let [a,b]=vector;if(x)[a,b]=[b,a];if(z)b=-b;return [a,b];}
export function teleportSame(a,b){return [1,-1].some(sign=>a.every((x,i)=>Math.abs(x-sign*b[i])<1e-9));}
export function createTeleport(){return {selected:'c00',phase:'ready',x:false,z:false,report:null,solved:[],answer:null,checked:false,history:[]};}
export function teleportAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=150)return {ok:false,message:'操作記録がいっぱいです。最初からやり直してください。'};
 const n={...s,solved:[...s.solved],history:[...s.history],checked:false};let message='';
 if(action.startsWith('case:')&&Object.hasOwn(teleportCases,action.slice(5))){n.selected=action.slice(5);n.phase='ready';n.x=false;n.z=false;n.report=null;message='別の場面を用意しました。';}
 else if(action==='measure'&&s.phase==='ready'){n.phase='measured';n.report=null;message='この場面の測定結果を確認しました。受け手にはまだ届いていません。';}
 else if(action==='send'&&s.phase==='measured'){n.phase='delivered';message='２つの古典ビットが受け手に届きました。';}
 else if((action==='x'||action==='z')&&s.phase==='delivered'){n[action]=!s[action];n.report=null;message='受け手の修正を切り替えました。';}
 else if(action==='verify'&&s.phase==='delivered'){
  const c=teleportCases[s.selected],branch=teleportBranch(c.input,c.bits),after=teleportCorrect(branch.before,s.x,s.z),same=teleportSame(after,teleportInputs[c.input].vector),rule=s.x===(c.bits[1]==='1')&&s.z===(c.bits[0]==='1');
  n.report={after,same,rule};if(same&&rule&&!n.solved.includes(s.selected))n.solved.push(s.selected);
  message=rule&&same?'測定結果に合う修正で元の状態を再現しました。':same?'この入力では一致しましたが、他の入力にも使える修正規則を確認しましょう。':'状態が一致しません。測定結果に応じた修正を見直しましょう。';
 }
 else if(['answer:classical','answer:copy','answer:instant'].includes(action)){n.answer=action.slice(7);message='振り返りを選びました。';}
 else if(action==='check'){n.checked=true;message='４場面と振り返りを確認しました。';}
 else return {ok:false,message:'測定と伝言を順に進めましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function restoreTeleport(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>150)throw new RangeError('途中記録が不正です。');let s=createTeleport();for(const a of saved.history){if(typeof a!=='string')throw new RangeError('途中記録が不正です。');const r=teleportAct(s,a);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
export function teleportComplete(s){return Object.keys(teleportCases).every(k=>s.solved.includes(k))&&s.answer==='classical'&&s.checked;}
