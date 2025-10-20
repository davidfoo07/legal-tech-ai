export interface User {
  uid: string;
  username: string;
  email: string;
  phone?: string;
  role: 'USER' | 'ADMIN';
  createdAt: string; // ISO date string
}
