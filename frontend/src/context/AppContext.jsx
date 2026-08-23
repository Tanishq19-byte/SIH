import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [selectedState, setSelectedState] = useState('all');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNewIncidentModalOpen, setIsNewIncidentModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(4);
  const [isEmergencyMode, setIsEmergencyMode] = useState(true);
  const [activeEmergencyAlert, setActiveEmergencyAlert] = useState({
    active: true,
    message: 'CRITICAL: Sonapur Tunnel Landslide (NH-27) - 38 Oxygen & POL Tankers Stranded. AI Bypass Recommendation Active.',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  return (
    <AppContext.Provider
      value={{
        selectedState,
        setSelectedState,
        isNotificationOpen,
        setIsNotificationOpen,
        isSearchOpen,
        setIsSearchOpen,
        isNewIncidentModalOpen,
        setIsNewIncidentModalOpen,
        isEmergencyModalOpen,
        setIsEmergencyModalOpen,
        unreadNotificationsCount,
        setUnreadNotificationsCount,
        isEmergencyMode,
        setIsEmergencyMode,
        activeEmergencyAlert,
        setActiveEmergencyAlert
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
