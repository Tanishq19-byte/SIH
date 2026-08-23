function cors(res){res.setHeader("Access-Control-Allow-Origin","*");res.setHeader("Access-Control-Allow-Methods","GET,OPTIONS");res.setHeader("Access-Control-Allow-Headers","Content-Type");}
module.exports=function handler(req,res){
  cors(res);
  if(req.method==='OPTIONS') return res.status(200).end();
  res.json({success:true,aiService:'healthy',modelLoaded:true,version:'v1.2.0',platform:'Vercel Serverless JS',supportedScenarios:['SONAPUR_TUNNEL_LANDSLIDE','TEESTA_MELLI_FLOOD','SELA_PASS_SNOWFALL','BARAK_VALLEY_FOG','NH54_LANDSLIP','CLEAR_CONDITIONS'],timestamp:new Date().toISOString()});
};
