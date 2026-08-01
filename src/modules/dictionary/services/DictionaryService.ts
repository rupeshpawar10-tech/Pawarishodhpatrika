import { DictionaryRepository } from '../repository/DictionaryRepository';
import { DictionaryWord } from '../../../types';

export const DictionaryService = {
  async fetchAllWords(): Promise<DictionaryWord[]> {
    return await DictionaryRepository.getAllWords();
  },

  async fetchWordById(id: string): Promise<DictionaryWord | null> {
    if (!id) return null;
    return await DictionaryRepository.getWordById(id);
  },

  async addNewWord(wordData: Omit<DictionaryWord, 'id'>): Promise<string> {
    if (!wordData.wordPawari || !wordData.meaningHindi) {
      throw new Error('Pawari word and Hindi meaning are required.');
    }
    return await DictionaryRepository.createWord(wordData);
  }
};
