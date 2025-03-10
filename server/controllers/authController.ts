import { Request, Response } from 'express';
import { createUser, findUserByPhone, comparePassword } from '../models/user.model.js';
import jwt from 'jsonwebtoken';import db from '../database/db.js';
import bcrypt from 'bcrypt';

// 📌 API ثبت‌نام (Register)
export const register = async (req: any, res: any) => {
  try {
    console.log("📌 Register function called!");

    const { phone, password } = req.body;
    console.log("🔹 Phone:", phone);
    console.log("🔹 Password:", password);

    if (!phone || !password) {
      console.error("❌ Error: Missing phone or password!");
      return res.status(400).json({ message: 'شماره تلفن و رمز عبور الزامی هستند' });
    }

    // 📌 بررسی می‌کنیم که آیا شماره از قبل وجود دارد یا نه؟
    console.log("🔄 Checking if user already exists...");
    const existingUser = await findUserByPhone(phone);

    if (existingUser) {
      console.error("❌ Error: User already exists!");
      return res.status(400).json({ message: 'این شماره قبلاً ثبت شده است' });
    }

    console.log("🔄 Creating new user...");
    await createUser(phone, password);
    console.log("✅ User registered successfully!");

    res.status(201).json({ message: 'ثبت‌نام موفقیت‌آمیز بود' });

  } catch (error) {
    console.error("❌ Error in register:", error);
    res.status(500).json({ message: 'خطا در ثبت‌نام' });
  }
};



// کنترلر ورود
export const login = async (req: Request, res: Response): Promise<Response> => {
  const { phone, password } = req.body;
  console.log("📌 Login request received with:", phone, password);
  const user = await findUserByPhone(phone);
  console.log("📌 Login request received with:", phone, password);
  if (!user) {
    return res.status(404).json({ message: 'کاربر یافت نشد' });
  }

  const isMatch = await comparePassword(password, user.password);
  console.log("📌 Comparing passwords:", password, user.password, "Result:", isMatch);
  if (!isMatch) {
    return res.status(401).json({ message: 'رمز عبور نادرست است' });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET as string || 'erfan010713', // استفاده از متغیر محیطی برای JWT_SECRET
    { expiresIn: '1h' }
  );

  return res.status(200).json({ token });
};
