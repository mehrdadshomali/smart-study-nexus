/**
 * Streak Calculation Algorithm
 * 
 * Calculates consecutive days of study activity
 */

export interface ActivityDay {
  date: Date
  hasActivity: boolean
}

export interface StreakResult {
  currentStreak: number
  longestStreak: number
  lastActivityDate: Date | null
  isActiveToday: boolean
}

/**
 * Calculate streak from activity dates
 * 
 * Property: Streak count equals consecutive days with activity from today
 * Property: Missing a day resets streak to 0
 */
export function calculateStreak(activityDates: Date[]): StreakResult {
  if (activityDates.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      isActiveToday: false,
    }
  }

  // Normalize dates to start of day and sort descending
  const normalizedDates = activityDates
    .map(d => {
      const date = new Date(d)
      date.setHours(0, 0, 0, 0)
      return date.getTime()
    })
    .filter((v, i, a) => a.indexOf(v) === i) // Remove duplicates
    .sort((a, b) => b - a) // Sort descending (most recent first)

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayTime = today.getTime()

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayTime = yesterday.getTime()

  // Check if active today
  const isActiveToday = normalizedDates[0] === todayTime

  // Calculate current streak
  let currentStreak = 0
  let checkDate = isActiveToday ? todayTime : yesterdayTime

  // If not active today and not active yesterday, streak is 0
  if (!isActiveToday && normalizedDates[0] !== yesterdayTime) {
    return {
      currentStreak: 0,
      longestStreak: calculateLongestStreak(normalizedDates),
      lastActivityDate: new Date(normalizedDates[0]),
      isActiveToday: false,
    }
  }

  // Count consecutive days
  for (const dateTime of normalizedDates) {
    if (dateTime === checkDate) {
      currentStreak++
      checkDate -= 24 * 60 * 60 * 1000 // Go back one day
    } else if (dateTime < checkDate) {
      break // Gap found, streak ends
    }
  }

  return {
    currentStreak,
    longestStreak: calculateLongestStreak(normalizedDates),
    lastActivityDate: new Date(normalizedDates[0]),
    isActiveToday,
  }
}

/**
 * Calculate longest streak ever achieved
 */
function calculateLongestStreak(sortedDates: number[]): number {
  if (sortedDates.length === 0) return 0
  if (sortedDates.length === 1) return 1

  let longestStreak = 1
  let currentStreak = 1
  const oneDay = 24 * 60 * 60 * 1000

  // Dates are sorted descending, so we iterate backwards
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const diff = sortedDates[i] - sortedDates[i + 1]
    
    if (diff === oneDay) {
      currentStreak++
      longestStreak = Math.max(longestStreak, currentStreak)
    } else {
      currentStreak = 1
    }
  }

  return longestStreak
}

/**
 * Generate heatmap data for the past year
 */
export interface HeatmapDay {
  date: string // YYYY-MM-DD
  count: number
  level: 0 | 1 | 2 | 3 | 4 // Activity intensity level
}

export function generateHeatmapData(
  activities: { date: Date; count: number }[],
  year: number = new Date().getFullYear()
): HeatmapDay[] {
  // Create a map of date -> count
  const activityMap = new Map<string, number>()
  
  activities.forEach(({ date, count }) => {
    const dateStr = date.toISOString().split('T')[0]
    activityMap.set(dateStr, (activityMap.get(dateStr) || 0) + count)
  })

  // Generate all days of the year
  const startDate = new Date(year, 0, 1)
  const endDate = new Date(year, 11, 31)
  const heatmapData: HeatmapDay[] = []

  const currentDate = new Date(startDate)
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0]
    const count = activityMap.get(dateStr) || 0
    
    heatmapData.push({
      date: dateStr,
      count,
      level: getActivityLevel(count),
    })

    currentDate.setDate(currentDate.getDate() + 1)
  }

  return heatmapData
}

/**
 * Get activity level (0-4) based on count
 */
function getActivityLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0
  if (count <= 2) return 1
  if (count <= 5) return 2
  if (count <= 10) return 3
  return 4
}

/**
 * Check if streak is at risk (no activity today)
 */
export function isStreakAtRisk(lastActivityDate: Date | null): boolean {
  if (!lastActivityDate) return false
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const lastActivity = new Date(lastActivityDate)
  lastActivity.setHours(0, 0, 0, 0)
  
  return lastActivity.getTime() < today.getTime()
}
