export type LandFields={district:string;taluk:string;village:string;survey:string;subdivision:string;owner:string;extentAcres:number|null;documentNumber?:string;registrationDate?:string;latitude?:number|null;longitude?:number|null};
export type InputDocument={id:string;type:string;name:string;fields:LandFields;text?:string;size?:number;confidence?:number;method?:string};
export type Finding={id:string;severity:'critical'|'high'|'medium'|'low';title:string;explanation:string;documents:string[];field:string;values:Record<string,string>};
const norm=(v:unknown)=>String(v??'').trim().toLowerCase().replace(/[^a-z0-9]/g,'');
const cleanName=(v:string)=>v.replace(/\s+/g,' ').replace(/[,:;]+$/,'').trim();
const label=(v:unknown)=>String(v??'—').trim()||'—';
export function normalizeSurvey(s:string,sub:string){return `${s}`.replace(/\s+/g,'').replace(/[-]/g,'/').toUpperCase() + '/' + `${sub}`.replace(/\s+/g,'').toUpperCase();}
export function verifyDocuments(documents:InputDocument[]){
 const findings:Finding[]=[]; let n=1;
 const fields:(keyof LandFields)[]=['district','taluk','village','survey','subdivision','owner','extentAcres'];
 for(const field of fields){const present=documents.filter(d=>d.fields[field]!==null&&d.fields[field]!==undefined&&String(d.fields[field]).trim()!==''); if(present.length<2)continue;
  const groups=new Map<string,InputDocument[]>();present.forEach(d=>{let v=d.fields[field]; if(field==='survey'||field==='subdivision')v=String(v).replace(/\s+/g,'').replace(/-/g,'/'); if(field==='owner')v=cleanName(String(v)); const k=norm(v);groups.set(k,[...(groups.get(k)||[]),d]);});
  if(groups.size>1){const values:Record<string,string>={};present.forEach(d=>values[d.type]=label(d.fields[field]));const severity=field==='survey'||field==='subdivision'||field==='owner'?'critical':field==='extentAcres'?'high':'medium';findings.push({id:`F-${n++}`,severity,title:`${field==='extentAcres'?'Land extent':field==='owner'?'Registered owner':field[0].toUpperCase()+field.slice(1)} mismatch`,explanation:field==='survey'||field==='subdivision'?`The submitted records resolve to different survey identities. This can indicate a wrong parcel reference or document substitution and requires source-record verification.`:field==='owner'?`The owner name differs across the submitted set. Name variation can be legitimate, but this contradiction must be reconciled against the authoritative ownership record.`:`The submitted ${field} is not consistent across the document set.`,documents:present.map(d=>d.type),field:String(field),values});}}
 for(const d of documents){const required:(keyof LandFields)[]=['district','taluk','village','survey','subdivision','owner'];const missing=required.filter(k=>!String(d.fields[k]??'').trim());if(missing.length)findings.push({id:`F-${n++}`,severity:'medium',title:`Missing fields in ${d.type}`,explanation:`${d.type} is missing ${missing.join(', ')}. The case should not be auto-cleared until the land identity is complete.`,documents:[d.type],field:'missing',values:{[d.type]:missing.join(', ')}});}
 const fingerprints=documents.map(d=>`${norm(d.fields.district)}|${norm(d.fields.village)}|${norm(d.fields.survey)}|${norm(d.fields.subdivision)}|${norm(d.fields.owner)}|${norm(d.fields.extentAcres)}`);if(new Set(fingerprints).size<fingerprints.length)findings.push({id:`F-${n++}`,severity:'high',title:'Potential duplicate application fingerprint',explanation:'Two submitted records share the same normalized land identity fingerprint. This is a duplicate-review signal, not proof of fraud.',documents:documents.map(d=>d.type),field:'duplicate',values:{match:'district + village + survey + owner + extent'}});
 const critical=findings.filter(f=>f.severity==='critical').length,high=findings.filter(f=>f.severity==='high').length,medium=findings.filter(f=>f.severity==='medium').length;const score=Math.min(99,Math.max(4,critical*30+high*17+medium*6));const risk=score>=70?'HIGH':score>=40?'MEDIUM':'LOW';
 return {findings,score,risk,recommendation:score>=70?'HOLD FOR OFFICER REVIEW':score>=40?'REQUEST DOCUMENT REVIEW':'LOW RISK — PROCEED TO OFFICER APPROVAL'};
}
export function extractFields(text:string):Partial<LandFields>{
 const t=text.replace(/\r/g,'\n').replace(/[|]+/g,'\n').replace(/[ \t]+\n/g,'\n');
 const get=(patterns:RegExp[])=>{for(const p of patterns){const m=t.match(p);if(m?.[1])return cleanName(m[1]);}return ''};
 const num=(patterns:RegExp[])=>{const v=get(patterns);const n=Number(v);return Number.isFinite(n)?n:null};
 const surveyRaw=get([/(?:survey\s*(?:no|number)?|s\.?\s*no\.?|r\.?s\.?\s*no\.?)\s*[:#=-]?\s*([0-9]+\s*[/-]\s*[A-Za-z0-9]+|[0-9A-Za-z]+)/i]);
 let survey=surveyRaw,sub=''; const parts=surveyRaw.match(/^(\d+)\s*[/-]\s*([A-Za-z0-9]+)$/);if(parts){survey=parts[1];sub=parts[2]}
 const explicitSub=get([/(?:sub\s*division|subdivision|sub-division)\s*(?:no|number)?\s*[:#=-]?\s*([A-Za-z0-9]+)/i]); if(explicitSub)sub=explicitSub;
 const extentMatch=t.match(/(?:extent|area|land\s*extent|extent\s*of\s*property)\s*[:#=-]?\s*([0-9]+(?:\.[0-9]+)?)\s*(acres?|acre|cents?|cent|sq\.?\s*ft|sqft)?/i);
 let extentAcres:number|null=null;if(extentMatch?.[1]){const value=Number(extentMatch[1]);const unit=(extentMatch[2]||'acres').toLowerCase();if(Number.isFinite(value)){extentAcres=unit.startsWith('cent')?value/100:unit.startsWith('sq')?value/43560:value;}}
 const district=get([/district\s*[:#=-]?\s*([^\n]+?)(?=\s+(?:taluk|village|survey|patta|ownership|record\s+details)\b|\n|$)/i]);
 const taluk=get([/taluk\s*[:#=-]?\s*([^\n]+?)(?=\s+(?:village|survey|patta|ownership|record\s+details)\b|\n|$)/i]);
 const village=get([/(?:revenue\s*village|village)\s*[:#=-]?\s*([^\n]+?)(?=\s+(?:survey|patta|extent|ownership|record\s+details)\b|\n|$)/i]);
 const owner=get([/(?:current\s+owner|registered\s+owner|owner(?:\s*name)?|patta\s*holder|name\s*of\s*owner)\s*[:#=-]?\s*([^\n]+?)(?=\s+(?:previous\s+owner|record\s+details|status|reference|issue\s+date)\b|\n|$)/i]);
 const latitude=num([/(?:latitude|lat)\s*[:=]?\s*(-?\d{1,2}(?:\.\d+)?)/i]);
 const longitude=num([/(?:longitude|long|lng|lon)\s*[:=]?\s*(-?\d{1,3}(?:\.\d+)?)/i]);
 return {district,taluk,village,survey,subdivision:sub,owner,extentAcres,documentNumber:get([/(?:document\s*(?:no|number)|doc\.?\s*no\.?)\s*[:#=-]?\s*([A-Za-z0-9/-]+)/i]),registrationDate:get([/(?:registration\s*date|date\s*of\s*registration)\s*[:#=-]?\s*([^\n;|]+)/i]),latitude,longitude};
}
