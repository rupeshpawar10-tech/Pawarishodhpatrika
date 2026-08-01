import { CategoryRepository, CategoryItem } from '../repository/CategoryRepository';

export const CategoryService = {
  async fetchAllCategories(): Promise<CategoryItem[]> {
    return await CategoryRepository.getAllCategories();
  },

  async addNewCategory(item: Omit<CategoryItem, 'id'>): Promise<string> {
    if (!item.name || !item.module) {
      throw new Error('Category name and module are required.');
    }
    return await CategoryRepository.createCategory(item);
  },

  async removeCategory(id: string): Promise<void> {
    await CategoryRepository.deleteCategory(id);
  }
};
