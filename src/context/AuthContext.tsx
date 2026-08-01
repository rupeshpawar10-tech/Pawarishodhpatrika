import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { StorageEngine } from '../lib/storage';

interface AuthContextType {
  user: UserProfile;
  setRole: (role: UserRole) => void;
  canManageCMS: boolean;
  canManagePapers: boolean;
  canReviewPapers: boolean;
  canSubmitPapers: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => StorageEngine.getCurrentUser());

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(StorageEngine.getCurrentUser());
    };
    window.addEventListener('pawari_storage_change', handleStorageChange);
    return () => window.removeEventListener('pawari_storage_change', handleStorageChange);
  }, []);

  const setRole = (role: UserRole) => {
    StorageEngine.setUserRole(role);
    setUser(prev => ({ ...prev, role }));
  };

  const adminRoles: UserRole[] = ['super_admin', 'administrator', 'managing_editor'];
  const editorRoles: UserRole[] = [...adminRoles, 'editor', 'section_editor'];
  const reviewerRoles: UserRole[] = [...editorRoles, 'reviewer'];
  const authorRoles: UserRole[] = [...reviewerRoles, 'author', 'research_scholar', 'translator', 'proofreader'];

  const canManageCMS = adminRoles.includes(user.role);
  const canManagePapers = editorRoles.includes(user.role);
  const canReviewPapers = reviewerRoles.includes(user.role);
  const canSubmitPapers = authorRoles.includes(user.role);

  return (
    <AuthContext.Provider
      value={{
        user,
        setRole,
        canManageCMS,
        canManagePapers,
        canReviewPapers,
        canSubmitPapers
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
