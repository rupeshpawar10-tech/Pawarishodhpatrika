import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { ResearchPaper } from '../../../types';

const COLLECTION_NAME = 'papers';

export const PaperRepository = {
  async getAllPapers(): Promise<ResearchPaper[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('publicationDate', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ResearchPaper));
    } catch (error) {
      console.error('Error fetching papers from Firestore:', error);
      return [];
    }
  },

  async getPaperById(id: string): Promise<ResearchPaper | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as ResearchPaper;
      }
      return null;
    } catch (error) {
      console.error('Error fetching paper by id:', error);
      return null;
    }
  },

  async createPaper(paper: Omit<ResearchPaper, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...paper,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating paper:', error);
      throw error;
    }
  },

  async updatePaper(id: string, updates: Partial<ResearchPaper>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating paper:', error);
      throw error;
    }
  },

  async deletePaper(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting paper:', error);
      throw error;
    }
  }
};
