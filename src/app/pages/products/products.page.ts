import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ProductService } from '../../services/product.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  imports: [CommonModule, HttpClientModule, IonicModule],
  standalone: true,
  providers: [ProductService]
})
export class ViewProductsPage implements OnInit {

  products: any[] = [];
  selectedProduct: any = null;

  constructor(
    private http: HttpClient,  // برای فراخوانی داده‌ها از سرور
    private router: Router     // برای ناوبری به صفحه جزئیات
  ) {}

  goToProductDetails(product: any) {
    // استفاده از router.navigate برای ارسال اطلاعات به صفحه جزئیات
    this.router.navigate(['/product-details'], {
      state: { product } // ارسال اطلاعات محصول به state
    });
  }

  ngOnInit() {
    this.fetchProducts();
  }

  // متد برای دریافت محصولات از سرور
  fetchProducts() {
    this.http.get<any[]>('http://localhost:3000/products').subscribe(
      (response) => {
        console.log('Products:', response);
        this.products = response.map(product => ({
          ...product,
          imageUrl: `http://localhost:3000/uploads/${product.imageUrl}` // مسیر صحیح تصویر
        }));;
      },
      (error) => {
        console.error('Error fetching products', error);
      }
    );
  }

  showProductDetails(product: any) {
    this.selectedProduct = product;
    console.log("📸 محصول انتخاب شده:", product);
    console.log("🌐 آدرس تصویر:", product.imageUrl);
  }
  closeProductDetails() {
    this.selectedProduct = null;
  }
  viewProductDetails(productId: string) {
    this.router.navigate(['/product-details', productId]); // ناوبری به صفحه جزئیات محصول
  }
}
