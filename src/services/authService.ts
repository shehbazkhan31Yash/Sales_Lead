import { User } from '../types';
import api from './api';

export const authService = {
  async login(email: string, password: string) {
    // Mock implementation - replace with actual API call
    return new Promise<{ user: User; token: string }>((resolve) => {
      setTimeout(() => {
        const user: User = {
          id: '1',
          email,
          name: 'John Doe',
          role: 'admin',
          avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
        };
        const token = 'mock-jwt-token-' + Date.now();
        resolve({ user, token });
      }, 1000);
    });
  },

  async loginAsGuest() {
    return new Promise<{ user: User; token: string }>((resolve) => {
      setTimeout(() => {
        const user: User = {
          id: 'guest',
          email: 'guest@leadiq.com',
          name: 'Guest User',
          role: 'user',
        };
        const token = 'guest-token-' + Date.now();
        resolve({ user, token });
      }, 500);
    });
  },

  async verifyToken(token: string) {
    return new Promise<User>((resolve, reject) => {
      setTimeout(() => {
        if (token.includes('mock-jwt-token') || token.includes('guest-token')) {
          const user: User = {
            id: token.includes('guest') ? 'guest' : '1',
            email: token.includes('guest') ? 'guest@leadiq.com' : 'john@leadiq.com',
            name: token.includes('guest') ? 'Guest User' : 'John Doe',
            role: token.includes('guest') ? 'user' : 'admin',
            avatar: token.includes('guest') ? undefined : 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
          };
          resolve(user);
        } else {
          reject(new Error('Invalid token'));
        }
      }, 300);
    });
  },
};