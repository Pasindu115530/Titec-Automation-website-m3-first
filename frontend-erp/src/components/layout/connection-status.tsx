'use client';
import { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, CloudUpload } from 'lucide-react';
import { syncService } from '@/services/syncService';
import { Badge } from '@/components/ui/badge';

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState({ invoices: 0, serviceLogs: 0 });
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initialize sync service
    syncService.init();

    // Check pending count periodically
    const interval = setInterval(async () => {
      const counts = await syncService.getPendingCount();
      setPendingCount(counts);
    }, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const totalPending = pendingCount.invoices + pendingCount.serviceLogs;

  const handleManualSync = async () => {
    setIsSyncing(true);
    await syncService.syncAll();
    setIsSyncing(false);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Online/Offline indicator */}
      {isOnline ? (
        <Badge variant="outline" className="text-green-500 border-green-500/30">
          <Wifi className="h-3 w-3 mr-1" /> Online
        </Badge>
      ) : (
        <Badge variant="outline" className="text-amber-500 border-amber-500/30 animate-pulse">
          <WifiOff className="h-3 w-3 mr-1" /> Offline
        </Badge>
      )}

      {/* Pending sync count */}
      {totalPending > 0 && (
        <Badge
          variant="outline"
          className="text-blue-400 border-blue-400/30 cursor-pointer"
          onClick={handleManualSync}
        >
          {isSyncing ? (
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
          ) : (
            <CloudUpload className="h-3 w-3 mr-1" />
          )}
          {totalPending} pending
        </Badge>
      )}
    </div>
  );
}
