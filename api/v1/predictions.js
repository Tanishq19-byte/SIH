function cors(res){res.setHeader("Access-Control-Allow-Origin","*");res.setHeader("Access-Control-Allow-Methods","GET,POST,OPTIONS");res.setHeader("Access-Control-Allow-Headers","Content-Type");}
function ok(res,data,msg,st=200){res.status(st).json({success:true,statusCode:st,message:msg,data,timestamp:new Date().toISOString()});}

let predictionsData=[
  {corridorId:'R-NH27-SILCHAR',corridorName:'NH-27 Sonapur Tunnel Corridor',riskScore:87,category:'HIGH',disruptionProbability:88.5,contributingFactors:[{factor:'Heavy rainfall intensity (220mm/24h)',points:31},{factor:'Terrain vulnerability (Slope 42 deg)',points:22},{factor:'Historical disruption frequency',points:18},{factor:'Recent field incident report',points:16}],recommendation:'Avoid this corridor for next 4h. Route B via Lumding-Haflong recommended.',evaluatedAt:new Date().toISOString()},
  {corridorId:'R-NH10-GANGTOK',corridorName:'NH-10 Teesta Melli Corridor',riskScore:68,category:'MEDIUM',disruptionProbability:64.2,contributingFactors:[{factor:'River level rise (Teesta 8.2m)',points:28},{factor:'Flood plain proximity',points:19},{factor:'Historical submersion frequency',points:14}],recommendation:'Monitor hourly. Jorethang bypass pre-positioned.',evaluatedAt:new Date().toISOString()}
];

module.exports=function handler(req,res){
  cors(res);
  if(req.method==='OPTIONS') return res.status(200).end();
  if(req.method==='GET') return ok(res,predictionsData,'Fetched AI route disruption predictions');
  if(req.method==='POST'){
    const {rainfallMm=180,terrainVulnerability=8,historicalFrequency=7}=req.body||{};
    const riskScore=Math.min(Math.round(rainfallMm*0.25+terrainVulnerability*4.5+historicalFrequency*3.0),98);
    const category=riskScore>=75?'CRITICAL':riskScore>=50?'HIGH':'MEDIUM';
    const result={corridorId:req.body.corridorId||'R-CUSTOM-EVAL',riskScore,category,disruptionProbability:Math.min(riskScore*0.95,99.0),contributingFactors:[{factor:`Rainfall (${rainfallMm}mm)`,points:Math.round(rainfallMm*0.25)},{factor:`Terrain index (${terrainVulnerability}/10)`,points:Math.round(terrainVulnerability*4.5)},{factor:`Historical freq (${historicalFrequency})`,points:Math.round(historicalFrequency*3.0)}],recommendation:riskScore>=75?'Enforce immediate detour via Corridor B.':'Maintain normal monitoring.',evaluatedAt:new Date().toISOString()};
    predictionsData.unshift(result);
    return ok(res,result,'Corridor risk evaluated');
  }
  return res.status(405).json({success:false,message:'Method not allowed'});
};
