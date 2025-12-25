'use client'

import { useState } from 'react'
import { PlusIcon, HelpCircleIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function QuestionsPage() {
  const [questions] = useState([])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sorular</h1>
          <p className="text-slate-600">{questions.length} soru</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <PlusIcon className="h-4 w-4 mr-2" />
          Yeni Soru
        </Button>
      </div>

      <div className="bg-white rounded-xl p-12 shadow-sm border border-slate-200 text-center">
        <HelpCircleIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">Henüz soru yok</h3>
        <p className="text-slate-600 mb-4">
          Çalışma soruları ekleyerek kendini test et
        </p>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <PlusIcon className="h-4 w-4 mr-2" />
          Soru Ekle
        </Button>
      </div>
    </div>
  )
}
