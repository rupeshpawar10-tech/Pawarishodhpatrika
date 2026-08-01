import { useState, useEffect, useCallback } from 'react';
import { HistoryService } from '../services/HistoryService';
import { HistoricalDocument } from '../../../types';

export function useHistory() {
  const [historyItems, setHistoryItems] = useState<HistoricalDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      const data = await HistoryService.fetchAllHistory();
      setHistoryItems(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load historical documents');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const addHistory = async (newItem: Omit<HistoricalDocument, 'id'>) => {
    try {
      await HistoryService.addNewHistory(newItem);
      await loadHistory();
    } catch (err: any) {
      throw new Error(err.message || 'Failed to add historical document');
    }
  };

  return {
    historyItems,
    loading,
    error,
    refreshHistory: loadHistory,
    addHistory,
  };
}
