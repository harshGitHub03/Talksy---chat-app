import { apiRequest } from './api';

type AuthResponse = {
  success: boolean;
};

// The JWT is set by the backend as an httpOnly cookie, so it never touches JS
export function login(email: string, password: string) {
  return apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export type User = {
  id: string;
  name: string | null;
  email: string;
  role: 'admin' | 'user';
};

// Fails with 401 when the cookie is missing or expired
export function getMe() {
  return apiRequest<User>('/user/me');
}

export function logout() {
  return apiRequest<AuthResponse>('/auth/logout', { method: 'POST' });
}
