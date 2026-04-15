import multer from 'multer';

const storage = multer.memoryStorage();

const allowedTypes = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
];

export const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only PDF and image files are allowed'));
    }
    cb(null, true);
  },
}).single('file');
