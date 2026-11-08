import {unlocked} from './workshop-journey-data.js';
import {harborUnlocked} from './harbor-route.js';
import {midUnlocked,bridgeReady} from './midgame.js';
import {searchIds} from './adventure-expansion.js';
import {towerGateOpen,towerGateConverged} from './tower-gate.js';
import {forgeStationConverged} from './forge-station.js';
import {festivalReady} from './four-regions.js';
export const travelPlaces=[
 {id:'sky',name:'空の中継塔',target:'sky',image:'sky-tower.png',description:'雲の上で、各地からの知らせをつなぐ塔。',x:50,y:13,mx:50,my:13},
 {id:'mountain',name:'山の中継所',target:'mountain',image:'mountain-relay.png',description:'山道の情報が集まり、知らせをつなぐ中継所。',x:28,y:23,mx:16,my:22},
 {id:'valley',name:'谷の記録所',target:'valley',image:'valley-hub.png',description:'山を越えた谷で、荷物と届け先の記録を預かる場所。',x:65,y:23,mx:83,my:21},
 {id:'mist',name:'霧の関所',target:'mist',image:'mist-gate.png',description:'霧の向こうから訪れる旅人と知らせを迎える関所。',x:88,y:22,mx:83,my:43},
 {id:'archive',name:'森の文庫',target:'mid-archive',image:'forest-library.png',description:'木々に囲まれた、本と記録を大切に守る文庫。',x:13,y:43,mx:16,my:43},
 {id:'windmill',name:'風車の里',target:'mid-windmill',image:'windmill-village.png',description:'風車が回り、道具や橋を手入れする人たちの里。',x:35,y:48,mx:49,my:39},
 {id:'forge',name:'星鉄の鍛冶街',target:'forge',image:'forge-town.png',description:'山のふもとで星鉄を扱い、古い道具を直す街。',x:63,y:48,mx:50,my:62},
 {id:'station',name:'風待ちの駅',target:'station',image:'wind-station.png',description:'人と荷物が集まり、風を待ちながら旅立つ駅。',x:87,y:56,mx:83,my:66},
 {id:'harbor',name:'風の港町',target:'harbor',image:'wind-harbor.png',description:'海辺に船や飛行船が集まる、風の気持ちいい港町。',x:12,y:82,mx:16,my:88},
 {id:'workshop',name:'精霊の工房',target:'choices',image:'spirit-workshop.png',description:'リラとノノが暮らす、森のそばの小さな工房。',x:32,y:72,mx:16,my:65},
 {id:'city',name:'灯花の街',target:'city',image:'festival-city.png',description:'市場とギルドがにぎわい、祭りの準備が進む街。',x:54,y:85,mx:50,my:88},
 {id:'river',name:'水辺の村',target:'river',image:'river-village.png',description:'川の向こうで、人と精霊が一緒に暮らす村。',x:80,y:84,mx:83,my:88},
 {id:'garden',name:'星読みの庭園',target:'garden',image:'four-garden.webp',description:'星と花が彩る、ナギの庭園。',x:25,y:77,mx:26,my:77},
 {id:'observatory',name:'夢見の観測所',target:'observatory',image:'four-observatory.webp',description:'雲を眺め、空の知らせを集める観測所。',x:73,y:80,mx:74,my:80},
 {id:'tailor',name:'願いをかなえる仕立て屋',target:'tailor',image:'four-tailor.webp',description:'ダリオが旅人の願いを聞く仕立て屋。',x:28,y:91,mx:28,my:91},
 {id:'guide',name:'旅人の案内所',target:'guide',image:'four-guide.webp',description:'マルタが旅人の声を聞き、道を案内する場所。',x:73,y:94,mx:74,my:94},
];
export const travelIds=travelPlaces.map(p=>p.id);
export function availableTravelPlaces(state){
 const c=state.completed??[];
 return travelPlaces.filter(p=>p.id==='workshop'||(['river','city'].includes(p.id)&&unlocked(c))||(p.id==='harbor'&&harborUnlocked(c))||(['archive','windmill'].includes(p.id)&&midUnlocked(c))||(p.id==='mountain'&&state.bridgeOpen)||(p.id==='valley'&&searchIds.every(id=>c.includes(id)))||(['sky','mist'].includes(p.id)&&towerGateOpen(c))||(['forge','station'].includes(p.id)&&state.towerGateSeen)||(['garden','observatory','tailor','guide'].includes(p.id)&&state.forgeStationSeen));
}
export function travelNotice(id,state){
 const c=state.completed??[];
 if(['archive','windmill'].includes(id)&&!state.bridgeOpen&&bridgeReady(c))return '橋の準備が整いました。開通を見届けましょう。';
 if(['sky','mist'].includes(id)&&towerGateConverged(c)&&!state.towerGateSeen)return '塔と関所の手がかりを谷で合わせられます。';
 if(['forge','station'].includes(id)&&forgeStationConverged(c)&&!state.forgeStationSeen)return '直した道具を待つ土地へ送り出せます。';
 if(['garden','observatory','tailor','guide'].includes(id)&&festivalReady(c)&&!state.fourFestivalSeen)return '四つの土地の準備がそろい、祭りの知らせが届いています。';
 return '';
}
export function validTravelVisits(value){return Array.isArray(value)&&new Set(value).size===value.length&&value.every(id=>travelIds.includes(id));}
