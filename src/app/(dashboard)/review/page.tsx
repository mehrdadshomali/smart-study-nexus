'use client'

import { RefreshCwIcon, CalendarIcon, TrendingUpIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ReviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Aralıklı Tekrar</h1>
        <p className="text-slate-600">Spaced Repetition ile öğrenmeyi pekiştir</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">0</p>
              <p className="text-sm text-slate-600">Bugün Tekrar</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <TrendingUpIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">0</p>
              <p className="text-sm text-slate-600">Öğrenildi</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100">
              <RefreshCwIcon className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">0</p>
              <p className="text-sm text-slate-600">Toplam Soru</p>
            </div>
          </div>
        </div>
      </div>

      {/* Review Session */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 text-center">
        <RefreshCwIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          Bugün tekrar edilecek soru yok
        </h3>
        <p className="text-slate-600 mb-6 max-w-md mx-auto">
          Sorular eklediğinde ve quiz çözdüğünde, yanlış cevapladığın sorular
          otomatik olarak tekrar listesine eklenecek.
        </p>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          Soru Ekle
        </Button>
      </div>

      {/* How it works */}
      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
        <h3 className="font-semibold text-slate-900 mb-4">Nasıl Çalışır?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
              1
            </span>
            <p className="text-slate-600">
              Sorular ekle ve quiz çöz. Yanlış cevaplar otomatik işaretlenir.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
              2
            </span>
            <p className="text-slate-600">
              SM-2 algoritması, her sorunun tekrar zamanını hesaplar.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
              3
            </span>
            <p className="text-slate-600">
              Her gün tekrar listeni kontrol et ve soruları çöz.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
