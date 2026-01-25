const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

let s3Client = null;
let BUCKET_NAME = null;
let R2_ENDPOINT = null;
let R2_PUBLIC_URL = null;

if (process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY && process.env.R2_BUCKET_NAME) {
  const accountId = process.env.R2_ACCOUNT_ID;
  R2_ENDPOINT = process.env.R2_ENDPOINT || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : null);
  
  const publicDomain = process.env.R2_PUBLIC_DOMAIN || process.env.R2_PUBLIC_URL;
  if (publicDomain) {
    if (publicDomain.startsWith('http://') || publicDomain.startsWith('https://')) {
      R2_PUBLIC_URL = publicDomain;
    } else {
      R2_PUBLIC_URL = `https://${publicDomain}`;
    }
    if (R2_PUBLIC_URL.endsWith('/')) {
      R2_PUBLIC_URL = R2_PUBLIC_URL.slice(0, -1);
    }
  } else {
    R2_PUBLIC_URL = R2_ENDPOINT;
  }
  
  if (R2_ENDPOINT) {
    s3Client = new S3Client({
      region: process.env.R2_REGION || 'auto',
      endpoint: R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });
    BUCKET_NAME = process.env.R2_BUCKET_NAME;
  }
}

const uploadToR2 = async (file, folder = 'uploads') => {
  try {
    if (!s3Client || !BUCKET_NAME) {
      throw new Error('R2 configuration is missing. Please check your environment variables.');
    }
    if (!file) {
      throw new Error('No file provided');
    }

    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}-${file.originalname}`;
    const contentType = file.mimetype || 'application/octet-stream';

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: contentType,
    });

    await s3Client.send(command);

    let fileUrl;
    if (R2_PUBLIC_URL) {
      if (R2_PUBLIC_URL.endsWith('/')) {
        fileUrl = `${R2_PUBLIC_URL}${fileName}`;
      } else {
        fileUrl = `${R2_PUBLIC_URL}/${fileName}`;
      }
    } else {
      fileUrl = `${R2_ENDPOINT}/${BUCKET_NAME}/${fileName}`;
    }
    return fileUrl;
  } catch (error) {
    console.error('R2 Upload Error:', error);
    throw new Error('Failed to upload file to R2');
  }
};

const deleteFromR2 = async (fileUrl) => {
  try {
    if (!s3Client || !BUCKET_NAME) {
      return false;
    }
    const urlParts = fileUrl.split('/');
    const fileName = urlParts.slice(-2).join('/');

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error('R2 Delete Error:', error);
    return false;
  }
};

const getUploadUrl = async (fileName, contentType, folder = 'uploads') => {
  try {
    if (!s3Client || !BUCKET_NAME) {
      throw new Error('R2 configuration is missing. Please check your environment variables.');
    }
    const key = `${folder}/${Date.now()}-${fileName}`;
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    let fileUrl;
    if (R2_PUBLIC_URL) {
      if (R2_PUBLIC_URL.endsWith('/')) {
        fileUrl = `${R2_PUBLIC_URL}${key}`;
      } else {
        fileUrl = `${R2_PUBLIC_URL}/${key}`;
      }
    } else {
      fileUrl = `${R2_ENDPOINT}/${BUCKET_NAME}/${key}`;
    }
    return { signedUrl, key, url: fileUrl };
  } catch (error) {
    console.error('R2 Presigned URL Error:', error);
    throw new Error('Failed to generate upload URL');
  }
};

module.exports = {
  uploadToR2,
  deleteFromR2,
  getUploadUrl,
};
