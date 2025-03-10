import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';  // برای هدایت به صفحه دیگر بعد از ورود
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  imports: [CommonModule, HttpClientModule, FormsModule, IonicModule],
  providers: [AuthService],
  styleUrls: ['login.page.scss'],
})
export class LoginPage {
  phone: string = '';
  password: string = '';

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (!this.authService) {
      console.error("🚨 authService مقداردهی نشده است!");
    }
  }
  // متد ورود
  login() {
    if (!this.authService) {
      console.error("🚨 authService هنوز مقداردهی نشده!");
      return;
    }

    console.log("📌 Login Request Data:", this.phone, this.password);

    const loginData = {
      phone: this.phone,
      password: this.password
    };

    // ارسال درخواست POST به سرور برای ورود
    // this.http.post('http://localhost:5000/api/auth/login', loginData)
    //   .subscribe(
    //     (response: any) => {
    //       // بررسی پاسخ سرور
    //       if (response.token) {
    //         localStorage.setItem('token', response.token);  // ذخیره توکن JWT
    //         this.router.navigate(['/dashboard']);  // هدایت به داشبورد یا صفحه دلخواه بعد از ورود موفق
    //       } else {
    //         alert('خطا در ورود، لطفاً دوباره تلاش کنید.');
    //       }
    //     },
    //     (error) => {
    //       alert('خطا در برقراری ارتباط با سرور.');
    //       console.error(error);
    //     }
    //   );
      
      this.authService.login(this.phone, this.password).subscribe({
        next: (res: any) => {  // 👈 خطاهای TS7006 را با مشخص کردن نوع رفع کردیم
          console.log('✅ Login successful:', res);
          localStorage.setItem('token', res.token); // ذخیره توکن JWT
          console.log('🔹 JWT Token:', res.token);
          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          console.error('❌ Login error:', err);
          alert('خطا در ورود');
        }
      });
  }
  
}
