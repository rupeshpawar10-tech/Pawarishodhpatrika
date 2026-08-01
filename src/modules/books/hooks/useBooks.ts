import { useState, useEffect, useCallback } from 'react';
import { BookService } from '../services/BookService';
import { BookItem } from '../../../types';

export function useBooks() {
  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadBooks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await BookService.fetchAllBooks();
      setBooks(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load library books');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const addBook = async (newBook: Omit<BookItem, 'id'>) => {
    try {
      await BookService.addNewBook(newBook);
      await loadBooks();
    } catch (err: any) {
      throw new Error(err.message || 'Failed to add book');
    }
  };

  const incrementDownload = async (id: string, count: number) => {
    try {
      await BookService.incrementDownloadCount(id, count);
      setBooks(prev => prev.map(b => b.id === id ? { ...b, downloadCount: count + 1 } : b));
    } catch (err: any) {
      console.error('Failed to increment download count:', err);
    }
  };

  return {
    books,
    loading,
    error,
    refreshBooks: loadBooks,
    addBook,
    incrementDownload,
  };
}
