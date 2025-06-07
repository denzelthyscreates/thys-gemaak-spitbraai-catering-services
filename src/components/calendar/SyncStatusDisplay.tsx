
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { SyncStatus } from '@/services/calendar/types';

interface SyncStatusDisplayProps {
  syncStatus: SyncStatus | null;
}

const SyncStatusDisplay: React.FC<SyncStatusDisplayProps> = ({ syncStatus }) => {
  if (!syncStatus) return null;

  const getStatusIcon = () => {
    switch (syncStatus.status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (syncStatus.status) {
      case 'success':
        return 'Success';
      case 'error':
        return 'Failed';
      case 'pending':
        return 'In Progress';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = () => {
    switch (syncStatus.status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm">
        {getStatusIcon()}
        <span>
          Last sync: {new Date(syncStatus.lastSync).toLocaleString()}
        </span>
        <Badge className={getStatusColor()}>
          {getStatusText()}
        </Badge>
        {syncStatus.status === 'success' && (
          <Badge variant="secondary">{syncStatus.eventsSynced} events</Badge>
        )}
      </div>
      
      {syncStatus.status === 'error' && syncStatus.errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm">
          <div className="font-medium text-red-800 mb-1">Sync Error:</div>
          <div className="text-red-700">{syncStatus.errorMessage}</div>
          <div className="mt-2 text-red-600 text-xs">
            Please check your Google Calendar credentials in Supabase settings.
          </div>
        </div>
      )}
      
      {syncStatus.status === 'pending' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm">
          <div className="text-yellow-800">
            Calendar sync is in progress. This may take a few moments.
          </div>
        </div>
      )}
    </div>
  );
};

export default SyncStatusDisplay;
