import { Request, Response } from 'express';
import { updateUserRole, findUserByPhone } from '../models/user.model';

// تغییر نقش کاربر به ادمین
export const assignAdmin = async (req: Request, res: Response): Promise<void> => {
  const { phone } = req.body;

  // چک کردن اینکه کاربر موجود است
  const user = await findUserByPhone(phone);
  if (!user) {
    res.status(404).json({ message: 'کاربر پیدا نشد' });
    return; // از ادامه اجرا جلوگیری می‌کند
  }

  // تغییر نقش کاربر به 'admin'
  await updateUserRole(phone, 'admin');

  // ارسال پاسخ موفقیت‌آمیز
  res.status(200).json({ message: 'نقش کاربر به ادمین تغییر یافت' });
};
