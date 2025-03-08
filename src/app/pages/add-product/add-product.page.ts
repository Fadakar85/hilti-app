import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
  imports: [CommonModule, HttpClientModule, FormsModule, IonicModule],
  standalone: true,
  providers: [ProductService]
})
export class AddProductPage {
  name: string = '';
  price: number = 0;
  description: string = '';  // توضیحات محصول
  imageUrl: string | null = null;
  selectedFile: File | null = null;
  uploadedImageUrl: string = '';
  products: any[] = [];
  showAddForm: boolean = false; // برای نمایش/مخفی کردن فرم افزودن محصول
  editingProductId: string | null = null; // برای ذخیره ID محصول در حال ویرایش
  uploadedImages: string[] = [];  // ✅ تغییر داده شد: اضافه کردن متغیر برای ذخیره تصاویر آپلود شده
  selectedImages: any = null;
  showGallery: boolean = false; // متغیر برای نمایش/مخفی کردن دیویژن تصاویر
  showGallery1: boolean = false;


  constructor(
    private http: HttpClient,
    private alertController: AlertController
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];  // فایل انتخابی

    if (file) {
      this.selectedFile = file;  // ذخیره فایل انتخاب شده در selectedFile
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;  // مسیر تصویر انتخاب شده را در imageUrl ذخیره می‌کند
      };
      reader.readAsDataURL(file);  // خواندن تصویر به صورت Data URL
    }
  }

  // زمانی که کاربر دکمه آپلود را فشار می‌دهد
  uploadImage() {
    if (!this.selectedFile) {  // اگر فایلی انتخاب نشده باشد
      console.error('هیچ فایلی انتخاب نشده است');
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile);  // فایل انتخابی را به formData اضافه می‌کند

    this.http.post<{ imageUrl: string }>('http://localhost:3000/upload-image', formData)
      .subscribe(response => {
        this.uploadedImageUrl = response.imageUrl;  // آدرس تصویر آپلود شده را در uploadedImageUrl ذخیره می‌کند
      }, error => {
        console.error('خطا در آپلود', error);
      });
  }

  async selectImage() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos, // انتخاب از گالری
      });
  
      const imageUrl = image.webPath;
      if (!image.webPath) {  // ✅ تغییر داده شد: بررسی معتبر بودن URL تصویر
        throw new Error("Image URL is not valid.");
      }

      const file = await fetch(image.webPath)
        .then(res => res.blob())
        .then(blob => new File([blob], 'image.jpg', { type: 'image/jpeg' }));
  
      // ارسال تصویر به سرور
      const formData = new FormData();
      formData.append('image', file); // اضافه کردن تصویر به فرستاده‌ها
  
      const response = await this.http.post<{ imageUrl: string }>('http://localhost:3000/upload-image', formData).toPromise();
  
      if (response?.imageUrl) { // ✅ تغییر داده شد: بررسی پاسخ سرور و ذخیره URL تصویر
        this.imageUrl = response.imageUrl; 
        this.fetchUploadedImages(); // ✅ تغییر داده شد: فراخوانی تابع برای دریافت تصاویر آپلود شده
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  }

  fetchUploadedImages() {
    this.http.get<string[]>('http://localhost:3000/uploaded-images').subscribe(
      (response) => {
        this.uploadedImages = response;
      },
      (error) => {
        console.error('Error fetching uploaded images', error);
      }
    );
  }  

  selectUploadedImage(imageUrl: string) {  // ✅ تغییر داده شد: انتخاب تصویر از لیست آپلود شده
    this.imageUrl = imageUrl; // ذخیره آدرس تصویر انتخاب‌شده
    this.toggleImageGallery();
  }

  selectedProduct = this.products[0];  

  async addProduct() {
    if (!this.name || this.price <= 0) { // ✅ تغییر داده شد: اضافه کردن اعتبارسنجی برای نام و قیمت
      console.error('نام و قیمت محصول باید مشخص شوند.');
      return;
    }

    const product = {
      name: this.name,
      price: this.price,
      description: this.description,
      imageUrl: this.imageUrl, // ارسال آدرس تصویر
    };
  
    this.http.post('http://localhost:3000/add-product', product).subscribe(
      async () => {
        const alert = await this.alertController.create({
          header: 'Success',
          message: 'Product added successfully',
          buttons: ['OK'],
        });
        await alert.present();
        this.clearForm(); // ✅ تغییر داده شد: فراخوانی تابع برای پاک کردن فرم
        this.fetchProducts();
  
        // پاک کردن فیلدها
        this.name = '';
        this.price = 0;
        this.description = '';
        this.imageUrl = '';
        this.fetchProducts(); // به روز رسانی لیست محصولات
      },
      async (error) => {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Failed to add product',
          buttons: ['OK'],
        });
        await alert.present();
      }
    );
  }

  clearForm() { // ✅ تغییر داده شد: تابع برای پاک کردن فرم
    this.name = '';
    this.price = 0;
    this.description = '';
    this.imageUrl = '';
    this.editingProductId = null;
  }
  

  // برای ویرایش محصول
  editProduct(product: any) {
    console.log('Editing product:', product); // بررسی مقدار محصول در کنسول
    this.name = product.name;
    this.price = product.price;
    this.description = product.description;

    // اگر آدرس تصویر وجود داشته باشد، از سرور بارگذاری می‌شود
    if (product.imageUrl) {
        // در اینجا فرض می‌کنیم که imageUrl از نوع path یا filename است و باید آن را به مسیر کامل تبدیل کنیم
        this.imageUrl = `http://localhost:3000${product.imageUrl}`;
    } else {
        this.imageUrl = ''; // اگر تصویر وجود ندارد، مقدار خالی می‌دهیم
    }

    this.editingProductId = product.id; // ذخیره ID محصول در حال ویرایش
    this.showAddForm = true; // فرم را برای ویرایش نمایش بده
  }

  // برای به روز رسانی محصول
  updateProduct() {
    if (!this.editingProductId) return; // اگر ID وجود ندارد، ویرایش انجام نمی‌شود

    const updatedProduct = {
      name: this.name,
      price: this.price,
      description: this.description,
      imageUrl: this.imageUrl,
    };

    this.http.put(`http://localhost:3000/products/${this.editingProductId}`, updatedProduct).subscribe(
      async () => {
        const alert = await this.alertController.create({
          header: 'Success',
          message: 'Product updated successfully',
          buttons: ['OK'],
        });
        await alert.present();

        // پاک کردن فیلدها
        this.name = '';
        this.price = 0;
        this.description = '';
        this.imageUrl = '';
        this.fetchProducts(); // به روز رسانی لیست محصولات
        this.editingProductId = null; // Reset the editing ID
        this.showAddForm = false; // فرم را مخفی کن
      },
      async (error) => {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Failed to update product',
          buttons: ['OK'],
        });
        await alert.present();
      }
    );
  }

  // حذف محصول
  deleteProduct(productId: string) {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این محصول را حذف کنید؟')) return;

    this.http.delete(`http://localhost:3000/products/${productId}`).subscribe(
      async () => {
        const alert = await this.alertController.create({
          header: 'Success',
          message: 'Product deleted successfully',
          buttons: ['OK'],
        });
        await alert.present();
        this.fetchProducts(); // به روز رسانی لیست محصولات
      },
      async (error) => {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Failed to delete product',
          buttons: ['OK'],
        });
        await alert.present();
        console.error('Error deleting product', error);
      }
    );
  }
  

  ngOnInit() {
    this.fetchProducts(); // هنگام بارگذاری صفحه، لیست محصولات را دریافت کن
    this.fetchUploadedImages(); // ✅ تغییر داده شد: فراخوانی تابع برای بارگذاری تصاویر آپلود شده
  }

  fetchProducts() {
    this.http.get<any[]>('http://localhost:3000/products').subscribe(
      (response) => {
        this.products = response;
      },
      (error) => {
        console.error('Error fetching products', error);
      }
    );
  }

  async deleteImage() {
    if (!this.imageUrl) return; // اگر تصویری انتخاب نشده، نیازی به حذف نیست
  
    const imageToDelete = this.imageUrl; // ذخیره تصویر فعلی برای حذف از سرور
    this.imageUrl = ''; // حذف تصویر از فرم
  
    // درخواست به سرور برای حذف تصویر از دیتابیس و فایل‌ها
    this.http.post('http://localhost:3000/delete-image', { imageUrl: imageToDelete }).subscribe(
      async () => {
        const alert = await this.alertController.create({
          header: 'Success',
          message: 'Image deleted successfully',
          buttons: ['OK'],
        });
        await alert.present();
        this.fetchUploadedImages(); // ✅ تغییر داده شد: بارگذاری مجدد تصاویر آپلود شده
      },
      async (error) => {
        console.error('Error deleting image:', error);
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Failed to delete image',
          buttons: ['OK'],
        });
        await alert.present();
      }
    );
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
      // فقط هنگام بستن فرم مقدارها را پاک کن
      this.name = '';
      this.price = 0;
      this.description = '';
      this.imageUrl = '';
      this.editingProductId = null;
  }


    toggleImageGallery() {
        this.showGallery = !this.showGallery; // باز و بسته کردن دیویژن
    }

    toggleImageGallery1() {
      this.showGallery1 = !this.showGallery1; // باز و بسته کردن دیویژن
  }
  selectUploadedImage1(image: string) {
    this.imageUrl = 'http://localhost:3000/uploads/' + image; // آدرس تصویر انتخاب‌شده
    this.showGallery1 = true;
  }
  closeSelectedImage() {
    this.imageUrl = null;  // پاک کردن آدرس تصویر انتخاب شده
  }
    removeImage(): void {
      if (this.imageUrl) {
      // گرفتن نام فایل از آدرس URL
      const imageName = this.imageUrl.split('/').pop();

      // درخواست حذف تصویر از سرور
      this.http.delete(`http://localhost:3000/delete-image/${imageName}`).subscribe(
        (response) => {
          console.log('Image deleted successfully:', response);
          this.imageUrl = null; // حذف تصویر از نمایش
        },
        (error) => {
          console.error('Failed to delete image:', error);
        }
      );
    }
  }
}

