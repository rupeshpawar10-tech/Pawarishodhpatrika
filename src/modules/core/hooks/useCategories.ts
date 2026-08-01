import { useState, useEffect, useCallback } from 'react';
import { CategoryService } from '../services/CategoryService';
import { CategoryItem } from '../repository/CategoryRepository';

export function useCategories() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await CategoryService.fetchAllCategories();
      setCategories(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const addCategory = async (item: Omit<CategoryItem, 'id'>) => {
    try {
      await CategoryService.addNewCategory(item);
      await loadCategories();
    } catch (err: any) {
      throw new Error(err.message || 'Failed to add category');
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await CategoryService.removeCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      console.error('Failed to delete category:', err);
    }
  };

  return {
    categories,
    loading,
    error,
    refreshCategories: loadCategories,
    addCategory,
    deleteCategory,
  };
}
