export const designSmellsLevel={id:'village-design-smells',number:'680',kind:'design-smells',name:'二つの薬草受付',tag:'設計品質・重複・回帰試験',title:'二つの受付を直しやすくしよう',story:'村には店頭と配達の受付があります。どちらも動いていますが、同じ数量の約束を別々に持っています。動作を確かめながら、変更に強い形を選びましょう。'};
export const designVariants={separate:'別々の数量確認',shared:'数量確認だけを共有',fee:'配達料も消して共通化',late:'先に在庫を引いて確認'};
export const designCases=[
 {id:'shop1',name:'店頭・１個',channel:'shop',qty:1,stock:4},
 {id:'delivery1',name:'配達・１個',channel:'delivery',qty:1,stock:4},
 {id:'shop3',name:'店頭・３個',channel:'shop',qty:3,stock:4},
 {id:'delivery3',name:'配達・３個',channel:'delivery',qty:3,stock:4},
 {id:'zero',name:'配達・０個',channel:'delivery',qty:0,stock:4},
 {id:'four',name:'配達・４個',channel:'delivery',qty:4,stock:5},
 {id:'shortage',name:'配達・３個で在庫２個',channel:'delivery',qty:3,stock:2}
];
function expected(c,changed){const limit=changed?2:3;if(c.qty<1||c.qty>limit||c.qty>c.stock)return {accepted:false,stock:c.stock,cost:null};return {accepted:true,stock:c.stock-c.qty,cost:c.qty*10+(c.channel==='delivery'?3:0)};}
export function runDesignCase(variant,changed,c){
 if(!Object.hasOwn(designVariants,variant)||typeof changed!=='boolean'||!designCases.includes(c))throw new RangeError('試験条件が不正です。');
 // In the separate design only the shop copy is updated in the change exercise.
 const limit=changed&&(variant!=='separate'||c.channel==='shop')?2:3;
 const valid=c.qty>=1&&c.qty<=limit&&c.qty<=c.stock;
 if(!valid)return {accepted:false,stock:variant==='late'?c.stock-c.qty:c.stock,cost:null};
 return {accepted:true,stock:c.stock-c.qty,cost:c.qty*10+(c.channel==='delivery'&&variant!=='fee'?3:0)};
}
export function designSuite(variant,changed){
 return designCases.map(c=>{const actual=runDesignCase(variant,changed,c),wanted=expected(c,changed);return {id:c.id,actual,wanted,pass:actual.accepted===wanted.accepted&&actual.stock===wanted.stock&&actual.cost===wanted.cost};});
}
export function createDesignSmells(){return {variant:'separate',changed:false,seen:[],report:null,answer:null,checked:false,history:[]};}
export function designSmellsAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=120)return {ok:false,message:'操作記録がいっぱいです。最初からやり直してください。'};
 const n={...s,seen:[...s.seen],history:[...s.history],checked:false};let message='';
 if(action.startsWith('variant:')&&Object.hasOwn(designVariants,action.slice(8))){n.variant=action.slice(8);n.report=null;message='設計を選びました。';}
 else if(action==='old'||action==='new'){n.changed=action==='new';n.report=null;message='約束の時点を選びました。';}
 else if(action==='run'){
  n.report=designSuite(s.variant,s.changed);const key=`${s.variant}:${s.changed?'new':'old'}`;if(!n.seen.includes(key))n.seen.push(key);const failed=n.report.filter(x=>!x.pass).length;
  message=failed?`${failed} 件で約束と違います。結果と在庫を確認しましょう。`:'７つの試験は約束どおりでした。これだけで他の入力も正しいとは限りません。';
 }
 else if(['answer:shared','answer:separate','answer:fee'].includes(action)){n.answer=action.slice(7);message='設計の選択を記録しました。';}
 else if(action==='check'){n.checked=true;message='比較記録と選択を確認しました。';}
 else return {ok:false,message:'設計の操作を確認しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function restoreDesignSmells(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>120)throw new RangeError('途中記録が不正です。');let s=createDesignSmells();for(const a of saved.history){if(typeof a!=='string')throw new RangeError('途中記録が不正です。');const r=designSmellsAct(s,a);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
export function designSmellsComplete(s){return ['separate:old','shared:old','fee:old','late:old','separate:new','shared:new'].every(k=>s.seen.includes(k))&&s.answer==='shared'&&s.checked;}
