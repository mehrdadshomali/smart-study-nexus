'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  FileText, 
  Send, 
  Upload, 
  Loader2, 
  MessageSquare,
  BookOpen,
  Sparkles,
  ChevronRight,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: Array<{
    pageNumber: number | null
    excerpt: string
  }>
}

interface PDFFile {
  id: string
  name: string
  pageCount: number | null
  isProcessed: boolean
}

export default function PDFChatPage() {
  const [files, setFiles] = useState<PDFFile[]>([])
  const [selectedFile, setSelectedFile] = useState<PDFFile | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch PDF files
  useEffect(() => {
    fetchPDFFiles()
  }, [])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchPDFFiles = async () => {
    try {
      const res = await fetch('/api/files?type=PDF')
      if (res.ok) {
        const data = await res.json()
        setFiles(data)
      }
    } catch (error) {
      console.error('Failed to fetch files:', error)
    }
  }

  const handleSelectFile = async (file: PDFFile) => {
    setSelectedFile(file)
    setMessages([])
    setSessionId(null)

    if (!file.isProcessed) {
      setIsProcessing(true)
      try {
        const res = await fetch('/api/pdf/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileId: file.id }),
        })

        if (res.ok) {
          const result = await res.json()
          setSelectedFile({ ...file, isProcessed: true, pageCount: result.pageCount })
          fetchPDFFiles()
        }
      } catch (error) {
        console.error('Failed to process PDF:', error)
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const handleSend = async () => {
    if (!input.trim() || !selectedFile || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/pdf/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileId: selectedFile.id,
          sessionId,
          question: input,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setSessionId(data.sessionId)

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.answer,
          sources: data.sources,
        }

        setMessages(prev => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-[calc(100vh-2rem)] gap-6">
      {/* Sidebar - PDF List */}
      <div className="w-80 bg-slate-800/50 rounded-xl border border-slate-700/50 flex flex-col">
        <div className="p-4 border-b border-slate-700/50">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-400" />
            PDF Dosyaları
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {files.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Upload className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Henüz PDF yok</p>
              <p className="text-xs mt-1">Dosyalar sayfasından PDF yükleyin</p>
            </div>
          ) : (
            files.map(file => (
              <button
                key={file.id}
                onClick={() => handleSelectFile(file)}
                className={cn(
                  'w-full p-3 rounded-lg text-left transition-all',
                  'hover:bg-slate-700/50',
                  selectedFile?.id === file.id
                    ? 'bg-indigo-600/20 border border-indigo-500/50'
                    : 'bg-slate-700/30 border border-transparent'
                )}
              >
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {file.isProcessed ? (
                        <span className="text-green-400">
                          ✓ İşlendi {file.pageCount && `• ${file.pageCount} sayfa`}
                        </span>
                      ) : (
                        <span className="text-amber-400">İşlenmedi</span>
                      )}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-slate-800/50 rounded-xl border border-slate-700/50 flex flex-col">
        {!selectedFile ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-indigo-600/20 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-10 w-10 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                PDF ile Sohbet
              </h3>
              <p className="text-slate-400 max-w-md">
                Sol taraftan bir PDF seçin ve doküman hakkında sorular sorun.
                AI, PDF içeriğini analiz ederek yanıt verecek.
              </p>
            </div>
          </div>
        ) : isProcessing ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-12 w-12 text-indigo-400 animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                PDF İşleniyor...
              </h3>
              <p className="text-slate-400">
                Metin çıkarılıyor ve embedding oluşturuluyor
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white">{selectedFile.name}</h3>
                  <p className="text-xs text-slate-400">
                    {selectedFile.pageCount} sayfa
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSelectedFile(null)
                  setMessages([])
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <Sparkles className="h-10 w-10 text-indigo-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-white mb-2">
                    Soru Sormaya Başlayın
                  </h4>
                  <p className="text-slate-400 text-sm max-w-md mx-auto">
                    Bu PDF hakkında herhangi bir soru sorabilirsiniz.
                    AI, doküman içeriğini analiz ederek yanıt verecek.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2 justify-center">
                    {[
                      'Bu doküman ne hakkında?',
                      'Ana konuları özetle',
                      'Önemli noktalar neler?',
                    ].map(suggestion => (
                      <button
                        key={suggestion}
                        onClick={() => setInput(suggestion)}
                        className="px-3 py-1.5 rounded-full bg-slate-700/50 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map(message => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex gap-3',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="h-4 w-4 text-indigo-400" />
                      </div>
                    )}
                    <div
                      className={cn(
                        'max-w-[70%] rounded-xl px-4 py-3',
                        message.role === 'user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-700/50 text-slate-100'
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      
                      {/* Sources */}
                      {message.sources && message.sources.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-600/50">
                          <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            Kaynaklar
                          </p>
                          <div className="space-y-2">
                            {message.sources.map((source, i) => (
                              <div
                                key={i}
                                className="text-xs bg-slate-800/50 rounded-lg p-2"
                              >
                                {source.pageNumber && (
                                  <span className="text-indigo-400 font-medium">
                                    Sayfa {source.pageNumber}:
                                  </span>
                                )}{' '}
                                <span className="text-slate-400">
                                  {source.excerpt}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-lg bg-slate-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-white">S</span>
                      </div>
                    )}
                  </div>
                ))
              )}
              
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div className="bg-slate-700/50 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
                      <span className="text-sm text-slate-400">Düşünüyor...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-700/50">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="PDF hakkında bir soru sorun..."
                  className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 px-6"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
