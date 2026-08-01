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
import { Lokgeet } from '../../../types';

const COLLECTION_NAME = 'lokgeet';

export const LokgeetRepository = {
  async getAllLokgeets(): Promise<Lokgeet[]> {
    try {
      if (!db) return [];
      const q = query(collection(db, COLLECTION_NAME), orderBy('titlePawari', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lokgeet));
    } catch (error) {
      console.error('Error fetching lokgeets from Firestore:', error);
      return [];
    }
  },

  async getLokgeetById(id: string): Promise<Lokgeet | null> {
    try {
      if (!db) return null;
      const docRef = doc(db, COLLECTION_NAME, id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as Lokgeet;
      }
      return null;
    } catch (error) {
      console.error('Error fetching lokgeet by id:', error);
      return null;
    }
  },

  async createLokgeet(lokgeet: Omit<Lokgeet, 'id'>): Promise<string> {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...lokgeet,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating lokgeet:', error);
      throw error;
    }
  },

  async updateLokgeet(id: string, updates: Partial<Lokgeet>): Promise<void> {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating lokgeet:', error);
      throw error;
    }
  },

  async deleteLokgeet(id: string): Promise<void> {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting lokgeet:', error);
      throw error;
    }
  }
};
