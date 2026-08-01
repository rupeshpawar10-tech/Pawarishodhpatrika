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
import { UserProfile } from '../../../types';

const COLLECTION_NAME = 'users';

export const UserRepository = {
  async getAllUsers(): Promise<UserProfile[]> {
    try {
      if (!db) return [];
      const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserProfile));
    } catch (error) {
      console.error('Error fetching users from Firestore:', error);
      return [];
    }
  },

  async updateUserRole(id: string, role: string): Promise<void> {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        role,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }
};
