'use client'

import { useEffect, useState } from 'react'
import {
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  FileText,
  HelpCircle,
  Layers,
  Flame,
  Calendar,
  Award,
} from 'lucide-react'
import { ActivityHeatmap } from '@/components/analytics/activity-heatmap'

interface Stats {
  totalNotes: number
  totalQuestions: number
  totalFlashcards: number
  studyMinutes: number
  correctAnswers: number
  totalAnswers: number
  currentStreak: number
  longestStreak: number
}

interface ActivityData {
  date: string
  count: number
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats>({
    totalNotes: 0,
    totalQuestions: 0,
    totalFlashcards: 0,
    studyMinutes: 0,
    correctAnswers: 0,
    totalAnswers: 0,
    currentStreak: 0,
    longestStreak: 0,
  })
  const [activityData, setActivityData] = useState<ActivityData[]>([])
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    setIsLoading(true)
    try {
      // Fetch stats
      const statsRes = await fetch('/api/analytics/stats')
      if (statsRes.ok) {
        const data = await statsRes.json()
        setStats(data)
      }

      // Fetch activity data for heatmap
      const activityRes = await fetch('/api/analytics/activity')
      if (activityRes.ok) {
        const data = await activityRes.json()
        setActivityData(data)
      }

      // Fetch recent activities
      const recentRes = await fetch('/api/analytics/recent')
      if (recentRes.ok) {
        const data = await recentRes.json()
        setRecentActivities(data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const accuracyRate = stats.totalAnswers > 0 
    ? Math.round((stats.correctAnswers / stats.totalAnswers) * 100) 
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-600/20 flex items-center justify-center">
          <BarChart3 className="h-5 w-5 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Analitik</h1>
          <p className="text-sm text-slate-400">Çalışma performansını takip et</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalNotes}</p>
              <p className="text-xs text-slate-400">Toplam Not</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center">
              <HelpCircle className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalQuestions}</p>
              <p className="text-xs text-slate-400">Toplam Soru</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600/20 flex items-center justify-center">
              <Layers className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalFlashcards}</p>
              <p className="text-xs text-slate-400">Flashcard</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-600/20 flex items-center justify-center">
              <Target className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{accuracyRate}%</p>
              <p className="text-xs text-slate-400">Doğruluk</p>
            </div>
          </div>
        </div>
      </div>

      {/* Streak & Study Time */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 rounded-xl p-5 border border-orange-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-300 mb-1">Mevcut Seri</p>
              <p className="text-4xl font-bold text-white">{stats.currentStreak}</p>
              <p className="text-xs text-slate-400 mt-1">gün üst üste</p>
            </div>
            <Flame className="h-12 w-12 text-orange-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-600/20 to-yellow-600/20 rounded-xl p-5 border border-amber-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-300 mb-1">En Uzun Seri</p>
              <p className="text-4xl font-bold text-white">{stats.longestStreak}</p>
              <p className="text-xs text-slate-400 mt-1">gün rekor</p>
            </div>
            <Award className="h-12 w-12 text-amber-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-xl p-5 border border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-300 mb-1">Çalışma Süresi</p>
              <p className="text-4xl font-bold text-white">{stats.studyMinutes}</p>
              <p className="text-xs text-slate-400 mt-1">dakika bu hafta</p>
            </div>
            <Clock className="h-12 w-12 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Activity Heatmap */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-green-400" />
          <h3 className="font-semibold text-white">Çalışma Aktivitesi</h3>
        </div>
        <ActivityHeatmap data={activityData} />
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-indigo-400" />
          <h3 className="font-semibold text-white">Son Aktiviteler</h3>
        </div>
        
        {recentActivities.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <p>Henüz aktivite yok.</p>
            <p className="text-sm mt-1">Çalışmaya başladığında aktivitelerin burada görünecek.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentActivities.map((activity, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/30"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">{getActivityText(activity.type)}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(activity.createdAt).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'NOTE_CREATED':
    case 'NOTE_EDITED':
      return <FileText className="h-4 w-4 text-blue-400" />
    case 'QUESTION_ANSWERED':
      return <HelpCircle className="h-4 w-4 text-purple-400" />
    case 'FLASHCARD_REVIEWED':
      return <Layers className="h-4 w-4 text-indigo-400" />
    case 'QUIZ_COMPLETED':
      return <Target className="h-4 w-4 text-green-400" />
    default:
      return <TrendingUp className="h-4 w-4 text-slate-400" />
  }
}

function getActivityText(type: string) {
  switch (type) {
    case 'NOTE_CREATED':
      return 'Yeni not oluşturuldu'
    case 'NOTE_EDITED':
      return 'Not düzenlendi'
    case 'QUESTION_ANSWERED':
      return 'Soru cevaplandı'
    case 'FLASHCARD_REVIEWED':
      return 'Flashcard tekrar edildi'
    case 'QUIZ_COMPLETED':
      return 'Quiz tamamlandı'
    case 'FILE_UPLOADED':
      return 'Dosya yüklendi'
    case 'STREAK_ACHIEVED':
      return 'Seri başarısı!'
    default:
      return 'Aktivite'
  }
}
