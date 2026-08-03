import { catchAsync } from '../utils/catchAsync.js';
import { supabase } from '../config/supabase.js';

// Document-only MIME types allowed in the 'documents' bucket
const DOCUMENT_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.oasis.opendocument.text',
  'application/rtf',
  'text/rtf',
];

/**
 * Ensures a bucket exists. Creates it as public if it doesn't.
 * For the 'documents' bucket, enforces document-only MIME types.
 */
async function ensureBucket(bucketName) {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === bucketName);

  const isDocBucket = bucketName === 'documents';
  const options = {
    public: true,
    allowedMimeTypes: isDocBucket ? DOCUMENT_MIME_TYPES : null,
    fileSizeLimit: isDocBucket ? 10 * 1024 * 1024 : null, // 10 MB for docs
  };

  if (!exists) {
    const { error } = await supabase.storage.createBucket(bucketName, options);
    if (error) console.error(`Failed to create bucket "${bucketName}":`, error.message);
  } else if (isDocBucket) {
    // Keep MIME restrictions up-to-date even if bucket already exists
    await supabase.storage.updateBucket(bucketName, options);
  }
}

export const uploadFile = catchAsync(async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ success: false, message: 'Supabase is not configured on the server.' });
  }
  
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }

  const bucketName = req.body.bucket || 'images';
  const folderPath = req.body.path ? `${req.body.path}/` : '';
  const oldUrl = req.body.oldUrl;

  // Ensure the target bucket exists (creates it if missing)
  await ensureBucket(bucketName);

  // Delete old file if URL is provided
  if (oldUrl) {
    try {
      const urlParts = oldUrl.split(`/storage/v1/object/public/${bucketName}/`);
      if (urlParts.length === 2) {
        const oldFilePath = urlParts[1];
        await supabase.storage.from(bucketName).remove([oldFilePath]);
      }
    } catch (e) {
      console.error('Failed to delete old file:', e);
    }
  }

  const file = req.file;
  const originalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileName = `${folderPath}${Date.now()}_${originalName}`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    throw error;
  }

  // Get public URL
  const { data: publicData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);

  res.status(200).json({ success: true, data: { url: publicData.publicUrl } });
});

export const deleteFile = catchAsync(async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ success: false, message: 'Supabase is not configured on the server.' });
  }

  const { url, bucket = 'images' } = req.body;
  if (!url) {
    return res.status(400).json({ success: false, message: 'No URL provided to delete.' });
  }

  try {
    const urlParts = url.split(`/storage/v1/object/public/${bucket}/`);
    if (urlParts.length === 2) {
      const filePath = urlParts[1];
      const { error } = await supabase.storage.from(bucket).remove([filePath]);
      if (error) throw error;
      return res.status(200).json({ success: true, message: 'File deleted successfully.' });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid URL for the specified bucket.' });
    }
  } catch (error) {
    console.error('Failed to delete file:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete file.' });
  }
});
