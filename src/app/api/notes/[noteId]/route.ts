import { NextRequest, NextResponse } from 'next/server'

// GET - Tek not getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ noteId: string }> }
) {
  try {
    const { prisma } = await import('@/lib/prisma')
    const { noteId } = await params

    const note = await prisma.note.findUnique({
      where: { id: noteId },
      include: {
        folder: { select: { id: true, name: true, color: true } },
        questions: true,
      },
    })

    if (!note) {
      return NextResponse.json({ error: 'Not bulunamadı' }, { status: 404 })
    }

    return NextResponse.json(note)
  } catch (error) {
    console.error('Note GET error:', error)
    return NextResponse.json({ error: 'Not alınamadı' }, { status: 500 })
  }
}

// PATCH - Not güncelle
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ noteId: string }> }
) {
  try {
    const { prisma } = await import('@/lib/prisma')
    const { noteId } = await params
    const body = await request.json()
    const { title, content, folderId, summary } = body

    const note = await prisma.note.update({
      where: { id: noteId },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(folderId !== undefined && { folderId }),
        ...(summary && { summary }),
      },
      include: {
        folder: { select: { id: true, name: true, color: true } },
      },
    })

    return NextResponse.json(note)
  } catch (error) {
    console.error('Note PATCH error:', error)
    return NextResponse.json({ error: 'Not güncellenemedi' }, { status: 500 })
  }
}

// DELETE - Not sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ noteId: string }> }
) {
  try {
    const { prisma } = await import('@/lib/prisma')
    const { noteId } = await params

    await prisma.note.delete({
      where: { id: noteId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Note DELETE error:', error)
    return NextResponse.json({ error: 'Not silinemedi' }, { status: 500 })
  }
}
