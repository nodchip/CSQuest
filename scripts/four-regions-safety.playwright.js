// Preservation and travel-cancellation checks in isolated browser contexts.
async page => {
 const url=new URL('./',page.url()).href,key='csquest-workshop-journey-v1',report={};
 for(const mode of ['invalid','quota','travel']){
  const c=await page.context().browser().newContext({viewport:{width:390,height:844}}),p=await c.newPage();
  try{
   if(mode==='quota')await p.addInitScript(key=>{const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k===key)throw new DOMException('full','QuotaExceededError');return original.call(this,k,v);};},key);
   await p.goto(url);
   if(mode==='invalid'){
    await p.evaluate(key=>localStorage.setItem(key,'{broken'),key);await p.reload();await p.locator('#new').click();
    report.invalid={warning:await p.locator('.notice').innerText(),saved:await p.evaluate(key=>localStorage.getItem(key),key)};
   }else if(mode==='quota'){
    await p.locator('#new').click();report.quota={warning:await p.locator('.notice').innerText(),saved:await p.evaluate(key=>localStorage.getItem(key),key)};
   }else{
    const s=await p.evaluate(async()=>{const t=await import('./src/tower-gate.js'),f=await import('./src/forge-station.js');return {place:'garden',program:['forward','forward'],executed:true,completed:['forest','branch','river','harbor-message','archive-search','windmill-lamp','search-bfs','search-weighted','search-compare','data-record','data-filter','data-join',...t.towerGateIds,...f.forgeStationIds],bridgeOpen:true,towerGateSeen:true,forgeStationSeen:true,mapVisited:['workshop','station','garden']};});
    await p.evaluate(({key,s})=>localStorage.setItem(key,JSON.stringify(s)),{key,s});await p.reload();await p.locator('#continue').click();await p.locator('#travel').click();
    await p.locator('[data-travel-place="garden"]').click();const self=await p.locator('#travel-depart').count();await p.locator('#travel-close').click();
    await p.locator('[data-travel-place="guide"]').click();await p.locator('#travel-close').click();await p.reload();await p.locator('#continue').click();await p.locator('#back').click();
    report.travel={selfDepart:self,back:await p.locator('h1').innerText(),place:await p.evaluate(key=>JSON.parse(localStorage.getItem(key)).place,key)};
   }
  }catch(e){report[mode]={error:String(e),heading:await p.locator('h1').allTextContents()};}finally{await c.close();}
 }
 report.ok=report.invalid?.saved==='{broken'&&report.invalid?.warning.includes('保護')&&report.quota?.saved===null&&report.quota?.warning.includes('保存できません')&&report.travel?.selfDepart===0&&report.travel?.place==='garden';return report;
}
