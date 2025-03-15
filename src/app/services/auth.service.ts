import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth'; // مسیر صحیح API ثبت‌نام

  constructor(private http: HttpClient) {}

  login(phone: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { phone, password });
  }

  register(phone: string, password: string) {
    console.log("📤 ارسال درخواست ثبت‌نام:", { phone, password });
  
    return this.http.post('http://localhost:5000/api/auth/register', 
      { phone, password }, 
      { headers: { 'Content-Type': 'application/json' } }  // ✅ تنظیم `Content-Type`
    ).toPromise();
  }
  // متدهای دیگر سرویس احراز هویت (مثلاً، بازیابی رمز عبور، تغییر رمز عبور و غیره)  
}
