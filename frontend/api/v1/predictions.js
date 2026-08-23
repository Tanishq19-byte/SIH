const predictionsData=[
  {corridorId:"R-NH27-SILCHAR",corridorName:"NH-27 Sonapur Tunnel Corridor",riskScore:87,category:"HIGH",disruptionProbability:88.5,contributingFactors:[{factor:"Heavy rainfall intensity (220mm/24h)",points:31},{factor:"Terrain vulnerability (Slope 42 deg)",points:22},{factor:"Historical disruption frequency",points:18},{factor:"Recent field incident report",points:16}],recommendation:"Avoid this corridor for next 4h. Route B via Lumding-Haflong recommended.",evaluatedAt:new Date().toISOString()},
  {corridorId:"R-NH10-GANGTOK",corridorName:"NH-10 Teesta Melli Corridor",riskScore:68,category:"MEDIUM",disruptionProbability:64.2,contributingFactors:[{factor:"River level rise (Teesta 8.2m)",points:28},{factor:"Flood plain proximity",points:19},{factor:"Historical submersion frequency",points:14}],recommendation:"Monitor hourly. Jorethang bypass pre-positioned.",evaluatedAt:new Date().toISOString()}
];
export default function handler(req,res){
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Methods","GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers","Content-Type");
  if(req.method==="OPTIONS") return res.status(200).end();
  if(req.method==="GET") return res.json({success:true,data:predictionsData,message:"Fetched predictions",timestamp:new Date().toISOString()});
  if(req.method==="POST"){const {rainfallMm=180,terrainVulnerability=8,historicalFrequency=7}=req.body||{};const riskScore=Math.min(Math.round(rainfallMm*0.25+terrainVulnerability*4.5+historicalFrequency*3.0),98);const category=riskScore>=75?"CRITICAL":riskScore>=50?"HIGH":"MEDIUM";const result={corridorId:req.body.corridorId||"R-CUSTOM-EVAL",riskScore,category,disruptionProbability:Math.min(riskScore*0.95,99.0),recommendation:riskScore>=75?"Enforce immediate detour.":"Maintain normal monitoring.",evaluatedAt:new Date().toISOString()};predictionsData.unshift(result);return res.status(201).json({success:true,data:result,timestamp:new Date().toISOString()});}
  return res.status(405).json({success:false,message:"Method not allowed"});
}
