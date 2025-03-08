import { Request, Response } from 'express';
import { createUser, findUserByPhone, comparePassword } from '../models/user.model';
import jwt from 'jsonwebtoken';

// کنترلر ثبت‌نام
export const register = async (req: Request, res: Response): Promise<Response> => {
  const { phone, password } = req.body;

  const existingUser = await findUserByPhone(phone);
  if (existingUser) {
    return res.status(400).json({ message: 'این شماره قبلاً ثبت‌نام کرده است.' });
  }

  await createUser(phone, password);

  return res.status(201).json({ message: 'کاربر با موفقیت ثبت‌نام شد.' });
};

// کنترلر ورود
export const login = async (req: Request, res: Response): Promise<Response> => {
  const { phone, password } = req.body;

  const user = await findUserByPhone(phone);
  if (!user) {
    return res.status(404).json({ message: 'کاربر یافت نشد' });
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'رمز عبور نادرست است' });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET as string || 'B@h702600$#@', // استفاده از متغیر محیطی برای JWT_SECRET
    { expiresIn: '1h' }
  );

  return res.status(200).json({ token });
};
