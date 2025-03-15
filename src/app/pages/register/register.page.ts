import { AuthService } from '../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ProductService } from '../../services/product.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RegisterPage {
  phone: string = '';  // مقدار اولیه
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async onRegister() {
    console.log("📌 مقدار phone:", this.phone);
    console.log("📌 مقدار password:", this.password);

    if (!this.phone || !this.password) {
      alert('لطفاً تمام فیلدها را پر کنید.');
      return;
    }

    try {
      const response = await this.authService.register(this.phone, this.password);
      alert("ثبت‌نام موفق! حالا وارد شوید.");
      this.router.navigate(['/login']);
    } catch (error: any) {
      alert("خطا در ثبت‌نام: " + error.error.message);
    }
  }

  testValues() {
    console.log("📌 مقدار phone:", this.phone);
    console.log("📌 مقدار password:", this.password);
  }
}
