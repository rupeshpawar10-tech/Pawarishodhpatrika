import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { GalleryItem } from '../../../types';

const COLLECTION_NAME = 'gallery';

export const GalleryRepository = {
  async getAllGalleryItems(): Promise<GalleryItem[]> {
    try {
      if (!db) return [];
      const q = query(collection(db, COLLECTION_NAME), orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryItem));
    } catch (error) {
      console.error('Error fetching gallery items from Firestore:', error);
      return [];
    }
  },

  async createGalleryItem(item: Omit<GalleryItem, 'id'>): Promise<string> {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...item,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating gallery item:', error);
      throw error;
    }
  },

  async deleteGalleryItem(id: string): Promise<void> {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      throw error;
    }
  }
};
