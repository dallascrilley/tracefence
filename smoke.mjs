import assert from 'node:assert/strict';
import {loadPlaywright,launchChrome} from './tools/find-playwright.mjs';
import {startServer} from './tools/static-server.mjs';
const server=process.env.TRACEFENCE_URL?null:await startServer('public',0);
const browser=await launchChrome(loadPlaywright());
try {
 const page=await browser.newPage({viewport:{width:1280,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.TRACEFENCE_URL||server.url,{waitUntil:'networkidle'});
 await page.click('#sample');await page.waitForSelector('#results tr');
 assert.equal(await page.textContent('#total'),'7');assert.equal(await page.textContent('#skipped'),'1');assert.equal(await page.textContent('#review'),'5');
 await page.click('#reveal');assert.match(await page.textContent('#plan'),/0 writes scheduled/);
 const [download]=await Promise.all([page.waitForEvent('download'),page.click('#download')]);assert.equal(download.suggestedFilename(),'tracefence-plan.json');
 let requests=0;const count=()=>requests++;page.on('request',count);
 await page.locator('byo-data').evaluate(el=>el.load('[{"id":"local","tool":"lookup","effect":"read","status":"succeeded","arguments":{}}]',{name:'local.json',source:'paste'}));
 assert.equal(await page.textContent('#reads'),'1');assert.equal(requests,0);
 await page.locator('byo-data').evaluate(el=>el.load('[{"id":"bad"}]',{name:'invalid.json',source:'paste'}));
 assert.match(await page.locator('byo-data').evaluate(el=>el.shadowRoot.textContent),/tool name/);
 await page.locator('byo-data').evaluate(el=>el.load('[{"id":"html","tool":"<img src=x onerror=alert(1)>","effect":"write","status":"timeout","arguments":{}}]',{name:'html.json',source:'paste'}));assert.equal(await page.locator('#results img').count(),0);
 await page.click('#reset');assert.equal(await page.locator('#workspace').isVisible(),false);
 await page.setViewportSize({width:390,height:844});await page.click('#sample');await page.waitForSelector('#results tr');assert.ok(await page.locator('#reveal').isVisible());
 assert.equal(errors.length,0);console.log('browser: sample, replay explanation, JSON export, own input with zero network requests, invalid input, inert HTML, clear and mobile passed');
} finally {await browser.close();if(server)await server.close();}
