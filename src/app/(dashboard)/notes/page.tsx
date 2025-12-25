'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PlusIcon, FileTextIcon, FolderIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNoteStore } from '@/store/note-store'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'

export default function NotesPage() {
  const { notes } = useNoteStore()
  const [view, setView] = useState<'grid' | 'list'>('grid')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notlarım</h1>
          <p className="text-slate-600">{notes.length} not</p>
        </div>
        <Link href="/notes/new">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <PlusIcon className="h-4 w-4 mr-2" />
            Yeni Not
          </Button>
        </Link>
      </div>

      {notes.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-slate-200 text-center">
          <FileTextIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">Henüz not yok</h3>
          <p className="text-slate-600 mb-4">İlk notunu oluşturarak başla</p>
          <Link href="/notes/new">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <PlusIcon className="h-4 w-4 mr-2" />
              Not Oluştur
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <Link
              key={note.id}
              href={`/notes/${note.id}`}
              className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-slate-900 line-clamp-1">
                  {note.title}
                </h3>
              </div>
              {note.folder && (
                <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
                  <FolderIcon className="h-3 w-3" />
                  {note.folder.name}
                </div>
              )}
              <p className="text-sm text-slate-600 line-clamp-3 mb-3">
                {/* Content preview */}
              </p>
              <p className="text-xs text-slate-400">
                {formatDistanceToNow(new Date(note.updatedAt), {
                  addSuffix: true,
                  locale: tr,
                })}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
