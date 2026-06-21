import { useRef, useState } from 'react'
import { X, Upload, ImagePlus } from 'lucide-react'
import api from '../../api/client.js'

/**
 * ImageUpload — lets admin pick local image files, uploads each to /api/upload,
 * shows thumbnails, and calls onChange(urls[]) with the updated list.
 *
 * Props:
 *   value    string[]   current image URL list
 *   onChange fn         called with new string[] after add/remove
 *   max      number     max images allowed (default 6)
 */
export default function ImageUpload({ value = [], onChange, max = 6 }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFiles = async (files) => {
    setError('')
    const remaining = max - value.length
    const toUpload = Array.from(files).slice(0, remaining)
    if (toUpload.length === 0) return

    setUploading(true)
    try {
      const results = await Promise.allSettled(
        toUpload.map(async (file) => {
          const fd = new FormData()
          fd.append('image', file)
          const { data } = await api.post('/upload', fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
          return data.url
        })
      )
      const succeeded = results.filter(r => r.status === 'fulfilled').map(r => r.value)
      const failed    = results.filter(r => r.status === 'rejected').length
      if (succeeded.length > 0) onChange([...value, ...succeeded])
      if (failed > 0) setError(`${failed} file${failed > 1 ? 's' : ''} failed to upload. Please try again.`)
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Try again.')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const remove = (idx) => onChange(value.filter((_, i) => i !== idx))

  const onDrop = (e) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Images <span className="text-gray-400 font-normal">({value.length}/{max})</span>
      </label>

      {/* Thumbnails */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {value.map((url, i) => (
            <div key={i} className="relative group rounded-xl overflow-hidden bg-gray-100 aspect-video">
              <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Drop zone / picker */}
      {value.length < max && (
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-2xl py-6 px-4 cursor-pointer hover:border-teal-400 hover:bg-teal-50/30 transition-colors"
        >
          {uploading ? (
            <>
              <Upload size={22} className="text-teal-500 animate-bounce" />
              <p className="text-sm text-teal-600 font-medium">Uploading...</p>
            </>
          ) : (
            <>
              <ImagePlus size={22} className="text-gray-400" />
              <p className="text-sm text-gray-500">
                <span className="font-medium text-teal-500">Click to upload</span> or drag &amp; drop
              </p>
              <p className="text-xs text-gray-400">PNG, JPG, WEBP — max 5 MB each</p>
            </>
          )}
        </div>
      )}

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}
