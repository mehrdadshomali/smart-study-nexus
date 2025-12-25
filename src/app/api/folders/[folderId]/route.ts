import { NextRequest, NextResponse } from 'next/server'

// GET - Tek klasör getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ folderId: string }> }
) {
  try {
    const { prisma } = await import('@/lib/prisma')
    const { folderId } = await params

    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
      include: {
        children: true,
        notes: { orderBy: { updatedAt: 'desc' } },
        _count: { select: { notes: true, questions: true } },
      },
    })

    if (!folder) {
      return NextResponse.json({ error: 'Klasör bulunamadı' }, { status: 404 })
    }

    return NextResponse.json(folder)
  } catch (error) {
    console.error('Folder GET error:', error)
    return NextResponse.json({ error: 'Klasör alınamadı' }, { status: 500 })
  }
}

// PATCH - Klasör güncelle
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ folderId: string }> }
) {
  try {
    const { prisma } = await import('@/lib/prisma')
    const { folderId } = await params
    const body = await request.json()
    const { name, color, parentId } = body

    const folder = await prisma.folder.update({
      where: { id: folderId },
      data: {
        ...(name && { name }),
        ...(color && { color }),
        ...(parentId !== undefined && { parentId }),
      },
      include: {
        _count: { select: { notes: true, questions: true } },
      },
    })

    return NextResponse.json(folder)
  } catch (error) {
    console.error('Folder PATCH error:', error)
    return NextResponse.json({ error: 'Klasör güncellenemedi' }, { status: 500 })
  }
}

// DELETE - Klasör sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ folderId: string }> }
) {
  try {
    const { prisma } = await import('@/lib/prisma')
    const { folderId } = await params

    await prisma.folder.delete({
      where: { id: folderId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Folder DELETE error:', error)
    return NextResponse.json({ error: 'Klasör silinemedi' }, { status: 500 })
  }
}
