import { useState, useEffect, useCallback } from 'react';
import { PaperService } from '../services/PaperService';
import { ResearchPaper } from '../../../types';

export function usePapers() {
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadPapers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await PaperService.fetchAllPapers();
      setPapers(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load research papers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPapers();
  }, [loadPapers]);

  const submitPaper = async (newPaper: Omit<ResearchPaper, 'id'>) => {
    try {
      await PaperService.submitNewPaper(newPaper);
      await loadPapers();
    } catch (err: any) {
      throw new Error(err.message || 'Failed to submit paper');
    }
  };

  return {
    papers,
    loading,
    error,
    refreshPapers: loadPapers,
    submitPaper,
  };
}
