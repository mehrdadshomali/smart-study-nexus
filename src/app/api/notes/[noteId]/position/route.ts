import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH /api/notes/[noteId]/position - Update note position for mind map
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ noteId: string }> }
) {
  try {
    const { noteId } = await params
    const { positionX, positionY } = await request.json()

    const note = await prisma.note.update({
      where: { id: noteId },
      data: {
        positionX,
        positionY,
      },
    })

    return NextResponse.json(note)
  } catch (error) {
    console.error('Update position error:', error)
    return NextResponse.json(
      { error: 'Pozisyon güncellenirken hata oluştu' },
      { status: 500 }
    )
  }
}
