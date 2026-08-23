const deliveriesData=[
  {id:"DEL-OXY-8891",vehicleId:"V-NER-8891",cargoCategory:"Medicines",cargoDescription:"22,000L Cryogenic Medical Oxygen",cargoQuantity:"22,000 Liters",origin:"Guwahati Oxygen Hub",destination:"Silchar SMCH Hospital",priorityLevel:"Critical",etaOriginal:"2026-08-23T14:00:00Z",etaRevised:"2026-08-24T01:30:00Z",delayHours:11.5,status:"in_transit"},
  {id:"DEL-VAC-3091",vehicleId:"V-NER-3091",cargoCategory:"Medicines",cargoDescription:"1,850 Cold Chain Vaccine Kits",cargoQuantity:"1,850 Kits",origin:"Siliguri Depot",destination:"STNM Hospital Gangtok",priorityLevel:"Critical",etaOriginal:"2026-08-23T16:00:00Z",etaRevised:"2026-08-23T20:30:00Z",delayHours:4.5,status:"in_transit"},
  {id:"DEL-RICE-4412",vehicleId:"V-NER-4412",cargoCategory:"Food",cargoDescription:"Fortified Rice & Wheat",cargoQuantity:"42 MT",origin:"FCI Depot Changsari",destination:"Shillong Civil Supplies Warehouse",priorityLevel:"High",etaOriginal:"2026-08-23T18:00:00Z",etaRevised:"2026-08-23T19:15:00Z",delayHours:0.75,status:"in_transit"}
];
export default function handler(req,res){
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Methods","GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers","Content-Type");
  if(req.method==="OPTIONS") return res.status(200).end();
  if(req.method==="GET") return res.json({success:true,data:deliveriesData,message:`Fetched ${deliveriesData.length} deliveries`,timestamp:new Date().toISOString()});
  if(req.method==="POST"){const {vehicleId,cargoCategory,cargoDescription,cargoQuantity,origin,destination,priorityLevel}=req.body||{};const d={id:`DEL-${Math.floor(1000+Math.random()*9000)}`,vehicleId,cargoCategory,cargoDescription,cargoQuantity,origin,destination,priorityLevel:priorityLevel||"High",etaOriginal:new Date(Date.now()+8*3600000).toISOString(),etaRevised:new Date(Date.now()+8*3600000).toISOString(),delayHours:0,status:"in_transit",createdAt:new Date().toISOString()};deliveriesData.unshift(d);return res.status(201).json({success:true,data:d,message:`Delivery ${d.id} created`,timestamp:new Date().toISOString()});}
  return res.status(405).json({success:false,message:"Method not allowed"});
}
