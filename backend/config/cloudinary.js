const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setup multer storage using Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine folder and resource_type based on file type
    let folder = 'video_platform/others';
    let resource_type = 'auto';

    if (file.mimetype.startsWith('video/')) {
      folder = 'video_platform/videos';
      resource_type = 'video';
    } else if (file.mimetype.startsWith('image/')) {
      folder = 'video_platform/images';
      resource_type = 'image';
    }

    return {
      folder: folder,
      resource_type: resource_type,
      // allowed_formats: ['jpg', 'png', 'mp4', 'mkv', 'webm'],
    };
  },
});

const ALLOWED_VIDEO_FORMATS = ['video/mp4', 'video/quicktime', 'video/webm'];
const ALLOWED_IMAGE_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];
const maxSizeMB = process.env.MAX_VIDEO_SIZE_MB ? Number(process.env.MAX_VIDEO_SIZE_MB) : 500;
const MAX_VIDEO_SIZE = maxSizeMB * 1024 * 1024;

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'video') {
    if (ALLOWED_VIDEO_FORMATS.includes(file.mimetype)) {
      cb(null, true);
    } else {
      // Custom error that will be caught by error middleware
      cb(new Error('Only mp4, mov, and webm formats are allowed'), false);
    }
  } else if (file.fieldname === 'thumbnail') {
    if (ALLOWED_IMAGE_FORMATS.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid image format for thumbnail'), false);
    }
  } else {
    cb(new Error('Unexpected field'), false);
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
