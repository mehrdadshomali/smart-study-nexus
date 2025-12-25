'use client'

import { useState, useEffect, useRef } from 'react'
import {
  FileIcon,
  Upload,
  Image,
  FileText,
  File,
  Trash2,
  Download,
  Grid,
  List,
  Filter,
  SortAsc,
  SortDesc,
  Loader2,
  X,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FileItem {
  id: string
  name: string
  type: 'IMAGE' | 'PDF' | 'DOCUMENT' | 'AUDIO' | 'OTHER'
  mimeType: string
  size: number
  url: string
  isProcessed: boolean
  createdAt: string
}

type FilterType = 'ALL' | 'IMAGE' | 'PDF' | 'DOCUMENT'
type SortBy = 'createdAt' | 'name' | 'size'
type SortOrder = 'asc' | 'desc'

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filter, setFilter] = useState<FilterType>('ALL')
  const [sortBy, setSortBy] = useState<SortBy>('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchFiles()
  }, [filter, sortBy, sortOrder])

  const fetchFiles = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter !== 'ALL') params.set('type', filter)
      params.set('sortBy', sortBy)
      params.set('sortOrder', sortOrder)

      const res = await fetch(`/api/files?${params}`)
      if (res.ok) {
        const data = await res.json()
        setFiles(data)
      }
    } catch (error) {
      console.error('Failed to fetch files:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles || selectedFiles.length === 0) return

    setIsUploading(true)
    
    // TODO: Implement actual file upload to Supabase Storage
    // For now, just show a placeholder
    console.log('Files to upload:', selectedFiles)
    
    setTimeout(() => {
      setIsUploading(false)
      fetchFiles()
    }, 1000)
  }

  const handleDelete = async (fileId: string) => {
    if (!confirm('Bu dosyayı silmek istediğinize emin misiniz?')) return

    try {
      const res = await fetch(`/api/files/${fileId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setFiles(files.filter(f => f.id !== fileId))
      }
    } catch (error) {
      console.error('Failed to delete file:', error)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'IMAGE':
        return <Image className="h-5 w-5 text-green-400" />
      case 'PDF':
        return <FileText className="h-5 w-5 text-red-400" />
      case 'DOCUMENT':
        return <File className="h-5 w-5 text-blue-400" />
      default:
        return <FileIcon className="h-5 w-5 text-slate-400" />
    }
  }

  const filterTabs: { value: FilterType; label: string }[] = [
    { value: 'ALL', label: 'Tümü' },
    { value: 'IMAGE', label: 'Resimler' },
    { value: 'PDF', label: 'PDF' },
    { value: 'DOCUMENT', label: 'Dokümanlar' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-600/20 flex items-center justify-center">
            <FileIcon className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Dosyalar</h1>
            <p className="text-sm text-slate-400">
              {files.length} dosya
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleUpload}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Yükle
          </Button>
        </div>
      </div>

      {/* Filters & Sort */}
      <div className="flex items-center justify-between">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-800/50 rounded-lg">
          {filterTabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                filter === tab.value
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sort & View */}
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortBy)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white"
          >
            <option value="createdAt">Tarih</option>
            <option value="name">İsim</option>
            <option value="size">Boyut</option>
          </select>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="text-slate-400 hover:text-white"
          >
            {sortOrder === 'asc' ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>

          <div className="flex items-center gap-1 p-1 bg-slate-800/50 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-1.5 rounded',
                viewMode === 'grid' ? 'bg-slate-700 text-white' : 'text-slate-400'
              )}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-1.5 rounded',
                viewMode === 'list' ? 'bg-slate-700 text-white' : 'text-slate-400'
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Files Grid/List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-12">
          <FileIcon className="h-16 w-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Henüz dosya yok</h3>
          <p className="text-slate-400 mb-4">
            Dosya yüklemek için yukarıdaki butonu kullanın
          </p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Upload className="h-4 w-4 mr-2" />
            İlk Dosyayı Yükle
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {files.map(file => (
            <div
              key={file.id}
              className="group bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden hover:border-indigo-500/50 transition-colors"
            >
              {/* Preview */}
              <div
                className="aspect-square bg-slate-900/50 flex items-center justify-center cursor-pointer relative"
                onClick={() => setPreviewFile(file)}
              >
                {file.type === 'IMAGE' ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center">
                    {getFileIcon(file.type)}
                  </div>
                )}
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button className="p-2 rounded-lg bg-white/20 hover:bg-white/30">
                    <Eye className="h-4 w-4 text-white" />
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      handleDelete(file.id)
                    }}
                    className="p-2 rounded-lg bg-red-500/50 hover:bg-red-500/70"
                  >
                    <Trash2 className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-sm font-medium text-white truncate">{file.name}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {formatFileSize(file.size)} • {new Date(file.createdAt).toLocaleDateString('tr-TR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {files.map(file => (
            <div
              key={file.id}
              className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-indigo-500/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center">
                {getFileIcon(file.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{file.name}</p>
                <p className="text-xs text-slate-400">
                  {formatFileSize(file.size)} • {new Date(file.createdAt).toLocaleDateString('tr-TR')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPreviewFile(file)}
                  className="text-slate-400 hover:text-white"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(file.id)}
                  className="text-slate-400 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewFile && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewFile(null)}
        >
          <div
            className="bg-slate-900 rounded-xl max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h3 className="font-medium text-white">{previewFile.name}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPreviewFile(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-4 max-h-[70vh] overflow-auto">
              {previewFile.type === 'IMAGE' ? (
                <img
                  src={previewFile.url}
                  alt={previewFile.name}
                  className="max-w-full h-auto rounded-lg"
                />
              ) : previewFile.type === 'PDF' ? (
                <iframe
                  src={previewFile.url}
                  className="w-full h-[60vh] rounded-lg"
                />
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <FileIcon className="h-16 w-16 mx-auto mb-4" />
                  <p>Bu dosya türü önizlenemez</p>
                  <a
                    href={previewFile.url}
                    download
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700"
                  >
                    <Download className="h-4 w-4" />
                    İndir
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
