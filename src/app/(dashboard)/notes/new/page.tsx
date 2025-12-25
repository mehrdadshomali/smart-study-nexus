'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, SaveIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TiptapEditor } from '@/components/editor/tiptap-editor'
import Link from 'next/link'

export default function NewNotePage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState<unknown>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Lütfen bir başlık girin')
      return
    }

    setIsSaving(true)
    try {
      // TODO: Gerçek API çağrısı
      // const response = await fetch('/api/notes', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ title, content, userId: 'demo-user' }),
      // })
      
      console.log('Saving note:', { title, content })
      
      // Simüle edilmiş kaydetme
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      router.push('/notes')
    } catch (error) {
      console.error('Save error:', error)
      alert('Not kaydedilemedi')
    } finally {
      setIsSaving(false)
    }
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
          <h1 className="text-xl font-semibold text-slate-900">Yeni Not</h1>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <SaveIcon className="h-4 w-4 mr-2" />
          {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
        </Button>
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
