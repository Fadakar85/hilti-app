import db from '../database/db.js';
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
  try {
    console.log("📌 createUser function called!");
    console.log("🔹 Phone:", phone);
    console.log("🔹 Raw Password Before Hashing:", password);

    if (!password) {
      console.error("❌ Error: Password is undefined!");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔐 Hashed Password:", hashedPassword);

    const query = 'INSERT INTO users (phone, password, role) VALUES (?, ?, ?)';
    const [result] = await db.execute(query, [phone, hashedPassword, role]);

    console.log("✅ User created successfully:", result);
  } catch (error) {
    console.error("❌ Error in createUser:", error);
  }
};




// پیدا کردن کاربر بر اساس شماره تلفن
export const findUserByPhone = async (phone: string): Promise<User | undefined> => {
  try {
    const query = 'SELECT * FROM users WHERE phone = ?';
    const [rows]: any = await db.execute(query, [phone]);

    if (rows.length > 0) {
      console.log("🔍 User found in database:", rows[0]);
      return rows[0]; // کاربر پیدا شد
    } else {
      console.log("❌ User not found in database.");
      return; // کاربر وجود ندارد
    }
  } catch (error) {
    console.error("❌ Error in findUserByPhone:", error);
    return;
  }
};



// مقایسه رمز عبور وارد شده با رمز عبور ذخیره‌شده
export const comparePassword = async (inputPassword: string, storedPassword: string): Promise<boolean> => {
  console.log("📌 Comparing passwords:");
  console.log("🔹 Input Password:", inputPassword);
  console.log("🔹 Stored Password (Hashed):", storedPassword);

  const result = await bcrypt.compare(inputPassword, storedPassword);
  console.log("📌 Password comparison result:", result);

  return result;
};

// به روز رسانی نقش کاربر
export const updateUserRole = async (phone: string, role: 'user' | 'admin'): Promise<void> => {
  const query = 'UPDATE users SET role = ? WHERE phone = ?';
  await db.execute(query, [role, phone]);
};