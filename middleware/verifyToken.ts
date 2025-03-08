// server/middleware/verifyToken.ts
import jwt from 'jsonwebtoken';

// تایپ‌گذاری برای اطلاعات کاربر در JWT
interface UserPayload {
  id: number;
  role: 'user' | 'admin';
}

// میانه‌ور برای احراز هویت
export const authenticateToken = (req: any, res: any, next: any) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'دسترسی غیرمجاز' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(400).json({ message: 'توکن نامعتبر است' });
  }
};

// میانه‌ور برای بررسی نقش کاربر
export const checkRole = (roles: ('user' | 'admin')[]) => {
  return (req: any, res: any, next: any) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'دسترسی ممنوع' });
    }
    next();
  };
};
