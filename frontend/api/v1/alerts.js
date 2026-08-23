const alertsData=[
  {id:"ALT-2026-001",category:"Road blocked",severity:"Critical",timeDisplay:"4 mins ago",location:"Sonapur Tunnel South Portal (NH-27 KM 142.5), Meghalaya",affectedVehicle:"AS-01-GC-9921 (Cryogenic Oxygen Tanker 22,000L)",affectedDeliveryId:"DEL-OXY-8891",recommendedAction:"Reroute vehicle AS-01-GC-9921 via Lumding-Haflong Corridor B immediately.",isRead:false,summary:"340m debris fall completely blocked both lanes of NH-27."},
  {id:"ALT-2026-002",category:"Flood risk",severity:"High",timeDisplay:"18 mins ago",location:"NH-10 Teesta Bridge Melli, South Sikkim",affectedVehicle:"SK-01-B-3091 (Vaccine Cold Chain)",affectedDeliveryId:"DEL-VAC-3091",recommendedAction:"Monitor river level. Pre-position at Jorethang bypass.",isRead:false,summary:"Teesta at 8.2m. Submersion risk if level exceeds 9.0m."},
  {id:"ALT-2026-003",category:"Weather advisory",severity:"Medium",timeDisplay:"35 mins ago",location:"NH-715B Tawang Corridor, Arunachal Pradesh",affectedVehicle:"All Tawang-bound convoys",affectedDeliveryId:null,recommendedAction:"Delay departure by 2h. Snow clearance underway at Sela Pass.",isRead:true,summary:"Heavy snowfall at Sela Pass (4170m). GREF clearance in progress."}
];
export default function handler(req,res){
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Methods","GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers","Content-Type");
  if(req.method==="OPTIONS") return res.status(200).end();
  if(req.method==="GET") return res.json({success:true,data:alertsData,message:`Fetched ${alertsData.length} alerts`,timestamp:new Date().toISOString()});
  if(req.method==="POST"){const {category,severity,location,recommendedAction,summary}=req.body||{};const a={id:`ALT-2026-${Math.floor(1000+Math.random()*9000)}`,category,severity,timeDisplay:"Just now",timestamp:new Date().toISOString(),location,affectedVehicle:req.body.affectedVehicle||"Unspecified",recommendedAction,isRead:false,summary,createdAt:new Date().toISOString()};alertsData.unshift(a);return res.status(201).json({success:true,data:a,message:"Alert created",timestamp:new Date().toISOString()});}
  return res.status(405).json({success:false,message:"Method not allowed"});
}
