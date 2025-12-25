'use client'

import type { Editor } from '@tiptap/react'
import {
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  CodeIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  HighlighterIcon,
  Undo2Icon,
  Redo2Icon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ToolbarButtonProps {
  onClick: () => void
  isActive?: boolean
  disabled?: boolean
  children: React.ReactNode
  title?: string
}

function ToolbarButton({ onClick, isActive, disabled, children, title }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'p-2 rounded hover:bg-slate-100 transition-colors',
        isActive && 'bg-slate-200 text-indigo-600',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {children}
    </button>
  )
}

interface EditorToolbarProps {
  editor: Editor
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const highlightColors = [
    { color: '#fef08a', name: 'Sarı' },
    { color: '#bbf7d0', name: 'Yeşil' },
    { color: '#bfdbfe', name: 'Mavi' },
    { color: '#fecaca', name: 'Kırmızı' },
    { color: '#e9d5ff', name: 'Mor' },
  ]

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 bg-slate-50">
      {/* Undo/Redo */}
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Geri Al"
      >
        <Undo2Icon className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="İleri Al"
      >
        <Redo2Icon className="h-4 w-4" />
      </ToolbarButton>

      <div className="w-px h-6 bg-slate-300 mx-1" />

      {/* Headings */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive('heading', { level: 1 })}
        title="Başlık 1"
      >
        <Heading1Icon className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        title="Başlık 2"
      >
        <Heading2Icon className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
        title="Başlık 3"
      >
        <Heading3Icon className="h-4 w-4" />
      </ToolbarButton>

      <div className="w-px h-6 bg-slate-300 mx-1" />

      {/* Text formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        title="Kalın"
      >
        <BoldIcon className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title="İtalik"
      >
        <ItalicIcon className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        title="Üstü Çizili"
      >
        <StrikethroughIcon className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
        title="Kod"
      >
        <CodeIcon className="h-4 w-4" />
      </ToolbarButton>

      <div className="w-px h-6 bg-slate-300 mx-1" />

      {/* Highlight */}
      <div className="relative group">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive('highlight')}
          title="Vurgula"
        >
          <HighlighterIcon className="h-4 w-4" />
        </ToolbarButton>
        <div className="absolute top-full left-0 mt-1 hidden group-hover:flex gap-1 p-2 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
          {highlightColors.map((item) => (
            <button
              key={item.color}
              onClick={() =>
                editor.chain().focus().toggleHighlight({ color: item.color }).run()
              }
              className="w-6 h-6 rounded border border-slate-200 hover:scale-110 transition-transform"
              style={{ backgroundColor: item.color }}
              title={item.name}
            />
          ))}
        </div>
      </div>

      <div className="w-px h-6 bg-slate-300 mx-1" />

      {/* Lists */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        title="Madde İşareti"
      >
        <ListIcon className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        title="Numaralı Liste"
      >
        <ListOrderedIcon className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        title="Alıntı"
      >
        <QuoteIcon className="h-4 w-4" />
      </ToolbarButton>

      <div className="w-px h-6 bg-slate-300 mx-1" />

      {/* Code Block */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive('codeBlock')}
        title="Kod Bloğu"
      >
        <span className="text-xs font-mono">{'{}'}</span>
      </ToolbarButton>
    </div>
  )
}
