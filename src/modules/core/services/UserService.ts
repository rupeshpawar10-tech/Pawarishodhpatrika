import { UserRepository } from '../repository/UserRepository';
import { UserProfile } from '../../../types';

export const UserService = {
  async fetchAllUsers(): Promise<UserProfile[]> {
    return await UserRepository.getAllUsers();
  },

  async changeUserRole(id: string, role: string): Promise<void> {
    await UserRepository.updateUserRole(id, role);
  }
};
