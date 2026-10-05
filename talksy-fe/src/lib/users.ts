import { apiRequest } from './api';

export type Role = 'admin' | 'user';

export const ROLES: Role[] = ['admin', 'user'];

export type ManagedUser = {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  createdAt: string;
};

export type UsersPage = {
  users: ManagedUser[];
  count: number;
  page: number;
  limit: number;
};

export type UserInput = {
  name: string;
  email: string;
  role: Role;
  password?: string;
};

export type Contact = Pick<ManagedUser, 'id' | 'name' | 'email'>;

export type ContactsPage = {
  users: Contact[];
  count: number;
  page: number;
  limit: number;
};

// Available to any logged-in user; excludes the caller
export function listContacts(page: number, limit: number, search = '') {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) params.set('search', search);
  return apiRequest<ContactsPage>(`/user/contacts?${params}`);
}

export function listUsers(page: number, limit: number, search = '') {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) params.set('search', search);
  return apiRequest<UsersPage>(`/user/all?${params}`);
}

export function createUser(input: UserInput) {
  return apiRequest<ManagedUser>('/user/create', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateUser(id: string, input: Partial<UserInput>) {
  return apiRequest<ManagedUser>(`/user/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function deleteUser(id: string) {
  return apiRequest<{ success: boolean }>(`/user/${id}`, { method: 'DELETE' });
}
