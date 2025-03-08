import db from '../database/db';
import bcrypt from 'bcrypt';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

// نوع‌های مربوط به کاربر
export interface User {
  id: number;
  phone: string;
  password: string;
  role: 'user' | 'admin';
}

// ایجاد کاربر جدید
export const createUser = async (phone: string, password: string, role: 'user' | 'admin' = 'user'): Promise<void> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = 'INSERT INTO users (phone, password, role) VALUES (?, ?, ?)';
  await db.execute(query, [phone, hashedPassword, role]);
};

// پیدا کردن کاربر بر اساس شماره تلفن
export const findUserByPhone = async (phone: string): Promise<User | undefined> => {
    const query = 'SELECT * FROM users WHERE phone = ?';
    const [rows]: [RowDataPacket[], any] = await db.execute(query, [phone]); // استفاده از any برای FieldPacket
    return rows[0] as User | undefined; // تبدیل به نوع User
};

// مقایسه رمز عبور وارد شده با رمز عبور ذخیره‌شده
export const comparePassword = async (inputPassword: string, storedPassword: string): Promise<boolean> => {
  return bcrypt.compare(inputPassword, storedPassword);
};

// به روز رسانی نقش کاربر
export const updateUserRole = async (phone: string, role: 'user' | 'admin'): Promise<void> => {
  const query = 'UPDATE users SET role = ? WHERE phone = ?';
  await db.execute(query, [role, phone]);
};
