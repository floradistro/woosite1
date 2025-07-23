# Supabase COA Storage Setup

## Overview
This project includes a lab results page that displays Certificate of Analysis (COA) documents stored in a Supabase storage bucket.

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Supabase Setup Steps

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key from the project settings

### 2. Create Storage Bucket
1. Navigate to **Storage** in your Supabase dashboard
2. Click **"New bucket"**
3. Create a new bucket named `coas`
4. Make sure the bucket is set to **public** for read access

### 3. Configure Bucket Policies
After creating the bucket, set up the following policies:

```sql
-- Allow public read access to COA files
CREATE POLICY "Public COA Access" ON storage.objects
FOR SELECT USING (bucket_id = 'coas');

-- Allow authenticated users to upload COAs (optional)
CREATE POLICY "Authenticated COA Upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'coas' AND auth.role() = 'authenticated');
```

### 4. Upload COA Files
1. Navigate to your `coas` bucket in the Supabase dashboard
2. **Create a folder named `flower`** within the bucket
3. Upload your PDF COA files to the `flower` folder
4. The files will be automatically listed on the lab results page

## Current Setup Status

✅ **Environment Variables**: Configured in `.env.local`
✅ **Supabase Connection**: Working
❌ **Storage Bucket**: Not created yet
❌ **COA Files**: Not uploaded yet

## Next Steps

1. **Create the `coas` bucket** in your Supabase dashboard
2. **Create a `flower` folder** within the bucket
3. **Upload COA PDF files** to the `flower` folder
4. **Set bucket policies** for public read access

## Features

### PDF Viewer
- **Full PDF Display**: View complete COA documents in the browser
- **Zoom Controls**: Zoom in/out for better readability
- **Page Navigation**: Navigate through multi-page documents
- **Search**: Search through COA filenames
- **Download**: Download individual COA files

### File Management
- **Automatic Listing**: Files are automatically loaded from the `flower` folder
- **Metadata Display**: Shows file size, upload date, and other metadata
- **Secure Access**: Uses Supabase signed URLs for secure file access

## File Structure

```
src/
├── lib/
│   └── supabase.ts          # Supabase client configuration
└── app/
    └── lab-results/
        └── page.tsx         # Lab results page with PDF viewer
```

## Dependencies

The following packages are required:
- `@supabase/supabase-js` - Supabase client
- `framer-motion` - Animations
- `lucide-react` - Icons

## Storage Structure

```
coas/                        # Storage bucket
└── flower/                  # Folder containing COA files
    ├── strain1-coa.pdf
    ├── strain2-coa.pdf
    └── strain3-coa.pdf
```

## Usage

1. Set up your Supabase project and bucket as described above
2. Add your environment variables to `.env.local`
3. Create the `flower` folder in your `coas` bucket
4. Upload COA PDF files to the `flower` folder
5. Navigate to `/lab-results` to view and download COAs

## Security Notes

- The bucket is configured for public read access to allow customers to view COAs
- Signed URLs are used for secure file access with automatic expiration
- Upload permissions can be restricted to authenticated users only

## Troubleshooting

### "No COA files found in storage bucket"
- **Check**: Bucket exists and is named `coas`
- **Check**: `flower` folder exists within the bucket
- **Check**: COA files are uploaded to the `flower` folder
- **Check**: Bucket policies allow public read access

### PDF Not Loading
- Check that your Supabase URL and keys are correct
- Ensure the file exists in the `coas/flower/` path
- Verify bucket policies allow public read access

### No Files Listed
- Confirm files are uploaded to the `flower` folder within the `coas` bucket
- Check browser console for any API errors
- Verify environment variables are set correctly

## Quick Setup Commands

After creating the bucket in Supabase dashboard, you can verify the setup:

```bash
# Test connection (run from project root)
node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
supabase.storage.from('coas').list('flower').then(({ data, error }) => {
  console.log('Files in flower folder:', data?.length || 0);
  if (error) console.error('Error:', error);
});
"
``` 