import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getDashboardData() {
    const token = localStorage.getItem('token');
    if (!token) {
      return Promise.reject('توکن موجود نیست');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get('http://localhost:5000/api/dashboard', { headers }).toPromise();
  }
}
