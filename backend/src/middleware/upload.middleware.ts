// src/middleware/upload.middleware.ts
import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";
import AppError from "../utils/AppError.js";

const AVATAR_DIR = path.join(process.cwd(), "uploads", "avatars");
const RESUME_DIR = path.join(process.cwd(), "uploads", "resumes");

[AVATAR_DIR, RESUME_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const avatarStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, AVATAR_DIR),
  filename: (req, file, cb) => {
    const userId = (req as any).user?.id ?? "unknown";
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `avatar-${userId}-${Date.now()}${ext}`);
  },
});

const resumeStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, RESUME_DIR),
  filename: (req, file, cb) => {
    const userId = (req as any).user?.id ?? "unknown";
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `resume-${userId}-${Date.now()}${ext}`);
  },
});

const IMAGE_TYPES = [".jpg", ".jpeg", ".png", ".webp"];
const IMAGE_MIME = ["image/jpeg", "image/png", "image/webp"];

const imageFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (IMAGE_TYPES.includes(ext) && IMAGE_MIME.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError("Only JPG, JPEG, PNG, or WEBP images are allowed", 400));
  }
};

const pdfFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".pdf" && file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new AppError("Only PDF files are allowed for resumes", 400));
  }
};

export const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
}).single("avatar");

export const uploadResume = multer({
  storage: resumeStorage,
  fileFilter: pdfFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single("resume");
