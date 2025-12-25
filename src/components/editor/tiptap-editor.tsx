'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import { EditorToolbar } from './toolbar'

const lowlight = createLowlight(common)

interface TiptapEditorProps {
  content?: unknown
  onChange?: (content: unknown) => void
  placeholder?: string
  editable?: boolean
}

export function TiptapEditor({
  content,
  onChange,
  placeholder = 'Yazmaya başla...',
  editable = true,
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Placeholder.configure({
        placeholder,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: content as Parameters<typeof useEditor>[0]['content'],
    editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON())
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-slate max-w-none focus:outline-none min-h-[300px] px-4 py-3',
      },
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
      {editable && <EditorToolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  )
}
