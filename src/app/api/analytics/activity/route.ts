import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/analytics/activity - Get activity data for heatmap
export async function GET() {
  try {
    // Get activities from last 365 days
    const yearAgo = new Date()
    yearAgo.setDate(yearAgo.getDate() - 365)

    const activities = await prisma.activity.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: { gte: yearAgo },
      },
      _count: true,
    })

    // Group by date
    const activityMap = new Map<string, number>()

    activities.forEach(activity => {
      const date = new Date(activity.createdAt).toISOString().split('T')[0]
      activityMap.set(date, (activityMap.get(date) || 0) + activity._count)
    })

    // Also include study stats
    const studyStats = await prisma.studyStats.findMany({
      where: {
        date: { gte: yearAgo },
      },
      select: {
        date: true,
        notesCreated: true,
        questionsAnswered: true,
        flashcardsReviewed: true,
      },
    })

    studyStats.forEach(stat => {
      const date = new Date(stat.date).toISOString().split('T')[0]
      const count = stat.notesCreated + stat.questionsAnswered + stat.flashcardsReviewed
      activityMap.set(date, (activityMap.get(date) || 0) + count)
    })

    // Convert to array
    const result = Array.from(activityMap.entries()).map(([date, count]) => ({
      date,
      count,
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error('Get activity error:', error)
    return NextResponse.json(
      { error: 'Aktivite verileri alınırken hata oluştu' },
      { status: 500 }
    )
  }
}
