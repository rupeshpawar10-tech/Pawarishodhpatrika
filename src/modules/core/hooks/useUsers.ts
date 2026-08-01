import { useState, useEffect, useCallback } from 'react';
import { UserService } from '../services/UserService';
import { UserProfile } from '../../../types';

export function useUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await UserService.fetchAllUsers();
      setUsers(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const updateRole = async (id: string, role: string) => {
    try {
      await UserService.changeUserRole(id, role);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: role as any } : u));
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update user role');
    }
  };

  return {
    users,
    loading,
    error,
    refreshUsers: loadUsers,
    updateRole,
  };
}
