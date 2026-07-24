import { supabase } from '../supabase/client.js'

const BUCKET_NAME = 'uploads'

export async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets()
  if (!buckets?.find(b => b.name === BUCKET_NAME)) {
    await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 20 * 1024 * 1024,
    })
  }
}

export async function uploadFile(file, folder = 'general') {
  const ext = file.originalname.split('.').pop()?.toLowerCase() || 'bin'
  const allowed = ['pdf', 'png', 'jpg', 'jpeg', 'webp']
  if (!allowed.includes(ext)) {
    throw new Error(`File type .${ext} is not allowed. Allowed: ${allowed.join(', ')}`)
  }

  const filePath = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    })

  if (error) throw new Error(`Upload failed: ${error.message}`)

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath)

  return {
    url: publicUrl,
    path: filePath,
    filename: file.originalname,
  }
}
