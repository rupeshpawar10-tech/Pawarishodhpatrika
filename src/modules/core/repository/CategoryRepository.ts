import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  module: string;
  description?: string;
  status: 'active' | 'inactive';
}

const COLLECTION_NAME = 'categories';
const LOCAL_STORAGE_KEY = 'pawari_categories_v1';

const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: 'c1', name: 'लोक साहित्य', slug: 'lok-sahitya', module: 'papers', status: 'active' },
  { id: 'c2', name: 'भाषाविज्ञान एवं व्याकरण', slug: 'linguistics', module: 'papers', status: 'active' },
  { id: 'c3', name: 'परमार इतिहास एवं पुरातात्विक साक्ष्य', slug: 'history', module: 'papers', status: 'active' },
  { id: 'c4', name: 'ताप्ती अंचल एवं सतपुड़ा भूगोल', slug: 'geography', module: 'papers', status: 'active' },
  { id: 'c5', name: 'दैनिक उपयोग', slug: 'dainik-upyog', module: 'dictionary', status: 'active' }
];

export const CategoryRepository = {
  async getAllCategories(): Promise<CategoryItem[]> {
    try {
      if (db) {
        const q = query(collection(db, COLLECTION_NAME), orderBy('name', 'asc'));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CategoryItem));
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
          return list;
        }
      }
    } catch (error) {
      console.warn('Firestore fetch failed, falling back to localStorage:', error);
    }

    // Fallback to localStorage
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        // parse error
      }
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES;
  },

  async createCategory(item: Omit<CategoryItem, 'id'>): Promise<string> {
    const newId = `cat-${Date.now()}`;
    const newItem: CategoryItem = {
      id: newId,
      ...item
    };

    try {
      if (db) {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
          ...item,
          createdAt: serverTimestamp(),
        });
        newItem.id = docRef.id;
      }
    } catch (error) {
      console.warn('Firestore create failed, saving to localStorage:', error);
    }

    // Always update localStorage
    const current = await this.getAllCategories();
    const updated = [newItem, ...current.filter(c => c.name !== newItem.name)];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return newItem.id;
  },

  async deleteCategory(id: string): Promise<void> {
    try {
      if (db) {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
      }
    } catch (error) {
      console.warn('Firestore delete failed:', error);
    }

    // Update localStorage
    const current = await this.getAllCategories();
    const updated = current.filter(c => c.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  }
};

