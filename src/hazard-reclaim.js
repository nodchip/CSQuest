export const hazardLevel={id:'forge-hazard-reclaim',number:'816',kind:'hazard-reclaim',name:'札を守る目印',tag:'並行処理とメモリ回収',title:'使っている札の回収を待とう',story:'先頭札を読む精霊と、札を山から外して回収する精霊がいます。読み手の目印と再確認を操作しましょう。'};
export const hazardCases={unsafe:'目印を出さない',protected:'目印を出してから確認',late:'目印より先に回収'};
export const hazardActions={read:'読み手が先頭を読む',publish:'読み手が目印を出す',validate:'読み手が先頭を再確認',retire:'回収係が先頭を外す',scan:'回収係が目印を調べる',touch:'読み手が札に触れられるか確認',clear:'読み手が目印を消す',discard:'読み手が古い目印を捨てる'};
const plans={unsafe:['read','retire','scan','touch'],protected:['read','publish','validate','retire','scan','touch','clear','scan'],late:['read','retire','scan','publish','validate','discard']};
export function hazardInitial(id){if(!Object.hasOwn(hazardCases,id))throw new RangeError('場面が不正です');return {id,index:0,head:'A',local:null,hazard:null,retired:false,freed:false,valid:null,touch:null,lastScan:null,message:'読み手が先頭を読みます。'};}
export function hazardExecute(s,action){const plan=plans[s.id];if(s.index>=plan.length||action!==plan[s.index])throw new RangeError('今の場面で次に行う仕事を確かめましょう。');
 if(action==='read'){s.local=s.head;s.message='読み手は先頭 A の目印を記憶しました。';}
 else if(action==='publish'){s.hazard=s.local;s.message='読み手が A を使う可能性を公表しました。';}
 else if(action==='validate'){s.valid=s.local===s.head;s.message=s.valid?'公表後も先頭は A です。':'先頭が変わっていました。古い目印では札を読みません。';}
 else if(action==='retire'){s.head='B';s.retired=true;s.message='A を山から外し、回収待ちにしました。';}
 else if(action==='scan'){if(s.retired&&s.hazard!=='A'){s.freed=true;s.retired=false;s.lastScan='freed';s.message='A を示す公表がないため、この模型では A を回収しました。';}else{s.lastScan='deferred';s.message='A を示す目印があるため、回収を延期しました。';}}
 else if(action==='touch'){s.touch=s.freed?'unsafe':'safe';s.message=s.freed?'A は回収済みです。触れると危険なので、この模型では実際に触れません。':'A はまだ回収されていません。この場面では札を読めます。';}
 else if(action==='clear'){s.hazard=null;s.message='読み手が使い終え、目印を消しました。';}
 else if(action==='discard'){s.hazard=null;s.local=null;s.message='古い目印を捨てました。新しい先頭からやり直す必要があります。';}
 s.index++;return s;}
export function hazardReplay(id,history){if(!Array.isArray(history)||history.length>8)throw new RangeError('記録が不正です');const s=hazardInitial(id);for(const a of history)hazardExecute(s,a);return s;}
export function hazardCreate(){return {selected:'unsafe',trials:{unsafe:[],protected:[],late:[]},answer:null};}
export function hazardStep(q,action){const h=q.trials[q.selected];hazardExecute(hazardReplay(q.selected,h),action);h.push(action);}
export function hazardDone(id,history){return hazardReplay(id,history).index===plans[id].length;}
export function hazardNext(s){return plans[s.id][s.index]??null;}
export function hazardComplete(q){return Object.keys(hazardCases).every(id=>hazardDone(id,q.trials[id]))&&q.answer==='validate';}
export function hazardRestore(q){if(!q||!Object.hasOwn(hazardCases,q.selected)||!q.trials||![null,'validate','publish-only','forever'].includes(q.answer))throw new RangeError('記録が不正です');const n=hazardCreate();n.selected=q.selected;n.answer=q.answer;for(const id of Object.keys(hazardCases)){hazardReplay(id,q.trials[id]);n.trials[id]=[...q.trials[id]];}return n;}
