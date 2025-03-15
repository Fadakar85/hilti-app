import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // 👈 این باعث می‌شود که در کل برنامه در دسترس باشد.
})
export class ProductService {
  private apiUrl = 'https://localhost:5000/api/products';

  constructor(private http: HttpClient) {}

  addProduct(product: { name: string; price: number }) {
    return this.http.post(this.apiUrl, product).toPromise();
  }
  getUserProducts(userId: number): Promise<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`).toPromise()
    .then(products => products ?? []); // اگر products undefined باشد، یک آرایه خالی برمی‌گرداند
}


  deleteProduct(productId: number): Promise<void> {
    return this.http.delete<void>(`${this.apiUrl}/${productId}`).toPromise();
  }
}
