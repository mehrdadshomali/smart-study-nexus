'use client'

import { PlayCircleIcon, PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function QuizPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quiz</h1>
          <p className="text-slate-600">Kendini test et</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <PlusIcon className="h-4 w-4 mr-2" />
          Quiz Oluştur
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hızlı Quiz */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
          <PlayCircleIcon className="h-10 w-10 mb-4" />
          <h3 className="text-xl font-bold mb-2">Hızlı Quiz</h3>
          <p className="text-indigo-100 mb-4">
            Tüm sorulardan rastgele 10 soru ile hızlı bir test yap
          </p>
          <Button className="bg-white text-indigo-600 hover:bg-indigo-50">
            Başla
          </Button>
        </div>

        {/* Spaced Repetition */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
          <PlayCircleIcon className="h-10 w-10 mb-4" />
          <h3 className="text-xl font-bold mb-2">Günlük Tekrar</h3>
          <p className="text-green-100 mb-4">
            Bugün tekrar edilmesi gereken soruları çöz
          </p>
          <Button className="bg-white text-green-600 hover:bg-green-50">
            0 Soru Bekliyor
          </Button>
        </div>
      </div>

      {/* Quiz Geçmişi */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Quiz Geçmişi</h2>
        <div className="text-center py-8 text-slate-500">
          <p>Henüz quiz çözmedin.</p>
          <p className="text-sm">İlk quizini başlatarak kendini test et!</p>
        </div>
      </div>
    </div>
  )
}
