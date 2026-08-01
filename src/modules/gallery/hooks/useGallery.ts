import { useState, useEffect, useCallback } from 'react';
import { GalleryService } from '../services/GalleryService';
import { GalleryItem } from '../../../types';

export function useGallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadGallery = useCallback(async () => {
    try {
      setLoading(true);
      const data = await GalleryService.fetchAllGalleryItems();
      setGalleryItems(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load gallery items');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  const addGalleryItem = async (newItem: Omit<GalleryItem, 'id'>) => {
    try {
      await GalleryService.addNewGalleryItem(newItem);
      await loadGallery();
    } catch (err: any) {
      throw new Error(err.message || 'Failed to add gallery item');
    }
  };

  return {
    galleryItems,
    loading,
    error,
    refreshGallery: loadGallery,
    addGalleryItem,
  };
}
