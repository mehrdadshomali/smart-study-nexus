'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface ActivityData {
  date: string
  count: number
}

interface ActivityHeatmapProps {
  data: ActivityData[]
  className?: string
}

// Generate last 365 days
function generateDateRange(): string[] {
  const dates: string[] = []
  const today = new Date()
  
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    dates.push(date.toISOString().split('T')[0])
  }
  
  return dates
}

// Get intensity level (0-4) based on count
function getIntensityLevel(count: number): number {
  if (count === 0) return 0
  if (count <= 2) return 1
  if (count <= 5) return 2
  if (count <= 10) return 3
  return 4
}

// Intensity colors
const intensityColors = [
  'bg-slate-800', // 0 - no activity
  'bg-green-900', // 1 - low
  'bg-green-700', // 2 - medium-low
  'bg-green-500', // 3 - medium-high
  'bg-green-400', // 4 - high
]

const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']
const days = ['Pzt', '', 'Çar', '', 'Cum', '', 'Paz']

export function ActivityHeatmap({ data, className }: ActivityHeatmapProps) {
  const dateRange = useMemo(() => generateDateRange(), [])
  
  const activityMap = useMemo(() => {
    const map = new Map<string, number>()
    data.forEach(item => {
      map.set(item.date, item.count)
    })
    return map
  }, [data])

  // Group dates by week
  const weeks = useMemo(() => {
    const result: string[][] = []
    let currentWeek: string[] = []
    
    // Find the first day's weekday (0 = Sunday, 1 = Monday, etc.)
    const firstDate = new Date(dateRange[0])
    const firstDayOfWeek = firstDate.getDay()
    
    // Add empty cells for days before the first date
    for (let i = 0; i < (firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1); i++) {
      currentWeek.push('')
    }
    
    dateRange.forEach(date => {
      currentWeek.push(date)
      
      const dayOfWeek = new Date(date).getDay()
      if (dayOfWeek === 0) { // Sunday
        result.push(currentWeek)
        currentWeek = []
      }
    })
    
    // Add remaining days
    if (currentWeek.length > 0) {
      result.push(currentWeek)
    }
    
    return result
  }, [dateRange])

  // Get month labels with positions
  const monthLabels = useMemo(() => {
    const labels: { month: string; position: number }[] = []
    let currentMonth = -1
    
    weeks.forEach((week, weekIndex) => {
      const firstValidDate = week.find(d => d !== '')
      if (firstValidDate) {
        const month = new Date(firstValidDate).getMonth()
        if (month !== currentMonth) {
          currentMonth = month
          labels.push({ month: months[month], position: weekIndex })
        }
      }
    })
    
    return labels
  }, [weeks])

  // Calculate stats
  const stats = useMemo(() => {
    const totalActivities = data.reduce((sum, d) => sum + d.count, 0)
    const activeDays = data.filter(d => d.count > 0).length
    const maxStreak = calculateMaxStreak(data)
    const currentStreak = calculateCurrentStreak(data)
    
    return { totalActivities, activeDays, maxStreak, currentStreak }
  }, [data])

  return (
    <div className={cn('', className)}>
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800/50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-white">{stats.totalActivities}</p>
          <p className="text-xs text-slate-400">Toplam Aktivite</p>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-white">{stats.activeDays}</p>
          <p className="text-xs text-slate-400">Aktif Gün</p>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-green-400">{stats.currentStreak}</p>
          <p className="text-xs text-slate-400">Mevcut Seri</p>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-amber-400">{stats.maxStreak}</p>
          <p className="text-xs text-slate-400">En Uzun Seri</p>
        </div>
      </div>

      {/* Heatmap */}
      <div className="overflow-x-auto">
        <div className="inline-block">
          {/* Month labels */}
          <div className="flex mb-1 ml-8">
            {monthLabels.map((label, i) => (
              <div
                key={i}
                className="text-xs text-slate-400"
                style={{ 
                  position: 'relative',
                  left: `${label.position * 14}px`,
                  marginRight: i < monthLabels.length - 1 
                    ? `${(monthLabels[i + 1].position - label.position) * 14 - 30}px` 
                    : 0
                }}
              >
                {label.month}
              </div>
            ))}
          </div>

          <div className="flex">
            {/* Day labels */}
            <div className="flex flex-col mr-2 mt-1">
              {days.map((day, i) => (
                <div key={i} className="h-3 text-xs text-slate-400 leading-3">
                  {day}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="flex gap-[2px]">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[2px]">
                  {week.map((date, dayIndex) => {
                    if (!date) {
                      return <div key={dayIndex} className="w-3 h-3" />
                    }
                    
                    const count = activityMap.get(date) || 0
                    const level = getIntensityLevel(count)
                    
                    return (
                      <div
                        key={date}
                        className={cn(
                          'w-3 h-3 rounded-sm cursor-pointer transition-colors',
                          intensityColors[level],
                          'hover:ring-1 hover:ring-white/50'
                        )}
                        title={`${date}: ${count} aktivite`}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-1 mt-3">
            <span className="text-xs text-slate-400 mr-2">Az</span>
            {intensityColors.map((color, i) => (
              <div
                key={i}
                className={cn('w-3 h-3 rounded-sm', color)}
              />
            ))}
            <span className="text-xs text-slate-400 ml-2">Çok</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper functions
function calculateMaxStreak(data: ActivityData[]): number {
  const sortedDates = data
    .filter(d => d.count > 0)
    .map(d => d.date)
    .sort()

  if (sortedDates.length === 0) return 0

  let maxStreak = 1
  let currentStreak = 1

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1])
    const currDate = new Date(sortedDates[i])
    const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      currentStreak++
      maxStreak = Math.max(maxStreak, currentStreak)
    } else {
      currentStreak = 1
    }
  }

  return maxStreak
}

function calculateCurrentStreak(data: ActivityData[]): number {
  const today = new Date().toISOString().split('T')[0]
  const sortedDates = data
    .filter(d => d.count > 0)
    .map(d => d.date)
    .sort()
    .reverse()

  if (sortedDates.length === 0) return 0

  // Check if today or yesterday has activity
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  if (sortedDates[0] !== today && sortedDates[0] !== yesterdayStr) {
    return 0
  }

  let streak = 1
  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1])
    const currDate = new Date(sortedDates[i])
    const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      streak++
    } else {
      break
    }
  }

  return streak
}
