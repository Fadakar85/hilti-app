import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';  // سرویسی که در بالا ایجاد کردیم
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  imports: [CommonModule, HttpClientModule, FormsModule, IonicModule],
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  dashboardData: any = {};
  selectedTab: string = 'products';  // ✅ مقدار اولیه برای انتخاب تب
  userProducts: any[] = [];

  constructor(private apiService: ApiService, private router: Router, private productService: ProductService, private authService: AuthService, private alertController: AlertController) {}

  ngOnInit() {
    this.loadUserProducts();
  }

  async loadUserProducts() {
    try {
      const user = await this.authService.getCurrentUser();
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }
      this.userProducts = await this.productService.getUserProducts(user.id);
    } catch (error) {
      console.error("❌ خطا در گرفتن محصولات:", error);
    }
  }
  goToAddProduct() {
    this.router.navigate(['/add-product']);
  }
}
