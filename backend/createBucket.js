import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SECRET_KEY || process.env.PUBLISHABLE_KEY
);

async function createBucket() {
  console.log('Checking bucket...');
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    console.error('Error listing buckets:', listError.message);
    return;
  }
  
  const bucketExists = buckets.find(b => b.name === 'images');
  if (bucketExists) {
    console.log('Bucket "images" already exists.');
    return;
  }

  console.log('Creating bucket "images"...');
  const { data, error } = await supabase.storage.createBucket('images', {
    public: true,
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml']
  });

  if (error) {
    console.error('Failed to create bucket:', error.message);
  } else {
    console.log('Bucket "images" created successfully:', data);
  }
}

createBucket();
