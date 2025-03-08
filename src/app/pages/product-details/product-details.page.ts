import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// تعریف اینترفیس برای محصول
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class ProductDetailsPage implements OnInit {
  product: Product | null = null;  // مشخص کردن نوع محصول
  loading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // بررسی دریافت اطلاعات از state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['product']) {
      this.product = navigation.extras.state['product'] as Product; // استفاده از ایندکس
    } else {
      const productId = this.route.snapshot.paramMap.get('id');
      if (productId) {
        this.getProductDetails(productId);
      } else {
        // اگر اطلاعات از state دریافت نشد، می‌توانیم محصول را از URL با استفاده از شناسه آن بارگذاری کنیم
        const productId = this.route.snapshot.paramMap.get('id');
        if (productId) {
          this.getProductDetails(productId);
        } else {
          this.errorMessage = 'Product not found!';
        }
      }
    }
  }

  getProductDetails(id: string) {
    this.loading = true;
    this.errorMessage = null;

    this.http.get<Product>(`http://localhost:3000/products/${id}`).subscribe(
      (product) => {
        this.product = product;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching product details:', error);
        this.errorMessage = 'Failed to load product details.';
        this.loading = false;
      }
    );
  }
}
