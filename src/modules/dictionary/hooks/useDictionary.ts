import { useState, useEffect, useCallback } from 'react';
import { DictionaryService } from '../services/DictionaryService';
import { DictionaryWord } from '../../../types';

export function useDictionary() {
  const [words, setWords] = useState<DictionaryWord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadWords = useCallback(async () => {
    try {
      setLoading(true);
      const data = await DictionaryService.fetchAllWords();
      setWords(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load dictionary words');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWords();
  }, [loadWords]);

  const addWord = async (newWord: Omit<DictionaryWord, 'id'>) => {
    try {
      await DictionaryService.addNewWord(newWord);
      await loadWords();
    } catch (err: any) {
      throw new Error(err.message || 'Failed to add word');
    }
  };

  return {
    words,
    loading,
    error,
    refreshWords: loadWords,
    addWord,
  };
}
