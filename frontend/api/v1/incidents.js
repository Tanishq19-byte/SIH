function cors(res) { res.setHeader("Access-Control-Allow-Origin","*"); res.setHeader("Access-Control-Allow-Methods","GET,POST,PATCH,OPTIONS"); res.setHeader("Access-Control-Allow-Headers","Content-Type,Authorization"); }
function ok(res,data,msg,status=200){res.status(status).json({success:true,statusCode:status,message:msg,data,timestamp:new Date().toISOString()});}
function errR(res,msg,status=500){res.status(status).json({success:false,statusCode:status,message:msg,timestamp:new Date().toISOString()});}

let incidentsData = [
  { id:'INC-2026-001', title:'Sonapur Tunnel Portal Debris Fall', category:'Landslide', severity:'Critical', corridorId:'R-NH27-SILCHAR', state:'Meghalaya', district:'East Jaintia Hills', locationDescription:'NH-27 KM 142.5 near Sonapur Tunnel South Portal', reportedBy:'Inspector R. Terang', reporterAgency:'BRO 44 BRTF / NHIDCL Patrol', reportedTime:'2026-08-23T08:15:00Z', status:'Verified', impactSummary:'340m debris fall completely blocked both lanes of NH-27. 38 essential freight trucks stranded.', aiRiskIndex:94.5 },
  { id:'INC-2026-002', title:'Teesta River Melli Bridge Submersion', category:'Flood', severity:'High', corridorId:'R-NH10-GANGTOK', state:'Sikkim', district:'South Sikkim', locationDescription:'NH-10 Teesta Bridge at Melli', reportedBy:'Field Officer A. Sharma', reporterAgency:'NHIDCL Sikkim Division', reportedTime:'2026-08-23T06:30:00Z', status:'Under Control', impactSummary:'Teesta river level at 8.2m causing NH-10 partial submersion. Alternate route via Jorethang active.', aiRiskIndex:71.2 },
  { id:'INC-2026-003', title:'Haflong - Silchar NH-54 Landslip', category:'Landslide', severity:'Medium', corridorId:'R-NH54-HAFLONG', state:'Assam', district:'Dima Hasao', locationDescription:'NH-54 KM 89 near Haflong Hill', reportedBy:'Sub-Inspector K. Das', reporterAgency:'NHAI Patrol', reportedTime:'2026-08-23T09:45:00Z', status:'Reported', impactSummary:'Minor landslip cleared single lane. Single-lane traffic alternating.', aiRiskIndex:52.0 }
];

module.exports = function handler(req,res) {
  cors(res);
  if (req.method==='OPTIONS') return res.status(200).end();

  if (req.method==='GET') {
    const {status,category,severity}=req.query;
    let result=[...incidentsData];
    if(status) result=result.filter(i=>i.status===status);
    if(category) result=result.filter(i=>i.category===category);
    if(severity) result=result.filter(i=>i.severity===severity);
    return ok(res,result,`Fetched ${result.length} field incidents`);
  }
  if (req.method==='POST') {
    const {title,category,severity,state,district,locationDescription,reportedBy,reporterAgency}=req.body||{};
    if(!title) return errR(res,'title is required',400);
    const newInc={
      id:`INC-2026-${Math.floor(1000+Math.random()*9000)}`,
      title,category,severity,state,district,locationDescription,
      reportedBy:reportedBy||'Field Officer App',
      reporterAgency:reporterAgency||'Ground Inspection Team',
      reportedTime:new Date().toISOString(),
      status:'Reported',
      impactSummary:req.body.impactSummary||'Ground incident submitted.',
      aiRiskIndex:severity==='Critical'?92.0:65.0,
      createdAt:new Date().toISOString()
    };
    incidentsData.unshift(newInc);
    return ok(res,newInc,`Report #${newInc.id} received`,201);
  }
  return errR(res,'Method not allowed',405);
};
