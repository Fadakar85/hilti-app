import db from '../database/db.js';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from "../database/db.js";
 // بررسی کن که مسیر `db.ts` درست باشد
 // مسیر را بر اساس پروژه خود تنظیم کنید


// نوع‌های مربوط به کاربر
export interface User {
  id: number;
  phone: string;
  password: string;
  role: 'user' | 'admin';
}

// ایجاد کاربر جدید
const createUser = async (phone: string, password: string) => {  // ⚠ دیگر `req` و `res` را دریافت نمی‌کند
  try {
      console.log("📌 Creating new user in database:", phone);
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result]: any = await db.execute(
          "INSERT INTO users (phone, password) VALUES (?, ?)", 
          [phone, hashedPassword]
      );

      if (result && result.affectedRows > 0) {
          console.log("✅ User successfully created!");
          return { phone }; // ✅ فقط مقدار را برمی‌گرداند، نه `res.json()`
      } else {
          console.log("❌ Failed to create user.");
          return null;
      }
  } catch (error) {
      console.error("❌ Error in createUser:", error);
      throw error;
  }
};



export { createUser };






// پیدا کردن کاربر بر اساس شماره تلفن
export const findUserByPhone = async (phone: string) => {
  try {
      console.log("🔍 Searching for user in database:", phone);

      const [rows]: any = await pool.query(
          "SELECT * FROM users WHERE phone = ?", 
          [phone]
      );

      console.log("📊 Query Result:", rows);

      if (rows.length === 0) {
          console.log("❌ No user found.");
          return null;
      }

      console.log("✅ User found:", rows[0]);
      return rows[0];
  } catch (error) {
      console.error("❌ Error finding user:", error);
      throw error;
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