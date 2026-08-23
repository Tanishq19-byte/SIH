import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { NetworkProvider } from './context/NetworkContext';

import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { NotificationCenter } from './components/layout/NotificationCenter';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';
import { ToastContainer } from './components/common/ToastContainer';
import { ErrorBoundary } from './components/common/ErrorBoundary';

import { DashboardPage } from './pages/DashboardPage';
import { OperationsPage } from './pages/OperationsPage';
import { RoutesPage } from './pages/RoutesPage';
import { VehiclesPage } from './pages/VehiclesPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { PredictionsPage } from './pages/PredictionsPage';
import { SuppliesPage } from './pages/SuppliesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SimulationPage } from './pages/SimulationPage';
import { SettingsPage } from './pages/SettingsPage';

const Layout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC] text-[#0F172A] font-sans">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <TopBar onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />

        {/* Scrollable Page Body with Error Boundary Isolation */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-topo-pattern">
          <ErrorBoundary fallbackTitle="Page Section Temporarily Unavailable">
            {children}
          </ErrorBoundary>
        </main>
      </div>

      {/* Overlay Drawers & Modals */}
      <NotificationCenter />
      <GlobalSearchModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <NetworkProvider>
        <AppProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/operations" element={<OperationsPage />} />
              <Route path="/routes" element={<RoutesPage />} />
              <Route path="/vehicles" element={<VehiclesPage />} />
              <Route path="/incidents" element={<IncidentsPage />} />
              <Route path="/predictions" element={<PredictionsPage />} />
              <Route path="/supplies" element={<SuppliesPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/simulation" element={<SimulationPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Layout>
        </AppProvider>
      </NetworkProvider>
    </ToastProvider>
  );
}
