export const lifecycleExpeditionLevel={id:'village-lifecycle-expedition',number:'1224',kind:'lifecycle-expedition',name:'二つの村の記録をたどる',tag:'データのライフサイクル',title:'記録の役割と扱いを見極めよう',story:'薬師と祭りの係から、二つの記録の整理を頼まれました。何の段階かを考え、記録を正しく扱いましょう。'};
export const lifecycleStages={create:'作成',process:'処理',review:'確認・報告',retain:'保管・検索',destroy:'廃棄'};
export const lifecycleCases={
 herbs:{name:'薬草の配達',story:'北村２束、南村３束の配達をまとめます。',steps:[
  {stage:'create',prompt:'村ごとの束数を初めて記録します。',choices:{record:'北２・南３を記録',private:'関係のない病歴を記録'},answer:'record',reason:'目的は村別の束数です。'},
  {stage:'process',prompt:'村別の記録を合計します。',choices:{sum:'合計５束に集計',six:'合計６束に集計'},answer:'sum',reason:'２束と３束の合計です。'},
  {stage:'review',prompt:'報告の下書きには６束と書かれています。',choices:{fix:'集計と照合して５束に直す',send:'６束のまま報告'},answer:'fix',reason:'報告を記録と集計に照らして確認します。'},
  {stage:'retain',prompt:'後日、配達の確認が必要です。',choices:{keep:'確認期間中は記録と報告を保管',remove:'今すぐ両方を消す'},answer:'keep',reason:'後で確認できるよう保管します。'},
  {stage:'retain',prompt:'翌日、前の報告の合計を尋ねられました。',choices:{retrieve:'保管した５束の報告を読み出す',guess:'記録を見ずに６束と答える'},answer:'retrieve',reason:'保存済みの報告を検索して読み出します。'},
  {stage:'process',prompt:'遅れて届いた１束を追加し、合計を更新します。',choices:{update:'合計を６束に再集計',unchanged:'５束のままにする'},answer:'update',reason:'元の５束に１束が加わります。'},
  {stage:'review',prompt:'更新した合計を報告し直します。',choices:{report:'６束と報告を訂正する',old:'５束のまま報告する'},answer:'report',reason:'追加後の集計と報告を一致させます。'},
  {stage:'destroy',prompt:'必要な確認が終わり、保存を続ける理由や義務もないと確認できました。',choices:{delete:'この記録と報告を廃棄する',forever:'目的がなくても永久に保管する'},answer:'delete',reason:'この場面では保管を続ける理由がありません。'}
 ]},
 festival:{name:'祭りの灯り',story:'広場の灯りは東４個、西７個でした。',steps:[
  {stage:'create',prompt:'東と西の灯りの個数を記録します。',choices:{record:'東４・西７を記録',names:'来場者全員の住所を記録'},answer:'record',reason:'必要な情報は場所ごとの灯りの個数です。'},
  {stage:'process',prompt:'西は東より何個多いかを調べます。',choices:{diff:'３個多いと計算',eleven:'11個多いと計算'},answer:'diff',reason:'７個と４個の差を比べます。'},
  {stage:'review',prompt:'係に報告する前に結果を確認します。',choices:{report:'西が３個多いと報告',wrong:'西が11個多いと報告'},answer:'report',reason:'差は合計の11個ではありません。'},
  {stage:'retain',prompt:'定めた確認期間が終わりましたが、係から確認が終わるまで残すよう依頼されています。',choices:{hold:'確認が終わるまで保管を続ける',delete:'未確認のまま消す'},answer:'hold',reason:'この場面には、保管を続ける必要があります。'},
  {stage:'retain',prompt:'係が確認するため元の記録を求めました。',choices:{retrieve:'東４・西７を読み出す',change:'東４・西８に書き換える'},answer:'retrieve',reason:'保管した記録を変更せず読み出します。'},
  {stage:'destroy',prompt:'確認が終わり、保存を続ける必要も義務もないと確認しました。',choices:{delete:'記録と報告を廃棄する',publish:'全員に無制限に公開する'},answer:'delete',reason:'この場面では保持も公開も必要ありません。'}
 ]}
};
export function lifecycleExpeditionCreate(){return {selected:'herbs',actions:{herbs:[],festival:[]},stage:null,choice:null,reflection:null};}
export function lifecycleExpeditionAttempt(q){
 const steps=lifecycleCases[q.selected].steps,i=q.actions[q.selected].length,step=steps[i];if(!step)throw new RangeError('この依頼は終わっています。');
 if(!Object.hasOwn(lifecycleStages,q.stage)||!Object.hasOwn(step.choices,q.choice))return {ok:false,message:'段階と行動を両方選びましょう。'};
 if(q.stage!==step.stage||q.choice!==step.answer)return {ok:false,message:`この場面の中心は「${lifecycleStages[step.stage]}」です。${step.reason}`};
 q.actions[q.selected].push(step.answer);q.stage=null;q.choice=null;return {ok:true,message:'段階と行動を確認しました。'};
}
export function lifecycleExpeditionDone(q){return Object.keys(lifecycleCases).every(k=>q.actions[k].length===lifecycleCases[k].steps.length)&&q.reflection==='repeat';}
export function lifecycleExpeditionRestore(q){
 if(!q||!Object.hasOwn(lifecycleCases,q.selected)||!q.actions||!(q.stage===null||Object.hasOwn(lifecycleStages,q.stage))||![null,'repeat','once'].includes(q.reflection))throw new RangeError('記録が不正です。');
 const out=lifecycleExpeditionCreate();for(const k of Object.keys(lifecycleCases)){const a=q.actions[k],steps=lifecycleCases[k].steps;if(!Array.isArray(a)||a.length>steps.length||a.some((v,i)=>v!==steps[i].answer))throw new RangeError('記録が不正です。');out.actions[k]=[...a];}
 const step=lifecycleCases[q.selected].steps[out.actions[q.selected].length];if(!(q.choice===null||step&&Object.hasOwn(step.choices,q.choice)))throw new RangeError('記録が不正です。');
 out.selected=q.selected;out.stage=q.stage;out.choice=q.choice;out.reflection=q.reflection;return out;
}
