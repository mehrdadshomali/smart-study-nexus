'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, SaveIcon, TrashIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TiptapEditor } from '@/components/editor/tiptap-editor'
import Link from 'next/link'

interface NotePageProps {
  params: Promise<{ noteId: string }>
}

export default function NotePage({ params }: NotePageProps) {
  const { noteId } = use(params)
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState<unknown>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Gerçek API'den not yükle
    // fetch(`/api/notes/${noteId}`)
    //   .then(res => res.json())
    //   .then(data => {
    //     setTitle(data.title)
    //     setContent(data.content)
    //   })
    
    // Demo veri
    setTitle('Örnek Not')
    setContent({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Bu bir örnek not içeriğidir.' }],
        },
      ],
    })
    setIsLoading(false)
  }, [noteId])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // TODO: Gerçek API çağrısı
      console.log('Updating note:', { noteId, title, content })
      await new Promise((resolve) => setTimeout(resolve, 500))
    } catch (error) {
      console.error('Save error:', error)
      alert('Not kaydedilemedi')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Bu notu silmek istediğinize emin misiniz?')) return

    try {
      // TODO: Gerçek API çağrısı
      console.log('Deleting note:', noteId)
      router.push('/notes')
    } catch (error) {
      console.error('Delete error:', error)
      alert('Not silinemedi')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/notes">
            <Button variant="ghost" size="icon">
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-slate-900">Not Düzenle</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleDelete}>
            <TrashIcon className="h-4 w-4 mr-2" />
            Sil
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <SaveIcon className="h-4 w-4 mr-2" />
            {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <Input
            type="text"
            placeholder="Not başlığı..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-semibold border-0 shadow-none focus-visible:ring-0 px-0"
          />
        </div>
        <TiptapEditor
          content={content}
          onChange={setContent}
          placeholder="Notunuzu yazmaya başlayın..."
        />
      </div>
    </div>
  )
}
