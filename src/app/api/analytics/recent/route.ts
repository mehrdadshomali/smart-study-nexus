import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/analytics/recent - Get recent activities
export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        type: true,
        metadata: true,
        createdAt: true,
      },
    })

    return NextResponse.json(activities)
  } catch (error) {
    console.error('Get recent activities error:', error)
    return NextResponse.json(
      { error: 'Son aktiviteler alınırken hata oluştu' },
      { status: 500 }
    )
  }
}
