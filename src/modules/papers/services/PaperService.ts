import { PaperRepository } from '../repository/PaperRepository';
import { ResearchPaper } from '../../../types';

export const PaperService = {
  async fetchAllPapers(): Promise<ResearchPaper[]> {
    // Apply business sorting or filtering rules if needed
    const papers = await PaperRepository.getAllPapers();
    return papers;
  },

  async fetchPaperById(id: string): Promise<ResearchPaper | null> {
    if (!id) return null;
    return await PaperRepository.getPaperById(id);
  },

  async submitNewPaper(paperData: Omit<ResearchPaper, 'id'>): Promise<string> {
    // Validate mandatory fields
    if (!paperData.title || !paperData.abstract) {
      throw new Error('Title and abstract are required for research paper submission.');
    }
    return await PaperRepository.createPaper({
      ...paperData,
      status: 'submitted',
      downloadsCount: 0,
      viewsCount: 0,
    });
  },

  async updatePaperStatus(id: string, status: ResearchPaper['status']): Promise<void> {
    await PaperRepository.updatePaper(id, { status });
  },

  async incrementDownloads(id: string, currentCount: number): Promise<void> {
    await PaperRepository.updatePaper(id, { downloadsCount: currentCount + 1 });
  }
};
