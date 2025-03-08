// types.d.ts
import { Request } from 'express';

// تعریف تایپ برای اطلاعات کاربر در توکن
export interface UserPayload {
  id: string;
  role: string;
}

// افزودن تایپ به req.user
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
