import multer from "multer";
import path from "path";
import fs from "fs";
import { getAnnualAbsencesDir } from "../utils/storage.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const dir = getAnnualAbsencesDir();
      cb(null, dir);
    } catch (e) {
      cb(e);
    }
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const uploadExcel = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.originalname.endsWith(".xlsx")) cb(null, true);
    else cb(new Error("Only .xlsx files are allowed"));
  },
});

export default uploadExcel;
