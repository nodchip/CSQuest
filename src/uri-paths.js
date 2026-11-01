export const uriQuestLevel={id:'forest-uri-paths',number:'669',kind:'uri-paths',name:'書庫へ続く道の札',tag:'URI・相対参照・フラグメント',title:'道の札を読み解いて届けよう',story:'旅人は薬草の書庫から地図と検索結果を探します。道の札を現在地から解決し、書庫に届く依頼と手元の目印を比べましょう。'};
export const uriBase='https://library.example/herbs/index.html';
export const uriExamples={relative:{name:'一つ上から地図へ',reference:'../maps/forest?season=spring#bridge'},root:{name:'根元から地図へ',reference:'/maps/forest?season=spring#bridge'},nested:{name:'今の場所の下から地図へ',reference:'maps/forest?season=spring#bridge'},encoded:{name:'区切り記号を符号化した名前',reference:'/herbs/search?name=moon%26star#results'},raw:{name:'区切り記号をそのまま使う名前',reference:'/herbs/search?name=moon&star#results'}};
export function resolveUriExample(id){
 if(!Object.hasOwn(uriExamples,id))throw new RangeError('道の札が不正です。');const u=new URL(uriExamples[id].reference,uriBase);
 return {href:u.href,scheme:u.protocol.slice(0,-1),host:u.host,path:u.pathname,query:u.search,fragment:u.hash.slice(1),requestTarget:u.pathname+u.search,params:[...u.searchParams.entries()]};
}
export function uriExampleResponse(id){const r=resolveUriExample(id);return {...r,resource:r.path==='/maps/forest'?'地図':r.path==='/herbs/search'?'検索': '見つからない'};}
export function createUriQuest(){return {selected:'relative',resolved:null,results:{},answerPath:null,answerFragment:null,answerEncoding:null,checked:false,history:[]};}
export function uriQuestAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=100)return {ok:false,message:'操作記録がいっぱいです。最初からやり直してください。'};
 const n={...s,results:{...s.results},history:[...s.history],checked:false};let message='';
 if(action.startsWith('case:')&&Object.hasOwn(uriExamples,action.slice(5))){n.selected=action.slice(5);n.resolved=null;message='道の札を選びました。';}
 else if(action==='resolve'){n.resolved=s.selected;message='現在地を基準に道の札を解決しました。';}
 else if(action==='send'&&s.resolved===s.selected){n.results[s.selected]=uriExampleResponse(s.selected);message='書庫へパスと検索条件を送り、手元の目印を確かめました。';}
 else if(['path:same','path:all','path:different'].includes(action)){n.answerPath=action.slice(5);message='道の比較を選びました。';}
 else if(['fragment:local','fragment:server','fragment:hostname'].includes(action)){n.answerFragment=action.slice(9);message='目印の扱いを選びました。';}
 else if(['encoding:separate','encoding:same','encoding:host'].includes(action)){n.answerEncoding=action.slice(9);message='区切り記号の扱いを選びました。';}
 else if(action==='check'){n.checked=true;message='調査記録と答えを確認しました。';}
 else return {ok:false,message:'まず選んだ道の札を現在地から解決しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function restoreUriQuest(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>100)throw new RangeError('途中記録が不正です。');let s=createUriQuest();for(const a of saved.history){if(typeof a!=='string')throw new RangeError('途中記録が不正です。');const r=uriQuestAct(s,a);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
export function uriQuestComplete(s){return Object.keys(uriExamples).every(k=>Object.hasOwn(s.results,k))&&s.answerPath==='same'&&s.answerFragment==='local'&&s.answerEncoding==='separate'&&s.checked;}
