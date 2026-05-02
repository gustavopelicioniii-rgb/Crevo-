'use client'

import { useState, useRef, useEffect } from 'react'
import { Stage, Layer, Rect, Text, Image as KonvaImage, Circle, Line, Transformer } from 'react-konva'
import type { KonvaEventObject } from 'konva/lib/Node'
import { toast } from 'sonner'
import {
  Type,
  Image,
  Square,
  Circle as CircleIcon,
  Triangle,
  Minus,
  Undo,
  Redo,
  Trash2,
  Download,
  Layers,
  Settings2,
  MousePointer,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export interface CanvasElement {
  id: string
  type: 'rect' | 'circle' | 'triangle' | 'line' | 'text' | 'image'
  x: number
  y: number
  width?: number
  height?: number
  radius?: number
  fill: string
  stroke?: string
  strokeWidth?: number
  opacity: number
  rotation: number
  scaleX: number
  scaleY: number
  text?: string
  fontSize?: number
  fontFamily?: string
  src?: string
  points?: number[]
}

interface CanvasEditorProps {
  projectId: string
  initialData?: any
  onSave?: (data: any) => void
}

const CANVAS_WIDTH = 1080
const CANVAS_HEIGHT = 1920

export default function CanvasEditor({ projectId, initialData, onSave }: CanvasEditorProps) {
  const [elements, setElements] = useState<CanvasElement[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [history, setHistory] = useState<CanvasElement[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [stageScale, setStageScale] = useState(0.3)
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 })
  const [tool, setTool] = useState<'select' | 'rect' | 'circle' | 'text'>('select')
  
  const stageRef = useRef<any>(null)
  const transformerRef = useRef<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Update transformer when selection changes
  useEffect(() => {
    if (transformerRef.current && stageRef.current) {
      if (selectedId) {
        const selectedNode = stageRef.current.findOne(`#${selectedId}`)
        if (selectedNode) {
          transformerRef.current.nodes([selectedNode])
          transformerRef.current.getLayer()?.batchDraw()
        }
      } else {
        transformerRef.current.nodes([])
      }
    }
  }, [selectedId])

  // Save to history when elements change
  useEffect(() => {
    if (elements.length > 0) {
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push([...elements])
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    }
  }, [elements])

  const selectedElement = elements.find(el => el.id === selectedId)

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const addElement = (type: CanvasElement['type']) => {
    const newElement: CanvasElement = {
      id: generateId(),
      type,
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      width: type === 'text' ? 200 : 150,
      height: type === 'text' ? 50 : 150,
      fill: type === 'text' ? '#ffffff' : '#7c3aed',
      opacity: 1,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      ...(type === 'text' && {
        text: 'Novo Texto',
        fontSize: 48,
        fontFamily: 'Inter',
      }),
      ...(type === 'circle' && {
        radius: 75,
        width: undefined,
        height: undefined,
      }),
    }
    setElements([...elements, newElement])
    setSelectedId(newElement.id)
    toast.success(`${type} adicionado`)
  }

  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    setElements(elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ))
  }

  const deleteElement = () => {
    if (selectedId) {
      setElements(elements.filter(el => el.id !== selectedId))
      setSelectedId(null)
      toast.success('Elemento removido')
    }
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setElements([...history[historyIndex - 1]])
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setElements([...history[historyIndex + 1]])
    }
  }

  const handleStageClick = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null)
    }
  }

  const handleDragEnd = (e: KonvaEventObject<DragEvent>, id: string) => {
    updateElement(id, {
      x: e.target.x(),
      y: e.target.y(),
    })
  }

  const handleTransformEnd = (e: KonvaEventObject<Event>, id: string) => {
    const node = e.target
    const scaleX = node.scaleX()
    const scaleY = node.scaleY()
    
    // Reset scale and apply to width/height
    node.scaleX(1)
    node.scaleY(1)
    
    updateElement(id, {
      x: node.x(),
      y: node.y(),
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY),
      rotation: node.rotation(),
      scaleX,
      scaleY,
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new window.Image()
        img.src = event.target?.result as string
        img.onload = () => {
          const newElement: CanvasElement = {
            id: generateId(),
            type: 'image',
            x: CANVAS_WIDTH / 2 - img.width / 4,
            y: CANVAS_HEIGHT / 2 - img.height / 4,
            width: img.width / 2,
            height: img.height / 2,
            fill: 'transparent',
            opacity: 1,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            src: event.target?.result as string,
          }
          setElements([...elements, newElement])
          setSelectedId(newElement.id)
          toast.success('Imagem adicionada')
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const renderElement = (element: CanvasElement) => {
    const commonProps = {
      id: element.id,
      x: element.x,
      y: element.y,
      rotation: element.rotation,
      opacity: element.opacity,
      draggable: true,
      onClick: () => setSelectedId(element.id),
      onTap: () => setSelectedId(element.id),
      onDragEnd: (e: KonvaEventObject<DragEvent>) => handleDragEnd(e, element.id),
      onTransformEnd: (e: KonvaEventObject<Event>) => handleTransformEnd(e, element.id),
    }

    switch (element.type) {
      case 'rect':
        return (
          <Rect
            key={element.id}
            {...commonProps}
            width={element.width}
            height={element.height}
            fill={element.fill}
            stroke={element.stroke}
            strokeWidth={element.strokeWidth}
            cornerRadius={8}
          />
        )
      case 'circle':
        return (
          <Circle
            key={element.id}
            {...commonProps}
            x={element.x + (element.radius || 75)}
            y={element.y + (element.radius || 75)}
            radius={element.radius}
            fill={element.fill}
            stroke={element.stroke}
            strokeWidth={element.strokeWidth}
          />
        )
      case 'triangle':
        return (
          <Line
            key={element.id}
            {...commonProps}
            points={[
              element.x + (element.width || 150) / 2,
              element.y,
              element.x + (element.width || 150),
              element.y + (element.height || 150),
              element.x,
              element.y + (element.height || 150),
            ]}
            fill={element.fill}
            closed
          />
        )
      case 'line':
        return (
          <Line
            key={element.id}
            {...commonProps}
            points={element.points || [0, 0, 100, 0]}
            stroke={element.fill}
            strokeWidth={element.strokeWidth || 4}
          />
        )
      case 'text':
        return (
          <Text
            key={element.id}
            {...commonProps}
            text={element.text || 'Texto'}
            fontSize={element.fontSize || 48}
            fontFamily={element.fontFamily || 'Inter'}
            fill={element.fill}
            width={element.width}
            align="left"
          />
        )
      case 'image':
        return (
          <KonvaImage
            key={element.id}
            {...commonProps}
            image={element.src ? undefined : undefined}
            width={element.width}
            height={element.height}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-muted/30">
      {/* Left Toolbar */}
      <div className="w-14 bg-background border-r flex flex-col items-center py-4 gap-2">
        <Button
          variant={tool === 'select' ? 'default' : 'ghost'}
          size="icon"
          onClick={() => setTool('select')}
          title="Selecionar"
        >
          <MousePointer className="w-4 h-4" />
        </Button>
        
        <div className="w-8 h-px bg-border my-1" />
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => addElement('text')}
          title="Adicionar Texto"
        >
          <Type className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          title="Adicionar Imagem"
        >
          <Image className="w-4 h-4" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => addElement('rect')}
          title="Adicionar Retângulo"
        >
          <Square className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => addElement('circle')}
          title="Adicionar Círculo"
        >
          <CircleIcon className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => addElement('triangle')}
          title="Adicionar Triângulo"
        >
          <Triangle className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => addElement('line')}
          title="Adicionar Linha"
        >
          <Minus className="w-4 h-4" />
        </Button>

        <div className="w-8 h-px bg-border my-1" />

        <Button
          variant="ghost"
          size="icon"
          onClick={handleUndo}
          disabled={historyIndex <= 0}
          title="Desfazer"
        >
          <Undo className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRedo}
          disabled={historyIndex >= history.length - 1}
          title="Refazer"
        >
          <Redo className="w-4 h-4" />
        </Button>

        <div className="flex-1" />

        <Button
          variant="ghost"
          size="icon"
          onClick={deleteElement}
          disabled={!selectedId}
          title="Remover"
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-hidden relative bg-muted/50">
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStageScale(Math.max(0.1, stageScale - 0.1))}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="px-3 py-1 bg-background rounded border text-sm">
            {Math.round(stageScale * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStageScale(Math.min(2, stageScale + 0.1))}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>

        <div className="absolute inset-0 flex items-center justify-center overflow-auto p-8">
          <Stage
            ref={stageRef}
            width={CANVAS_WIDTH * stageScale}
            height={CANVAS_HEIGHT * stageScale}
            scaleX={stageScale}
            scaleY={stageScale}
            onClick={handleStageClick}
            onTap={handleStageClick}
            draggable
            onDragEnd={(e) => {
              setStagePosition({
                x: e.target.x(),
                y: e.target.y(),
              })
            }}
          >
            <Layer>
              {/* Background */}
              <Rect
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                fill="#1a1a2e"
              />
              
              {/* Grid for alignment */}
              {[...Array(20)].map((_, i) => (
                <Line
                  key={`v-${i}`}
                  points={[i * 54, 0, i * 54, CANVAS_HEIGHT]}
                  stroke="rgba(255,255,255,0.03)"
                />
              ))}
              {[...Array(40)].map((_, i) => (
                <Line
                  key={`h-${i}`}
                  points={[0, i * 48, CANVAS_WIDTH, i * 48]}
                  stroke="rgba(255,255,255,0.03)"
                />
              ))}

              {/* Elements */}
              {elements.map(renderElement)}

              {/* Transformer */}
              <Transformer
                ref={transformerRef}
                boundBoxFunc={(oldBox, newBox) => {
                  if (newBox.width < 5 || newBox.height < 5) {
                    return oldBox
                  }
                  return newBox
                }}
              />
            </Layer>
          </Stage>
        </div>
      </div>

      {/* Right Properties Panel */}
      <div className="w-72 bg-background border-l overflow-hidden flex flex-col">
        <Tabs defaultValue="properties" className="flex-1 flex flex-col">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="properties" className="gap-1">
              <Settings2 className="w-3 h-3" />
              Propriedades
            </TabsTrigger>
            <TabsTrigger value="layers" className="gap-1">
              <Layers className="w-3 h-3" />
              Layers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="flex-1 overflow-auto p-4">
            {selectedElement ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <div className="px-3 py-2 bg-muted rounded-md text-sm capitalize">
                    {selectedElement.type}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Posição X</Label>
                  <Input
                    type="number"
                    value={Math.round(selectedElement.x)}
                    onChange={(e) => updateElement(selectedId!, { x: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Posição Y</Label>
                  <Input
                    type="number"
                    value={Math.round(selectedElement.y)}
                    onChange={(e) => updateElement(selectedId!, { y: Number(e.target.value) })}
                  />
                </div>

                {selectedElement.width && (
                  <div className="space-y-2">
                    <Label>Largura</Label>
                    <Input
                      type="number"
                      value={Math.round(selectedElement.width)}
                      onChange={(e) => updateElement(selectedId!, { width: Number(e.target.value) })}
                    />
                  </div>
                )}

                {selectedElement.height && (
                  <div className="space-y-2">
                    <Label>Altura</Label>
                    <Input
                      type="number"
                      value={Math.round(selectedElement.height)}
                      onChange={(e) => updateElement(selectedId!, { height: Number(e.target.value) })}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Rotação</Label>
                  <Input
                    type="number"
                    value={Math.round(selectedElement.rotation)}
                    onChange={(e) => updateElement(selectedId!, { rotation: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Opacidade ({Math.round(selectedElement.opacity * 100)}%)</Label>
                  <Slider
                    value={[selectedElement.opacity * 100]}
                    onValueChange={(vals) => updateElement(selectedId!, { opacity: (vals as number[])[0] / 100 })}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Cor de Preenchimento</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={selectedElement.fill}
                      onChange={(e) => updateElement(selectedId!, { fill: e.target.value })}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <Input
                      value={selectedElement.fill}
                      onChange={(e) => updateElement(selectedId!, { fill: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                {selectedElement.type === 'text' && (
                  <>
                    <div className="space-y-2">
                      <Label>Texto</Label>
                      <Input
                        value={selectedElement.text}
                        onChange={(e) => updateElement(selectedId!, { text: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tamanho da Fonte</Label>
                      <Input
                        type="number"
                        value={selectedElement.fontSize}
                        onChange={(e) => updateElement(selectedId!, { fontSize: Number(e.target.value) })}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label>Cor da Borda</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={selectedElement.stroke || '#000000'}
                      onChange={(e) => updateElement(selectedId!, { stroke: e.target.value })}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <Input
                      value={selectedElement.stroke || ''}
                      onChange={(e) => updateElement(selectedId!, { stroke: e.target.value })}
                      placeholder="Sem borda"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Espessura da Borda</Label>
                  <Input
                    type="number"
                    value={selectedElement.strokeWidth || 0}
                    onChange={(e) => updateElement(selectedId!, { strokeWidth: Number(e.target.value) })}
                    min={0}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <MousePointer className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p>Selecione um elemento para editar</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="layers" className="flex-1 overflow-auto">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-1">
                {elements.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Layers className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    <p>Nenhum layer ainda</p>
                    <p className="text-sm">Adicione elementos usando a barra lateral</p>
                  </div>
                ) : (
                  elements.map((el, index) => (
                    <button
                      key={el.id}
                      onClick={() => setSelectedId(el.id)}
                      className={`w-full p-3 text-left rounded-lg flex items-center gap-3 transition-colors ${
                        selectedId === el.id
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded border-2"
                        style={{ 
                          backgroundColor: el.fill,
                          borderColor: selectedId === el.id ? 'var(--primary)' : 'transparent'
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium capitalize truncate">{el.type}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {el.text || `${Math.round(el.x)}, ${Math.round(el.y)}`}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">#{index + 1}</span>
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* Bottom Actions */}
        <div className="p-4 border-t bg-background">
          <Button className="w-full" size="lg">
            <Download className="w-4 h-4 mr-2" />
            Exportar & Gerar
          </Button>
        </div>
      </div>
    </div>
  )
}
