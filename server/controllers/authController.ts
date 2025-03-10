import { Request, Response } from 'express';
import { createUser, findUserByPhone, comparePassword } from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import db from '../database/db.js';
import bcrypt from 'bcrypt';

// 📌 API ثبت‌نام (Register)
export const register = async (req: any, res: any) => {
  const { phone, password } = req.body;

  try {
      let user = await findUserByPhone(phone);

      if (user) {
          return res.status(400).json({ message: "User already exists!" });
      }

      await createUser(phone, password);
      user = await findUserByPhone(phone);

      if (user) {
          console.log("✅ User registered successfully:", user);
          res.status(201).json({ message: "User created!", user });
      } else {
          console.log("❌ User registration failed.");
          res.status(500).json({ message: "Failed to create user" });
      }
  } catch (error) {
      console.error("❌ Error in register function:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};




// کنترلر ورود
export const login = async (req: any, res: any) => {
  console.log("📥 Login function called!");
  try {
      const { phone, password } = req.body;
      console.log("📌 Searching for phone:", phone);

      let user = await findUserByPhone(phone);
      console.log("📢 Checking user existence:", user, "Type:", typeof user);
      
      if (!user) {
          console.log("❌ User not found in database.");
          console.log("🔄 Attempting to create a new user...");
          
          // چک کنیم که createUser واقعاً اجرا می‌شود یا نه
          console.log("🛠 Calling createUser function NOW...");
          await createUser(phone, password);
          console.log("✅ createUser function executed!", user);

          user = await findUserByPhone(phone); // مجدداً دیتابیس را چک کن
          if (user) {
              console.log("✅ User successfully created:", user);
          } else {
              console.log("❌ User still not found after creation!");
              return res.status(500).json({ message: 'مشکل در ثبت نام کاربر' });
          }
      }

      console.log("🔑 Checking password...");
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          console.log("❌ Incorrect password for:", phone);
          return res.status(400).json({ message: 'رمز عبور اشتباه است' });
      }

      console.log("✅ Password matched. Generating token...");
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

      console.log("✅ Login successful!");
      res.json({ token, user });
  } catch (error) {
      console.error("❌ Login Error:", error);
      res.status(500).json({ message: 'خطای سرور' });
  }
};


