import { IAuthService } from '../interfaces';
import { User } from '../../types';

const STORAGE_KEY = 'datatwin_auth_user';
const LOGOUT_FLAG_KEY = 'datatwin_user_logged_out';

export const DEFAULT_USER: User = {
  id: 'user-default',
  email: 'admin@datatwin.ai',
  name: 'Alex Mercer (Lead Architect)',
  role: 'Enterprise Schema Lead',
};

export class MockAuthService implements IAuthService {
  async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    // Artificial small latency
    await new Promise((resolve) => setTimeout(resolve, 200));

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid business email address.' };
    }

    if (!cleanPassword || cleanPassword.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters.' };
    }

    // Accept valid demo credentials or any standard business email
    const namePart = cleanEmail.split('@')[0];
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    const user: User = {
      id: `user-${Date.now()}`,
      email: cleanEmail,
      name: cleanEmail === 'admin@datatwin.ai' ? 'Alex Mercer (Lead Architect)' : `${formattedName} (Finance Architect)`,
      role: 'Enterprise Schema Lead',
    };

    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(LOGOUT_FLAG_KEY);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      }
    } catch {}

    return { success: true, user };
  }

  async logout(): Promise<void> {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOGOUT_FLAG_KEY, 'true');
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {}
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      if (typeof window !== 'undefined') {
        if (localStorage.getItem(LOGOUT_FLAG_KEY) === 'true') {
          return null;
        }
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
          try {
            return JSON.parse(data) as User;
          } catch {
            return DEFAULT_USER;
          }
        }
        // Auto-initialize demo user on first session
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USER));
        return DEFAULT_USER;
      }
    } catch {}
    return DEFAULT_USER;
  }

  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return !!user;
  }
}
