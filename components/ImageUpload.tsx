'use client'

import { useState } from 'react'
import { ImageIcon, X, Upload, Loader2 } from 'lucide-react'

interface ImageUploadProps {
  onImagesChange: (urls: string[]) => void
  maxImages?: number
  folder?: string
}

export default function ImageUpload({ onImagesChange, maxImages = 5, folder = 'requests' }: ImageUploadProps) {
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (images.length + files.length > maxImages) {
      setError(`Você pode enviar no máximo ${maxImages} imagens`)
      return
    }

    setUploading(true)
    setError('')

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', folder)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Erro ao fazer upload')
        }

        const data = await response.json()
        return data.url
      })

      const urls = await Promise.all(uploadPromises)
      const newImages = [...images, ...urls]
      
      setImages(newImages)
      onImagesChange(newImages)
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer upload das imagens')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    onImagesChange(newImages)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Imagens {images.length > 0 && `(${images.length}/${maxImages})`}
      </label>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Images */}
        {images.map((url, index) => (
          <div key={index} className="relative group">
            <img
              src={url}
              alt={`Upload ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg"
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        {/* Upload Button */}
        {images.length < maxImages && (
          <label className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-primary-500 transition-colors cursor-pointer">
            <div className="text-center p-4">
              {uploading ? (
                <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-2" />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Adicionar</p>
                </>
              )}
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
          </label>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      
      <p className="mt-2 text-xs text-gray-500">
        Máximo {maxImages} imagens. Formatos: JPG, PNG, WebP. Máx 5MB por imagem.
      </p>
    </div>
  )
}

