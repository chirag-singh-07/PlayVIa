const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');

// Configure S3 client (For Images)
const s3 = new S3Client({
  region: process.env.AWS_REGION || 'auto',
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Configure Cloudinary (For Videos)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage configurations
const s3Storage = multerS3({
  s3: s3,
  bucket: process.env.S3_BUCKET || process.env.AWS_BUCKET_NAME || 'indian-video-player-assets',
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    let folder = 'video_platform/images';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${folder}/${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
  }
});

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'video_platform/videos',
      resource_type: 'video',
    };
  },
});

// Custom Composite Storage Engine
function DualStorageEngine() {}
DualStorageEngine.prototype._handleFile = function _handleFile(req, file, cb) {
  if (file.mimetype.startsWith('video/')) {
    cloudinaryStorage._handleFile(req, file, (err, info) => {
      if (!err && info) {
        // Standardize output property to location
        info.location = info.path; 
        // Attach additional info like duration if available from Cloudinary
        if (info.duration) {
          info.duration = info.duration; // It's already in info
        }
      }
      cb(err, info);
    });
  } else {
    s3Storage._handleFile(req, file, cb);
  }
};
DualStorageEngine.prototype._removeFile = function _removeFile(req, file, cb) {
  if (file.mimetype.startsWith('video/')) {
    cloudinaryStorage._removeFile(req, file, cb);
  } else {
    s3Storage._removeFile(req, file, cb);
  }
};

const storage = new DualStorageEngine();

const ALLOWED_VIDEO_FORMATS = ['video/mp4', 'video/quicktime', 'video/webm'];
const ALLOWED_IMAGE_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];
const maxSizeMB = process.env.MAX_VIDEO_SIZE_MB ? Number(process.env.MAX_VIDEO_SIZE_MB) : 500;
const MAX_VIDEO_SIZE = maxSizeMB * 1024 * 1024;

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'video') {
    if (ALLOWED_VIDEO_FORMATS.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only mp4, mov, and webm formats are allowed'), false);
    }
  } else if (file.fieldname === 'thumbnail' || file.fieldname === 'avatar' || file.fieldname === 'banner' || file.fieldname === 'logo') {
    if (ALLOWED_IMAGE_FORMATS.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid image format for ${file.fieldname}`), false);
    }
  } else {
    cb(new Error(`Unexpected field: ${file.fieldname}`), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_VIDEO_SIZE,
  },
  fileFilter,
});

module.exports = { cloudinary, upload, ALLOWED_VIDEO_FORMATS, MAX_VIDEO_SIZE };
