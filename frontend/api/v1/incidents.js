const incidentsData = [
  {id:"INC-2026-001",title:"Sonapur Tunnel Portal Debris Fall",category:"Landslide",severity:"Critical",corridorId:"R-NH27-SILCHAR",state:"Meghalaya",district:"East Jaintia Hills",locationDescription:"NH-27 KM 142.5 near Sonapur Tunnel South Portal",reportedBy:"Inspector R. Terang",reporterAgency:"BRO 44 BRTF / NHIDCL Patrol",reportedTime:"2026-08-23T08:15:00Z",status:"Verified",impactSummary:"340m debris fall completely blocked both lanes of NH-27. 38 trucks stranded.",aiRiskIndex:94.5},
  {id:"INC-2026-002",title:"Teesta River Melli Bridge Submersion",category:"Flood",severity:"High",corridorId:"R-NH10-GANGTOK",state:"Sikkim",district:"South Sikkim",locationDescription:"NH-10 Teesta Bridge at Melli",reportedBy:"Field Officer A. Sharma",reporterAgency:"NHIDCL Sikkim Division",reportedTime:"2026-08-23T06:30:00Z",status:"Under Control",impactSummary:"Teesta river at 8.2m causing NH-10 partial submersion.",aiRiskIndex:71.2},
  {id:"INC-2026-003",title:"Haflong - Silchar NH-54 Landslip",category:"Landslide",severity:"Medium",corridorId:"R-NH54-HAFLONG",state:"Assam",district:"Dima Hasao",locationDescription:"NH-54 KM 89 near Haflong Hill",reportedBy:"Sub-Inspector K. Das",reporterAgency:"NHAI Patrol",reportedTime:"2026-08-23T09:45:00Z",status:"Reported",impactSummary:"Minor landslip cleared single lane.",aiRiskIndex:52.0}
];
export default function handler(req,res){
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Methods","GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers","Content-Type,Authorization");
  if(req.method==="OPTIONS") return res.status(200).end();
  const ok=(data,msg,st=200)=>res.status(st).json({success:true,statusCode:st,message:msg,data,timestamp:new Date().toISOString()});
  if(req.method==="GET"){
    const {status,category,severity}=req.query;
    let r=[...incidentsData];
    if(status) r=r.filter(i=>i.status===status);
    if(category) r=r.filter(i=>i.category===category);
    if(severity) r=r.filter(i=>i.severity===severity);
    return ok(r,`Fetched ${r.length} field incidents`);
  }
  if(req.method==="POST"){
    const {title,category,severity,state,district,locationDescription,reportedBy,reporterAgency}=req.body||{};
    if(!title) return res.status(400).json({success:false,message:"title required"});
    const inc={id:`INC-2026-${Math.floor(1000+Math.random()*9000)}`,title,category,severity,state,district,locationDescription,reportedBy:reportedBy||"Field Officer App",reporterAgency:reporterAgency||"Ground Team",reportedTime:new Date().toISOString(),status:"Reported",impactSummary:req.body.impactSummary||"Ground incident submitted.",aiRiskIndex:severity==="Critical"?92.0:65.0,createdAt:new Date().toISOString()};
    incidentsData.unshift(inc);
    return ok(inc,`Report #${inc.id} received`,201);
  }
  return res.status(405).json({success:false,message:"Method not allowed"});
}
