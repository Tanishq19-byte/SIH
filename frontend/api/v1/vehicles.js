const vehiclesData = [
  { id:"V-NER-8891",regNumber:"AS-01-GC-9921",driverName:"Biren Gogoi",driverPhone:"+91 98640 11234",agency:"Assam State Oxygen Mission / IOCL",cargoCategory:"Medicines",cargoDescription:"Cryogenic Liquid Medical Oxygen (22,000 Liters)",origin:"Guwahati Oxygen Hub",destination:"Silchar Medical College & Hospital",status:"route_interrupted",speedKmh:0,fuelLevelPct:62,delayHours:11.5},
  { id:"V-NER-4412",regNumber:"ML-05-E-4412",driverName:"Sangma Marak",driverPhone:"+91 94361 88219",agency:"Food Corporation of India (FCI)",cargoCategory:"Food",cargoDescription:"Fortified Rice & Wheat Manifest",origin:"FCI Depot Changsari, Assam",destination:"Shillong Central Civil Supplies Warehouse",status:"on_duty",speedKmh:48,fuelLevelPct:84,delayHours:0.75},
  { id:"V-NER-3091",regNumber:"SK-01-B-3091",driverName:"Tashi Bhutia",driverPhone:"+91 94340 55567",agency:"Sikkim Health Dept",cargoCategory:"Medicines",cargoDescription:"1,850 Cold Chain Vaccine Kits",origin:"Siliguri Depot",destination:"STNM Hospital Gangtok",status:"delayed",speedKmh:22,fuelLevelPct:71,delayHours:4.5},
  { id:"V-NER-7721",regNumber:"AR-01-D-7721",driverName:"Nabam Tuki",driverPhone:"+91 94360 99812",agency:"ONGC / NRL Petroleum Division",cargoCategory:"Fuel",cargoDescription:"Aviation Turbine Fuel (ATF) 35,000L",origin:"NRL Numaligarh Refinery",destination:"Donyi Polo Airport, Itanagar",status:"on_duty",speedKmh:55,fuelLevelPct:100,delayHours:0}
];
export default function handler(req,res){
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Methods","GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers","Content-Type,Authorization");
  if(req.method==="OPTIONS") return res.status(200).end();
  const ok=(data,msg,st=200)=>res.status(st).json({success:true,statusCode:st,message:msg,data,timestamp:new Date().toISOString()});
  if(req.method==="GET"){
    const {status,category}=req.query;
    let r=[...vehiclesData];
    if(status) r=r.filter(v=>v.status===status);
    if(category) r=r.filter(v=>v.cargoCategory===category);
    return ok(r,`Fetched ${r.length} logistics vehicles`);
  }
  if(req.method==="POST"){
    const {regNumber,driverName,agency,cargoCategory,cargoDescription,origin,destination}=req.body||{};
    if(!regNumber) return res.status(400).json({success:false,message:"regNumber required"});
    const v={id:`V-NER-${Math.floor(1000+Math.random()*9000)}`,regNumber,driverName,agency,cargoCategory,cargoDescription,origin,destination,driverPhone:req.body.driverPhone||"+91 98000 00000",status:"on_duty",speedKmh:45,fuelLevelPct:100,delayHours:0,createdAt:new Date().toISOString()};
    vehiclesData.unshift(v);
    return ok(v,`Created vehicle ${regNumber}`,201);
  }
  return res.status(405).json({success:false,message:"Method not allowed"});
}
