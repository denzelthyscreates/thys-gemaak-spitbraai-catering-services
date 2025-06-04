
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';
import { SyncStatus } from '@/services/calendar/types';

interface SyncStatusDisplayProps {
  syncStatus: SyncStatus | null;
}

const SyncStatusDisplay: React.FC<SyncStatusDisplayProps> = ({ syncStatus }) => {
  if (!syncStatus) return null;

  return (
    <div className="flex items-center gap-2 text-sm">
      {syncStatus.status === 'success' ? (
        <CheckCircle className="h-4 w-4 text-green-500" />
      ) : (
        <XCircle className="h-4 w-4 text-red-500" />
      )}
      <span>
        Last sync: {new Date(syncStatus.lastSync).toLocaleString()}
      </span>
      {syncStatus.status === 'success' && (
        <Badge variant="secondary">{syncStatus.eventsSynced} events</Badge>
      )}
    </div>
  );
};

export default SyncStatusDisplay;
