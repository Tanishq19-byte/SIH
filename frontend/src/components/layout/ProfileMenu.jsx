import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  ShieldCheck,
  Settings,
  LogOut,
  LogIn,
  ChevronDown,
  Building2,
  X,
  Check,
  Key,
  Lock,
  Phone,
  Mail,
  Award,
  Radio,
  Sliders,
  ShieldAlert,
  Save
} from 'lucide-react';
import { useToast } from '../../hooks/useToast';

const OFFICER_PROFILES = [
  {
    id: 'dr_sharma',
    initials: 'ND',
    name: 'Dr. R. K. Sharma',
    role: 'Chief Logistics Officer',
    organization: 'NDMA / MDoNER',
    secretariat: 'North Eastern Council Secretariat',
    clearance: 'Level 5 (National Security & Defense Transit)',
    email: 'rk.sharma@mconer.gov.in',
    phone: '+91 98450 12891',
    badge: 'COMMAND CONTROLLER'
  },
  {
    id: 'col_roy',
    initials: 'BR',
    name: 'Col. S. Roy',
    role: 'BRO Border Logistics Commander',
    organization: 'Border Roads Organisation (44 BRTF)',
    secretariat: 'Eastern Sector Strategic Command',
    clearance: 'Level 5 (Mountain Warfare Logistics)',
    email: 'col.sroy@bro.gov.in',
    phone: '+91 94360 88201',
    badge: 'FIELD COMMANDER'
  },
  {
    id: 'p_das',
    initials: 'PD',
    name: 'P. Das, IAS',
    role: 'Disaster Relief Coordinator',
    organization: 'Assam State Disaster Management (ASDMA)',
    secretariat: 'Emergency Operations Center, Dispur',
    clearance: 'Level 4 (Civil Supplies & Relief Lifeline)',
    email: 'p.das@assam.gov.in',
    phone: '+91 97060 41190',
    badge: 'RELIEF CONTROLLER'
  }
];

export const ProfileMenu = () => {
  const { addToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'profile' | 'security' | 'preferences' | 'login'
  const menuRef = useRef(null);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [selectedOfficer, setSelectedOfficer] = useState(OFFICER_PROFILES[0]);

  // Preferences State
  const [routeBias, setRouteBias] = useState('safety');
  const [alertThreshold, setAlertThreshold] = useState('moderate');
  const [telemetryRefreshSec, setTelemetryRefreshSec] = useState(15);
  const [smsEmergencyAlerts, setSmsEmergencyAlerts] = useState(true);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    setIsOpen(false);
    setIsAuthenticated(false);
    addToast({
      title: 'Command Session Terminated',
      message: `${selectedOfficer.name} has been signed out. Switched to Read-Only Public Mode.`,
      type: 'warning'
    });
  };

  const handleSignIn = (officer) => {
    setSelectedOfficer(officer);
    setIsAuthenticated(true);
    setActiveModal(null);
    setIsOpen(false);
    addToast({
      title: 'Officer Authentication Verified',
      message: `Authenticated as ${officer.name} (${officer.role}). Security clearance Level 5 active.`,
      type: 'success'
    });
  };

  return (
    <>
      <div className="relative" ref={menuRef}>
        {isAuthenticated ? (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl p-1.5 pr-2.5 transition-all shadow-2xs cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-[#0F766E] flex items-center justify-center font-extrabold text-white text-xs shadow-xs flex-shrink-0">
              {selectedOfficer.initials}
            </div>
            <div className="hidden lg:block text-left font-sans max-w-[130px] truncate">
              <p className="text-xs font-extrabold text-[#0F172A] leading-none truncate">{selectedOfficer.role}</p>
              <p className="text-[10px] text-[#0F766E] font-bold mt-0.5 truncate">{selectedOfficer.organization}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B] flex-shrink-0" />
          </button>
        ) : (
          <button
            onClick={() => setActiveModal('login')}
            className="flex items-center gap-1.5 bg-[#0F766E] hover:bg-[#115E59] text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        )}

        {isOpen && isAuthenticated && (
          <div
            className="absolute right-0 mt-2 w-72 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl overflow-hidden z-[9999] font-sans text-xs animate-in fade-in zoom-in-95 duration-150"
            style={{ right: 0, minWidth: '280px', maxWidth: '94vw' }}
          >
            {/* Header Profile Badge */}
            <div className="p-3.5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-extrabold text-[#0F172A]">{selectedOfficer.name}</p>
                  <p className="text-[11px] text-[#64748B] font-medium">{selectedOfficer.role}</p>
                </div>
                <span className="text-[9px] bg-[#CCFBF1] text-[#0F766E] font-bold px-2 py-0.5 rounded-md border border-[#99F6E4]">
                  {selectedOfficer.badge}
                </span>
              </div>
              <div className="mt-2 pt-2 border-t border-[#E2E8F0] flex items-center gap-1.5 text-[10px] text-[#0F766E] font-bold font-mono">
                <Building2 className="w-3.5 h-3.5 text-[#0F766E] flex-shrink-0" />
                <span className="truncate">{selectedOfficer.secretariat}</span>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-1.5 text-xs text-[#0F172A]">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setActiveModal('profile');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#F1F5F9] transition-colors cursor-pointer font-medium text-left"
              >
                <User className="w-4 h-4 text-[#0F766E]" />
                <div className="flex-1">
                  <p className="font-bold">Officer Profile</p>
                  <p className="text-[10px] text-[#64748B]">View clearances, credentials & phone</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  setActiveModal('security');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#F1F5F9] transition-colors cursor-pointer font-medium text-left"
              >
                <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
                <div className="flex-1">
                  <p className="font-bold">Security & Credentials</p>
                  <p className="text-[10px] text-[#64748B]">Digital keys, 2FA & encrypted link</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  setActiveModal('preferences');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#F1F5F9] transition-colors cursor-pointer font-medium text-left"
              >
                <Settings className="w-4 h-4 text-[#2563EB]" />
                <div className="flex-1">
                  <p className="font-bold">Agency Preferences</p>
                  <p className="text-[10px] text-[#64748B]">Argmax weights & telemetry speeds</p>
                </div>
              </button>
            </div>

            {/* Sign Out Button */}
            <div className="p-1.5 border-t border-[#E2E8F0] bg-[#F8FAFC]">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#DC2626] hover:bg-[#FEF2F2] transition-colors text-xs font-bold cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-[#DC2626]" />
                <span>Sign Out Command System</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: OFFICER PROFILE MODAL */}
      {activeModal === 'profile' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[99999] animate-in fade-in duration-150">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden font-sans">
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0F766E] flex items-center justify-center text-white font-extrabold text-sm">
                  {selectedOfficer.initials}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#0F172A]">Command Officer Profile</h3>
                  <p className="text-[11px] text-[#64748B]">Official MDoNER & NDMA Command Record</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block">Officer Name</span>
                  <span className="text-sm font-extrabold text-[#0F172A] mt-0.5 block">{selectedOfficer.name}</span>
                </div>
                <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block">Command Role</span>
                  <span className="text-xs font-bold text-[#0F766E] mt-0.5 block">{selectedOfficer.role}</span>
                </div>
                <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block">Organization</span>
                  <span className="text-xs font-bold text-[#0F172A] mt-0.5 block">{selectedOfficer.organization}</span>
                </div>
                <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block">Security Clearance</span>
                  <span className="text-xs font-bold text-[#16A34A] mt-0.5 block">{selectedOfficer.clearance}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                <div className="flex items-center justify-between text-xs py-1.5 px-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                  <span className="text-[#64748B] flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#0F766E]" /> Official Email:
                  </span>
                  <span className="font-mono font-bold text-[#0F172A]">{selectedOfficer.email}</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1.5 px-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                  <span className="text-[#64748B] flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#0F766E]" /> Secure Hot Line:
                  </span>
                  <span className="font-mono font-bold text-[#0F172A]">{selectedOfficer.phone}</span>
                </div>
              </div>

              {/* Switch Officer Profile */}
              <div className="pt-3 border-t border-[#E2E8F0]">
                <span className="text-[11px] font-extrabold text-[#0F172A] uppercase block mb-2">Switch Active Officer Account:</span>
                <div className="space-y-2">
                  {OFFICER_PROFILES.map((prof) => (
                    <button
                      key={prof.id}
                      onClick={() => handleSignIn(prof)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer text-left ${
                        selectedOfficer.id === prof.id
                          ? 'bg-[#CCFBF1] border-[#0F766E] text-[#0F766E] shadow-2xs font-bold'
                          : 'bg-white border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0F172A]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-md bg-[#0F766E] text-white font-bold flex items-center justify-center text-[10px]">
                          {prof.initials}
                        </div>
                        <div>
                          <p className="text-xs font-extrabold">{prof.name}</p>
                          <p className="text-[10px] text-[#64748B]">{prof.role}</p>
                        </div>
                      </div>
                      {selectedOfficer.id === prof.id && <Check className="w-4 h-4 text-[#0F766E]" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="bg-[#0F766E] hover:bg-[#115E59] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: SECURITY & CREDENTIALS MODAL */}
      {activeModal === 'security' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[99999] animate-in fade-in duration-150">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden font-sans">
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#16A34A]" />
                <h3 className="font-extrabold text-sm text-[#0F172A]">Security & Cryptographic Credentials</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl flex items-center gap-2 text-[#065F46]">
                <Lock className="w-4 h-4 text-[#16A34A] flex-shrink-0" />
                <span className="font-bold text-[11px]">256-Bit Hardware Security Key (HSM) Active</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#64748B] uppercase">National Transit API Token</label>
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    value="ner_sec_live_9981248019284091284"
                    readOnly
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] px-3 py-2 rounded-xl font-mono text-xs"
                  />
                  <button
                    onClick={() =>
                      addToast({
                        title: 'API Token Copied',
                        message: 'National command key copied to clipboard.',
                        type: 'info'
                      })
                    }
                    className="bg-[#0F766E] text-white px-3 py-2 rounded-xl font-bold hover:bg-[#115E59] cursor-pointer shrink-0"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                <div className="flex items-center justify-between py-1">
                  <span className="text-[#64748B]">Multi-Factor Authentication (2FA):</span>
                  <span className="font-bold text-[#16A34A] flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Hardware Token Active
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-[#64748B]">Session Encryption:</span>
                  <span className="font-mono font-bold text-[#0F172A]">TLS 1.3 / AES-GCM-256</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-[#64748B]">Emergency Directive Authority:</span>
                  <span className="font-bold text-[#DC2626]">Authorized for Sonapur Bypass</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="bg-[#0F766E] hover:bg-[#115E59] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                Acknowledge Security
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: AGENCY PREFERENCES MODAL */}
      {activeModal === 'preferences' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[99999] animate-in fade-in duration-150">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden font-sans">
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#2563EB]" />
                <h3 className="font-extrabold text-sm text-[#0F172A]">Agency Command Preferences</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#64748B] uppercase">AI Rerouting Optimization Bias</label>
                <select
                  value={routeBias}
                  onChange={(e) => setRouteBias(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] px-3 py-2 rounded-xl font-bold cursor-pointer focus:outline-none"
                >
                  <option value="safety">Maximum Safety (Prioritize High Ridge Paved Passes)</option>
                  <option value="speed">Maximum Speed (Shortest Travel Hours)</option>
                  <option value="cost">Minimum Fuel & Toll Logistics Cost</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#64748B] uppercase">Telemetry Refresh Interval</label>
                <select
                  value={telemetryRefreshSec}
                  onChange={(e) => setTelemetryRefreshSec(Number(e.target.value))}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] px-3 py-2 rounded-xl font-bold cursor-pointer focus:outline-none"
                >
                  <option value={10}>10 Seconds (High-Frequency Satellite Stream)</option>
                  <option value={15}>15 Seconds (Standard Operations)</option>
                  <option value={30}>30 Seconds (Bandwidth Conservative)</option>
                </select>
              </div>

              <div className="pt-2 border-t border-[#E2E8F0] space-y-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smsEmergencyAlerts}
                    onChange={(e) => setSmsEmergencyAlerts(e.target.checked)}
                    className="rounded text-[#0F766E] focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span className="font-bold text-[#0F172A]">Send Flash SMS on Landslide Blockages</span>
                </label>
              </div>
            </div>

            <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-2">
              <button
                onClick={() => {
                  setActiveModal(null);
                  addToast({
                    title: 'Agency Preferences Saved',
                    message: `Routing bias updated to ${routeBias.toUpperCase()}. Telemetry set to ${telemetryRefreshSec}s.`,
                    type: 'success'
                  });
                }}
                className="bg-[#0F766E] hover:bg-[#115E59] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Preferences</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: SIGN IN / OFFICER LOGIN MODAL */}
      {activeModal === 'login' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[99999] animate-in fade-in duration-150">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden font-sans">
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
              <div className="flex items-center gap-2">
                <LogIn className="w-5 h-5 text-[#0F766E]" />
                <h3 className="font-extrabold text-sm text-[#0F172A]">Command Center Authentication</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <p className="text-[#64748B] text-xs">
                Select an authorized government command officer profile to initialize secure session:
              </p>

              <div className="space-y-2.5">
                {OFFICER_PROFILES.map((prof) => (
                  <button
                    key={prof.id}
                    onClick={() => handleSignIn(prof)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-[#E2E8F0] hover:border-[#0F766E] hover:bg-[#F0FDFA] transition-all cursor-pointer text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#0F766E] text-white font-extrabold flex items-center justify-center text-xs shadow-xs">
                        {prof.initials}
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-[#0F172A] group-hover:text-[#0F766E]">{prof.name}</p>
                        <p className="text-[10px] text-[#64748B]">{prof.role}</p>
                        <p className="text-[9px] text-[#0F766E] font-bold font-mono">{prof.organization}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-[#F1F5F9] group-hover:bg-[#0F766E] group-hover:text-white px-2.5 py-1 rounded-lg transition-colors">
                      Login &rarr;
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

