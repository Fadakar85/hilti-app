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

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  imports: [CommonModule, HttpClientModule, FormsModule, IonicModule],
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  dashboardData: any = {};

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.apiService.getDashboardData().then(
      (data) => {
        this.dashboardData = data;
      },
      (error) => {
        console.error('خطا در دریافت داده‌ها:', error);
      }
    );
  }
}
