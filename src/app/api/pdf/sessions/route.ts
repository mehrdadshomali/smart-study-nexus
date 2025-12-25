import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/pdf/sessions - Get chat sessions for a file
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get('fileId')

    if (!fileId) {
      return NextResponse.json(
        { error: 'fileId gerekli' },
        { status: 400 }
      )
    }

    const sessions = await prisma.chatSession.findMany({
      where: { fileId },
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: {
          select: { messages: true },
        },
      },
    })

    return NextResponse.json(sessions)
  } catch (error) {
    console.error('Get sessions error:', error)
    return NextResponse.json(
      { error: 'Oturumlar alınırken hata oluştu' },
      { status: 500 }
    )
  }
}
