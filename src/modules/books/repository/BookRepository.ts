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
import { BookItem } from '../../../types';

const COLLECTION_NAME = 'books';

export const BookRepository = {
  async getAllBooks(): Promise<BookItem[]> {
    try {
      if (!db) return [];
      const q = query(collection(db, COLLECTION_NAME), orderBy('year', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BookItem));
    } catch (error) {
      console.error('Error fetching books from Firestore:', error);
      return [];
    }
  },

  async getBookById(id: string): Promise<BookItem | null> {
    try {
      if (!db) return null;
      const docRef = doc(db, COLLECTION_NAME, id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as BookItem;
      }
      return null;
    } catch (error) {
      console.error('Error fetching book by id:', error);
      return null;
    }
  },

  async createBook(book: Omit<BookItem, 'id'>): Promise<string> {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...book,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating book:', error);
      throw error;
    }
  },

  async updateBook(id: string, updates: Partial<BookItem>): Promise<void> {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating book:', error);
      throw error;
    }
  },

  async deleteBook(id: string): Promise<void> {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  }
};
