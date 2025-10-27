export interface User {
  uid: string;
  username: string;
  email: string;
  phone: string;
  role: 'USER' | 'ADMIN';
  language: string;
  createdAt: string; // ISO date string
}
