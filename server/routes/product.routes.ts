import express from "express";
import { addProduct, getProducts, deleteProduct, uploadMiddleware } from "../controllers/productController";
import { Request, Response } from "express";
import multer from "multer";

const router = express.Router();

router.post("/add", uploadMiddleware, addProduct);
router.get("/", getProducts);
router.delete("/:id", deleteProduct);

export default router;
// c:\Users\iTeck\my-app\my-hilti-store-app\server\controllers\productController.ts
