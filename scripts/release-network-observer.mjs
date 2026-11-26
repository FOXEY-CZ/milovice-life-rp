// Release preview evidence only. No interception, no response body collection.
export function observeReleaseNetwork(page){
 const records=[], byRequest=new Map();
 function register(request){
  if(byRequest.has(request))return byRequest.get(request);
  const previous=request.redirectedFrom();
  const record={id:records.length+1,url:request.url(),method:request.method(),resourceType:request.resourceType(),redirectFrom:previous?byRequest.get(previous)?.id??null:null,status:null,outcome:'pending',failure:null};
  records.push(record);byRequest.set(request,record);return record;
 }
 const handlers={
  request:register,
  response:response=>{register(response.request()).status=response.status();},
  requestfinished:request=>{register(request).outcome='finished';},
  requestfailed:request=>{const record=register(request);record.outcome='failed';record.failure=request.failure()?.errorText??'unknown';}
 };
 for(const [event,handler] of Object.entries(handlers))page.on(event,handler);
 const snapshot=()=>({records:records.map(r=>({...r})),summary:{requests:records.length,httpErrors:records.filter(r=>r.status>=400).length,failed:records.filter(r=>r.outcome==='failed').length,pending:records.filter(r=>r.outcome==='pending').length,redirects:records.filter(r=>r.redirectFrom!==null).length}});
 return {snapshot,stop(){for(const [event,handler] of Object.entries(handlers))page.off(event,handler);return snapshot();}};
}
