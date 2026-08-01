import { BookRepository } from '../repository/BookRepository';
import { BookItem } from '../../../types';

export const BookService = {
  async fetchAllBooks(): Promise<BookItem[]> {
    return await BookRepository.getAllBooks();
  },

  async fetchBookById(id: string): Promise<BookItem | null> {
    if (!id) return null;
    return await BookRepository.getBookById(id);
  },

  async addNewBook(bookData: Omit<BookItem, 'id'>): Promise<string> {
    if (!bookData.title || !bookData.author) {
      throw new Error('Title and author are required for book cataloging.');
    }
    return await BookRepository.createBook({
      ...bookData,
      downloadCount: bookData.downloadCount || 0,
    });
  },

  async incrementDownloadCount(id: string, currentCount: number): Promise<void> {
    await BookRepository.updateBook(id, { downloadCount: currentCount + 1 });
  }
};
