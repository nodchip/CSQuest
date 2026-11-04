export const acidWorkshopLevel={id:'village-acid-workshop',number:'1225',kind:'acid-workshop',name:'四つの約束と薬草の台帳',tag:'取引と ACID',title:'四つの約束を使って台帳を守ろう',story:'薬師の台帳には、途中で止まる仕事や同時の注文が届きます。四つの約束を比べ、壊れた記録を防ぎましょう。'};
export const acidProperties={atomic:'原子性（Atomicity）',consistency:'一貫性（Consistency）',isolation:'分離性（Isolation）',durability:'永続性（Durability）'};
export const acidCases={
 atomic:{name:'途中で止まる移動',story:'北５束・南１束から３束を移す途中、北だけ減らした後に失敗します。',fix:'失敗した取引全体を取り消す'},
 consistency:{name:'不足した束の移動',story:'北１束・南５束から２束を移す要求。各村の束数は０以上という規則です。',fix:'移動前に不足を検査し、規則に反する取引を拒否する'},
 isolation:{name:'二人の同時注文',story:'在庫２束を２人が同時に１束ずつ使います。両者が更新前の２を読む順序を試します。',fix:'取引を直列と同じ結果にする順序で実行する'},
 durability:{name:'確定直後の停止',story:'保管済み４束を７束へ更新し、確定した直後に停止・再起動します。',fix:'停止後も復元できる記録を確保してから確定を返す'}
};
export function acidRun(id,protect){
 if(!Object.hasOwn(acidCases,id)||typeof protect!=='boolean')throw new RangeError('条件が不正です。');
 if(id==='atomic'){const start={north:5,south:1},after=protect?{...start}:{north:start.north-3,south:start.south};return {before:'北５・南１',after:`北${after.north}・南${after.south}`,ok:after.north===start.north&&after.south===start.south,explanation:protect?'途中の減算も取り消しました。':'北だけ減ったまま残りました。'};}
 if(id==='consistency'){const start={north:1,south:5},after=protect?{...start}:{north:start.north-2,south:start.south+2};return {before:'北１・南５',after:`北${after.north}・南${after.south}`,ok:after.north>=0&&after.south>=0,explanation:protect?'不足を確認し、両方を変えずに拒否しました。':'移動の両側は実行されましたが、北が負になりました。'};}
 if(id==='isolation'){const initial=2,firstRead=initial,secondRead=protect?firstRead-1:initial,after=secondRead-1;return {before:'在庫２',after:`在庫${after}`,ok:after===0,explanation:protect?'２人の更新を順に反映しました。':'両者が２を読み、同じ１を書いたため一方の更新が失われました。'};}
 const initial=4,committed=7,persisted=protect?committed:initial;return {before:'保管済み４',after:`再起動後${persisted}`,ok:persisted===committed,explanation:protect?'確定した７を復元できました。':'確定後の変更が消えて古い４に戻りました。'};
}
export function acidCreate(){return {selected:'atomic',protect:false,property:null,prediction:null,seen:[],reflection:null};}
export function acidCheck(q){const result=acidRun(q.selected,q.protect),correct=q.property===q.selected&&q.prediction===(result.ok?'ok':'fail'),key=`${q.selected}:${q.protect?'fixed':'broken'}`;if(correct&&!q.seen.includes(key))q.seen.push(key);return {...result,correct};}
export function acidDone(q){return Object.keys(acidCases).every(k=>['fixed','broken'].every(m=>q.seen.includes(`${k}:${m}`)))&&q.reflection==='scope';}
export function acidRestore(q){
 const keys=Object.keys(acidCases).flatMap(k=>['fixed','broken'].map(m=>`${k}:${m}`));
 if(!q||!Object.hasOwn(acidCases,q.selected)||typeof q.protect!=='boolean'||!(q.property===null||Object.hasOwn(acidProperties,q.property))||![null,'ok','fail'].includes(q.prediction)||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!keys.includes(k))||![null,'scope','all'].includes(q.reflection))throw new RangeError('記録が不正です。');
 return {selected:q.selected,protect:q.protect,property:q.property,prediction:q.prediction,seen:[...q.seen],reflection:q.reflection};
}
