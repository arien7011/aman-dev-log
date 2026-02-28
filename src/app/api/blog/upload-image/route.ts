import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/auth/admin';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ----------------------------------------------------------------
// POST /api/blog/upload-image — admin only, upload image to Cloudinary
// Accepts: multipart/form-data with a field named "file"
// Returns: { success: true, url: string }
// ----------------------------------------------------------------
export async function POST(request: NextRequest) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided. Send a multipart/form-data request with a "file" field.' },
        { status: 400 }
      );
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type. Only JPEG, PNG, GIF, WEBP, and SVG are allowed.' },
        { status: 400 }
      );
    }

    const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, message: 'File too large. Maximum size is 10 MB.' },
        { status: 400 }
      );
    }

    // Convert File to Buffer for Cloudinary upload_stream
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary via upload_stream wrapped in a Promise
    const url = await new Promise<string>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'amandevlog/blog',
          resource_type: 'image',
          use_filename: false,
          unique_filename: true,
        },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error('Cloudinary upload failed'));
          } else {
            resolve(result.secure_url);
          }
        }
      );
      stream.end(buffer);
    });

    return NextResponse.json({ success: true, url });
  } catch (err) {
    console.error('[POST /api/blog/upload-image]', err);
    return NextResponse.json(
      { success: false, message: 'Image upload failed' },
      { status: 500 }
    );
  }
}
