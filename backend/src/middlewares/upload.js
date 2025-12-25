import multer from 'multer';

// Configure multer to store files in memory
const storage = multer.memoryStorage();

// File filter to accept video and image files
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    // Video formats
    'video/mp4',
    'video/avi',
    'video/quicktime', // .mov
    'video/x-msvideo',
    'video/x-matroska', // .mkv
    // Image formats (for slides)
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only video and image files are allowed (MP4, AVI, MOV, MKV, JPG, PNG, GIF, WEBP)'), false);
  }
};

// Configure multer with storage and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB max file size
  },
});

export default upload;
