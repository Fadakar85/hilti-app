import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root' // 👈 این باعث می‌شود که در کل برنامه در دسترس باشد.
})
export class ProductService {
  private apiUrl = 'https://your-api.com/products';

  constructor(private http: HttpClient) {}

  addProduct(product: { name: string; price: number }) {
    return this.http.post(this.apiUrl, product).toPromise();
  }
}
