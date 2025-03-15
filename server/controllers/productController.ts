import { Request, Response } from "express";
import pool from "../database/db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// تنظیمات multer برای ذخیره تصاویر در سرور
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// آپلود عکس (میان‌افزار)
export const uploadMiddleware = upload.single("image");

// افزودن محصول همراه با تصویر
export const addProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const sql = `INSERT INTO products (name, price, description, imageUrl) VALUES (?, ?, ?, ?)`;
    const values = [name, price, description, imageUrl];

    const [result]: any = await pool.execute(sql, values);

    res.status(201).json({ message: "محصول اضافه شد", productId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "مشکلی رخ داد!", details: error });
  }
};

// دریافت لیست محصولات
export const getProducts = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM products");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "مشکلی در دریافت محصولات پیش آمد!" });
  }
};

// حذف محصول و عکس آن
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // دریافت اطلاعات محصول
    const [rows]: any = await pool.execute("SELECT imageUrl FROM products WHERE id = ?", [id]);
    const product = rows[0];

    if (product?.imageUrl) {
      const imagePath = path.join(__dirname, "..", product.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // حذف عکس از سرور
      }
    }

    await pool.execute("DELETE FROM products WHERE id = ?", [id]);
    res.json({ message: "محصول و عکس آن حذف شد" });
  } catch (error) {
    res.status(500).json({ error: "خطا در حذف محصول!" });
  }
};
