const suppliesData=[
  {id:"SUP-DIST-01",district:"Cachar (Silchar HQ)",state:"Assam",population:1736000,primaryHospital:"Silchar Medical College & Hospital (SMCH)",isolationRisk:"High",stockLevels:{medicalOxygen:{daysRemaining:1.8,totalUnits:"4,200 Liters"},fuelPOL:{daysRemaining:3.5,totalUnits:"85,000 Liters"},riceGrains:{daysRemaining:12.0,totalUnits:"420 Metric Tonnes"},essentialMeds:{daysRemaining:4.2,totalUnits:"1,800 Kits"}}},
  {id:"SUP-DIST-02",district:"East Khasi Hills (Shillong)",state:"Meghalaya",population:824000,primaryHospital:"Civil Hospital Shillong",isolationRisk:"Medium",stockLevels:{medicalOxygen:{daysRemaining:6.5,totalUnits:"12,000 Liters"},fuelPOL:{daysRemaining:8.0,totalUnits:"120,000 Liters"},riceGrains:{daysRemaining:22.0,totalUnits:"680 Metric Tonnes"},essentialMeds:{daysRemaining:9.5,totalUnits:"4,200 Kits"}}},
  {id:"SUP-DIST-03",district:"East Sikkim (Gangtok)",state:"Sikkim",population:280000,primaryHospital:"STNM Hospital Gangtok",isolationRisk:"Medium",stockLevels:{medicalOxygen:{daysRemaining:4.2,totalUnits:"8,500 Liters"},fuelPOL:{daysRemaining:5.0,totalUnits:"62,000 Liters"},riceGrains:{daysRemaining:18.0,totalUnits:"210 Metric Tonnes"},essentialMeds:{daysRemaining:7.0,totalUnits:"2,100 Kits"}}}
];
export default function handler(req,res){
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Methods","GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers","Content-Type");
  if(req.method==="OPTIONS") return res.status(200).end();
  if(req.method==="GET") return res.json({success:true,data:suppliesData,message:"Fetched district supply inventories",timestamp:new Date().toISOString()});
  if(req.method==="POST"){const {district,supplyCategory="Medical Oxygen",requestedUnits="5,000 Liters"}=req.body||{};const r={requisitionId:`REQ-${Math.floor(1000+Math.random()*9000)}`,district,supplyCategory,requestedUnits,priority:"CRITICAL",status:"APPROVED & DISPATCHED",loggedAt:new Date().toISOString()};return res.status(201).json({success:true,data:r,message:`Requisition logged for ${district}`,timestamp:new Date().toISOString()});}
  return res.status(405).json({success:false,message:"Method not allowed"});
}
