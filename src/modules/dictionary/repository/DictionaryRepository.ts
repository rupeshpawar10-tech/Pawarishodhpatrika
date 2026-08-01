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
import { DictionaryWord } from '../../../types';

const COLLECTION_NAME = 'dictionary';

export const DictionaryRepository = {
  async getAllWords(): Promise<DictionaryWord[]> {
    try {
      if (!db) return [];
      const q = query(collection(db, COLLECTION_NAME), orderBy('wordPawari', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DictionaryWord));
    } catch (error) {
      console.error('Error fetching dictionary words from Firestore:', error);
      return [];
    }
  },

  async getWordById(id: string): Promise<DictionaryWord | null> {
    try {
      if (!db) return null;
      const docRef = doc(db, COLLECTION_NAME, id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as DictionaryWord;
      }
      return null;
    } catch (error) {
      console.error('Error fetching dictionary word by id:', error);
      return null;
    }
  },

  async createWord(word: Omit<DictionaryWord, 'id'>): Promise<string> {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...word,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating dictionary word:', error);
      throw error;
    }
  },

  async updateWord(id: string, updates: Partial<DictionaryWord>): Promise<void> {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating dictionary word:', error);
      throw error;
    }
  },

  async deleteWord(id: string): Promise<void> {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting dictionary word:', error);
      throw error;
    }
  }
};
