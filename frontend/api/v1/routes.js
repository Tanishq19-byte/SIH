const routesData=[
  {id:"R-NH27-SILCHAR",name:"NH-27 Guwahati - Silchar Lifeline Corridor",states:["Assam","Meghalaya"],distanceKm:342,status:"blocked",disruptionType:"Sonapur Tunnel 340m Mudslide",accessibilityScore:22.0,normalTravelHours:7.5,currentTravelHours:19.0,riskLevel:"Critical"},
  {id:"R-NH10-GANGTOK",name:"NH-10 Siliguri - Gangtok Lifeline",states:["West Bengal","Sikkim"],distanceKm:114,status:"warning",disruptionType:"Teesta River Melli Submersion",accessibilityScore:58.0,normalTravelHours:3.5,currentTravelHours:8.0,riskLevel:"High"},
  {id:"R-NH54-HAFLONG",name:"NH-54 Silchar - Haflong Corridor",states:["Assam"],distanceKm:178,status:"warning",disruptionType:"Minor landslip KM 89",accessibilityScore:67.0,normalTravelHours:4.5,currentTravelHours:6.5,riskLevel:"Medium"},
  {id:"R-NH37-TINSUKIA",name:"NH-37 Guwahati - Tinsukia Brahmaputra Corridor",states:["Assam"],distanceKm:488,status:"operational",disruptionType:null,accessibilityScore:91.0,normalTravelHours:9.0,currentTravelHours:9.5,riskLevel:"Low"},
  {id:"R-NH13-IMPHAL",name:"NH-13 Jiribam - Imphal Lifeline",states:["Manipur"],distanceKm:225,status:"warning",disruptionType:"Barak Valley fog advisory",accessibilityScore:74.0,normalTravelHours:6.0,currentTravelHours:8.5,riskLevel:"Medium"}
];
export default function handler(req,res){
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Methods","GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers","Content-Type");
  if(req.method==="OPTIONS") return res.status(200).end();
  const {id}=req.query;
  if(id){const route=routesData.find(r=>r.id===id);if(!route) return res.status(404).json({success:false,message:`Route ${id} not found`});return res.json({success:true,data:route,timestamp:new Date().toISOString()});}
  return res.json({success:true,data:routesData,message:`Fetched ${routesData.length} corridors`,timestamp:new Date().toISOString()});
}
