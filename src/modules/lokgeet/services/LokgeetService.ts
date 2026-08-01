import { LokgeetRepository } from '../repository/LokgeetRepository';
import { Lokgeet } from '../../../types';

export const LokgeetService = {
  async fetchAllLokgeets(): Promise<Lokgeet[]> {
    return await LokgeetRepository.getAllLokgeets();
  },

  async fetchLokgeetById(id: string): Promise<Lokgeet | null> {
    if (!id) return null;
    return await LokgeetRepository.getLokgeetById(id);
  },

  async addNewLokgeet(lokgeetData: Omit<Lokgeet, 'id'>): Promise<string> {
    if (!lokgeetData.titlePawari || !lokgeetData.lyricsDevanagari) {
      throw new Error('Pawari title and lyrics are required.');
    }
    return await LokgeetRepository.createLokgeet(lokgeetData);
  }
};
