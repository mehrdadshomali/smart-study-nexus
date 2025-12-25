'use client'

import { useCallback, useEffect, useState } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  MarkerType,
  BackgroundVariant,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { 
  Brain, 
  Plus, 
  Link2, 
  Trash2, 
  Save,
  FileText,
  Folder,
  Tag,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Custom node component
function NoteNode({ data }: { data: any }) {
  return (
    <div className={cn(
      'px-4 py-3 rounded-xl shadow-lg border-2 min-w-[180px] max-w-[250px]',
      'bg-slate-800 border-slate-600 hover:border-indigo-500 transition-colors'
    )}>
      <div className="flex items-start gap-2">
        <FileText className="h-4 w-4 text-indigo-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-white truncate">{data.label}</h4>
          {data.folder && (
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <Folder className="h-3 w-3" />
              {data.folder}
            </p>
          )}
          {data.tags && data.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {data.tags.slice(0, 3).map((tag: string) => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 rounded text-xs bg-indigo-600/30 text-indigo-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const nodeTypes = {
  noteNode: NoteNode,
}

// Edge styles by type
const edgeStyles = {
  MANUAL: { stroke: '#6366f1', strokeWidth: 2 },
  TAG: { stroke: '#22c55e', strokeWidth: 1.5, strokeDasharray: '5,5' },
  FOLDER: { stroke: '#f59e0b', strokeWidth: 1.5 },
  AI_SUGGESTED: { stroke: '#ec4899', strokeWidth: 1.5, strokeDasharray: '3,3' },
}

export default function MindMapPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch notes and create nodes
  useEffect(() => {
    fetchNotesForMindMap()
  }, [])

  const fetchNotesForMindMap = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/notes')
      if (res.ok) {
        const notes = await res.json()
        
        // Create nodes from notes
        const newNodes: Node[] = notes.map((note: any, index: number) => ({
          id: note.id,
          type: 'noteNode',
          position: note.positionX && note.positionY 
            ? { x: note.positionX, y: note.positionY }
            : { 
                x: 100 + (index % 4) * 300, 
                y: 100 + Math.floor(index / 4) * 200 
              },
          data: {
            label: note.title,
            folder: note.folder?.name,
            tags: note.tags?.map((t: any) => t.tag?.name) || [],
          },
        }))

        setNodes(newNodes)

        // Fetch links
        const linksRes = await fetch('/api/notes/links')
        if (linksRes.ok) {
          const links = await linksRes.json()
          
          const newEdges: Edge[] = links.map((link: any) => ({
            id: link.id,
            source: link.sourceId,
            target: link.targetId,
            label: link.label,
            type: 'smoothstep',
            animated: link.linkType === 'AI_SUGGESTED',
            style: edgeStyles[link.linkType as keyof typeof edgeStyles] || edgeStyles.MANUAL,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: edgeStyles[link.linkType as keyof typeof edgeStyles]?.stroke || '#6366f1',
            },
          }))

          setEdges(newEdges)
        }
      }
    } catch (error) {
      console.error('Failed to fetch notes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const onConnect = useCallback(
    async (params: Connection) => {
      if (!params.source || !params.target) return

      // Save link to database
      try {
        const res = await fetch('/api/notes/links', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sourceId: params.source,
            targetId: params.target,
            linkType: 'MANUAL',
          }),
        })

        if (res.ok) {
          const link = await res.json()
          
          setEdges(eds =>
            addEdge(
              {
                ...params,
                id: link.id,
                type: 'smoothstep',
                style: edgeStyles.MANUAL,
                markerEnd: {
                  type: MarkerType.ArrowClosed,
                  color: '#6366f1',
                },
              },
              eds
            )
          )
        }
      } catch (error) {
        console.error('Failed to create link:', error)
      }
    },
    [setEdges]
  )

  const onNodeDragStop = useCallback(
    async (_: any, node: Node) => {
      // Save position to database
      try {
        await fetch(`/api/notes/${node.id}/position`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            positionX: node.position.x,
            positionY: node.position.y,
          }),
        })
      } catch (error) {
        console.error('Failed to save position:', error)
      }
    },
    []
  )

  const deleteSelectedEdge = async (edgeId: string) => {
    try {
      await fetch(`/api/notes/links/${edgeId}`, {
        method: 'DELETE',
      })
      setEdges(eds => eds.filter(e => e.id !== edgeId))
    } catch (error) {
      console.error('Failed to delete link:', error)
    }
  }

  const generateAIConnections = async () => {
    try {
      const res = await fetch('/api/notes/links/suggest', {
        method: 'POST',
      })
      
      if (res.ok) {
        fetchNotesForMindMap()
      }
    } catch (error) {
      console.error('Failed to generate AI connections:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-2rem)]">
        <div className="text-center">
          <Brain className="h-12 w-12 text-indigo-400 animate-pulse mx-auto mb-4" />
          <p className="text-slate-400">Zihin haritası yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center">
            <Brain className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Zihin Haritası</h1>
            <p className="text-sm text-slate-400">
              Notlarınız arasındaki bağlantıları görselleştirin
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={generateAIConnections}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            AI Bağlantıları
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 px-4 py-2 bg-slate-800/50 rounded-lg">
        <span className="text-xs text-slate-400">Bağlantı Türleri:</span>
        <div className="flex items-center gap-1">
          <div className="w-6 h-0.5 bg-indigo-500" />
          <span className="text-xs text-slate-300">Manuel</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-0.5 bg-green-500" style={{ borderStyle: 'dashed' }} />
          <span className="text-xs text-slate-300">Etiket</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-0.5 bg-amber-500" />
          <span className="text-xs text-slate-300">Klasör</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-0.5 bg-pink-500" style={{ borderStyle: 'dashed' }} />
          <span className="text-xs text-slate-300">AI Önerisi</span>
        </div>
      </div>

      {/* Mind Map */}
      <div className="flex-1 rounded-xl overflow-hidden border border-slate-700/50">
        {nodes.length === 0 ? (
          <div className="h-full flex items-center justify-center bg-slate-800/30">
            <div className="text-center">
              <Brain className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                Henüz Not Yok
              </h3>
              <p className="text-slate-400 max-w-md">
                Zihin haritası oluşturmak için önce notlar ekleyin.
                Notlar arasında bağlantılar kurarak bilgilerinizi görselleştirin.
              </p>
            </div>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeDragStop={onNodeDragStop}
            nodeTypes={nodeTypes}
            fitView
            className="bg-slate-900"
          >
            <Controls className="bg-slate-800 border-slate-700 rounded-lg" />
            <Background 
              variant={BackgroundVariant.Dots} 
              gap={20} 
              size={1} 
              color="#334155" 
            />
          </ReactFlow>
        )}
      </div>
    </div>
  )
}
