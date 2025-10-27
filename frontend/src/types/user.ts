export interface User {
  uid: string;
  username: string;
  email: string;
  phone: number;
  role: 'USER' | 'ADMIN';
  createdAt: string; // ISO date string
}
