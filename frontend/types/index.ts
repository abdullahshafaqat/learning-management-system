export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  createdAt: string;
}

export interface AuthResponse {
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  username: string;
  email: string;
  password: string;
  role?: 'student' | 'instructor' | 'admin';
}
