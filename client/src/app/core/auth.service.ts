import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { User } from '../models/app.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private router = inject(Router);
  user = signal<User | null>(this.readUser());
  private readUser(): User | null {
    try { const value = localStorage.getItem('medibook_user'); return value ? JSON.parse(value) as User : null; }
    catch { return null; }
  }
  login(email: string, password: string) {
    return this.api.post<{ token: string; user: User }>('/auth/login', { email, password });
  }
  register(name: string, email: string, password: string, phone: string) {
    return this.api.post<{ token: string; user: User }>('/auth/register', { name, email, password, phone });
  }
  saveSession(token: string, user: User) {
    localStorage.setItem('medibook_token', token);
    localStorage.setItem('medibook_user', JSON.stringify(user));
    this.user.set(user);
  }
  logout() {
    localStorage.removeItem('medibook_token');
    localStorage.removeItem('medibook_user');
    this.user.set(null);
    this.router.navigate(['/']);
  }
}
