import { NextRequest, NextResponse } from 'next/server'
import { calculateSM2 } from '@/lib/algorithms/sm2'

// POST - Flashcard review (SM-2 algorithm)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ cardId: string }> }
) {
  try {
    const { prisma } = await import('@/lib/prisma')
    const { cardId } = await params
    const body = await request.json()
    const { quality } = body // 0-5 rating

    if (quality === undefined || quality < 0 || quality > 5) {
      return NextResponse.json(
        { error: 'quality 0-5 arasında olmalı' },
        { status: 400 }
      )
    }

    // Get current flashcard
    const flashcard = await prisma.flashcard.findUnique({
      where: { id: cardId },
    })

    if (!flashcard) {
      return NextResponse.json({ error: 'Flashcard bulunamadı' }, { status: 404 })
    }

    // Calculate new SM-2 values
    const sm2Result = calculateSM2({
      quality,
      easeFactor: flashcard.easeFactor,
      interval: flashcard.interval,
      repetitions: flashcard.repetitions,
    })

    // Update flashcard with new values
    const updatedFlashcard = await prisma.flashcard.update({
      where: { id: cardId },
      data: {
        easeFactor: sm2Result.easeFactor,
        interval: sm2Result.interval,
        repetitions: sm2Result.repetitions,
        nextReviewDate: sm2Result.nextReviewDate,
        lastReviewDate: new Date(),
      },
      include: {
        folder: { select: { id: true, name: true, color: true } },
      },
    })

    // Record review history
    await prisma.flashcardReview.create({
      data: {
        flashcardId: cardId,
        quality,
      },
    })

    // Update study stats
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    await prisma.studyStats.upsert({
      where: {
        userId_date: {
          userId: flashcard.userId,
          date: today,
        },
      },
      update: {
        flashcardsReviewed: { increment: 1 },
      },
      create: {
        userId: flashcard.userId,
        date: today,
        flashcardsReviewed: 1,
      },
    })

    // Record activity
    await prisma.activity.create({
      data: {
        userId: flashcard.userId,
        type: 'FLASHCARD_REVIEWED',
        metadata: {
          flashcardId: cardId,
          quality,
          newInterval: sm2Result.interval,
        },
      },
    })

    return NextResponse.json({
      flashcard: updatedFlashcard,
      sm2Result,
    })
  } catch (error) {
    console.error('Flashcard review error:', error)
    return NextResponse.json({ error: 'Review kaydedilemedi' }, { status: 500 })
  }
}
