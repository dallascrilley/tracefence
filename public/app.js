import { inspectTrace } from './src/standout.js';
let report;
const narrow = matchMedia('(max-width: 760px)');
function prepareViewport() { document.querySelector('.format').open = !narrow.matches; }
prepareViewport();
narrow.addEventListener('change', prepareViewport);
const $ = selector => document.querySelector(selector);
const data = $('byo-data');
data.validate = rows => { try { inspectTrace(rows); return []; } catch(error) { return [error.message]; } };
function text(tag, value, cls) { const el=document.createElement(tag);el.textContent=value;if(cls)el.className=cls;return el; }
function show(rows) {
  report=inspectTrace(rows); $('#empty').hidden=true; $('#workspace').hidden=false;
  for(const key of ['total','skipped','review','reads']) $('#'+key).textContent=report.summary[key];
  $('#conflicts').textContent=report.summary.key_conflicts ? report.summary.key_conflicts+' calls share a key with different arguments' : 'No conflicting keys found';
  $('#results').replaceChildren();
  for(const row of report.calls) {
    const tr=document.createElement('tr');tr.dataset.action=row.action;
    const identity=document.createElement('td');identity.append(text('span',row.id,'call-name'),text('span',row.tool,'tool-name'));
    tr.append(identity,text('td',row.status));
    const decision=text('td',({review:'Review',skip_completed:'Skip completed',replay_read:'Replay read'})[row.action],'decision '+row.action);tr.append(decision);
    const detail=text('td',row.reason);if(row.related_ids.length)detail.append(text('small','Related: '+row.related_ids.join(', ')));tr.append(detail);$('#results').append(tr);
  }
  $('#download').disabled=false;$('#reveal').disabled=false;$('#plan').hidden=true;
  if(narrow.matches) $('.format').open=false;
}
data.addEventListener('byo-data', event=>show(event.detail.data));
$('#sample').addEventListener('click',async()=>{const raw=await fetch('./sample.json').then(r=>r.text());await data.load(raw,{name:'sample.json',source:'sample'});});
$('#reveal').addEventListener('click',()=> {$('#plan').hidden=false;$('#plan').scrollIntoView({behavior:'instant',block:'nearest'});});
$('#download').addEventListener('click',()=>{
 if(!report)return;const url=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='tracefence-plan.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),500);
});
$('#reset').addEventListener('click',()=>{report=null;data.clear();$('#workspace').hidden=true;$('#empty').hidden=false;$('#download').disabled=true;$('#reveal').disabled=true;});
