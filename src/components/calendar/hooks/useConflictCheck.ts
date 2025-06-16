
import { useState, useEffect } from 'react';
import { ConflictService } from '@/services/calendar/conflictService';
import { DateConflictInfo } from '@/services/calendar/types';

export const useConflictCheck = (selectedDate?: Date, userPostalCode?: string) => {
  const [dateConflictInfo, setDateConflictInfo] = useState<DateConflictInfo | null>(null);

  useEffect(() => {
    if (selectedDate && userPostalCode) {
      checkDateConflicts();
    } else {
      setDateConflictInfo(null);
    }
  }, [selectedDate, userPostalCode]);

  const checkDateConflicts = async () => {
    if (!selectedDate || !userPostalCode) return;
    
    try {
      const conflictInfo = await ConflictService.getDateConflicts(selectedDate, userPostalCode);
      setDateConflictInfo(conflictInfo);
    } catch (error) {
      console.error('Error checking date conflicts:', error);
    }
  };

  return { dateConflictInfo };
};
