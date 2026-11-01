export const imitationRoomLevel={id:'guild-imitation-room',number:'686',kind:'imitation-room',name:'幕の向こうの対話',tag:'チューリングテスト・中国語の部屋',title:'対話と理解の違いを考えよう',story:'ギルドの記録係が二人の返答を幕の向こうに隠しました。対話の記録と記号の部屋を調べ、何が分かり、何が議論に残るか考えましょう。'};
export const imitationPrompts={festival:{label:'祭りを尋ねる',a:'屋台の灯りを見るのが楽しみです。',b:'灯りと音楽がある祭りが好きです。'},number:{label:'２と３の合計を尋ねる',a:'５です。',b:'５です。'},rain:{label:'雨の日の支度を尋ねる',a:'外なら傘を持って行きます。',b:'濡れないように傘を用意します。'}};
export const roomInputs={sun:{symbol:'☀',answer:'star'},moon:{symbol:'☾',answer:'circle'}};
export const roomOutputs={star:'◆',circle:'●'};
export const modalityInputs={image:'絵だけ',text:'文字だけ',both:'絵と文字'};
export const modalityOutputs={text:'文字',symbol:'絵記号'};
export function modalityResult(input,output){
 if(!Object.hasOwn(modalityInputs,input)||!Object.hasOwn(modalityOutputs,output))throw new RangeError('入出力の形式が不正です。');
 const known=input!=='image';
 return {known,display:output==='text'?(known?'薬草です':'中身は不明です'):(known?'🌿':'？')};
}
export function createImitationRoom(){return {seen:[],guess:null,revealed:false,input:'sun',choice:null,roomSeen:[],report:null,modalityInput:'image',modalityOutput:'text',modalitySeen:[],modalityReport:null,modalityAnswer:null,testAnswer:null,roomAnswer:null,checked:false,history:[]};}
export function imitationRoomAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=120)return {ok:false,message:'操作記録がいっぱいです。最初からやり直してください。'};
 const n={...s,seen:[...s.seen],roomSeen:[...s.roomSeen],modalitySeen:[...s.modalitySeen],history:[...s.history],checked:false};let message='';
 if(/^ask:(a|b):(festival|number|rain)$/.test(action)){
  const [,who,prompt]=action.split(':'),key=`${who}:${prompt}`;if(!n.seen.includes(key))n.seen.push(key);message=`幕 ${who.toUpperCase()} の返答を記録しました。`;
 }
 else if(['guess:a','guess:b','guess:unknown'].includes(action)){n.guess=action.slice(6);message='正体についての予想を選びました。';}
 else if(action==='reveal'){
  if(s.seen.length<6||!s.guess)return {ok:false,message:'両方に３つの問いを送り、予想を選んでから確認しましょう。'};
  n.revealed=true;message='この架空の実験で設定した正体を明かしました。予想の正誤は達成条件ではありません。';
 }
 else if(action.startsWith('input:')&&Object.hasOwn(roomInputs,action.slice(6))&&s.revealed){n.input=action.slice(6);n.choice=null;n.report=null;message='部屋に渡す記号を選びました。';}
 else if(action.startsWith('output:')&&Object.hasOwn(roomOutputs,action.slice(7))&&s.revealed){n.choice=action.slice(7);n.report=null;message='返す記号を選びました。';}
 else if(action==='room:check'&&s.revealed){
  if(!s.choice)return {ok:false,message:'対応表を見て、返す記号を選びましょう。'};
  n.report={input:s.input,choice:s.choice,correct:s.choice===roomInputs[s.input].answer};if(n.report.correct&&!n.roomSeen.includes(s.input))n.roomSeen.push(s.input);
  message=n.report.correct?'対応表どおりの記号を返しました。':'対応表と違います。選び直せます。';
 }
 else if(action.startsWith('modality-input:')&&Object.hasOwn(modalityInputs,action.slice(15))){n.modalityInput=action.slice(15);n.modalityReport=null;message='入力を選びました。';}
 else if(action.startsWith('modality-output:')&&Object.hasOwn(modalityOutputs,action.slice(16))){n.modalityOutput=action.slice(16);n.modalityReport=null;message='出力を選びました。';}
 else if(action==='modality:run'){
  const key=`${s.modalityInput}:${s.modalityOutput}`;if(!n.modalitySeen.includes(key))n.modalitySeen.push(key);
  n.modalityReport={input:s.modalityInput,output:s.modalityOutput,...modalityResult(s.modalityInput,s.modalityOutput)};message='選んだ形式で固定の規則を試しました。';
 }
 else if(['modality-answer:information','modality-answer:always','modality-answer:image'].includes(action)){n.modalityAnswer=action.slice(16);message='入力の情報について選びました。';}
 else if(['test:limits','test:proof','test:failure'].includes(action)){n.testAnswer=action.slice(5);message='対話試験の結論を選びました。';}
 else if(['room:debate','room:proved','room:person'].includes(action)){n.roomAnswer=action.slice(5);message='記号の部屋についての結論を選びました。';}
 else if(action==='check'){n.checked=true;message='対話と部屋の記録、二つの結論を確認しました。';}
 else return {ok:false,message:'記録の順序を確認しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function restoreImitationRoom(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>120)throw new RangeError('途中記録が不正です。');let s=createImitationRoom();for(const a of saved.history){if(typeof a!=='string')throw new RangeError('途中記録が不正です。');const r=imitationRoomAct(s,a);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
export function imitationRoomComplete(s){return s.revealed&&Object.keys(roomInputs).every(k=>s.roomSeen.includes(k))&&Object.keys(modalityInputs).every(i=>Object.keys(modalityOutputs).every(o=>s.modalitySeen.includes(`${i}:${o}`)))&&s.modalityAnswer==='information'&&s.testAnswer==='limits'&&s.roomAnswer==='debate'&&s.checked;}
