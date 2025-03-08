import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';  // برای هدایت به صفحه دیگر بعد از ورود

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  imports: [CommonModule, HttpClientModule, FormsModule, IonicModule],
  styleUrls: ['login.page.scss'],
})
export class LoginPage {
  phone: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  // متد ورود
  login() {
    const loginData = {
      phone: this.phone,
      password: this.password
    };

    // ارسال درخواست POST به سرور برای ورود
    this.http.post('http://localhost:5000/api/auth/login', loginData)
      .subscribe(
        (response: any) => {
          // بررسی پاسخ سرور
          if (response.token) {
            localStorage.setItem('token', response.token);  // ذخیره توکن JWT
            this.router.navigate(['/dashboard']);  // هدایت به داشبورد یا صفحه دلخواه بعد از ورود موفق
          } else {
            alert('خطا در ورود، لطفاً دوباره تلاش کنید.');
          }
        },
        (error) => {
          alert('خطا در برقراری ارتباط با سرور.');
          console.error(error);
        }
      );
  }
}
