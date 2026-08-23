import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Play,
  RotateCcw,
  CloudRain,
  AlertTriangle,
  Compass,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { runDisasterSimulation } from '../services/disasterSimulationEngine';
import { useToast } from '../hooks/useToast';

export const SimulationPage = () => {
  const { addToast } = useToast();

  const [rainfall24h, setRainfall24h] = useState(185);
  const [activeIncidentCount, setActiveIncidentCount] = useState(4);
  const [landslideProbability, setLandslideProbability] = useState(90);
  const [floodProbability, setFloodProbability] = useState(82);
  const [simResult, setSimResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    runDisasterSimulation({
      rainfall24h,
      activeIncidentCount,
      landslideProbability,
      floodProbability
    }).then((res) => {
      setSimResult(res);
    });
  }, [rainfall24h, activeIncidentCount, landslideProbability, floodProbability]);

  const handleRunSimulation = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      addToast({
        title: 'Disaster Cascade Simulation Executed',
        message: 'Updated network accessibility index and AI preparedness directives.',
        type: 'success'
      });
    }, 600);
  };

  return (
    <div className="space-y-6 font-sans text-[#172033]">
      <PageHeader
        category="WHAT-IF DISASTER CASCADE SIMULATION ENGINE"
        title="Crisis Simulator & Stress Testing"
        subtitle="Simulate extreme rainfall, multiple simultaneous landslides, and river flooding to stress-test North East corridor resilience."
        badgeText="SIMULATOR READY"
        actionButton={
          <Button
            variant="primary"
            size="sm"
            icon={Play}
            isLoading={isRunning}
            onClick={handleRunSimulation}
            className="bg-[#155EEF] text-white font-bold"
          >
            Run Simulation
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="SIMULATION PARAMETERS" subtitle="Adjust monsoon intensity and blockage counts">
          <div className="space-y-4 font-mono text-xs">
            <div className="space-y-1.5 p-3 rounded-xl bg-[#F8FAFC] border border-[#E4EAF2]">
              <div className="flex justify-between text-[#172033]">
                <span className="font-bold">Simulated 24h Rainfall:</span>
                <span className="font-bold text-[#155EEF]">{rainfall24h} mm</span>
              </div>
              <input
                type="range"
                min="20"
                max="350"
                value={rainfall24h}
                onChange={(e) => setRainfall24h(Number(e.target.value))}
                className="w-full accent-[#155EEF]"
              />
            </div>

            <div className="space-y-1.5 p-3 rounded-xl bg-[#F8FAFC] border border-[#E4EAF2]">
              <div className="flex justify-between text-[#172033]">
                <span className="font-bold">Simulated Active Blockages:</span>
                <span className="font-bold text-[#E5484D]">{activeIncidentCount} Passes Blocked</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={activeIncidentCount}
                onChange={(e) => setActiveIncidentCount(Number(e.target.value))}
                className="w-full accent-[#E5484D]"
              />
            </div>
          </div>
        </Card>

        <Card title="SIMULATION CASCADE RESULTS" subtitle="Network impact & dynamic preparedness directives">
          <div className="space-y-3 font-sans text-xs">
            <div className="p-3.5 rounded-xl bg-[#EAF2FF] border border-[#B2CCFF] text-[#155EEF]">
              <span className="font-mono text-[10px] uppercase font-bold block">RISK TRANSITION</span>
              <p className="text-sm font-extrabold mt-0.5">
                {simResult?.riskTransition?.transitionStatus || 'RISK ESCALATING (+86 PTS)'}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold text-[#667085] uppercase">PREPAREDNESS DIRECTIVES</span>
              {simResult?.preparedActions?.map((act, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E4EAF2] text-[#172033]">
                  • {act}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
