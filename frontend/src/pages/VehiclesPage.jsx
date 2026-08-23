import React, { useState, useEffect } from 'react';
import {
  Truck,
  Search,
  Filter,
  MapPin,
  Clock,
  Radio,
  Plus,
  X,
  Send,
  Shield,
  Fuel,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Building2,
  Phone,
  User,
  Package
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { DataTable } from '../components/common/DataTable';
import { useToast } from '../hooks/useToast';
import { useApp } from '../context/AppContext';
import { NER_STATES } from '../data/mockRegions';

const STATE_VEHICLES_MAP = {
  all: [
    {
      id: 'V-NER-8891',
      regNumber: 'AS-01-GC-9921',
      driverName: 'Biren Gogoi',
      driverPhone: '+91 98640 11234',
      agency: 'Assam State Oxygen Mission / IOCL',
      cargoCategory: 'Medicines',
      cargoDescription: 'Cryogenic Liquid Medical Oxygen (22,000 Liters)',
      origin: 'Guwahati Oxygen Hub',
      destination: 'Silchar Medical College & Hospital',
      status: 'route_interrupted',
      locationName: 'Sonapur Tunnel Bypass (KM 142)',
      speedKmh: 0,
      fuelLevelPct: 62,
      priority: 'Critical',
      stateCode: 'AS'
    },
    {
      id: 'V-NER-4412',
      regNumber: 'ML-05-E-4412',
      driverName: 'Sangma Marak',
      driverPhone: '+91 94361 88219',
      agency: 'Food Corporation of India (FCI)',
      cargoCategory: 'Food',
      cargoDescription: 'Fortified Rice & Wheat Manifest (32 MT)',
      origin: 'FCI Depot Changsari, Assam',
      destination: 'Shillong Central Civil Supplies Warehouse',
      status: 'on_duty',
      locationName: 'Nongpoh Checkpoint (KM 52)',
      speedKmh: 48,
      fuelLevelPct: 84,
      priority: 'Medium',
      stateCode: 'ML'
    },
    {
      id: 'V-NER-9904',
      regNumber: 'TR-01-A-1029',
      driverName: 'Pranab Debbarma',
      driverPhone: '+91 98622 34109',
      agency: 'Indian Oil Corporation (POL Fleet)',
      cargoCategory: 'Emergency Supplies',
      cargoDescription: 'High-Speed Diesel (HSD) Fuel Tanker 18KL',
      origin: 'Guwahati Oil Refinery Depot',
      destination: 'Agartala Main IOCL Depot',
      status: 'rerouted',
      locationName: 'Jowai Bypass Rerouted Stretch',
      speedKmh: 36,
      fuelLevelPct: 91,
      priority: 'High',
      stateCode: 'TR'
    },
    {
      id: 'V-NER-3091',
      regNumber: 'SK-01-D-3091',
      driverName: 'Tenzing Lepcha',
      driverPhone: '+91 97330 90123',
      agency: 'Sikkim Health & Family Welfare Dept',
      cargoCategory: 'Medicines',
      cargoDescription: 'Vaccines & Refrigerated Cold Chain Kits',
      origin: 'Siliguri Medical Cold Chain Hub',
      destination: 'STNM Hospital Gangtok',
      status: 'route_interrupted',
      locationName: 'Melli Bridge Junction (Teesta Overflow)',
      speedKmh: 0,
      fuelLevelPct: 78,
      priority: 'Critical',
      stateCode: 'SK'
    },
    {
      id: 'V-NER-7120',
      regNumber: 'NL-07-B-7120',
      driverName: 'Kevi Angami',
      driverPhone: '+91 94360 45678',
      agency: 'Nagaland Disaster Management (NDMA)',
      cargoCategory: 'Emergency Supplies',
      cargoDescription: 'Emergency Disaster Relief Tents & Tarpaulins',
      origin: 'Dimapur Relief Yard',
      destination: 'Kohima Relief Command Hub',
      status: 'on_duty',
      locationName: 'Chumukedima 4-Lane Asian Highway',
      speedKmh: 54,
      fuelLevelPct: 88,
      priority: 'High',
      stateCode: 'NL'
    },
    {
      id: 'V-NER-5510',
      regNumber: 'MZ-01-F-5510',
      driverName: 'Lalthan Zama',
      driverPhone: '+91 98625 11092',
      agency: 'BRO 44 BRTF Infrastructure Wing',
      cargoCategory: 'Construction materials',
      cargoDescription: 'Bailey Bridge Modular Steel Girders (28 MT)',
      origin: 'Silchar Rail Freight Yard',
      destination: 'Vairengte Collapse Site',
      status: 'route_interrupted',
      locationName: 'Vairengte Border Gate (KM 45)',
      speedKmh: 0,
      fuelLevelPct: 54,
      priority: 'Critical',
      stateCode: 'MZ'
    },
    {
      id: 'V-NER-6022',
      regNumber: 'AR-01-C-6022',
      driverName: 'Tashi Dorjee',
      driverPhone: '+91 94362 77100',
      agency: 'Arunachal Agri Marketing Board',
      cargoCategory: 'Agricultural produce',
      cargoDescription: 'Organic Large Cardamom & Fresh Horticulture (14 MT)',
      origin: 'Itanagar Wholesale Agri Hub',
      destination: 'Tezpur Express Cargo Terminal',
      status: 'on_duty',
      locationName: 'Bandardewa Checkgate',
      speedKmh: 58,
      fuelLevelPct: 92,
      priority: 'Medium',
      stateCode: 'AR'
    },
    {
      id: 'V-NER-8823',
      regNumber: 'MN-01-C-8823',
      driverName: 'Tomba Singh',
      driverPhone: '+91 98621 55102',
      agency: 'FCI / Manipur Civil Supplies',
      cargoCategory: 'Food',
      cargoDescription: 'FCI Fortified Rice Grain Manifest (42 MT)',
      origin: 'Silchar Supply Base',
      destination: 'Imphal Valley Relief Stockpiles',
      status: 'on_duty',
      locationName: 'Noney Escorted Highway Stretch',
      speedKmh: 52,
      fuelLevelPct: 86,
      priority: 'High',
      stateCode: 'MN'
    }
  ],
  MN: [
    {
      id: 'V-MN-8823',
      regNumber: 'MN-01-C-8823',
      driverName: 'Tomba Singh',
      driverPhone: '+91 98621 55102',
      agency: 'Food Corporation of India (FCI)',
      cargoCategory: 'Food',
      cargoDescription: 'FCI Fortified Rice Grain Manifest (42 MT)',
      origin: 'Silchar Supply Base',
      destination: 'Imphal Valley Relief Stockpiles',
      status: 'on_duty',
      locationName: 'Noney Escorted Highway Stretch (NH-37)',
      speedKmh: 52,
      fuelLevelPct: 86,
      priority: 'High',
      stateCode: 'MN'
    },
    {
      id: 'V-MN-9912',
      regNumber: 'MN-02-B-9912',
      driverName: 'Ibomcha Meitei',
      driverPhone: '+91 97740 12891',
      agency: 'Manipur Health Directorate',
      cargoCategory: 'Medicines',
      cargoDescription: 'Liquid Medical Oxygen & ICU Surgical Kits',
      origin: 'Guwahati Oxygen Terminal',
      destination: 'JNIMS Hospital Imphal East',
      status: 'on_duty',
      locationName: 'Kangpokpi Escort Corridor (NH-2)',
      speedKmh: 46,
      fuelLevelPct: 78,
      priority: 'Critical',
      stateCode: 'MN'
    },
    {
      id: 'V-MN-4412',
      regNumber: 'MN-01-A-4412',
      driverName: 'R. Sharma',
      driverPhone: '+91 94360 77123',
      agency: 'Indian Oil Corporation (POL Fleet)',
      cargoCategory: 'Emergency Supplies',
      cargoDescription: 'High-Speed Diesel Tanker 18KL',
      origin: 'Numaligarh Refinery Depot',
      destination: 'Imphal Chingmeirong IOCL Depot',
      status: 'rerouted',
      locationName: 'Jiribam - Noney Mountain Bypass',
      speedKmh: 38,
      fuelLevelPct: 92,
      priority: 'High',
      stateCode: 'MN'
    },
    {
      id: 'V-MN-2219',
      regNumber: 'MN-03-D-2219',
      driverName: 'L. Haokip',
      driverPhone: '+91 98561 33410',
      agency: 'State Disaster Relief Task Force',
      cargoCategory: 'Food',
      cargoDescription: 'Baby Nutrition & Fortified Milk Powder (12 MT)',
      origin: 'Dimapur Freight Railhead',
      destination: 'Churachandpur District Depot',
      status: 'delayed',
      locationName: 'Leingangpoki Checkpost Stretch',
      speedKmh: 24,
      fuelLevelPct: 68,
      priority: 'Medium',
      stateCode: 'MN'
    }
  ],
  MZ: [
    {
      id: 'V-MZ-5510',
      regNumber: 'MZ-01-F-5510',
      driverName: 'Lalthan Zama',
      driverPhone: '+91 98625 11092',
      agency: 'BRO 44 BRTF Infrastructure Wing',
      cargoCategory: 'Construction materials',
      cargoDescription: 'Bailey Bridge Modular Steel Girders (28 MT)',
      origin: 'Silchar Rail Freight Yard',
      destination: 'Vairengte Collapse Site',
      status: 'route_interrupted',
      locationName: 'Vairengte Border Gate (KM 45)',
      speedKmh: 0,
      fuelLevelPct: 54,
      priority: 'Critical',
      stateCode: 'MZ'
    },
    {
      id: 'V-MZ-7712',
      regNumber: 'MZ-01-E-7712',
      driverName: 'Lalremruata',
      driverPhone: '+91 94361 88201',
      agency: 'Indian Oil Corporation',
      cargoCategory: 'Emergency Supplies',
      cargoDescription: 'POL Petroleum & LPG Bulkers (28 MT)',
      origin: 'Silchar Freight Hub',
      destination: 'Aizawl Central Petroleum Depot',
      status: 'rerouted',
      locationName: 'Bhairabi Railhead Paved Bypass',
      speedKmh: 42,
      fuelLevelPct: 88,
      priority: 'Critical',
      stateCode: 'MZ'
    },
    {
      id: 'V-MZ-3319',
      regNumber: 'MZ-02-C-3319',
      driverName: 'Vanlal Hruaia',
      driverPhone: '+91 98620 44912',
      agency: 'Mizoram Civil Supplies Dept',
      cargoCategory: 'Food',
      cargoDescription: 'Essential Foodgrains, Salt & Edible Oils (30 MT)',
      origin: 'Guwahati Logistics Depot',
      destination: 'Kolasib Relief Stockpiles',
      status: 'on_duty',
      locationName: 'Bilkhawthlir Ridge Pass',
      speedKmh: 50,
      fuelLevelPct: 82,
      priority: 'High',
      stateCode: 'MZ'
    }
  ],
  SK: [
    {
      id: 'V-SK-3091',
      regNumber: 'SK-01-D-3091',
      driverName: 'Tenzing Lepcha',
      driverPhone: '+91 97330 90123',
      agency: 'Sikkim Health & Family Welfare Dept',
      cargoCategory: 'Medicines',
      cargoDescription: 'Vaccines & Refrigerated Cold Chain Kits',
      origin: 'Siliguri Medical Cold Chain Hub',
      destination: 'STNM Hospital Gangtok',
      status: 'route_interrupted',
      locationName: 'Melli Bridge Junction (Teesta River Overflow)',
      speedKmh: 0,
      fuelLevelPct: 78,
      priority: 'Critical',
      stateCode: 'SK'
    },
    {
      id: 'V-SK-1102',
      regNumber: 'SK-02-A-1102',
      driverName: 'Pemba Sherpa',
      driverPhone: '+91 94340 77812',
      agency: 'National Health Mission Sikkim',
      cargoCategory: 'Medicines',
      cargoDescription: 'Cold-Chain Blood Units & Plasma Packs',
      origin: 'Siliguri Medical Depot',
      destination: 'Namchi District Hospital',
      status: 'rerouted',
      locationName: 'Gorubathan - Lava High Ridge Pass',
      speedKmh: 38,
      fuelLevelPct: 90,
      priority: 'Critical',
      stateCode: 'SK'
    },
    {
      id: 'V-SK-4421',
      regNumber: 'SK-01-C-4421',
      driverName: 'Karma Bhutia',
      driverPhone: '+91 98320 66120',
      agency: 'Hindustan Petroleum Corp (HPCL)',
      cargoCategory: 'Emergency Supplies',
      cargoDescription: 'LPG Commercial Cylinders (450 Units)',
      origin: 'Siliguri LPG Bottling Plant',
      destination: 'Gangtok Central Fuel Depot',
      status: 'on_duty',
      locationName: 'Pakyong Transit Hub',
      speedKmh: 44,
      fuelLevelPct: 85,
      priority: 'High',
      stateCode: 'SK'
    }
  ],
  NL: [
    {
      id: 'V-NL-7120',
      regNumber: 'NL-07-B-7120',
      driverName: 'Kevi Angami',
      driverPhone: '+91 94360 45678',
      agency: 'Nagaland Disaster Management (NDMA)',
      cargoCategory: 'Emergency Supplies',
      cargoDescription: 'Emergency Disaster Relief Tents & Tarpaulins (450 Units)',
      origin: 'Dimapur Relief Yard',
      destination: 'Kohima Relief Command Hub',
      status: 'on_duty',
      locationName: 'Chumukedima 4-Lane Asian Highway (NH-29)',
      speedKmh: 54,
      fuelLevelPct: 88,
      priority: 'High',
      stateCode: 'NL'
    },
    {
      id: 'V-NL-5531',
      regNumber: 'NL-01-B-5531',
      driverName: 'Toshi Ao',
      driverPhone: '+91 98621 77341',
      agency: 'Nagaland Civil Supplies Corp',
      cargoCategory: 'Food',
      cargoDescription: 'Civil Ration Supplies & Wheat Grain (35 MT)',
      origin: 'Dimapur Railhead Depot',
      destination: 'Mokokchung Civil Supply Center',
      status: 'on_duty',
      locationName: 'Medziphema Highway Corridor',
      speedKmh: 48,
      fuelLevelPct: 94,
      priority: 'Medium',
      stateCode: 'NL'
    },
    {
      id: 'V-NL-8821',
      regNumber: 'NL-02-D-8821',
      driverName: 'Neiba Kire',
      driverPhone: '+91 94364 12093',
      agency: 'Health & Family Welfare Nagaland',
      cargoCategory: 'Medicines',
      cargoDescription: 'Emergency Antibiotics & Dialysis Fluids',
      origin: 'Guwahati Logistics Hub',
      destination: 'Kohima Naga Hospital Authority',
      status: 'on_duty',
      locationName: 'Pagala Pahar Patrol Stretch',
      speedKmh: 52,
      fuelLevelPct: 76,
      priority: 'High',
      stateCode: 'NL'
    }
  ],
  AR: [
    {
      id: 'V-AR-6022',
      regNumber: 'AR-01-C-6022',
      driverName: 'Tashi Dorjee',
      driverPhone: '+91 94362 77100',
      agency: 'Arunachal Agri Marketing Board',
      cargoCategory: 'Agricultural produce',
      cargoDescription: 'Organic Large Cardamom & Fresh Horticulture (14 MT)',
      origin: 'Itanagar Wholesale Agri Hub',
      destination: 'Tezpur Express Cargo Terminal',
      status: 'on_duty',
      locationName: 'Bandardewa Checkgate',
      speedKmh: 58,
      fuelLevelPct: 92,
      priority: 'Medium',
      stateCode: 'AR'
    },
    {
      id: 'V-AR-7721',
      regNumber: 'AR-01-D-7721',
      driverName: 'Dorjee Khandu',
      driverPhone: '+91 94360 11982',
      agency: 'Defense Airfield Logistics / IOCL',
      cargoCategory: 'Emergency Supplies',
      cargoDescription: 'Aviation Turbine Fuel & Military Rations (18KL)',
      origin: 'Tezpur Airfield Depot',
      destination: 'Tawang Forward Relief Station',
      status: 'rerouted',
      locationName: 'Sela Twin-Tube Tunnel Approach',
      speedKmh: 35,
      fuelLevelPct: 84,
      priority: 'Critical',
      stateCode: 'AR'
    },
    {
      id: 'V-AR-3312',
      regNumber: 'AR-02-B-3312',
      driverName: 'Nima Tsering',
      driverPhone: '+91 94368 44201',
      agency: 'Power Grid Corp of India',
      cargoCategory: 'Construction materials',
      cargoDescription: 'High-Voltage Transformer Substation Units',
      origin: 'Bhalukpong Highway Entry',
      destination: 'Bomdila Power Substation',
      status: 'on_duty',
      locationName: 'Balipara Mountain Highway',
      speedKmh: 40,
      fuelLevelPct: 79,
      priority: 'High',
      stateCode: 'AR'
    }
  ],
  TR: [
    {
      id: 'V-TR-1029',
      regNumber: 'TR-01-A-1029',
      driverName: 'Pranab Debbarma',
      driverPhone: '+91 98622 34109',
      agency: 'Indian Oil Corporation (POL Fleet)',
      cargoCategory: 'Emergency Supplies',
      cargoDescription: 'High-Speed Diesel (HSD) Fuel Tanker 18KL',
      origin: 'Guwahati Oil Refinery Depot',
      destination: 'Agartala Main IOCL Depot',
      status: 'rerouted',
      locationName: 'Jowai Bypass Rerouted Stretch (NH-8)',
      speedKmh: 36,
      fuelLevelPct: 91,
      priority: 'High',
      stateCode: 'TR'
    },
    {
      id: 'V-TR-4412',
      regNumber: 'TR-02-B-4412',
      driverName: 'Babul Tripura',
      driverPhone: '+91 94361 55902',
      agency: 'Food Corporation of India (FCI)',
      cargoCategory: 'Food',
      cargoDescription: 'Fortified Rice & Grain Stockpiles (38 MT)',
      origin: 'Badarpur Railhead Depot',
      destination: 'Agartala FCI Central Silo',
      status: 'on_duty',
      locationName: 'Churaibari Interstate Gate',
      speedKmh: 50,
      fuelLevelPct: 87,
      priority: 'Medium',
      stateCode: 'TR'
    },
    {
      id: 'V-TR-8821',
      regNumber: 'TR-01-C-8821',
      driverName: 'Samar Das',
      driverPhone: '+91 98620 88319',
      agency: 'Tripura Health Services Directorate',
      cargoCategory: 'Medicines',
      cargoDescription: 'Life-Saving Pharmaceuticals & IV Fluids (10 MT)',
      origin: 'Guwahati Medical Depot',
      destination: 'AGMC Hospital Agartala',
      status: 'on_duty',
      locationName: 'Dharmanagar Highway Link',
      speedKmh: 55,
      fuelLevelPct: 83,
      priority: 'High',
      stateCode: 'TR'
    }
  ],
  AS: [
    {
      id: 'V-AS-9921',
      regNumber: 'AS-01-GC-9921',
      driverName: 'Biren Gogoi',
      driverPhone: '+91 98640 11234',
      agency: 'Assam State Oxygen Mission / IOCL',
      cargoCategory: 'Medicines',
      cargoDescription: 'Cryogenic Liquid Medical Oxygen (22,000 Liters)',
      origin: 'Guwahati Oxygen Hub',
      destination: 'Silchar Medical College & Hospital',
      status: 'route_interrupted',
      locationName: 'Sonapur Tunnel Bypass (KM 142)',
      speedKmh: 0,
      fuelLevelPct: 62,
      priority: 'Critical',
      stateCode: 'AS'
    },
    {
      id: 'V-AS-3310',
      regNumber: 'AS-01-F-3310',
      driverName: 'Hemen Barman',
      driverPhone: '+91 98642 99012',
      agency: 'Food Corporation of India (FCI)',
      cargoCategory: 'Food',
      cargoDescription: 'Emergency Food Grains & Pulses (40 MT)',
      origin: 'Changsari Railhead, Guwahati',
      destination: 'Silchar Relief Base',
      status: 'rerouted',
      locationName: 'Lumding - Haflong AI Bypass',
      speedKmh: 44,
      fuelLevelPct: 80,
      priority: 'High',
      stateCode: 'AS'
    },
    {
      id: 'V-AS-8812',
      regNumber: 'AS-01-D-8812',
      driverName: 'Robin Saikia',
      driverPhone: '+91 94350 44120',
      agency: 'Indian Oil Corporation',
      cargoCategory: 'Emergency Supplies',
      cargoDescription: 'Petroleum Fuel Tanker 20KL',
      origin: 'Digboi Refinery Depot',
      destination: 'Tezpur Regional Depot',
      status: 'on_duty',
      locationName: 'Nagaon Expressway (NH-27)',
      speedKmh: 56,
      fuelLevelPct: 89,
      priority: 'Medium',
      stateCode: 'AS'
    }
  ],
  ML: [
    {
      id: 'V-ML-4412',
      regNumber: 'ML-05-E-4412',
      driverName: 'Sangma Marak',
      driverPhone: '+91 94361 88219',
      agency: 'Food Corporation of India (FCI)',
      cargoCategory: 'Food',
      cargoDescription: 'Fortified Rice & Wheat Manifest (32 MT)',
      origin: 'FCI Depot Changsari, Assam',
      destination: 'Shillong Central Civil Supplies Warehouse',
      status: 'on_duty',
      locationName: 'Nongpoh Checkpoint (KM 52)',
      speedKmh: 48,
      fuelLevelPct: 84,
      priority: 'Medium',
      stateCode: 'ML'
    },
    {
      id: 'V-ML-2219',
      regNumber: 'ML-01-D-2219',
      driverName: 'K. Syiem',
      driverPhone: '+91 94363 88102',
      agency: 'Meghalaya Energy Corporation (MeECL)',
      cargoCategory: 'Construction materials',
      cargoDescription: 'Essential Power Transformers & Grid Spares',
      origin: 'Guwahati Logistics Hub',
      destination: 'Jowai Power Substation',
      status: 'route_interrupted',
      locationName: 'East Jaintia Hills Subsidence Point',
      speedKmh: 0,
      fuelLevelPct: 65,
      priority: 'Critical',
      stateCode: 'ML'
    },
    {
      id: 'V-ML-9912',
      regNumber: 'ML-04-C-9912',
      driverName: 'D. Lyngdoh',
      driverPhone: '+91 98630 11290',
      agency: 'Meghalaya Basin Development Authority',
      cargoCategory: 'Agricultural produce',
      cargoDescription: 'Fresh Agri Horticulture Cold Transport (16 MT)',
      origin: 'Shillong Agri Hub',
      destination: 'Guwahati Export Cargo Terminal',
      status: 'on_duty',
      locationName: 'Umiam Lake Bypass Stretch',
      speedKmh: 52,
      fuelLevelPct: 91,
      priority: 'Medium',
      stateCode: 'ML'
    }
  ]
};

export const VehiclesPage = () => {
  const { addToast } = useToast();
  const { selectedState } = useApp();
  const stateName = NER_STATES.find(s => s.id === selectedState)?.name || 'All NER States';

  // Vehicles state dynamically filtered by selected region
  const [vehicles, setVehicles] = useState(STATE_VEHICLES_MAP[selectedState] || STATE_VEHICLES_MAP.all);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);

  // Convoy Dispatch Form State
  const [newRegNumber, setNewRegNumber] = useState('MN-01-D-5520');
  const [newDriverName, setNewDriverName] = useState('B. Sanatomba');
  const [newDriverPhone, setNewDriverPhone] = useState('+91 98623 44012');
  const [newAgency, setNewAgency] = useState('NDMA / MDoNER Emergency Fleet');
  const [newCargoCategory, setNewCargoCategory] = useState('Medicines');
  const [newCargoDesc, setNewCargoDesc] = useState('Liquid Medical Oxygen & Essential Vaccines');
  const [newOrigin, setNewOrigin] = useState('Silchar Supply Base');
  const [newDestination, setNewDestination] = useState('Imphal Valley Relief Hub');
  const [newPriority, setNewPriority] = useState('Critical');

  // Update vehicle list whenever region changes
  useEffect(() => {
    const list = STATE_VEHICLES_MAP[selectedState] || STATE_VEHICLES_MAP.all;
    setVehicles(list);
    if (selectedState === 'MN') {
      setNewOrigin('Silchar Supply Base');
      setNewDestination('Imphal Valley Relief Hub');
      setNewRegNumber('MN-01-D-5520');
      setNewDriverName('B. Sanatomba');
      setNewDriverPhone('+91 98623 44012');
      setNewCargoDesc('Liquid Medical Oxygen & Essential Vaccines (18 MT)');
    } else if (selectedState === 'MZ') {
      setNewOrigin('Silchar Freight Depot');
      setNewDestination('Aizawl Central Petroleum Depot');
      setNewRegNumber('MZ-01-E-9912');
      setNewDriverName('K. Lalhmachhuana');
      setNewDriverPhone('+91 94361 77209');
      setNewCargoDesc('POL Diesel & Kerosene Fuel Tanker (20KL)');
    } else if (selectedState === 'SK') {
      setNewOrigin('Siliguri Medical Cold Chain Depot');
      setNewDestination('STNM Hospital Gangtok');
      setNewRegNumber('SK-01-D-4412');
      setNewDriverName('Dawa Tamang');
      setNewDriverPhone('+91 97332 55190');
      setNewCargoDesc('Life-Saving Emergency Medicines & Plasma');
    } else {
      setNewOrigin('Guwahati Central Logistics Hub');
      setNewDestination('Silchar Relief Base');
      setNewRegNumber('AS-01-GC-4481');
      setNewDriverName('Bimal Das');
      setNewDriverPhone('+91 98640 55120');
      setNewCargoDesc('Cryogenic Medical Oxygen Refill (22,000L)');
    }
  }, [selectedState]);

  const handleDispatchConvoy = (e) => {
    e.preventDefault();
    if (!newRegNumber.trim() || !newDriverName.trim()) {
      addToast({
        title: 'Manifest Incomplete',
        message: 'Please provide Vehicle Registration and Driver Name.',
        type: 'warning'
      });
      return;
    }

    const newVehicle = {
      id: `V-DISPATCH-${Date.now()}`,
      regNumber: newRegNumber,
      driverName: newDriverName,
      driverPhone: newDriverPhone || '+91 98000 00000',
      agency: newAgency,
      cargoCategory: newCargoCategory,
      cargoDescription: newCargoDesc || 'Emergency Relief Cargo',
      origin: newOrigin || 'Regional Hub',
      destination: newDestination || 'District Depot',
      status: 'on_duty',
      locationName: `${newOrigin || 'Regional Hub'} (Dispatched En-route)`,
      speedKmh: 55,
      fuelLevelPct: 100,
      priority: newPriority,
      stateCode: selectedState === 'all' ? 'AS' : selectedState
    };

    setVehicles([newVehicle, ...vehicles]);
    setIsDispatchModalOpen(false);

    addToast({
      title: 'Convoy Dispatched Successfully',
      message: `Convoy ${newRegNumber} (${newCargoCategory}) dispatched to ${newDestination}. Real-time GPS telemetry initialized.`,
      type: 'success'
    });
  };

  const vehicleColumns = [
    {
      key: 'regNumber',
      label: 'Registration / Fleet ID',
      render: (val, row) => (
        <div>
          <p className="font-bold text-[#172033] font-mono text-xs">{val}</p>
          <p className="text-[10px] text-[#667085] font-sans">{row.agency}</p>
        </div>
      )
    },
    {
      key: 'driverName',
      label: 'Driver & Contact',
      render: (val, row) => (
        <div>
          <p className="font-bold text-[#172033] text-xs font-sans">{val}</p>
          <p className="text-[10px] text-[#667085] font-mono">{row.driverPhone}</p>
        </div>
      )
    },
    {
      key: 'cargoCategory',
      label: 'Cargo Manifest',
      render: (val, row) => (
        <div>
          <span className="font-sans text-xs font-bold text-[#0F172A] block">{val}</span>
          <span className="text-[10px] text-[#64748B] block truncate max-w-xs">{row.cargoDescription}</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Convoy Status',
      render: (val) => <Badge status={val} size="sm" />
    },
    {
      key: 'locationName',
      label: 'Current Location',
      render: (val) => (
        <span className="font-mono text-[#475569] text-xs flex items-center gap-1 font-semibold">
          <MapPin className="w-3.5 h-3.5 text-[#0F766E] flex-shrink-0" />
          <span className="truncate max-w-[200px]">{val}</span>
        </span>
      )
    },
    {
      key: 'speedKmh',
      label: 'Speed / Fuel',
      render: (val, row) => (
        <div className="font-mono text-xs">
          <p className="text-[#0F172A] font-bold">{val} km/h</p>
          <p className="text-[10px] text-[#64748B] flex items-center gap-1">
            <Fuel className="w-3 h-3 text-[#D97706]" /> Fuel: {row.fuelLevelPct}%
          </p>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 font-sans text-[#0F172A]">
      <PageHeader
        category="CONVOY TELEMETRY & ESSENTIAL FLEET MANAGEMENT"
        title={`Supply Fleet & Vehicle Telemetry (${stateName.toUpperCase()})`}
        subtitle={`Real-time GPS tracking, driver communications, cargo priority status, and detour directives for logistics convoys operating in ${stateName}.`}
        badgeText={`${vehicles.length} ACTIVE FLEETS • ${stateName.toUpperCase()}`}
        actionButton={
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setIsDispatchModalOpen(true)}
            className="bg-[#0F766E] hover:bg-[#115E59] text-white font-bold cursor-pointer"
          >
            + Dispatch Convoy
          </Button>
        }
      />

      <DataTable
        columns={vehicleColumns}
        data={vehicles}
        searchPlaceholder={`Search ${stateName} vehicle reg number, driver, agency, or location...`}
        filterOptions={[
          { label: 'On Duty', value: 'on_duty' },
          { label: 'Delayed', value: 'delayed' },
          { label: 'Rerouted', value: 'rerouted' },
          { label: 'Halted', value: 'route_interrupted' }
        ]}
      />

      {/* DISPATCH NEW CONVOY MODAL */}
      {isDispatchModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[99999] animate-in fade-in duration-150">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden font-sans">
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0F766E] flex items-center justify-center text-white font-bold text-xs shadow-xs">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#0F172A]">Dispatch New Logistics Convoy</h3>
                  <p className="text-[11px] text-[#64748B]">MDoNER National Logistics Command • {stateName}</p>
                </div>
              </div>
              <button
                onClick={() => setIsDispatchModalOpen(false)}
                className="p-1 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDispatchConvoy} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#64748B] uppercase">Vehicle Reg Number *</label>
                  <input
                    type="text"
                    required
                    value={newRegNumber}
                    onChange={(e) => setNewRegNumber(e.target.value)}
                    placeholder="e.g. MN-01-D-5520"
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] px-3 py-2 rounded-xl font-mono text-xs focus:outline-none focus:border-[#0F766E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#64748B] uppercase">Operating Agency / Mission</label>
                  <select
                    value={newAgency}
                    onChange={(e) => setNewAgency(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] px-3 py-2 rounded-xl font-bold cursor-pointer focus:outline-none"
                  >
                    <option value="NDMA / MDoNER Emergency Fleet">NDMA / MDoNER Emergency Fleet</option>
                    <option value="Assam State Oxygen Mission / IOCL">Assam State Oxygen Mission / IOCL</option>
                    <option value="Food Corporation of India (FCI)">Food Corporation of India (FCI)</option>
                    <option value="Border Roads Organisation (44 BRTF)">Border Roads Organisation (44 BRTF)</option>
                    <option value="State Health & Family Welfare Dept">State Health & Family Welfare Dept</option>
                    <option value="Indian Oil Corporation (POL Fleet)">Indian Oil Corporation (POL Fleet)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#64748B] uppercase">Driver Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newDriverName}
                    onChange={(e) => setNewDriverName(e.target.value)}
                    placeholder="Driver Name"
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[#0F766E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#64748B] uppercase">Driver Mobile Contact</label>
                  <input
                    type="text"
                    value={newDriverPhone}
                    onChange={(e) => setNewDriverPhone(e.target.value)}
                    placeholder="+91 98XXX XXXXX"
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] px-3 py-2 rounded-xl font-mono text-xs focus:outline-none focus:border-[#0F766E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#64748B] uppercase">Cargo Category</label>
                  <select
                    value={newCargoCategory}
                    onChange={(e) => setNewCargoCategory(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] px-3 py-2 rounded-xl font-bold cursor-pointer focus:outline-none"
                  >
                    <option value="Medicines">Medicines & Oxygen</option>
                    <option value="Food">Food & Grains</option>
                    <option value="Emergency Supplies">Emergency Fuel & Relief Supplies</option>
                    <option value="Construction materials">Construction & Bridge Steel</option>
                    <option value="Agricultural produce">Agricultural Horticulture Produce</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#64748B] uppercase">Priority Level</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] px-3 py-2 rounded-xl font-bold cursor-pointer focus:outline-none"
                  >
                    <option value="Critical">Critical (Green Corridor Escort)</option>
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium (Routine Freight)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#64748B] uppercase">Cargo Manifest Description</label>
                <input
                  type="text"
                  value={newCargoDesc}
                  onChange={(e) => setNewCargoDesc(e.target.value)}
                  placeholder="e.g. 20,000L Liquid Oxygen + 400 Regulated Cylinders"
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[#0F766E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#64748B] uppercase">Origin Logistics Depot</label>
                  <input
                    type="text"
                    value={newOrigin}
                    onChange={(e) => setNewOrigin(e.target.value)}
                    placeholder="Origin Hub"
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[#0F766E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#64748B] uppercase">Destination Facility</label>
                  <input
                    type="text"
                    value={newDestination}
                    onChange={(e) => setNewDestination(e.target.value)}
                    placeholder="Destination Facility"
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-2 -mx-5 -mb-5 mt-4">
                <button
                  type="button"
                  onClick={() => setIsDispatchModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0F766E] hover:bg-[#115E59] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Authorize & Dispatch Convoy</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
