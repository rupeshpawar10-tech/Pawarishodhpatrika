import { useState, useEffect, useCallback } from 'react';
import { LokgeetService } from '../services/LokgeetService';
import { Lokgeet } from '../../../types';

export function useLokgeet() {
  const [lokgeets, setLokgeets] = useState<Lokgeet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadLokgeets = useCallback(async () => {
    try {
      setLoading(true);
      const data = await LokgeetService.fetchAllLokgeets();
      setLokgeets(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load folk songs (Lokgeet)');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLokgeets();
  }, [loadLokgeets]);

  const addLokgeet = async (newLokgeet: Omit<Lokgeet, 'id'>) => {
    try {
      await LokgeetService.addNewLokgeet(newLokgeet);
      await loadLokgeets();
    } catch (err: any) {
      throw new Error(err.message || 'Failed to add lokgeet');
    }
  };

  return {
    lokgeets,
    loading,
    error,
    refreshLokgeets: loadLokgeets,
    addLokgeet,
  };
}
