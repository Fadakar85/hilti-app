import { Request, Response } from 'express';
import { createUser, findUserByPhone, comparePassword } from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import db from '../database/db.js';
import bcrypt from 'bcrypt';

// 📌 API ثبت‌نام (Register)
export const register = async (req: any, res: any) => {
  try {
      console.log("📌 مقدار `req.body` در `register`:", req.body);

      const { phone, password } = req.body;
      if (!phone || !password) {
          console.log("❌ Missing phone or password");
          return res.status(400).json({ error: 'لطفاً شماره تلفن و رمز عبور را وارد کنید.' });
      }

      console.log("📌 Creating user with phone:", phone);
      const newUser = await createUser(phone, password);

      console.log("✅ User registered successfully:", newUser);
      return res.status(201).json({ message: "ثبت‌نام موفقیت‌آمیز بود", user: newUser }); // ✅ فقط یک بار ارسال پاسخ

  } catch (error) {
      console.error("❌ Register Error:", error);
      return res.status(500).json({ message: "خطای سرور" });
  }
};






// کنترلر ورود
export const login = async (req: any, res: any) => {
  console.log("📥 Login function called!");
  try {
      const { phone, password } = req.body;
      console.log("📌 Searching for phone:", phone);

      let user = await findUserByPhone(phone);
      console.log("📢 Checking user existence:", user);
      
      if (!user) {
          console.log("❌ User not found in database.");
          return res.status(404).json({ message: "کاربر یافت نشد" });
      }

      console.log("🔑 Checking password...");
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          console.log("❌ Incorrect password for:", phone);
          return res.status(400).json({ message: "رمز عبور اشتباه است" });
      }

      console.log("✅ Password matched. Generating token...");
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: "1h" });

      console.log("✅ Login successful!");
      res.json({ token, user });
  } catch (error) {
      console.error("❌ Login Error:", error);
      res.status(500).json({ message: "خطای سرور" });
  }
};

