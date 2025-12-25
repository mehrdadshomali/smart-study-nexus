'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeftIcon, RotateCcwIcon, CheckIcon, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getQualityDescription } from '@/lib/algorithms/sm2'

// Demo data
const demoCards = [
  {
    id: '1',
    front: 'React\'te useState hook\'u ne işe yarar?',
    back: 'Fonksiyonel componentlerde state yönetimi için kullanılır. useState bir array döner: [state, setState]',
  },
  {
    id: '2',
    front: 'Big O Notation nedir?',
    back: 'Algoritmaların zaman ve alan karmaşıklığını ifade eden matematiksel notasyon. Örn: O(n), O(log n), O(n²)',
  },
  {
    id: '3',
    front: 'REST API nedir?',
    back: 'Representational State Transfer - HTTP protokolü üzerinden kaynaklara erişim sağlayan mimari stil.',
  },
]

const qualityButtons = [
  { value: 0, label: 'Hiç', color: 'bg-red-500 hover:bg-red-600' },
  { value: 1, label: 'Zor', color: 'bg-orange-500 hover:bg-orange-600' },
  { value: 2, label: 'Orta', color: 'bg-yellow-500 hover:bg-yellow-600' },
  { value: 3, label: 'Kolay', color: 'bg-lime-500 hover:bg-lime-600' },
  { value: 4, label: 'İyi', color: 'bg-green-500 hover:bg-green-600' },
  { value: 5, label: 'Mükemmel', color: 'bg-emerald-500 hover:bg-emerald-600' },
]

export default function FlashcardReviewPage() {
  const router = useRouter()
  const [cards] = useState(demoCards)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [results, setResults] = useState<{ cardId: string; quality: number }[]>([])
  const [isComplete, setIsComplete] = useState(false)

  const currentCard = cards[currentIndex]
  const progress = ((currentIndex) / cards.length) * 100

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleRate = (quality: number) => {
    setResults([...results, { cardId: currentCard.id, quality }])

    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    } else {
      setIsComplete(true)
    }
  }

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <CheckIcon className="h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Tebrikler!</h2>
        <p className="text-slate-600 mb-6">Bugün tekrar edilecek kart yok.</p>
        <Button onClick={() => router.push('/flashcards')}>
          Flashcards'a Dön
        </Button>
      </div>
    )
  }

  if (isComplete) {
    const correctCount = results.filter(r => r.quality >= 3).length
    const accuracy = Math.round((correctCount / results.length) * 100)

    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckIcon className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Oturum Tamamlandı!
          </h2>
          <p className="text-slate-600 mb-6">
            {results.length} kart tekrar edildi
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-3xl font-bold text-green-600">{correctCount}</p>
              <p className="text-sm text-slate-600">Doğru</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-3xl font-bold text-indigo-600">{accuracy}%</p>
              <p className="text-sm text-slate-600">Başarı</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setCurrentIndex(0)
                setIsFlipped(false)
                setResults([])
                setIsComplete(false)
              }}
            >
              <RotateCcwIcon className="h-4 w-4 mr-2" />
              Tekrarla
            </Button>
            <Button
              className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              onClick={() => router.push('/flashcards')}
            >
              Bitir
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => router.push('/flashcards')}>
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Geri
        </Button>
        <span className="text-sm text-slate-600">
          {currentIndex + 1} / {cards.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-slate-200 rounded-full mb-8 overflow-hidden">
        <motion.div
          className="h-full bg-indigo-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Card */}
      <div className="perspective-1000 mb-8">
        <motion.div
          className="relative w-full h-80 cursor-pointer"
          onClick={handleFlip}
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 bg-white rounded-2xl shadow-lg p-8 flex items-center justify-center backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <p className="text-xl text-center text-slate-900">{currentCard.front}</p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-8 flex items-center justify-center"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <p className="text-xl text-center text-white">{currentCard.back}</p>
          </div>
        </motion.div>
      </div>

      {/* Flip hint or Rating buttons */}
      <AnimatePresence mode="wait">
        {!isFlipped ? (
          <motion.div
            key="hint"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <p className="text-slate-500 mb-4">Cevabı görmek için karta tıkla</p>
            <Button variant="outline" onClick={handleFlip}>
              Cevabı Göster
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="rating"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <p className="text-center text-slate-600 mb-4">
              Ne kadar hatırladın?
            </p>
            <div className="grid grid-cols-3 gap-2">
              {qualityButtons.map((btn) => (
                <button
                  key={btn.value}
                  onClick={() => handleRate(btn.value)}
                  className={`${btn.color} text-white py-3 px-4 rounded-xl font-medium transition-all hover:scale-105`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-center text-slate-400 mt-4">
              {getQualityDescription(3)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
