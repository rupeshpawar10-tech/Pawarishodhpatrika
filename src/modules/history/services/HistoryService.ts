import { HistoryRepository } from '../repository/HistoryRepository';
import { HistoricalDocument } from '../../../types';

export const HistoryService = {
  async fetchAllHistory(): Promise<HistoricalDocument[]> {
    return await HistoryRepository.getAllHistory();
  },

  async fetchHistoryById(id: string): Promise<HistoricalDocument | null> {
    if (!id) return null;
    return await HistoryRepository.getHistoryById(id);
  },

  async addNewHistory(itemData: Omit<HistoricalDocument, 'id'>): Promise<string> {
    if (!itemData.title || !itemData.period) {
      throw new Error('Title and period are required for historical documents.');
    }
    return await HistoryRepository.createHistory(itemData);
  }
};
