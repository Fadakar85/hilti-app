export interface Product {
    id?: number; // مقدارش می‌تونه باشه یا نباشه، چون auto-increment هست
    name: string;
    price: number;
    description?: string;
    imageUrl?: string;
  }
  
