export const storyClueDetails={
 workshop:{speaker:'kaede',line:'配達の帰り道で、古い道しるべに迷ってしまってね。直せる人に伝えようと思っているんだ。',note:'カエデは、配達の途中で古い道しるべに迷った。'},
 river:{speaker:'mizuho',line:'川向こうへ行く道しるべが、前の道を向いたままなんだ。旅人が迷わないといいけれど。',note:'水辺の道しるべは、以前の道を向いたまま。'},
 city:{speaker:'mina',line:'ギルドに届くはずの荷物が、別の通りへ運ばれたことがあったの。届け先も確かめなくちゃね。',note:'街では、荷物が別の通りへ運ばれた。'},
 harbor:{speaker:'ren',line:'港に届くはずの便りが、別の便に積まれて遅れたことがあったよ。待つ人が心配していないといいな。',note:'港では、便りが別の便に積まれて遅れた。'},
 archive:{speaker:'aoi',line:'山へ届ける本の宛先が、前の中継所のままだったの。新しい道に合わせて直しておきたいわ。',note:'文庫の本には、古い中継所の宛先が残っていた。'},
 windmill:{speaker:'toma',line:'里の橋を通れるようになったのに、回り道を教える札が残っていたんだ。旅人にも知らせたいね。',note:'風車の里には、回り道を示す古い札が残っていた。'},
 mountain:{speaker:'sora',line:'山の道が変わったことが、麓の中継所にはまだ届いていなかったみたいなんだ。',note:'山道の変更が、麓の中継所に伝わっていなかった。'},
 valley:{speaker:'yuno',line:'届け先の記録に古い名前が残っていて、荷物をどこへ送るか迷ったの。',note:'谷の記録には、古い届け先の名前が残っていた。'},
 sky:{speaker:'alto',line:'塔で受け取った知らせの次の送り先が、今の道と違っていたんだ。確かめ直さないとね。',note:'塔に届いた知らせには、今の道と違う送り先が書かれていた。'},
 mist:{speaker:'shino',line:'関所に、別の人へ渡すはずの便りが届いたことがあるの。渡す前に宛先を確かめてよかったわ。',note:'関所には、別の人宛ての便りが届いたことがあった。'},
 forge:{speaker:'akari',line:'修理の終わった道具を送りたいのに、駅への届け先が昔の札のままだったんだ。',note:'鍛冶街の道具には、古い駅の届け先が書かれていた。'},
 station:{speaker:'haru',line:'駅で預かった荷物が、待っている人の場所と違う所に送られかけたんだ。',note:'駅の荷物は、待つ人と違う場所へ送られかけていた。'}
};
export const storyClueRegions=Object.keys(storyClueDetails);
export function storyReflectionReady(heard){return new Set(heard.filter(id=>id!=='workshop'&&storyClueRegions.includes(id))).size>=3;}
export function validStoryHeard(heard){return Array.isArray(heard)&&new Set(heard).size===heard.length&&heard.every(id=>storyClueRegions.includes(id));}
