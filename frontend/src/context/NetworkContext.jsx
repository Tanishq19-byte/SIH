import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '../hooks/useToast';

const NetworkContext = createContext(null);

export const NetworkProvider = ({ children }) => {
  const { addToast } = useToast();

  const [isBrowserOnline, setIsBrowserOnline] = useState(navigator.onLine);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);
  const [pendingSyncQueue, setPendingSyncQueue] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedCount, setSyncedCount] = useState(0);

  // Computed online status
  const isOnline = isBrowserOnline && !isSimulatedOffline;

  // Load initial pending queue from localStorage
  useEffect(() => {
    const savedQueue = localStorage.getItem('ner_pending_sync_queue');
    if (savedQueue) {
      try {
        setPendingSyncQueue(JSON.parse(savedQueue));
      } catch (e) {
        console.error('Failed to parse pending sync queue', e);
      }
    }
  }, []);

  // Sync queue persistence helper
  const updateQueue = (newQueue) => {
    setPendingSyncQueue(newQueue);
    localStorage.setItem('ner_pending_sync_queue', JSON.stringify(newQueue));
  };

  // Process and sync pending offline reports
  const syncPendingQueue = useCallback(async (currentQueue = pendingSyncQueue) => {
    if (!currentQueue.length || isSyncing) return;

    setIsSyncing(true);
    let synced = 0;
    const processedIds = new Set();
    const remainingQueue = [];

    for (const report of currentQueue) {
      // Idempotency check: prevent duplicate submissions
      if (processedIds.has(report.idempotencyKey)) {
        continue;
      }

      // Simulate API sync transmission delay per report
      await new Promise(res => setTimeout(res, 600));
      processedIds.add(report.idempotencyKey);
      synced++;
    }

    updateQueue(remainingQueue);
    setIsSyncing(false);
    setSyncedCount(prev => prev + synced);

    if (synced > 0) {
      addToast({
        title: 'Auto-Sync Completed Successfully',
        message: `Synced ${synced} offline incident report(s) with MDoNER & BRO Control Center. Zero duplicate submissions.`,
        type: 'success'
      });
    }
  }, [pendingSyncQueue, isSyncing, addToast]);

  // Window online/offline event listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsBrowserOnline(true);
      addToast({
        title: 'Network Connection Restored',
        message: 'Reconnected to command network. Initiating auto-sync engine...',
        type: 'success'
      });
    };

    const handleOffline = () => {
      setIsBrowserOnline(false);
      addToast({
        title: 'Network Connection Dropped',
        message: 'Switched to offline field mode. Ground reports will be queued locally.',
        type: 'warning'
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [addToast]);

  // Trigger auto-sync when network returns
  useEffect(() => {
    if (isOnline && pendingSyncQueue.length > 0 && !isSyncing) {
      syncPendingQueue();
    }
  }, [isOnline, pendingSyncQueue, isSyncing, syncPendingQueue]);

  // Add offline report to pending queue
  const addOfflineReport = (report) => {
    const idempotencyKey = report.idempotencyKey || `IDEM-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const pendingItem = {
      ...report,
      idempotencyKey,
      status: 'pending_sync',
      createdAt: new Date().toISOString()
    };

    const newQueue = [...pendingSyncQueue, pendingItem];
    updateQueue(newQueue);

    addToast({
      title: 'Incident Queued Locally (Offline Mode)',
      message: `Report #${report.id} saved to offline queue. Will auto-sync when connection returns.`,
      type: 'warning'
    });

    return pendingItem;
  };

  return (
    <NetworkContext.Provider
      value={{
        isOnline,
        isBrowserOnline,
        isSimulatedOffline,
        setIsSimulatedOffline,
        pendingSyncQueue,
        isSyncing,
        syncedCount,
        addOfflineReport,
        syncPendingQueue
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};
