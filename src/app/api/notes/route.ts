import { NextRequest, NextResponse } from 'next/server'

// GET - Tüm notları getir
export async function GET(request: NextRequest) {
  try {
    const { prisma } = await import('@/lib/prisma')
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const folderId = searchParams.get('folderId')

    if (!userId) {
      return NextResponse.json({ error: 'userId gerekli' }, { status: 400 })
    }

    const notes = await prisma.note.findMany({
      where: {
        userId,
        ...(folderId && { folderId }),
      },
      include: {
        folder: { select: { id: true, name: true, color: true } },
      },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json(notes)
  } catch (error) {
    console.error('Note GET error:', error)
    return NextResponse.json({ error: 'Notlar alınamadı' }, { status: 500 })
  }
}

// POST - Yeni not oluştur
export async function POST(request: NextRequest) {
  try {
    const { prisma } = await import('@/lib/prisma')
    const body = await request.json()
    const { title, content, folderId, userId } = body

    if (!title || !userId) {
      return NextResponse.json({ error: 'title ve userId gerekli' }, { status: 400 })
    }

    const note = await prisma.note.create({
      data: {
        title,
        content: content || { type: 'doc', content: [] },
        folderId: folderId || null,
        userId,
      },
      include: {
        folder: { select: { id: true, name: true, color: true } },
      },
    })

    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    console.error('Note POST error:', error)
    return NextResponse.json({ error: 'Not oluşturulamadı' }, { status: 500 })
  }
}
