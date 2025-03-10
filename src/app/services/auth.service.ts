import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth'; // مسیر سرور

  constructor(private http: HttpClient) {}

  login(phone: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { phone, password });
  }

  register(phone: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { phone, password });
  }
}
