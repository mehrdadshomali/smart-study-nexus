import { NextRequest, NextResponse } from 'next/server'

// GET - Tek flashcard getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cardId: string }> }
) {
  try {
    const { prisma } = await import('@/lib/prisma')
    const { cardId } = await params

    const flashcard = await prisma.flashcard.findUnique({
      where: { id: cardId },
      include: {
        folder: { select: { id: true, name: true, color: true } },
        reviews: {
          orderBy: { reviewedAt: 'desc' },
          take: 10,
        },
      },
    })

    if (!flashcard) {
      return NextResponse.json({ error: 'Flashcard bulunamadı' }, { status: 404 })
    }

    return NextResponse.json(flashcard)
  } catch (error) {
    console.error('Flashcard GET error:', error)
    return NextResponse.json({ error: 'Flashcard alınamadı' }, { status: 500 })
  }
}

// PATCH - Flashcard güncelle
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ cardId: string }> }
) {
  try {
    const { prisma } = await import('@/lib/prisma')
    const { cardId } = await params
    const body = await request.json()
    const { front, back, frontImage, backImage, folderId } = body

    const flashcard = await prisma.flashcard.update({
      where: { id: cardId },
      data: {
        ...(front && { front }),
        ...(back && { back }),
        ...(frontImage !== undefined && { frontImage }),
        ...(backImage !== undefined && { backImage }),
        ...(folderId !== undefined && { folderId }),
      },
      include: {
        folder: { select: { id: true, name: true, color: true } },
      },
    })

    return NextResponse.json(flashcard)
  } catch (error) {
    console.error('Flashcard PATCH error:', error)
    return NextResponse.json({ error: 'Flashcard güncellenemedi' }, { status: 500 })
  }
}

// DELETE - Flashcard sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ cardId: string }> }
) {
  try {
    const { prisma } = await import('@/lib/prisma')
    const { cardId } = await params

    await prisma.flashcard.delete({
      where: { id: cardId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Flashcard DELETE error:', error)
    return NextResponse.json({ error: 'Flashcard silinemedi' }, { status: 500 })
  }
}
