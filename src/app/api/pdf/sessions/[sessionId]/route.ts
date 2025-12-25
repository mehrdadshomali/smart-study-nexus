import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/pdf/sessions/[sessionId] - Get session with messages
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params

    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
        file: {
          select: {
            id: true,
            name: true,
            pageCount: true,
          },
        },
      },
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Oturum bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json(session)
  } catch (error) {
    console.error('Get session error:', error)
    return NextResponse.json(
      { error: 'Oturum alınırken hata oluştu' },
      { status: 500 }
    )
  }
}

// DELETE /api/pdf/sessions/[sessionId] - Delete session
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params

    await prisma.chatSession.delete({
      where: { id: sessionId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete session error:', error)
    return NextResponse.json(
      { error: 'Oturum silinirken hata oluştu' },
      { status: 500 }
    )
  }
}
