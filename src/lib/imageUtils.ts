export interface ProcessedImage {
  base64: string
  thumbnailBase64: string
  previewUrl: string
  fileSizeFormatted: string
  width: number
  height: number
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_RAW_SIZE_BYTES = 10 * 1024 * 1024 // 10MB
const MAX_BASE64_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file format. Please upload a JPG, PNG, or WEBP photo.',
    }
  }

  if (file.size > MAX_RAW_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds 10MB (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please choose a smaller photo.`,
    }
  }

  return { valid: true }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Resizes an image file to max 1024px, encodes as JPEG 0.85,
 * and creates a 200px thumbnail.
 */
export async function processImageForAnalysis(file: File): Promise<ProcessedImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Failed to read image file'))
    
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Failed to load image into memory'))
      
      img.onload = () => {
        try {
          // 1. Full processed image (Max 1024px dimension)
          const maxDim = 1024
          let width = img.naturalWidth || img.width
          let height = img.naturalHeight || img.height

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width)
              width = maxDim
            } else {
              width = Math.round((width * maxDim) / height)
              height = maxDim
            }
          }

          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            throw new Error('Canvas 2D context unavailable')
          }

          // Fill white background for transparent PNG/WEBP conversion to JPEG
          ctx.fillStyle = '#FFFFFF'
          ctx.fillRect(0, 0, width, height)
          ctx.drawImage(img, 0, 0, width, height)

          const base64 = canvas.toDataURL('image/jpeg', 0.85)

          // Approximate base64 byte size check
          const approxSizeBytes = Math.round((base64.length * 3) / 4)
          if (approxSizeBytes > MAX_BASE64_SIZE_BYTES) {
            throw new Error('Processed image exceeds 5MB limit. Please crop or reduce resolution.')
          }

          // 2. Thumbnail (Max 200px dimension)
          const thumbDim = 200
          let thumbW = width
          let thumbH = height
          if (thumbW > thumbDim || thumbH > thumbDim) {
            if (thumbW > thumbH) {
              thumbH = Math.round((thumbH * thumbDim) / thumbW)
              thumbW = thumbDim
            } else {
              thumbW = Math.round((thumbW * thumbDim) / thumbH)
              thumbH = thumbDim
            }
          }

          const thumbCanvas = document.createElement('canvas')
          thumbCanvas.width = thumbW
          thumbCanvas.height = thumbH
          const thumbCtx = thumbCanvas.getContext('2d')
          if (thumbCtx) {
            thumbCtx.fillStyle = '#FFFFFF'
            thumbCtx.fillRect(0, 0, thumbW, thumbH)
            thumbCtx.drawImage(img, 0, 0, thumbW, thumbH)
          }
          const thumbnailBase64 = thumbCanvas.toDataURL('image/jpeg', 0.8)

          resolve({
            base64,
            thumbnailBase64,
            previewUrl: URL.createObjectURL(file),
            fileSizeFormatted: formatBytes(file.size),
            width,
            height,
          })
        } catch (err) {
          reject(err)
        }
      }

      img.src = reader.result as string
    }

    reader.readAsDataURL(file)
  })
}
