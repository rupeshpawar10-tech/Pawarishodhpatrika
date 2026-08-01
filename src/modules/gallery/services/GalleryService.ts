import { GalleryRepository } from '../repository/GalleryRepository';
import { GalleryItem } from '../../../types';

export const GalleryService = {
  async fetchAllGalleryItems(): Promise<GalleryItem[]> {
    return await GalleryRepository.getAllGalleryItems();
  },

  async addNewGalleryItem(itemData: Omit<GalleryItem, 'id'>): Promise<string> {
    if (!itemData.title || !itemData.imageUrl) {
      throw new Error('Title and image URL are required for gallery items.');
    }
    return await GalleryRepository.createGalleryItem(itemData);
  }
};
