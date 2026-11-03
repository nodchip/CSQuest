export const osInfluencesLevel={id:'village-os-influences',number:'1103',kind:'os-influences',name:'四つの工房と見守り役',tag:'用途が OS に求めるもの',title:'それぞれの工房を支えよう',story:'村の共通の見守り役は、秘密の保管、通信、演奏、共同作業を支えます。各工房で二つの仕組みを試し、要求の違いを調べましょう。'};
export const influenceCases={
 security:{name:'秘密の保管',description:'別の冒険者が秘密の箱を開けようとします。箱の所有者だけに読み取りを許す規則です。',options:['確認しない','所有者を確認'],question:'規則を守るために必要な働きは？',answers:['要求者と箱の権限を照合する','全員に箱を開けさせる'],correct:0,explain:'アクセス制御は許可の照合を必要とします。この模型の照合だけで実際のシステム全体が安全になるわけではありません。'},
 network:{name:'通信の受付',description:'四つの通信口のうち４番だけが読める状態です。前者は１番から順に確認し、後者は準備済み一覧から受け取ります。',options:['順番に確認','準備済み一覧'],question:'この条件でアプリが調べた口の数は？',answers:['順番は４、一覧は１','どちらも必ず１'],correct:0,explain:'準備済み一覧は通信口を扱う一つの仕組みです。ここで数えたのはアプリの確認回数だけで、OS 内部の費用や実際の速さではありません。'},
 audio:{name:'歌の再生',description:'再生前に音を１個または３個ためます。各刻に１個再生し、その後で１・０・１・１個が届きます。３個ためる準備は１個より長いとします。',options:['１個ためる','３個ためる'],question:'この到着順で起きることは？',answers:['１個では音切れ、３個では起きない','３個ならどんな遅れでも音切れしない'],correct:0,explain:'余分な蓄えは一時的な遅れを吸収しますが、再生開始までの待ちも増えます。遅れが十分長ければ大きな蓄えも尽きます。'},
 parallel:{name:'共同の台帳',description:'二人が０から始まる同じ数をそれぞれ１増やします。鍵なしでは両者が書く前に０を読み、鍵ありでは読み書きの組を順番に行います。',options:['鍵なし','鍵あり'],question:'この順序で最後の数は？',answers:['鍵なしは１、鍵ありは２','どちらも必ず２'],correct:0,explain:'同時に進む処理の読み書きには同期が必要です。鍵の費用や他の実行順、分散した機械の故障はこの模型では扱いません。'}
};
export function influenceFrames(id,mode){
 if(!Object.hasOwn(influenceCases,id)||![0,1].includes(mode))throw new RangeError('場面または仕組みが不正です');
 if(id==='security')return ['別の冒険者から読み取り要求',mode?'所有者を照合：別人なので拒否':'照合なし：秘密を読めた'];
 if(id==='network')return mode?['準備済み一覧を受け取る','４番を確認：読める']:['１番を確認：まだ','２番を確認：まだ','３番を確認：まだ','４番を確認：読める'];
 if(id==='audio'){let held=mode?3:1,miss=0;return [1,0,1,1].map((arrival,i)=>{if(held)held--;else miss++;held+=arrival;return `${i+1}刻：再生後に${arrival}個到着、残り${held}個、音切れ${miss}回`;});}
 return mode?['甲が鍵を取り０を読む','甲が１を書き鍵を返す','乙が鍵を取り１を読む','乙が２を書き鍵を返す']:['甲が０を読む','乙が０を読む','甲が１を書く','乙が１を書く'];
}
export function influenceCreate(){return {selected:'security',mode:0,steps:Object.fromEntries(Object.keys(influenceCases).map(id=>[id,[0,0]])),answers:{}};}
export function influencePass(q,id){return q.steps[id].every((n,i)=>n===influenceFrames(id,i).length)&&q.answers[id]===influenceCases[id].correct;}
export function influenceDone(q){return Object.keys(influenceCases).every(id=>influencePass(q,id));}
export function influenceRestore(q){if(!q||!Object.hasOwn(influenceCases,q.selected)||![0,1].includes(q.mode)||!q.steps||!q.answers)throw new RangeError('途中記録が不正です');const out=influenceCreate();out.selected=q.selected;out.mode=q.mode;for(const id of Object.keys(influenceCases)){const a=q.steps[id];if(!Array.isArray(a)||a.length!==2||a.some((n,i)=>!Number.isInteger(n)||n<0||n>influenceFrames(id,i).length)||!(q.answers[id]===undefined||[0,1].includes(q.answers[id])))throw new RangeError('途中記録が不正です');out.steps[id]=[...a];if(q.answers[id]!==undefined)out.answers[id]=q.answers[id];}return out;}
