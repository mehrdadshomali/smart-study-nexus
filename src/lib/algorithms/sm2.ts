/**
 * SM-2 Spaced Repetition Algorithm
 * 
 * Quality ratings:
 * 0 - Complete blackout, no recall
 * 1 - Incorrect, but upon seeing correct answer, remembered
 * 2 - Incorrect, but correct answer seemed easy to recall
 * 3 - Correct with serious difficulty
 * 4 - Correct with some hesitation
 * 5 - Perfect response, instant recall
 */

export interface SM2Input {
  quality: number        // 0-5 rating
  easeFactor: number     // Current ease factor (default 2.5)
  interval: number       // Current interval in days
  repetitions: number    // Number of successful reviews
}

export interface SM2Result {
  easeFactor: number
  interval: number
  repetitions: number
  nextReviewDate: Date
}

/**
 * Calculate next review parameters using SM-2 algorithm
 * 
 * Property: For any quality >= 3, interval should increase
 * Property: easeFactor should never go below 1.3
 * Property: nextReviewDate should always be >= today
 */
export function calculateSM2(input: SM2Input): SM2Result {
  const { quality, easeFactor: currentEF, interval: currentInterval, repetitions: currentReps } = input
  
  // Validate quality rating
  const q = Math.max(0, Math.min(5, Math.round(quality)))
  
  let newEF = currentEF
  let newInterval: number
  let newReps: number
  
  if (q < 3) {
    // Failed recall - reset to beginning
    newInterval = 1
    newReps = 0
    // EF stays the same on failure
  } else {
    // Successful recall
    newReps = currentReps + 1
    
    // Calculate new ease factor
    // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    newEF = currentEF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    
    // EF should never go below 1.3
    newEF = Math.max(1.3, newEF)
    
    // Calculate new interval
    if (newReps === 1) {
      newInterval = 1
    } else if (newReps === 2) {
      newInterval = 6
    } else {
      newInterval = Math.round(currentInterval * newEF)
    }
  }
  
  // Calculate next review date
  const nextReviewDate = new Date()
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval)
  nextReviewDate.setHours(0, 0, 0, 0) // Start of day
  
  return {
    easeFactor: Math.round(newEF * 100) / 100, // Round to 2 decimal places
    interval: newInterval,
    repetitions: newReps,
    nextReviewDate,
  }
}

/**
 * Get cards due for review
 */
export function isDueForReview(nextReviewDate: Date): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return nextReviewDate <= today
}

/**
 * Calculate mastery level based on SM-2 parameters
 * Returns a value between 0-100
 */
export function calculateMasteryLevel(easeFactor: number, repetitions: number, interval: number): number {
  // Weight factors
  const efWeight = 0.3
  const repWeight = 0.3
  const intervalWeight = 0.4
  
  // Normalize ease factor (1.3 - 3.0 range to 0-100)
  const efScore = Math.min(100, ((easeFactor - 1.3) / 1.7) * 100)
  
  // Normalize repetitions (0-10+ to 0-100)
  const repScore = Math.min(100, (repetitions / 10) * 100)
  
  // Normalize interval (0-90+ days to 0-100)
  const intervalScore = Math.min(100, (interval / 90) * 100)
  
  return Math.round(efScore * efWeight + repScore * repWeight + intervalScore * intervalWeight)
}

/**
 * Get quality rating description
 */
export function getQualityDescription(quality: number): string {
  switch (quality) {
    case 0: return 'Hiç hatırlamadım'
    case 1: return 'Yanlış, ama cevabı görünce hatırladım'
    case 2: return 'Yanlış, ama kolay görünüyordu'
    case 3: return 'Doğru, ama zorlandım'
    case 4: return 'Doğru, biraz düşündüm'
    case 5: return 'Mükemmel, anında hatırladım'
    default: return ''
  }
}
