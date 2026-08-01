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
import { HistoricalDocument } from '../../../types';

const COLLECTION_NAME = 'history';

export const HistoryRepository = {
  async getAllHistory(): Promise<HistoricalDocument[]> {
    try {
      if (!db) return [];
      const q = query(collection(db, COLLECTION_NAME), orderBy('title', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HistoricalDocument));
    } catch (error) {
      console.error('Error fetching historical documents from Firestore:', error);
      return [];
    }
  },

  async getHistoryById(id: string): Promise<HistoricalDocument | null> {
    try {
      if (!db) return null;
      const docRef = doc(db, COLLECTION_NAME, id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as HistoricalDocument;
      }
      return null;
    } catch (error) {
      console.error('Error fetching historical document by id:', error);
      return null;
    }
  },

  async createHistory(item: Omit<HistoricalDocument, 'id'>): Promise<string> {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...item,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating historical document:', error);
      throw error;
    }
  },

  async updateHistory(id: string, updates: Partial<HistoricalDocument>): Promise<void> {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating historical document:', error);
      throw error;
    }
  },

  async deleteHistory(id: string): Promise<void> {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting historical document:', error);
      throw error;
    }
  }
};
