const simulationRuns=[];
export default function handler(req,res){
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Methods","GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers","Content-Type");
  if(req.method==="OPTIONS") return res.status(200).end();
  if(req.method==="GET") return res.json({success:true,data:simulationRuns,message:`Fetched ${simulationRuns.length} simulation runs`,timestamp:new Date().toISOString()});
  if(req.method==="POST"){const {rainfallMm=180,numBlockages=3,floodSeverity="High",landslideProb=88,trafficCongestion="Dense"}=req.body||{};const blockedPct=Math.min(Math.round(numBlockages*3.2+(rainfallMm/300)*12),45);const atRiskPct=Math.min(Math.round((landslideProb/100)*22+(rainfallMm/300)*10),38);const accessiblePct=Math.max(100-blockedPct-atRiskPct,17);const result={id:`SIM-RUN-${Math.floor(1000+Math.random()*9000)}`,inputs:{rainfallMm,numBlockages,floodSeverity,landslideProb,trafficCongestion},baselineStats:{accessiblePct:82,atRiskPct:10,blockedPct:8},simulatedStats:{accessiblePct,atRiskPct,blockedPct},affectedVehiclesCount:numBlockages*9,delayedDeliveriesCount:numBlockages*14,preparedActions:["Pre-position medicine stock in District Cachar (SMCH).","Reroute priority supply vehicles before weather landfall.","Alert NH-27 Sonapur operators & pre-stage excavators."],executedAt:new Date().toISOString()};simulationRuns.unshift(result);return res.status(201).json({success:true,data:result,message:"Simulation executed",timestamp:new Date().toISOString()});}
  return res.status(405).json({success:false,message:"Method not allowed"});
}
