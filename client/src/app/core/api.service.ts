import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;
  private headers() {
    const token = localStorage.getItem('medibook_token');
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }
  get<T>(path: string): Observable<T> { return this.http.get<T>(`${this.base}${path}`, { headers: this.headers() }); }
  post<T>(path: string, body: unknown): Observable<T> { return this.http.post<T>(`${this.base}${path}`, body, { headers: this.headers() }); }
  patch<T>(path: string, body: unknown): Observable<T> { return this.http.patch<T>(`${this.base}${path}`, body, { headers: this.headers() }); }
}
