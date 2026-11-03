export const landscapeLevel={id:'forge-pdc-landscape',number:'1157',kind:'pdc-landscape',name:'六つの工房を結ぶ',tag:'並列・分散環境の比較',title:'仕事に合う工房を探そう',story:'王国の六つの依頼を、それぞれの特徴に合う工房へ届けます。働き手、通信、用途と目的を比べましょう。'};
export const landscapeCases=[
 {id:'multicore',name:'マルチコア',request:'一台の装置の複数の実行流が同じ在庫を更新します。',agents:'同じ計算機のスレッド',communication:'共有メモリー・ロック・アトミック操作',application:'資源管理、データ処理',goal:'処理量、遅延、エネルギー'},
 {id:'reactive',name:'リアクティブ',request:'鐘が鳴るたびに対応する係が短い仕事を始めます。',agents:'イベント処理担当やスレッド',communication:'入出力チャネル',application:'サービス、リアルタイム処理',goal:'応答の遅延'},
 {id:'data',name:'データ並列',request:'多数の画素に同じ計算を行い、絵を描きます。',agents:'GPU・SIMD・アクセラレーター',communication:'種類の異なるメモリー間のデータ移動',application:'線形代数、画像、データ分析',goal:'処理量、エネルギー'},
 {id:'cluster',name:'クラスタ',request:'管理された複数の計算機で大きな模擬実験を分担します。',agents:'管理された複数の計算機',communication:'ソケット、メッセージチャネル',application:'シミュレーション、データ分析',goal:'処理量'},
 {id:'cloud',name:'クラウド',request:'需要に応じて借りる計算機を増やし、予約サービスを動かします。',agents:'必要に応じて用意する計算機',communication:'サービス API',application:'ウェブアプリケーション',goal:'拡張性'},
 {id:'open',name:'開放分散系',request:'別々の組織が運営する拠点で記録を持ち、故障にも備えます。',agents:'それぞれ自律した計算機',communication:'ソケット、データストア',application:'耐障害性を持つデータストアやサービス',goal:'信頼性'}
];
export function landscapeCreate(){return {index:0,choice:null,solved:[],overlap:null,checked:false};}
export function landscapeDone(q){return q.solved.length===landscapeCases.length&&q.overlap==='yes'&&q.checked;}
export function landscapeRestore(q){const ids=landscapeCases.map(x=>x.id);if(!q||!Number.isInteger(q.index)||q.index<0||q.index>=ids.length||![null,...ids].includes(q.choice)||!Array.isArray(q.solved)||new Set(q.solved).size!==q.solved.length||q.solved.some(x=>!ids.includes(x))||![null,'yes','no'].includes(q.overlap)||typeof q.checked!=='boolean')throw new RangeError('途中記録が不正です');return {...q,solved:[...q.solved]};}
