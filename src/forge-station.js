export const forgeStationQuests={
 'forge-bits':{region:'forge',title:'灯りの数を合わせよう',short:'灯りの数を合わせる',goal:'三つの灯りで５と３を順に表す'},
 'forge-cpu':{region:'forge',title:'道具の命令を動かそう',short:'命令の動きを確かめる',goal:'二つの命令を取り出し、読み解き、実行する'},
 'forge-memory':{region:'forge',title:'部品の置き場所を直そう',short:'記憶の箱を調べる',goal:'箱Ｂを読み、値を７に書き直して確かめる'},
 'forge-cache':{region:'forge',title:'手元の棚を使おう',short:'手元の棚を使う',goal:'三回の部品の注文に、手元の棚か倉庫から応える'},
 'station-fcfs':{region:'station',title:'到着順に荷物を運ぼう',short:'到着順に運ぶ',goal:'先に届いた荷物から三つを送り出す'},
 'station-round':{region:'station',title:'順番に仕事を進めよう',short:'仕事を交代する',goal:'一回ずつ交代して二つの仕事を終える'},
 'station-lock':{region:'station',title:'道具を譲り合おう',short:'道具を譲り合う',goal:'一つの台車を譲り合い、二人の仕事を終える'},
 'station-memory':{region:'station',title:'荷物の場所を決めよう',short:'荷物の場所を決める',goal:'二つの荷物を重ならないよう棚に収める'},
};
export const forgeStationIds=Object.keys(forgeStationQuests);
export const forgeStationConverged=completed=>forgeStationIds.every(id=>completed.includes(id));
export function forgeStationReplay(id,history){
 if(!forgeStationIds.includes(id)||!Array.isArray(history)||history.length>100||history.some(a=>typeof a!=='string'))throw new RangeError('依頼の記録を読み込めません。');
 let s={done:false};
 if(id==='forge-bits')s={done:false,bits:[false,false,false],round:0};
 if(id==='forge-cpu')s={done:false,step:0};
 if(id==='forge-memory')s={done:false,step:0};
 if(id==='forge-cache')s={done:false,step:0,cache:'A'};
 if(id==='station-fcfs')s={done:false,order:[]};
 if(id==='station-round')s={done:false,order:[],remaining:{A:2,B:2}};
 if(id==='station-lock')s={done:false,holder:null,worked:{A:false,B:false},finished:{A:false,B:false}};
 if(id==='station-memory')s={done:false,selected:[],occupied:[],round:0};
 for(const a of history){
  if(s.done)throw new RangeError('すでに目標を達成しています。');
  if(id==='forge-bits'){
   if(/^toggle:[0-2]$/.test(a))s.bits[+a.slice(-1)]=!s.bits[+a.slice(-1)];
   else if(a==='check'){if(s.bits.reduce((n,on,i)=>n+(on?[4,2,1][i]:0),0)!==[5,3][s.round])throw new RangeError('灯りの数の合計を、目標と比べてみましょう。');s.round++;s.done=s.round===2;s.bits=[false,false,false];}
   else throw new RangeError('灯りを選びましょう。');
  }else if(id==='forge-cpu'){
   const order=['fetch','decode','execute','fetch','decode','execute'];
   if(a!==order[s.step])throw new RangeError('命令は、取り出す → 読み解く → 実行する、の順に進めましょう。');s.step++;s.done=s.step===6;
  }else if(id==='forge-memory'){
   const order=['read:B','value:7','write:B','read:B'];
   if(a!==order[s.step])throw new RangeError('箱Ｂを読む → 値７を用意する → 箱Ｂに書く → もう一度読む、の順に確かめましょう。');s.step++;s.done=s.step===4;
  }else if(id==='forge-cache'){
   const requested=['A','B','B'][s.step],expected=requested===s.cache?'cache':'store';
   if(a!==expected)throw new RangeError('手元の棚に注文された部品があるか確かめましょう。');
   if(a==='store')s.cache=requested;s.step++;s.done=s.step===3;
  }else if(id==='station-fcfs'){
   if(a!==['B','C','A'][s.order.length])throw new RangeError('まだ送っていない荷物の到着時刻を比べましょう。');s.order.push(a);s.done=s.order.length===3;
  }else if(id==='station-round'){
   if(a!==['A','B','A','B'][s.order.length])throw new RangeError('一回進めたら、待っている次の仕事に交代しましょう。');s.order.push(a);s.remaining[a]--;s.done=s.order.length===4;
  }else if(id==='station-lock'){
   const match=/^(take|work|release):([AB])$/.exec(a);if(!match)throw new RangeError('仕事と台車の状態を確かめましょう。');const [,action,p]=match;
   if(action==='take'&&s.holder===null&&!s.finished[p])s.holder=p;
   else if(action==='work'&&s.holder===p&&!s.worked[p])s.worked[p]=true;
   else if(action==='release'&&s.holder===p&&s.worked[p]){s.holder=null;s.finished[p]=true;}
   else throw new RangeError('台車は一人ずつ使います。使い終わったら返しましょう。');
   s.done=s.finished.A&&s.finished.B;
  }else{
   if(/^slot:[0-2]$/.test(a)){const n=+a.slice(-1);if(s.occupied.includes(n))throw new RangeError('そこには荷物が入っています。');s.selected=s.selected.includes(n)?s.selected.filter(x=>x!==n):[...s.selected,n];}
   else if(a==='place'){
    const sorted=[...s.selected].sort();const needed=s.round===0?2:1;
    if(sorted.length!==needed||(needed===2&&sorted[1]!==sorted[0]+1))throw new RangeError('荷物の大きさに合う、続いた空き場所を選びましょう。');
    s.occupied.push(...sorted);s.selected=[];s.round++;s.done=s.round===2;
   }else throw new RangeError('空き場所を選びましょう。');
  }
 }
 return s;
}
export function validForgeStationDrafts(drafts){if(!drafts||typeof drafts!=='object'||Array.isArray(drafts))return false;try{return Object.entries(drafts).every(([id,h])=>{forgeStationReplay(id,h);return true;});}catch{return false;}}
