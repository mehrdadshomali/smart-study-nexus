import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/analytics/stats - Get overall stats
export async function GET() {
  try {
    // Get counts
    const [totalNotes, totalQuestions, totalFlashcards] = await Promise.all([
      prisma.note.count(),
      prisma.question.count(),
      prisma.flashcard.count(),
    ])

    // Get quiz attempts for accuracy
    const quizAttempts = await prisma.quizAttempt.aggregate({
      _sum: {
        correctAnswers: true,
        totalQuestions: true,
      },
    })

    // Get study stats for this week
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    const weeklyStats = await prisma.studyStats.aggregate({
      where: {
        date: { gte: weekAgo },
      },
      _sum: {
        studyMinutes: true,
      },
      _max: {
        currentStreak: true,
      },
    })

    // Calculate longest streak from all study stats
    const longestStreak = await prisma.studyStats.aggregate({
      _max: {
        currentStreak: true,
      },
    })

    // Get current streak (from most recent study stat)
    const latestStat = await prisma.studyStats.findFirst({
      orderBy: { date: 'desc' },
      select: { currentStreak: true },
    })

    return NextResponse.json({
      totalNotes,
      totalQuestions,
      totalFlashcards,
      studyMinutes: weeklyStats._sum.studyMinutes || 0,
      correctAnswers: quizAttempts._sum.correctAnswers || 0,
      totalAnswers: quizAttempts._sum.totalQuestions || 0,
      currentStreak: latestStat?.currentStreak || 0,
      longestStreak: longestStreak._max.currentStreak || 0,
    })
  } catch (error) {
    console.error('Get stats error:', error)
    return NextResponse.json(
      { error: 'İstatistikler alınırken hata oluştu' },
      { status: 500 }
    )
  }
}
