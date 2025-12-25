import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// DELETE /api/notes/links/[linkId] - Delete a link
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ linkId: string }> }
) {
  try {
    const { linkId } = await params

    await prisma.noteLink.delete({
      where: { id: linkId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete link error:', error)
    return NextResponse.json(
      { error: 'Bağlantı silinirken hata oluştu' },
      { status: 500 }
    )
  }
}
