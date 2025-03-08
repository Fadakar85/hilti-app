import express, { Request, Response } from 'express';
import multer from 'multer';
import mysql from 'mysql2';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Router from 'express';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';

const app = express();
const router = Router();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
dotenv.config();
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'B@h702600$#@',
  database: 'hilti_store'
});

// تست اتصال به دیتابیس
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Successfully connected to the database');
  }
});

app.get('/', (req, res) => {
  res.send('Hello, the server is running!');
});

// دریافت لیست محصولات
app.get('/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) throw err;
    res.status(200).json(results);
  });
});

// اضافه کردن محصول جدید
app.post('/add-product', (req: any, res: any) => { // تغییر
  const { name, price, description, imageUrl } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(403).json({ error: 'User not authenticated' });
  }
  db.query('INSERT INTO products (name, price, description, imageUrl) VALUES (?, ?, ?, ?)', [name, price, description, imageUrl], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'خطا در افزودن محصول' });
    }
    res.status(201).json({ message: 'محصول اضافه شد' });
  });
});

// دریافت سفارشات
app.get('/orders', (req, res) => {
  db.query('SELECT * FROM orders', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// پوشه آپلود
const uploadDir = path.join(process.cwd(), 'uploads'); // پوشه uploads در ریشه پروژه
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, uploadDir); // مسیر ذخیره فایل‌ها
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // نام فایل با timestamp برای جلوگیری از تداخل
  }
});

const upload = multer({ storage });

// API برای آپلود تصویر
app.post('/upload-image', upload.single('image'), (req: any, res: any) => { // تغییر
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ imageUrl: `/uploads/${req.file.filename}` }); // بازگشت URL تصویر بارگذاری شده
});

// سرو کردن فایل‌های استاتیک
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// آپدیت محصول
app.put('/products/:id', (req: any, res: any) => { // تغییر
  const { name, price, description, imageUrl } = req.body;
  const { id } = req.params;

  if (!name || !price) {
    return res.status(400).json({ error: 'نام و قیمت محصول ضروری است.' });
  }

  db.query('UPDATE products SET name = ?, price = ?, description = ?, imageUrl = ? WHERE id = ?', [name, price, description, imageUrl, id], (err, result) => {
    if (err) {
      console.error('Error updating product:', err);
      return res.status(500).json({ error: 'Failed to update product' });
    }
    const resultSetHeader = result as mysql.ResultSetHeader;
    if (resultSetHeader.affectedRows > 0) {
      return res.status(200).json({ message: 'Product updated successfully' });
    } else {
      return res.status(404).json({ error: 'Product not found' });
    }
  });
});

// حذف محصول
app.delete('/products/:id', (req: Request, res: Response) => { // تغییر
  const { id } = req.params;

  // ابتدا اطلاعات محصول را از دیتابیس بگیریم
  db.query('SELECT imageUrl FROM products WHERE id = ?', [id], (err, result: mysql.RowDataPacket[]) => {
    if (err) {
      console.error('Error fetching product for deletion:', err);
      return res.status(500).json({ error: 'Failed to fetch product' });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const imageUrl = result[0]['imageUrl'];
    if (imageUrl) {
      const imageName = path.basename(imageUrl); // استخراج نام تصویر
      const uploadDir = path.join(process.cwd(), 'uploads'); // مسیر صحیح پوشه uploads در ریشه پروژه
      const imagePath = path.join(uploadDir, imageName); // مسیر صحیح فایل تصویر

      // حذف تصویر از پوشه uploads
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Failed to delete image:', err);
          return res.status(500).json({ error: 'Failed to delete image', details: err.message });
        }
        console.log('Image deleted successfully:', imageName);

        // حذف محصول از دیتابیس
        db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
          if (err) {
            console.error('Error deleting product:', err);
            return res.status(500).json({ error: 'Failed to delete product' });
          }
          if ((result as mysql.ResultSetHeader).affectedRows > 0) {
            return res.status(200).json({ message: 'Product and image deleted successfully' });
          } else {
            return res.status(404).json({ error: 'Product not found' });
          }
        });
        return;
      });
    } else {
      // اگر تصویر وجود نداشت، فقط محصول را حذف می‌کنیم
      db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
        if (err) {
          console.error('Error deleting product:', err);
          return res.status(500).json({ error: 'Failed to delete product' });
        }
        if ((result as mysql.ResultSetHeader).affectedRows > 0) {
          return res.status(200).json({ message: 'Product deleted successfully' });
        } else {
          return res.status(404).json({ error: 'Product not found' });
        }
      });
    }
    return;
  });
});

// **این API فایل‌های موجود در پوشه uploads را به کلاینت ارسال می‌کند.**
app.get('/uploaded-images', (req: Request, res: Response) => { // تغییر
  const uploadDir = path.join(process.cwd(), 'uploads');

  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      console.error('Error reading the upload directory', err);
      return res.status(500).json({ error: 'Failed to read upload directory' });
    }
    const imageUrls = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
    res.json(imageUrls);
    console.log("Uploaded files:", files);
    return;
  });
});

// API برای حذف فایل تصویر
app.delete('/delete-image/:imageName', (req: Request, res: Response) => { // تغییر
  const { imageName } = req.params;
  // استفاده از process.cwd() برای دریافت مسیر ریشه پروژه
  const imagePath = path.join(process.cwd(), 'uploads', imageName);

  // حذف تصویر از پوشه uploads
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error('Failed to delete image:', err);
      return res.status(500).json({ error: 'Failed to delete image' });
    }
    console.log('Image deleted successfully:', imageName);
    res.status(200).json({ message: 'Image deleted successfully' });
    return;
  });
});


app.post('/register', async (req: any, res: any) => { // تغییر
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ error: 'شماره تلفن و رمز عبور الزامی است' });
  }

  // هش کردن پسورد
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query('INSERT INTO users (phone, password) VALUES (?, ?)', [phone, hashedPassword], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'خطا در ثبت نام' });
    }
    res.status(201).json({ message: 'ثبت نام موفقیت آمیز بود' });
  });
});

app.post('/login', (req: Request, res: Response) => { // تغییر
  const { phone, password } = req.body;

  db.query('SELECT * FROM users WHERE phone = ?', [phone], async (err: any, results: any[]) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: 'شماره تلفن یا رمز عبور اشتباه است' });
    }
    const user = results[0]; // اولین نتیجه از دیتابیس
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'شماره تلفن یا رمز عبور اشتباه است' });
    }
  
    // تولید توکن JWT
    if (!process.env['JWT_SECRET']) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    
    // استفاده از JWT_SECRET برای امضای توکن
    const token = jwt.sign({ id: user.id, role: user.role }, process.env['JWT_SECRET'], { expiresIn: '1h' });

    res.json({ token, role: user.role });
    return;
  });
});

app.delete('/users/:id', (req: any, res: any) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'دسترسی غیرمجاز' });
  }

  db.query('DELETE FROM users WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: 'خطا در حذف کاربر' });
    res.json({ message: 'کاربر حذف شد' });
  });
});



app.listen(3000, () => console.log('Server running on http://localhost:3000'));
