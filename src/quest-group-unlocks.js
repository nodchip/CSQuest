// Each rule names a previously available group whose two completed quests
// introduce a related group. A completed quest always preserves its group.
export function unlockedQuestGroups(groups, plan, completed) {
 const done=new Set(completed), ids=new Set(plan.start);
 // A group added without a rollout rule remains reachable until a rule is
 // deliberately assigned; this also protects saves across content updates.
 for(const group of groups)if(!plan.start.includes(group.id)&&!Object.hasOwn(plan.after,group.id))ids.add(group.id);
 for(const group of groups)if(group.quests.some(id=>done.has(id)))ids.add(group.id);
 for(const [id,source] of Object.entries(plan.after)){
  const prerequisite=groups.find(group=>group.id===source);
  if(prerequisite&&new Set(prerequisite.quests.filter(quest=>done.has(quest))).size>=2)ids.add(id);
 }
 return groups.filter(group=>ids.has(group.id));
}

// City: preparations lead to planning; arranging the market's cards leads
// from merging sorted runs to sorting by digits.
export const cityGroupPlan={
 start:['local','dependency','sorting'],
 after:{coinplan:'dependency',mergeruns:'sorting',radixparcel:'mergeruns'}
};

// At the riverside, counting combinations leads into sampling, while the
// watergate's tools lead into the transformation of number cards.
export const riverGroupPlan={
 start:['local','types','herbcomb'],
 after:{numbers:'types',samplingbias:'herbcomb',intervalsample:'samplingbias'}
};

export const mountainGroupPlan={
 start:['routes','ropegcd','primroads'],
 after:{search:'routes',astar:'search',negativejourney:'astar'}
};

export const harborGroupPlan={
 start:['local','counting','cooperation'],
 after:{'parallel-map':'counting',performance:'parallel-map',deadlock:'cooperation',onebox:'deadlock',condition:'onebox',rendezvous:'condition'}
};

// Each row is a path through related work. A one-quest group is always a
// leaf, so it cannot prevent the next group from opening.
const chains={
 workshop:[
  ['start','flower'],
  ['instructions','debug','refactor','invariant','recursion','fiblantern','boxcollection'],
  ['scrolltokens','scopelight','closurejourney','lambdajourney','sharingjourney','streamjourney']
 ],
 archive:[
  ['local','collections','linkedletters','listjourney','stack','expressions','strings','utfmessage','versions','filenames','fileaccess'],
  ['tree','treeorders','bst-delete','avlbranches','quickstones'],
  ['complexity','lowerbound','hash','shelfresize','bloomjourney','scrollretrieval','bayesscrolls']
 ],
 windmill:[['village','reliability','energy-window'],['scatter'],['patterns','prefix']],
 valley:[
  ['delivery','lists','relations','query-join','leftjoin','sqlnull','group-ledger'],
  ['transactions','rowbalance','journal','ledgersplit','shardjourney'],
  ['replicajourney','distributedjourney','quorumjourney','twophasejourney']
 ],
 forge:[
  ['lights','numbers','signedlamps','carrysigns','rounding-stones','lampneg','switch'],
  ['storage','boxes','cache','cacheways','writepolicy','sharingshelves','flashshelves'],
  ['cpu','instructionhazard','io','dmagems','objects','forktales']
 ],
 station:[['delivery','priority','agingwork','office'],['tools','spacefit','replacement','cowpages','tlbjourney','ringparcel']],
 sky:[
  ['local','layers','ipv4pieces','window','handshaketowers','congestion','retryeffect'],
  ['address','dns-expiry','route-prefix','adjacency-route','pagerankjourney'],
  ['http','etagmap','crypto','paritylantern','events','clockjourney']
 ],
 mist:[['local','security','injection','signature','availability'],['automata','nfagate','gatetests']],
 tailor:[['local-0'],['local-2','testing']],
 guide:[
  ['local-0','local-4'],
  ['local-2','usability','textcontrast','dialogroute'],
  ['requirements','study-review','ethics','privacy']
 ],
 garden:[
  ['local-0','local-4'],
  ['local-2','vector','lightdot','matrix','spanjourney','eigenjourney','svdjourney','rayprojection','color','image','pixelwindow','depth'],
  ['quantifiers','relations','logic-rules','garden-advanced','constraint','flowerunion','squareinduction','modulo-wheel']
 ],
 observatory:[
  ['local-0','local-4'],
  ['local-2','forecast','probability','event-independence','threedraws','warningprior','statistics','variance','interquartile','regression','supervised','confusioncards','foldchoice','pcajourney','cluster'],
  ['agent','planning','local-search','descent','derivative','lightintegral','eulerlantern','guardian','reward-route','layers']
 ]
};

function planFromChains(paths){
 const start=[],after={};
 for(const path of paths){
  start.push(path[0]);
  for(let i=1;i<path.length;i++)after[path[i]]=path[i-1];
 }
 return {start,after};
}

export const questGroupPlans={
 ...Object.fromEntries(Object.entries(chains).map(([region,paths])=>[region,planFromChains(paths)])),
 city:cityGroupPlan,river:riverGroupPlan,mountain:mountainGroupPlan,harbor:harborGroupPlan
};

// `known` also preserves groups visible before upgrading an old save. The
// first baseline is silent; later unlocks remain pending until the menu opens.
export function updateQuestGroupNotices(state, groupsByRegion, legacy=false){
 const completion=region=>region==='workshop'&&state.executed?[...state.completed,'workshop-opening']:state.completed;
 if(state.questGroups===undefined){
  const known={};
  for(const [region,groups] of Object.entries(groupsByRegion)){
   const visible=legacy?groups:unlockedQuestGroups(groups,questGroupPlans[region],completion(region));
   known[region]=visible.filter(group=>group.available.length||group.complete).map(group=>group.id);
  }
  state.questGroups={known,pending:{}};
  return;
 }
 for(const [region,groups] of Object.entries(groupsByRegion)){
  const known=new Set(state.questGroups.known[region]??[]);
  const pending=new Set(state.questGroups.pending[region]??[]);
  const plan=questGroupPlans[region];
  const visible=unlockedQuestGroups(groups,plan,completion(region)).filter(group=>group.available.length||group.complete);
  for(const group of visible){
   if(!known.has(group.id)&&!plan.start.includes(group.id))pending.add(group.id);
   known.add(group.id);
  }
  state.questGroups.known[region]=[...known];
  state.questGroups.pending[region]=[...pending];
 }
}

export function validQuestGroupNotices(value){
 const validMap=map=>map&&typeof map==='object'&&!Array.isArray(map)&&Object.entries(map).every(([region,ids])=>
  region in questGroupPlans&&Array.isArray(ids)&&new Set(ids).size===ids.length&&ids.every(id=>typeof id==='string'&&id.length>0&&id.length<=100));
 return value&&typeof value==='object'&&validMap(value.known)&&validMap(value.pending);
}
