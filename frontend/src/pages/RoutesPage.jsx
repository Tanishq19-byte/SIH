import React, { useState, useEffect } from 'react';
import {
  Route,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Fuel,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Sliders,
  History,
  FileCheck,
  Zap,
  Info,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  Sparkles,
  RefreshCw,
  Scale,
  Send,
  MapPin,
  Truck,
  Filter
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { predictDisruption } from '../services/aiPredictionService';
import { evaluateRouteDecision, getDynamicDecisionWeights } from '../services/routeDecisionEngine';
import { useToast } from '../hooks/useToast';
import { useApp } from '../context/AppContext';
import { NER_STATES } from '../data/mockRegions';

const STATE_ROUTE_MANIFESTS = {
  all: {
    deliveryId: 'DEL-OXY-8891',
    vehicleRegNumber: 'AS-01-GC-9921',
    cargoDescription: 'Cryogenic Liquid Medical Oxygen (22,000 Liters)',
    cargoCategory: 'Medicines & Oxygen',
    priority: 'Critical (SMCH Hospital Refill)',
    origin: 'Guwahati Oxygen Hub',
    destination: 'Silchar Medical College & Hospital',
    currentLocation: 'Sonapur Tunnel Bypass (KM 142)',
    routes: [
      {
        id: 'route-a',
        name: 'Route A: Direct NH-27 Corridor (Via Sonapur Tunnel)',
        isRecommended: false,
        distanceKm: 340,
        etaHours: 19.5,
        etaDisplay: '19h 30m',
        riskScore: 100,
        status: 'CLOSED / HIGH RISK',
        statusStyle: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
        disruptionsCount: 2,
        disruptionDetails: 'Sonapur 340m Debris Fall + KM 142 Subsidence',
        roadAccessibilityPct: 15,
        fuelLiters: 110,
        fuelCostINR: 10450,
        tollCostINR: 850,
        totalCostINR: 11300
      },
      {
        id: 'route-b',
        name: 'Route B: AI Recommended Bypass (Guwahati -> Lumding -> Haflong -> Silchar)',
        isRecommended: true,
        distanceKm: 414,
        etaHours: 7.25,
        etaDisplay: '7h 15m',
        riskScore: 38,
        status: 'LOW RISK',
        statusStyle: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
        disruptionsCount: 0,
        disruptionDetails: 'Clear Paved Hill Corridor with Active Escort',
        roadAccessibilityPct: 88,
        fuelLiters: 132,
        fuelCostINR: 12540,
        tollCostINR: 620,
        totalCostINR: 13160
      },
      {
        id: 'route-c',
        name: 'Route C: Extended Safe Lifeline (Guwahati -> Nagaon -> Tezpur -> Jatinga Loop)',
        isRecommended: false,
        distanceKm: 460,
        etaHours: 8.5,
        etaDisplay: '8h 30m',
        riskScore: 21,
        status: 'VERY LOW RISK',
        statusStyle: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
        disruptionsCount: 0,
        disruptionDetails: 'Fully Paved Four-lane Trunk Highway',
        roadAccessibilityPct: 96,
        fuelLiters: 148,
        fuelCostINR: 14060,
        tollCostINR: 940,
        totalCostINR: 15000
      }
    ]
  },
  AS: {
    deliveryId: 'DEL-OXY-8891',
    vehicleRegNumber: 'AS-01-GC-9921',
    cargoDescription: 'Cryogenic Liquid Medical Oxygen (22,000 Liters)',
    cargoCategory: 'Medicines & Oxygen',
    priority: 'Critical (SMCH Hospital Refill)',
    origin: 'Guwahati Oxygen Hub',
    destination: 'Silchar Medical College & Hospital',
    currentLocation: 'Sonapur Tunnel Bypass (KM 142)',
    routes: [
      {
        id: 'route-a',
        name: 'Route A: Direct NH-27 Corridor (Via Sonapur Tunnel)',
        isRecommended: false,
        distanceKm: 340,
        etaHours: 19.5,
        etaDisplay: '19h 30m',
        riskScore: 100,
        status: 'CLOSED / HIGH RISK',
        statusStyle: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
        disruptionsCount: 2,
        disruptionDetails: 'Sonapur 340m Debris Fall + KM 142 Subsidence',
        roadAccessibilityPct: 15,
        fuelLiters: 110,
        fuelCostINR: 10450,
        tollCostINR: 850,
        totalCostINR: 11300
      },
      {
        id: 'route-b',
        name: 'Route B: AI Recommended Bypass (Guwahati -> Lumding -> Haflong -> Silchar)',
        isRecommended: true,
        distanceKm: 414,
        etaHours: 7.25,
        etaDisplay: '7h 15m',
        riskScore: 38,
        status: 'LOW RISK',
        statusStyle: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
        disruptionsCount: 0,
        disruptionDetails: 'Clear Paved Hill Corridor with Active Escort',
        roadAccessibilityPct: 88,
        fuelLiters: 132,
        fuelCostINR: 12540,
        tollCostINR: 620,
        totalCostINR: 13160
      },
      {
        id: 'route-c',
        name: 'Route C: Extended Safe Lifeline (Guwahati -> Nagaon -> Tezpur -> Jatinga Loop)',
        isRecommended: false,
        distanceKm: 460,
        etaHours: 8.5,
        etaDisplay: '8h 30m',
        riskScore: 21,
        status: 'VERY LOW RISK',
        statusStyle: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
        disruptionsCount: 0,
        disruptionDetails: 'Fully Paved Four-lane Trunk Highway',
        roadAccessibilityPct: 96,
        fuelLiters: 148,
        fuelCostINR: 14060,
        tollCostINR: 940,
        totalCostINR: 15000
      }
    ]
  },
  MZ: {
    deliveryId: 'DEL-MZ-6610',
    vehicleRegNumber: 'MZ-01-E-7712',
    cargoDescription: 'POL Fuel Supplies & LPG Bulkers (28 MT)',
    cargoCategory: 'Petroleum & Gas',
    priority: 'Critical (Aizawl City Stockpile)',
    origin: 'Silchar Freight Hub',
    destination: 'Aizawl Central Petroleum Depot',
    currentLocation: 'Vairengte Border Checkpost (NH-54)',
    routes: [
      {
        id: 'route-a',
        name: 'Route A: Direct NH-54 Mountain Arterial (Via Vairengte Washout)',
        isRecommended: false,
        distanceKm: 180,
        etaHours: 19.0,
        etaDisplay: '19h 00m',
        riskScore: 92,
        status: 'CRITICAL RISK',
        statusStyle: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
        disruptionsCount: 2,
        disruptionDetails: 'Bridge Culvert Washout at KM 45',
        roadAccessibilityPct: 18,
        fuelLiters: 95,
        fuelCostINR: 9025,
        tollCostINR: 350,
        totalCostINR: 9375
      },
      {
        id: 'route-b',
        name: 'Route B: AI Recommended Bhairabi Detour (Hailakandi -> Bhairabi Railhead -> Aizawl)',
        isRecommended: true,
        distanceKm: 238,
        etaHours: 6.5,
        etaDisplay: '6h 30m',
        riskScore: 26,
        status: 'LOW RISK',
        statusStyle: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
        disruptionsCount: 0,
        disruptionDetails: 'Newly Paved Bhairabi Rail-Road Corridor',
        roadAccessibilityPct: 92,
        fuelLiters: 110,
        fuelCostINR: 10450,
        tollCostINR: 400,
        totalCostINR: 10850
      },
      {
        id: 'route-c',
        name: 'Route C: Southern Highway Corridor (Via Bilkhawthlir Paved Ridge)',
        isRecommended: false,
        distanceKm: 265,
        etaHours: 7.75,
        etaDisplay: '7h 45m',
        riskScore: 18,
        status: 'VERY LOW RISK',
        statusStyle: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
        disruptionsCount: 0,
        disruptionDetails: 'High Ridge Paved Pass (Safe from Slips)',
        roadAccessibilityPct: 97,
        fuelLiters: 122,
        fuelCostINR: 11590,
        tollCostINR: 450,
        totalCostINR: 12040
      }
    ]
  },
  SK: {
    deliveryId: 'DEL-VAC-3091',
    vehicleRegNumber: 'SK-01-D-3091',
    cargoDescription: 'Refrigerated Vaccines & Cold Chain Kits',
    cargoCategory: 'Medicines',
    priority: 'Critical (Temperature Sensitive)',
    origin: 'Siliguri Medical Depot',
    destination: 'STNM Hospital Gangtok',
    currentLocation: 'Melli Bridge Junction (Teesta River Overflow)',
    routes: [
      {
        id: 'route-a',
        name: 'Route A: Direct NH-10 Lifeline (Siliguri -> Melli -> Gangtok)',
        isRecommended: false,
        distanceKm: 114,
        etaHours: 6.5,
        etaDisplay: '6h 30m',
        riskScore: 89,
        status: 'CRITICAL RISK',
        statusStyle: 'bg-rose-600 text-white border-rose-400',
        disruptionsCount: 1,
        disruptionDetails: 'Teesta River Overflow at 29th Mile',
        roadAccessibilityPct: 35,
        fuelLiters: 42,
        fuelCostINR: 3990,
        tollCostINR: 180,
        totalCostINR: 4170
      },
      {
        id: 'route-b',
        name: 'Route B: AI Recommended Detour (Siliguri -> Gorubathan -> Lava -> Pakyong -> Gangtok)',
        isRecommended: true,
        distanceKm: 156,
        etaHours: 4.2,
        etaDisplay: '4h 12m',
        riskScore: 28,
        status: 'LOW RISK',
        statusStyle: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
        disruptionsCount: 0,
        disruptionDetails: 'High Ridge Paved Pass (Safe from River Flooding)',
        roadAccessibilityPct: 91,
        fuelLiters: 55,
        fuelCostINR: 5225,
        tollCostINR: 220,
        totalCostINR: 5445
      },
      {
        id: 'route-c',
        name: 'Route C: Extended Southern Pass (Siliguri -> Damdim -> Reshi -> Gangtok)',
        isRecommended: false,
        distanceKm: 178,
        etaHours: 5.1,
        etaDisplay: '5h 06m',
        riskScore: 16,
        status: 'VERY LOW RISK',
        statusStyle: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
        disruptionsCount: 0,
        disruptionDetails: 'Reinforced Ridge Bypass',
        roadAccessibilityPct: 98,
        fuelLiters: 64,
        fuelCostINR: 6080,
        tollCostINR: 260,
        totalCostINR: 6340
      }
    ]
  },
  AR: {
    deliveryId: 'DEL-ATF-7721',
    vehicleRegNumber: 'AR-01-D-7721',
    cargoDescription: 'Aviation Turbine Fuel & Military Logistics',
    cargoCategory: 'Defence & Airfield',
    priority: 'Critical (High Altitude Reserve)',
    origin: 'Tezpur Airfield Depot',
    destination: 'Tawang Forward Relief Station',
    currentLocation: 'Bomdila Ridge Post',
    routes: [
      {
        id: 'route-a',
        name: 'Route A: Direct NH-13 Summit Road (Via Sela Pass Snowstorm)',
        isRecommended: false,
        distanceKm: 330,
        etaHours: 12.5,
        etaDisplay: '12h 30m',
        riskScore: 84,
        status: 'HIGH RISK',
        statusStyle: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
        disruptionsCount: 1,
        disruptionDetails: 'High-Altitude Snow Drift at 4,170m Summit',
        roadAccessibilityPct: 42,
        fuelLiters: 140,
        fuelCostINR: 13300,
        tollCostINR: 500,
        totalCostINR: 13800
      },
      {
        id: 'route-b',
        name: 'Route B: AI Recommended Sela Twin-Tube Tunnel Corridor',
        isRecommended: true,
        distanceKm: 310,
        etaHours: 7.0,
        etaDisplay: '7h 00m',
        riskScore: 22,
        status: 'OPTIMAL FLOW',
        statusStyle: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
        disruptionsCount: 0,
        disruptionDetails: 'All-Weather Heated Tunnel Passage',
        roadAccessibilityPct: 98,
        fuelLiters: 118,
        fuelCostINR: 11210,
        tollCostINR: 650,
        totalCostINR: 11860
      },
      {
        id: 'route-c',
        name: 'Route C: Southern Foothill Link (Via Balipara - Bhalukpong)',
        isRecommended: false,
        distanceKm: 375,
        etaHours: 8.25,
        etaDisplay: '8h 15m',
        riskScore: 19,
        status: 'LOW RISK',
        statusStyle: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
        disruptionsCount: 0,
        disruptionDetails: 'Escorted Mountain Corridor',
        roadAccessibilityPct: 94,
        fuelLiters: 135,
        fuelCostINR: 12825,
        tollCostINR: 450,
        totalCostINR: 13275
      }
    ]
  },
  TR: {
    deliveryId: 'DEL-POL-9904',
    vehicleRegNumber: 'TR-01-A-1029',
    cargoDescription: 'High-Speed Diesel (HSD) Fuel Tanker 18KL',
    cargoCategory: 'Emergency Fuel',
    priority: 'High (State Fuel Reserve)',
    origin: 'Guwahati Oil Refinery',
    destination: 'Agartala Main IOCL Depot',
    currentLocation: 'Jowai Bypass Stretch',
    routes: [
      {
        id: 'route-a',
        name: 'Route A: Direct NH-8 Trunk Highway (Via Churaibari Checkgate)',
        isRecommended: false,
        distanceKm: 550,
        etaHours: 18.5,
        etaDisplay: '18h 30m',
        riskScore: 68,
        status: 'MODERATE RISK',
        statusStyle: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
        disruptionsCount: 1,
        disruptionDetails: 'Interstate Toll Gate Tailback',
        roadAccessibilityPct: 58,
        fuelLiters: 180,
        fuelCostINR: 17100,
        tollCostINR: 1200,
        totalCostINR: 18300
      },
      {
        id: 'route-b',
        name: 'Route B: AI Recommended Bypass (Guwahati -> Jowai -> Badarpur -> Agartala)',
        isRecommended: true,
        distanceKm: 585,
        etaHours: 14.5,
        etaDisplay: '14h 30m',
        riskScore: 25,
        status: 'LOW RISK',
        statusStyle: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
        disruptionsCount: 0,
        disruptionDetails: 'Fast-Track Interstate Convoy Lane',
        roadAccessibilityPct: 90,
        fuelLiters: 195,
        fuelCostINR: 18525,
        tollCostINR: 980,
        totalCostINR: 19505
      },
      {
        id: 'route-c',
        name: 'Route C: Extended Southern Transit Link (Via Dharmanagar Railhead)',
        isRecommended: false,
        distanceKm: 620,
        etaHours: 16.0,
        etaDisplay: '16h 00m',
        riskScore: 19,
        status: 'VERY LOW RISK',
        statusStyle: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
        disruptionsCount: 0,
        disruptionDetails: 'Low Risk Valley Corridor',
        roadAccessibilityPct: 95,
        fuelLiters: 210,
        fuelCostINR: 19950,
        tollCostINR: 1100,
        totalCostINR: 21050
      }
    ]
  },
  MN: {
    deliveryId: 'DEL-FCI-4412',
    vehicleRegNumber: 'MN-01-C-8823',
    cargoDescription: 'FCI Fortified Foodgrain Stockpiles (42 MT)',
    cargoCategory: 'Civil Supplies',
    priority: 'High (Imphal Buffer Stock)',
    origin: 'Silchar Supply Base',
    destination: 'Imphal Valley Relief Stockpiles',
    currentLocation: 'Jiribam Border Entry',
    routes: [
      {
        id: 'route-a',
        name: 'Route A: Direct NH-37 Lifeline (Silchar -> Jiribam -> Imphal)',
        isRecommended: false,
        distanceKm: 220,
        etaHours: 10.5,
        etaDisplay: '10h 30m',
        riskScore: 62,
        status: 'MODERATE RISK',
        statusStyle: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
        disruptionsCount: 1,
        disruptionDetails: 'Barak Basin Fog & Single-Lane Cuttings',
        roadAccessibilityPct: 65,
        fuelLiters: 105,
        fuelCostINR: 9975,
        tollCostINR: 300,
        totalCostINR: 10275
      },
      {
        id: 'route-b',
        name: 'Route B: AI Recommended Escorted Highway Convoy (Jiribam -> Noney -> Imphal)',
        isRecommended: true,
        distanceKm: 210,
        etaHours: 6.75,
        etaDisplay: '6h 45m',
        riskScore: 24,
        status: 'OPTIMAL FLOW',
        statusStyle: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
        disruptionsCount: 0,
        disruptionDetails: 'Four-lane Asian Highway Standard with Security Escort',
        roadAccessibilityPct: 92,
        fuelLiters: 98,
        fuelCostINR: 9310,
        tollCostINR: 350,
        totalCostINR: 9660
      },
      {
        id: 'route-c',
        name: 'Route C: Northern Arterial (Via Dimapur - Kohima)',
        isRecommended: false,
        distanceKm: 285,
        etaHours: 8.0,
        etaDisplay: '8h 00m',
        riskScore: 18,
        status: 'LOW RISK',
        statusStyle: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
        disruptionsCount: 0,
        disruptionDetails: 'Paved Interstate Connector',
        roadAccessibilityPct: 96,
        fuelLiters: 125,
        fuelCostINR: 11875,
        tollCostINR: 420,
        totalCostINR: 12295
      }
    ]
  },
  NL: {
    deliveryId: 'DEL-SUP-2219',
    vehicleRegNumber: 'NL-01-B-5531',
    cargoDescription: 'Civil Ration Supplies & LPG Cylinders',
    cargoCategory: 'Civil Supplies',
    priority: 'Normal Transit',
    origin: 'Dimapur Railhead Depot',
    destination: 'Kohima Central Logistics Hub',
    currentLocation: 'Chumukedima Checkgate',
    routes: [
      {
        id: 'route-a',
        name: 'Route A: Old Ridge Hill Road',
        isRecommended: false,
        distanceKm: 85,
        etaHours: 4.25,
        etaDisplay: '4h 15m',
        riskScore: 45,
        status: 'MODERATE RISK',
        statusStyle: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
        disruptionsCount: 0,
        disruptionDetails: 'Narrow Curves & Slow Speeds',
        roadAccessibilityPct: 75,
        fuelLiters: 38,
        fuelCostINR: 3610,
        tollCostINR: 100,
        totalCostINR: 3710
      },
      {
        id: 'route-b',
        name: 'Route B: AI Recommended 4-Lane Asian Highway NH-29',
        isRecommended: true,
        distanceKm: 74,
        etaHours: 1.75,
        etaDisplay: '1h 45m',
        riskScore: 12,
        status: 'OPTIMAL FLOW',
        statusStyle: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
        disruptionsCount: 0,
        disruptionDetails: 'Four-lane Expressway Standard',
        roadAccessibilityPct: 99,
        fuelLiters: 28,
        fuelCostINR: 2660,
        tollCostINR: 150,
        totalCostINR: 2810
      },
      {
        id: 'route-c',
        name: 'Route C: Chumukedima Bypass Expressway',
        isRecommended: false,
        distanceKm: 88,
        etaHours: 2.15,
        etaDisplay: '2h 10m',
        riskScore: 15,
        status: 'VERY LOW RISK',
        statusStyle: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
        disruptionsCount: 0,
        disruptionDetails: 'Smooth Paved Bypass',
        roadAccessibilityPct: 98,
        fuelLiters: 32,
        fuelCostINR: 3040,
        tollCostINR: 150,
        totalCostINR: 3190
      }
    ]
  },
  ML: {
    deliveryId: 'DEL-ML-3341',
    vehicleRegNumber: 'ML-05-E-4412',
    cargoDescription: 'Essential Food Grains & Power Grid Spares',
    cargoCategory: 'Emergency Freight',
    priority: 'Critical (Jowai Relief Depot)',
    origin: 'Guwahati Logistics Hub',
    destination: 'Jowai Depot / East Jaintia Hills',
    currentLocation: 'Umiam Highway Node',
    routes: [
      {
        id: 'route-a',
        name: 'Route A: Direct NH-6 Highway (Via East Jaintia Hills Mudflow)',
        isRecommended: false,
        distanceKm: 165,
        etaHours: 11.0,
        etaDisplay: '11h 00m',
        riskScore: 86,
        status: 'CRITICAL RISK',
        statusStyle: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
        disruptionsCount: 2,
        disruptionDetails: 'Active Cloudburst Mudflow at Sonapur Portal',
        roadAccessibilityPct: 25,
        fuelLiters: 65,
        fuelCostINR: 6175,
        tollCostINR: 250,
        totalCostINR: 6425
      },
      {
        id: 'route-b',
        name: 'Route B: AI Recommended Ridge Bypass (Shillong -> Mairang Corridor)',
        isRecommended: true,
        distanceKm: 195,
        etaHours: 4.5,
        etaDisplay: '4h 30m',
        riskScore: 25,
        status: 'LOW RISK',
        statusStyle: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
        disruptionsCount: 0,
        disruptionDetails: 'Paved High Ridge Route (Safe from Debris)',
        roadAccessibilityPct: 93,
        fuelLiters: 75,
        fuelCostINR: 7125,
        tollCostINR: 300,
        totalCostINR: 7425
      },
      {
        id: 'route-c',
        name: 'Route C: Nongstoin Arterial Highway',
        isRecommended: false,
        distanceKm: 220,
        etaHours: 5.25,
        etaDisplay: '5h 15m',
        riskScore: 18,
        status: 'VERY LOW RISK',
        statusStyle: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
        disruptionsCount: 0,
        disruptionDetails: 'Wide Interstate Trunk',
        roadAccessibilityPct: 97,
        fuelLiters: 85,
        fuelCostINR: 8075,
        tollCostINR: 320,
        totalCostINR: 8395
      }
    ]
  }
};

export const RoutesPage = () => {
  const { addToast } = useToast();
  const { selectedState } = useApp();

  const stateManifest = STATE_ROUTE_MANIFESTS[selectedState] || STATE_ROUTE_MANIFESTS.all;
  const stateName = NER_STATES.find(s => s.id === selectedState)?.name || 'All NER States';

  // Active Tab View: 'matrix' vs 'planner'
  const [activeTab, setActiveTab] = useState('matrix');

  // Active Selected Delivery Manifest
  const [selectedDelivery, setSelectedDelivery] = useState(stateManifest);

  // Route Planner Input Form State
  const [plannerOrigin, setPlannerOrigin] = useState(stateManifest.origin);
  const [plannerDestination, setPlannerDestination] = useState(stateManifest.destination);
  const [plannerCargo, setPlannerCargo] = useState(stateManifest.cargoDescription);
  const [plannerPriority, setPlannerPriority] = useState(stateManifest.priority);
  const [plannerVehicle, setPlannerVehicle] = useState(stateManifest.vehicleRegNumber);
  const [plannerIsEvaluating, setPlannerIsEvaluating] = useState(false);

  // Automatically update selected delivery when state changes
  useEffect(() => {
    const manifest = STATE_ROUTE_MANIFESTS[selectedState] || STATE_ROUTE_MANIFESTS.all;
    setSelectedDelivery(manifest);
    setPlannerOrigin(manifest.origin);
    setPlannerDestination(manifest.destination);
    setPlannerCargo(manifest.cargoDescription);
    setPlannerPriority(manifest.priority);
    setPlannerVehicle(manifest.vehicleRegNumber);
  }, [selectedState]);

  // Scenario Presets State
  const [scenarioInputs] = useState({
    rainfallMm: 140,
    weatherSeverity: 'heavy',
    terrainVulnerability: 'steep_gorge',
    historicalFrequency: 14,
    recentIncidentsCount: 2,
    roadCondition: 'subsidence',
    trafficCongestion: 'moderate'
  });

  // AI Prediction & Route Decision Engine Output State
  const [aiPrediction, setAiPrediction] = useState(null);
  const [decisionResult, setDecisionResult] = useState(null);

  useEffect(() => {
    let isMounted = true;

    predictDisruption(scenarioInputs).then((pred) => {
      if (isMounted) {
        setAiPrediction(pred);

        const decision = evaluateRouteDecision(
          selectedDelivery,
          selectedDelivery.routes,
          pred,
          scenarioInputs
        );

        setDecisionResult(decision);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedDelivery, scenarioInputs]);

  const handlePlanRoute = (e) => {
    e?.preventDefault();
    setPlannerIsEvaluating(true);

    setTimeout(() => {
      setPlannerIsEvaluating(false);
      addToast({
        title: 'Route Intelligence Evaluation Complete',
        message: `Argmax route planner evaluated 3 corridors for ${plannerCargo} from ${plannerOrigin} to ${plannerDestination}. Recommended: Route B Bypass.`,
        type: 'success'
      });
      setActiveTab('matrix');
    }, 600);
  };

  return (
    <div className="space-y-6 font-sans text-[#172033]">
      {/* Header Bar */}
      <PageHeader
        category="LOGISTICS CORRIDOR RESILIENCE & ARGMAX ROUTE PLANNER"
        title="Live Corridors & Route Comparison Matrix"
        subtitle="Multi-factor weighted evaluation comparing direct highways vs bypass corridors based on predicted disruption risk, ETA, distance, and accessibility."
        badgeText="ROUTE ENGINE ACTIVE"
        actionButton={
          <div className="flex items-center gap-2 bg-[#F8FAFC] p-1 rounded-xl border border-[#E4EAF2]">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeTab === 'matrix' ? 'bg-[#155EEF] text-white shadow-xs' : 'text-[#667085] hover:text-[#172033]'
              }`}
            >
              Corridor Matrix
            </button>
            <button
              onClick={() => setActiveTab('planner')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeTab === 'planner' ? 'bg-[#155EEF] text-white shadow-xs' : 'text-[#667085] hover:text-[#172033]'
              }`}
            >
              Route Planner
            </button>
          </div>
        }
      />

      {/* TAB 1: INTERACTIVE ROUTE PLANNER FORM */}
      {activeTab === 'planner' && (
        <Card title="ROUTE PLANNER INTERFACE" subtitle="Configure cargo manifest, priority level, and vehicle type to run Argmax route decision evaluation">
          <form onSubmit={handlePlanRoute} className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[#667085] uppercase text-[10px] font-bold">Origin Depot</label>
                <input
                  type="text"
                  value={plannerOrigin}
                  onChange={(e) => setPlannerOrigin(e.target.value)}
                  className="w-full bg-[#F5F8FC] border border-[#E4EAF2] text-[#172033] px-3.5 py-2 rounded-xl focus:outline-none focus:border-[#155EEF] font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#667085] uppercase text-[10px] font-bold">Destination Hub</label>
                <input
                  type="text"
                  value={plannerDestination}
                  onChange={(e) => setPlannerDestination(e.target.value)}
                  className="w-full bg-[#F5F8FC] border border-[#E4EAF2] text-[#172033] px-3.5 py-2 rounded-xl focus:outline-none focus:border-[#155EEF] font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#667085] uppercase text-[10px] font-bold">Cargo Category</label>
                <select
                  value={plannerCargo}
                  onChange={(e) => setPlannerCargo(e.target.value)}
                  className="w-full bg-[#F5F8FC] border border-[#E4EAF2] text-[#172033] px-3.5 py-2 rounded-xl focus:outline-none focus:border-[#155EEF] font-sans"
                >
                  <option value="Medicines & Cold Chain">Medicines & Cryogenic Oxygen</option>
                  <option value="Food & Ration Grains">Food & Ration Grains</option>
                  <option value="Construction Materials">Construction & Fuel Supplies</option>
                  <option value="Emergency Equipment">Emergency Rescue Machinery</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[#667085] uppercase text-[10px] font-bold">Priority Level</label>
                <select
                  value={plannerPriority}
                  onChange={(e) => setPlannerPriority(e.target.value)}
                  className="w-full bg-[#F5F8FC] border border-[#E4EAF2] text-[#172033] px-3.5 py-2 rounded-xl focus:outline-none focus:border-[#155EEF] font-sans"
                >
                  <option value="Critical">Critical (55% Risk Weight)</option>
                  <option value="High">High (48% Risk Weight)</option>
                  <option value="Normal">Normal (40% Risk Weight)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[#667085] uppercase text-[10px] font-bold">Vehicle / Transport Type</label>
                <select
                  value={plannerVehicle}
                  onChange={(e) => setPlannerVehicle(e.target.value)}
                  className="w-full bg-[#F5F8FC] border border-[#E4EAF2] text-[#172033] px-3.5 py-2 rounded-xl focus:outline-none focus:border-[#155EEF] font-sans"
                >
                  <option value="Heavy Tanker Convoy">Heavy Tanker Convoy</option>
                  <option value="Refrigerated Cold Chain Van">Refrigerated Cold Chain Van</option>
                  <option value="4x4 Escort Vehicle">4x4 Escort Vehicle</option>
                  <option value="Flatbed Truck">Flatbed Cargo Truck</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  icon={Compass}
                  isLoading={plannerIsEvaluating}
                  className="w-full bg-[#155EEF] hover:bg-[#124BCE] text-white font-bold"
                >
                  PLAN ROUTE
                </Button>
              </div>
            </div>
          </form>
        </Card>
      )}

      {/* TAB 2: CANDIDATE ROUTE COMPARISON MATRIX TABLE */}
      <Card
        title={`CANDIDATE ROUTE COMPARISON MATRIX (${stateName.toUpperCase()})`}
        subtitle={`Dynamic side-by-side trade-off evaluation for ${selectedDelivery.origin} → ${selectedDelivery.destination} (${selectedDelivery.cargoDescription})`}
      >
        <div className="space-y-4 font-mono text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E4EAF2] bg-[#F1F5F9] text-[#667085] uppercase text-[11px]">
                  <th className="py-3 px-4">Evaluation Metric</th>
                  {decisionResult?.candidateRoutes?.map((rt) => (
                    <th
                      key={rt.id}
                      className={`py-3 px-4 text-center ${
                        rt.id === decisionResult.recommendedRouteId
                          ? 'bg-[#E6F6F4] text-[#0F9D8A] font-bold border-t-2 border-t-[#0F9D8A]'
                          : 'text-[#172033]'
                      }`}
                    >
                      {rt.name}
                      {rt.id === decisionResult.recommendedRouteId && (
                        <span className="block text-[9px] uppercase text-[#0F9D8A] font-extrabold mt-0.5">
                          ★ RECOMMENDED
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4EAF2]">
                <tr>
                  <td className="py-3.5 px-4 font-bold text-[#172033]">Travel Time (ETA)</td>
                  {decisionResult?.candidateRoutes?.map((rt) => (
                    <td key={rt.id} className="py-3.5 px-4 text-center text-[#172033] font-bold">
                      {rt.etaDisplay}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3.5 px-4 font-bold text-[#172033]">Predicted Risk Score</td>
                  {decisionResult?.candidateRoutes?.map((rt) => (
                    <td key={rt.id} className="py-3.5 px-4 text-center">
                      <Badge status={rt.riskCategory.toLowerCase()} size="sm">
                        {rt.routeRiskScore} / 100 ({rt.riskCategory})
                      </Badge>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3.5 px-4 font-bold text-[#172033]">Corridor Reliability (%)</td>
                  {decisionResult?.candidateRoutes?.map((rt) => (
                    <td key={rt.id} className="py-3.5 px-4 text-center text-[#0F9D8A] font-bold">
                      {rt.roadAccessibilityPct}%
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3.5 px-4 font-bold text-[#172033]">Distance & Fuel Cost</td>
                  {decisionResult?.candidateRoutes?.map((rt) => (
                    <td key={rt.id} className="py-3.5 px-4 text-center text-[#667085]">
                      {rt.distanceKm} km (₹{(rt.totalCostINR || 12000).toLocaleString('en-IN')})
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3.5 px-4 font-bold text-[#172033]">Disruption Exposure</td>
                  {decisionResult?.candidateRoutes?.map((rt) => (
                    <td key={rt.id} className="py-3.5 px-4 text-center">
                      <span className={`font-bold ${rt.routeRiskScore > 70 ? 'text-[#E5484D]' : 'text-[#16A34A]'}`}>
                        {rt.routeRiskScore > 70 ? 'High Exposure' : 'Low Exposure'}
                      </span>
                    </td>
                  ))}
                </tr>

                <tr className="bg-[#F8FAFC]">
                  <td className="py-4 px-4 font-extrabold text-[#155EEF]">Overall Decision Score</td>
                  {decisionResult?.candidateRoutes?.map((rt) => (
                    <td key={rt.id} className="py-4 px-4 text-center">
                      <span className={`text-base font-extrabold ${rt.id === decisionResult.recommendedRouteId ? 'text-[#0F9D8A] text-lg' : 'text-[#172033]'}`}>
                        {rt.overallDecisionScore} / 100
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3.5 bg-[#EAF2FF] rounded-xl border border-[#B2CCFF] text-xs font-sans font-semibold text-[#155EEF] leading-relaxed">
            "{decisionResult?.decisionReason}"
          </div>
        </div>
      </Card>
    </div>
  );
};
