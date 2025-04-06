import express, { Request, Response, RequestHandler } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cors from "cors";

const app = express();
app.use(cors())
const PORT = 5001;

const UPLOAD_FOLDER = path.join(__dirname, 'images');
app.use('/images', express.static(UPLOAD_FOLDER));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_FOLDER);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

if (!fs.existsSync(UPLOAD_FOLDER)) {
  fs.mkdirSync(UPLOAD_FOLDER, { recursive: true });
}

const uploadHandler: RequestHandler = (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  const imageUrl = `http://localhost:${PORT}/images/${req.file.filename}`;
  res.status(200).json({ message: 'Upload bem sucedido.', filepath: imageUrl });
};

app.post('/upload', upload.single('file'), uploadHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Image server running on http://localhost:${PORT}`);
});
