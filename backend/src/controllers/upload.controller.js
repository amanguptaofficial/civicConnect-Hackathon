const multer = require('multer');
const { uploadToR2, deleteFromR2, getUploadUrl } = require('../services/r2.service');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type. Only images and documents are allowed.'));
  },
});

const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { message: 'No file uploaded' },
      });
    }

    const folder = req.body.folder || 'uploads';
    const fileUrl = await uploadToR2(req.file, folder);

    res.json({
      success: true,
      data: {
        url: fileUrl,
        filename: req.file.originalname,
      },
      message: 'File uploaded successfully',
    });
  } catch (error) {
    next(error);
  }
};

const uploadMultiple = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'No files uploaded' },
      });
    }

    const folder = req.body.folder || 'uploads';
    const uploadPromises = req.files.map((file) => uploadToR2(file, folder));
    const urls = await Promise.all(uploadPromises);

    res.json({
      success: true,
      data: {
        urls: urls.map((url, index) => ({
          url,
          filename: req.files[index].originalname,
        })),
      },
      message: 'Files uploaded successfully',
    });
  } catch (error) {
    next(error);
  }
};

const getPresignedUrl = async (req, res, next) => {
  try {
    const { fileName, contentType, folder } = req.body;

    if (!fileName || !contentType) {
      return res.status(400).json({
        success: false,
        error: { message: 'fileName and contentType are required' },
      });
    }

    const result = await getUploadUrl(fileName, contentType, folder);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteFile = async (req, res, next) => {
  try {
    const { fileUrl } = req.body;

    if (!fileUrl) {
      return res.status(400).json({
        success: false,
        error: { message: 'File URL is required' },
      });
    }

    const deleted = await deleteFromR2(fileUrl);

    res.json({
      success: deleted,
      message: deleted ? 'File deleted successfully' : 'Failed to delete file',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadFile: [upload.single('file'), uploadFile],
  uploadMultiple: [upload.array('files', 10), uploadMultiple],
  getPresignedUrl,
  deleteFile,
};
