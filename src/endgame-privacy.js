// Fixed examples: these are not a general test of whether data is anonymous.
export const privacyCases={
 collection:[
  {answer:'ticket',options:['ticket','address','name'],prompt:'薬草を渡す窓口では、旅人が持参する引換札の番号で一袋を探せます。袋を渡すために窓口が使う情報を選びましょう。',labels:['引換札の番号','住所と家族の名前','名前と旅の履歴'],effects:['引換札で該当する袋を探せます。番号の扱いにも注意が必要です。','受け取りには使わない住所や家族の情報も集まります。','受け取りには使わない旅の履歴も集まります。']},
  {answer:'count',options:['names','count','both'],prompt:'明日の薬草の量を決める人には、今日渡した袋の合計だけが必要です。渡す情報を選びましょう。',labels:['旅人の名前と袋の一覧','袋の合計数','名前、住所、袋の一覧'],effects:['必要のない名前が伝わります。','この目的に必要な合計数を伝えます。','必要のない名前と住所が伝わります。']},
  {answer:'restricted',options:['public','forever','restricted'],prompt:'引換札と袋の対応は、受け渡し中だけ窓口で必要です。受け渡し後は必要ありません。この条件で扱い方を選びましょう。',labels:['誰でも見られる場所に置く','いつまでも全員に配る','窓口だけが使い、不要になったら消す'],effects:['関係のない人にも対応が見えてしまいます。','必要がなくなっても多くの人が見られます。','必要な人に限り、不要になった記録を消します。']}
 ],
 identity:[
  {answer:'pseudonym',options:['pseudonym','anonymous','public'],prompt:'名前の代わりに番号を書いた札があります。案内所には番号と名前の対応表が残っています。この記録をどう考えますか？',labels:['対応表で本人と結びつく仮名の記録','誰にも結びつかない匿名の記録','すべての人に名前を公開した記録'],effects:['番号による仮名化で、対応表があれば本人と結びつきます。','対応表を持つ人は本人と結びつけられます。','番号だけの札に名前が公開されているわけではありません。']},
  {answer:'infer',options:['safe','infer','impossible'],prompt:'ある村の住民は一人だけで、周囲の人はその住民が誰か知っています。村名と、その村の住民が薬草を受け取った数１を公表した場合を考えましょう。',labels:['合計なので誰にも分からない','他の情報と合わせて本人を推測できる','受取数を数えること自体が不可能'],effects:['村の住民が誰か知っているという別の情報があります。','周囲の知識と合わせると、誰の記録か推測できます。','数を数えることはできますが、公開には注意が必要です。']},
  {answer:'assumption',options:['guarantee','key','assumption'],prompt:'名前も対応表もなく、他の情報と組み合わせても誰とも結びつかない、と仮定した集計を考えます。この場面について適切な説明は？',labels:['どんな集計でも必ず匿名になる','対応表を公開して確かめる','この仮定では本人を特定できないが、実際は追加情報も調べる'],effects:['集計でも少人数などから推測されることがあります。','この例には対応表がなく、公開すれば結びつきの危険もあります。','実際の識別可能性は、持っている他の情報や状況に左右されます。']}
 ],
 safeguards:[
  {answer:'private',options:['public','private','collect'],prompt:'窓口の受取帳には札番号と薬草が書かれています。番号と名前の対応表も窓口にあります。受け渡し中、両方の帳面を扱う方法を選びましょう。',labels:['二つの帳面を掲示する','窓口の必要な担当者に限る','全員の住所も集めて掲示する'],effects:['番号と名前を結びつけられます。','見られる人を限り、対応表も慎重に扱います。','不要な住所も広がり、番号と名前も結びつきます。']},
  {answer:'combine',options:['combine','anonymous','share'],prompt:'札番号だけを調査係に渡す案があります。調査係が対応表も入手できる場合、何を確かめますか？',labels:['二つを組み合わせて本人を識別できるか','番号なので匿名だと決める','対応表も全員に配る'],effects:['対応表を使える人は、番号と本人を結びつけられます。','対応表を入手できる条件を見落としています。','対応表を広げると結びつけられる人が増えます。']},
  {answer:'risk',options:['always','disclose','risk'],prompt:'案内所は村の住民による受取数の公表を考えています。ある村の住民は一人だけで、その村の受取数は１です。誰が住むか知る人もいます。まず何をすべきでしょう？',labels:['合計なら必ず安全と考える','小さな村の本人情報も一緒に出す','人数や他の情報を考え、推測の危険を調べる'],effects:['この条件では、住民が誰か知る人には、その人が受け取ったと分かります。','本人が特定される情報を増やしてしまいます。','小さい集計と外部の情報を照らし、公開方法を慎重に考えます。']}
 ]
};
export function replayPrivacy(kind,history){
 const cases=privacyCases[kind];if(!cases||!Array.isArray(history))return null;
 let scene=0,choice=null;const results=[];
 for(const action of history){
  const task=cases[scene];if(!task||typeof action!=='string')return null;
  if(action==='test'){if(choice!==task.answer)return null;results.push(choice);scene++;choice=null;}
  else if(action.startsWith('choose:')&&task.options.includes(action.slice(7)))choice=action.slice(7);
  else return null;
 }
 return {scene,choice,results,done:scene===cases.length};
}
