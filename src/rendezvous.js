export const rendezvousLevel={id:'forge-send-deadlock',number:'131',kind:'senddeadlock',name:'向かい合う二人の伝令',tag:'同期送信とデッドロック',title:'伝言の行き違い',story:'二人の精霊が互いに伝言を渡そうとしています。順序の違う２つの手順を試し、両方の伝言を届けましょう。'};
export const rendezvousModes={blocked:{name:'両方が先に送る',program:{a:['send','receive'],b:['send','receive']}},ordered:{name:'片方が先に受け取る',program:{a:['send','receive'],b:['receive','send']}}};
export const rendezvousActors={a:'アオ',b:'ベニ'};
export function createRendezvousTrial(id){if(!Object.hasOwn(rendezvousModes,id))throw new RangeError('手順が不正です。');return {id,pc:{a:0,b:0},waiting:{a:null,b:null},received:{a:false,b:false},history:[],status:'playing',message:'精霊を選んで次の操作を始めましょう。'};}
export function rendezvousStep(state,actor){
 if(!Object.hasOwn(rendezvousActors,actor))throw new RangeError('精霊が不正です。');
 if(state.status!=='playing'||state.waiting[actor]||state.pc[actor]>=2)return {...state,message:'この精霊はいま進めません。'};
 const other=actor==='a'?'b':'a',action=rendezvousModes[state.id].program[actor][state.pc[actor]],s={...state,pc:{...state.pc},waiting:{...state.waiting},received:{...state.received},history:[...state.history,actor]};
 if(s.waiting[other]&&s.waiting[other]!==action){const receiver=action==='receive'?actor:other;s.received[receiver]=true;s.waiting[other]=null;s.pc[actor]++;s.pc[other]++;s.message=`${rendezvousActors[actor]}と${rendezvousActors[other]}の送信・受信が出会い、伝言が届きました。`;}
 else{s.waiting[actor]=action;s.message=`${rendezvousActors[actor]}は${action==='send'?'送信':'受信'}の相手を待っています。`;}
 if(s.pc.a===2&&s.pc.b===2){s.status='done';s.message='両方の伝言が届きました！';}
 else if(s.waiting.a&&s.waiting.b){s.status='deadlock';s.message='二人とも相手を待ち、これ以上進めません。';}
 return s;
}
export function createRendezvous(){return {selected:'blocked',trials:Object.fromEntries(Object.keys(rendezvousModes).map(id=>[id,createRendezvousTrial(id)]))};}
export function rendezvousComplete(s){return s.trials.blocked.status==='deadlock'&&s.trials.ordered.status==='done'&&s.trials.ordered.received.a&&s.trials.ordered.received.b;}
export function restoreRendezvous(saved){if(!saved||!Object.hasOwn(rendezvousModes,saved.selected)||!saved.histories)throw new RangeError('途中記録が不正です。');const s=createRendezvous();s.selected=saved.selected;for(const id of Object.keys(rendezvousModes)){const actions=saved.histories[id];if(!Array.isArray(actions)||actions.length>4)throw new RangeError('履歴が不正です。');for(const action of actions){const before=s.trials[id],after=rendezvousStep(before,action);if(after.history.length!==before.history.length+1)throw new RangeError('履歴が不正です。');s.trials[id]=after;}}return s;}
