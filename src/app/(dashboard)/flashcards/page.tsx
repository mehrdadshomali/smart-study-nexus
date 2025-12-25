'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PlusIcon, PlayIcon, LayersIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Demo data
const demoFlashcards = [
  {
    id: '1',
    front: 'React\'te useState hook\'u ne işe yarar?',
    back: 'Fonksiyonel componentlerde state yönetimi için kullanılır.',
    nextReviewDate: new Date(),
    interval: 1,
    repetitions: 2,
  },
  {
    id: '2',
    front: 'Big O Notation nedir?',
    back: 'Algoritmaların zaman ve alan karmaşıklığını ifade eden matematiksel notasyon.',
    nextReviewDate: new Date(Date.now() + 86400000),
    interval: 3,
    repetitions: 4,
  },
]

export default function FlashcardsPage() {
  const [flashcards] = useState(demoFlashcards)
  
  const dueCards = flashcards.filter(
    card => new Date(card.nextReviewDate) <= new Date()
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Flashcards</h1>
          <p className="text-slate-600">Spaced repetition ile öğren</p>
        </div>
        <Link href="/flashcards/new">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <PlusIcon className="h-4 w-4 mr-2" />
            Yeni Kart
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-indigo-100">
              <LayersIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{flashcards.length}</p>
              <p className="text-sm text-slate-600">Toplam Kart</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-orange-100">
              <PlayIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{dueCards.length}</p>
              <p className="text-sm text-slate-600">Bugün Tekrar</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">0</p>
              <p className="text-sm text-slate-600">Bugün Tamamlanan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Review Button */}
      {dueCards.length > 0 && (
        <Link href="/flashcards/review">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white cursor-pointer hover:from-indigo-600 hover:to-purple-700 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Tekrar Zamanı!</h3>
                <p className="text-indigo-100 mt-1">
                  {dueCards.length} kart tekrar bekliyor
                </p>
              </div>
              <Button className="bg-white text-indigo-600 hover:bg-indigo-50">
                <PlayIcon className="h-4 w-4 mr-2" />
                Başla
              </Button>
            </div>
          </div>
        </Link>
      )}

      {/* Card List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-900">Tüm Kartlar</h2>
        </div>
        
        {flashcards.length === 0 ? (
          <div className="p-12 text-center">
            <LayersIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Henüz kart yok
            </h3>
            <p className="text-slate-600 mb-4">
              İlk flashcard'ını oluşturarak öğrenmeye başla
            </p>
            <Link href="/flashcards/new">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <PlusIcon className="h-4 w-4 mr-2" />
                Kart Oluştur
              </Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {flashcards.map((card) => (
              <div key={card.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{card.front}</p>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-1">
                      {card.back}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      new Date(card.nextReviewDate) <= new Date()
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {new Date(card.nextReviewDate) <= new Date()
                        ? 'Bugün'
                        : `${card.interval} gün sonra`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
