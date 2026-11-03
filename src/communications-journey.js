import {mpiMatch,mpiComms,mpiSources,mpiTags} from './mpi-envelope.js';
import {pipeEofReplay,pipeEofDone,pipeEofActions} from './pipe-eof.js';
export const commJourneyLevel={id:'forest-communications-journey',number:'1115',kind:'communications-journey',name:'伝令の道をひらく',tag:'MPI とパイプをつなぐ遠征',title:'塔から村へ薬を届けよう',story:'村へ向かう薬の伝令が途切れました。塔で封筒を照合し、二人の伝令が使う筒の終わりを確かめて、村に薬を届けましょう。'};
export const commPlaces={camp:'ギルドの野営地',tower:'封筒の塔',relay:'伝令の中継所',village:'薬師の村'};
export function commJourneyReplay(history){
 if(!Array.isArray(history)||history.length>100)throw new RangeError('遠征記録が不正です。');const s={place:'camp',comm:'blue',source:'0',tag:'3',mpi:'ready',towerDone:false,pipe:[],pipeDone:false,won:false,last:''},places=Object.keys(commPlaces);
 for(const a of history){if(typeof a!=='string'||s.won)throw new RangeError('遠征の操作が不正です。');
  if(a==='next'||a==='back'){const i=places.indexOf(s.place),j=i+(a==='next'?1:-1);if(j<0||j>=places.length)throw new RangeError('その方向には進めません。');if(a==='next'&&s.place==='tower'&&!s.towerDone)throw new RangeError('まず塔で伝言を受け取りましょう。');if(a==='next'&&s.place==='relay'&&!s.pipeDone)throw new RangeError('まず中継所で伝令の終わりを確かめましょう。');s.place=places[j];s.last=`${commPlaces[s.place]}へ進みました。`;}
  else if(s.place==='tower'&&a.startsWith('set:')){const parts=a.split(':');if(parts.length!==3||!['comm','source','tag'].includes(parts[1])||!Object.hasOwn(({comm:mpiComms,source:mpiSources,tag:mpiTags})[parts[1]],parts[2])||!['ready','sent'].includes(s.mpi)||s.towerDone)throw new RangeError('受信の指定を確認しましょう。');s[parts[1]]=parts[2];s.last='受信の指定を変更しました。';}
  else if(s.place==='tower'&&a==='mpi:send'&&s.mpi==='ready'&&!s.towerDone){s.mpi='sent';s.last='鍵を含む伝言の送信を開始しました。';}
  else if(s.place==='tower'&&a==='mpi:receive'&&s.mpi==='sent'&&!s.towerDone){if(mpiMatch('key',s.comm,s.source,s.tag)){s.mpi='received';s.towerDone=true;s.last='伝言が一致し、鍵を受け取りました。';}else{s.mpi='waiting';s.last='この模型に一致する伝言がなく受信待ちです。設定を変えるには実験をやり直しましょう。';}}
  else if(s.place==='tower'&&a==='mpi:retry'&&!s.towerDone){s.mpi='ready';s.last='封筒の実験を送信前に戻しました。';}
  else if(s.place==='relay'&&a==='pipe:retry'&&!s.pipeDone){s.pipe=[];s.last='筒と書き口を初めに戻しました。';}
  else if(s.place==='relay'&&a.startsWith('pipe:')&&!s.pipeDone){const op=a.slice(5);if(!Object.hasOwn(pipeEofActions,op))throw new RangeError('筒の操作が不正です。');const h=[...s.pipe,op],r=pipeEofReplay(h);s.pipe=h;s.last=r.last;if(pipeEofDone({history:h,answer:'closed',checked:true})){s.pipeDone=true;s.last+=' 伝令の終わりを確認しました。';}}
  else if(s.place==='village'&&a==='deliver'&&s.towerDone&&s.pipeDone){s.won=true;s.last='薬が村に届きました。';}
  else throw new RangeError('今いる場所と操作を確認しましょう。');
 }
 return s;
}
export function commJourneyCreate(){return {history:[]};}
export function commJourneyAct(q,a){const h=[...q.history,a],s=commJourneyReplay(h);q.history=h;return s;}
export function commJourneyRestore(q){if(!q)throw new RangeError('遠征記録が不正です。');commJourneyReplay(q.history);return {history:[...q.history]};}
