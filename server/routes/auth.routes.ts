// server/routes/auth.routes.ts
import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByPhone, comparePassword } from '../models/user.model.js';  // فرض بر این است که این مدل‌ها در مسیر صحیح قرار دارند.

const router = express.Router();

// ثبت‌نام کاربر
router.post('/register', async (req: Request, res: any) => {
  const { phone, password } = req.body;

  // بررسی فیلدهای ورودی
  if (!phone || !password) {
    return res.status(400).json({ error: 'شماره تلفن و رمز عبور الزامی است' });
  }

  // بررسی اینکه آیا کاربر قبلاً ثبت‌نام کرده است
  const existingUser = await findUserByPhone(phone);
  if (existingUser) {
    return res.status(400).json({ error: 'این شماره تلفن قبلاً ثبت‌نام شده است' });
  }

  // هش کردن رمز عبور
  const hashedPassword = await bcrypt.hash(password, 10);

  // ذخیره‌سازی کاربر جدید در دیتابیس
  await createUser(phone, hashedPassword);

  res.status(201).json({ message: 'ثبت‌نام با موفقیت انجام شد' });
});

// ورود به سیستم
router.post('/login', async (req: Request, res: any) => {
  const { phone, password } = req.body;

  // بررسی فیلدهای ورودی
  if (!phone || !password) {
    return res.status(400).json({ error: 'شماره تلفن و رمز عبور الزامی است' });
  }

  // پیدا کردن کاربر با شماره تلفن وارد شده
  const user = await findUserByPhone(phone);
  if (!user) {
    return res.status(404).json({ error: 'کاربر یافت نشد' });
  }

  // مقایسه رمز عبور وارد شده با رمز عبور ذخیره‌شده
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'رمز عبور نادرست است' });
  }

  // تولید توکن JWT
  const token = jwt.sign(
    { id: user.id, phone: user.phone, role: user.role }, 
    process.env.JWT_SECRET!, 
    { expiresIn: '1h' }
  );

  res.status(200).json({ message: 'ورود موفقیت‌آمیز بود', token });
});

export default router;