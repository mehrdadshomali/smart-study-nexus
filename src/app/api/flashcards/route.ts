import { NextRequest, NextResponse } from 'next/server'

// GET - Tüm flashcard'ları getir
export async function GET(request: NextRequest) {
  try {
    const { prisma } = await import('@/lib/prisma')
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const folderId = searchParams.get('folderId')
    const dueOnly = searchParams.get('dueOnly') === 'true'

    if (!userId) {
      return NextResponse.json({ error: 'userId gerekli' }, { status: 400 })
    }

    const where: any = { userId }
    
    if (folderId) {
      where.folderId = folderId
    }

    if (dueOnly) {
      where.nextReviewDate = {
        lte: new Date(),
      }
    }

    const flashcards = await prisma.flashcard.findMany({
      where,
      include: {
        folder: { select: { id: true, name: true, color: true } },
        _count: { select: { reviews: true } },
      },
      orderBy: dueOnly 
        ? { nextReviewDate: 'asc' }
        : { createdAt: 'desc' },
    })

    return NextResponse.json(flashcards)
  } catch (error) {
    console.error('Flashcard GET error:', error)
    return NextResponse.json({ error: 'Flashcard\'lar alınamadı' }, { status: 500 })
  }
}

// POST - Yeni flashcard oluştur
export async function POST(request: NextRequest) {
  try {
    const { prisma } = await import('@/lib/prisma')
    const body = await request.json()
    const { front, back, frontImage, backImage, folderId, userId } = body

    if (!front || !back || !userId) {
      return NextResponse.json(
        { error: 'front, back ve userId gerekli' },
        { status: 400 }
      )
    }

    const flashcard = await prisma.flashcard.create({
      data: {
        front,
        back,
        frontImage,
        backImage,
        folderId: folderId || null,
        userId,
        // SM-2 defaults
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0,
        nextReviewDate: new Date(),
      },
      include: {
        folder: { select: { id: true, name: true, color: true } },
      },
    })

    return NextResponse.json(flashcard, { status: 201 })
  } catch (error) {
    console.error('Flashcard POST error:', error)
    return NextResponse.json({ error: 'Flashcard oluşturulamadı' }, { status: 500 })
  }
}
