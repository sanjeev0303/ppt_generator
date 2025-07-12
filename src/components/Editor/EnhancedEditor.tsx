"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@/components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSlideStore } from '@/store/useSlideStore';
import { ContentItem, Slide } from '@/lib/type';
import { v4 as uuidv4 } from 'uuid';
import { ElementLibrary } from './ElementLibrary/ElementLibrary';
import { PropertyPanel } from './PropertyPanel/PropertyPanel';
import { SlideCanvas } from './SlideCanvas/SlideCanvas';
import { Toolbar } from './Toolbar/Toolbar';
import { Eye, EyeOff, Menu, X } from 'lucide-react';
import { toast } from 'sonner';

interface EnhancedEditorProps {
  presentationId: string;
  isEditable?: boolean;
}

interface EditorState {
  selectedElementId: string | null;
  selectedElement: ContentItem | null;
  isPreviewMode: boolean;
  zoom: number;
  showElementLibrary: boolean;
  showPropertyPanel: boolean;
  canUndo: boolean;
  canRedo: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
}

export const EnhancedEditor: React.FC<EnhancedEditorProps> = ({ 
  presentationId, 
  isEditable = true 
}) => {
  const {
    slides,
    currentSlide,
    currentTheme,
    setCurrentSlide,
    addSlide,
    removeSlide,
    updateSlide,
    reorderSlides,
    project
  } = useSlideStore();

  const [editorState, setEditorState] = useState<EditorState>({
    selectedElementId: null,
    selectedElement: null,
    isPreviewMode: false,
    zoom: 100,
    showElementLibrary: true,
    showPropertyPanel: true,
    canUndo: false,
    canRedo: false,
    isSaving: false,
    lastSaved: null
  });

  // Auto-save functionality
  useEffect(() => {
    if (!isEditable) return;

    const autoSaveInterval = setInterval(() => {
      handleSave();
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [isEditable]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isEditable) return;

      const isCtrl = event.ctrlKey || event.metaKey;
      
      switch (event.key) {
        case 's':
          if (isCtrl) {
            event.preventDefault();
            handleSave();
          }
          break;
        case 'z':
          if (isCtrl && !event.shiftKey) {
            event.preventDefault();
            handleUndo();
          }
          break;
        case 'y':
          if (isCtrl) {
            event.preventDefault();
            handleRedo();
          }
          break;
        case 'F5':
          event.preventDefault();
          handlePreview();
          break;
        case 'Escape':
          if (editorState.isPreviewMode) {
            event.preventDefault();
            setEditorState(prev => ({ ...prev, isPreviewMode: false }));
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditable, editorState.isPreviewMode]);

  const handleSave = useCallback(async () => {
    if (!isEditable) return;

    setEditorState(prev => ({ ...prev, isSaving: true }));
    
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEditorState(prev => ({ 
        ...prev, 
        isSaving: false, 
        lastSaved: new Date() 
      }));
      
      toast.success('Presentation saved successfully');
    } catch (error) {
      setEditorState(prev => ({ ...prev, isSaving: false }));
      toast.error('Failed to save presentation');
    }
  }, [isEditable]);

  const handleUndo = useCallback(() => {
    // Implement undo functionality
    console.log('Undo');
    toast.info('Undo functionality not yet implemented');
  }, []);

  const handleRedo = useCallback(() => {
    // Implement redo functionality
    console.log('Redo');
    toast.info('Redo functionality not yet implemented');
  }, []);

  const handlePreview = useCallback(() => {
    setEditorState(prev => ({ ...prev, isPreviewMode: !prev.isPreviewMode }));
  }, []);

  const handleExport = useCallback((format: 'pptx' | 'pdf' | 'png') => {
    toast.info(`Export to ${format.toUpperCase()} functionality not yet implemented`);
  }, []);

  const handleShare = useCallback(() => {
    toast.info('Share functionality not yet implemented');
  }, []);

  const handleAddSlide = useCallback(() => {
    const newSlide: Slide = {
      id: uuidv4(),
      slideName: `Slide ${slides.length + 1}`,
      type: 'blank',
      content: {
        id: uuidv4(),
        type: 'text',
        name: 'Default Content',
        content: 'Click to edit this slide',
        className: 'text-center py-20'
      },
      slideOrder: slides.length + 1
    };
    
    addSlide(newSlide);
    toast.success('New slide added');
  }, [slides, addSlide]);

  const handleDuplicateSlide = useCallback(() => {
    if (slides[currentSlide]) {
      const slideToClone = slides[currentSlide];
      const newSlide: Slide = {
        ...slideToClone,
        id: uuidv4(),
        slideName: `${slideToClone.slideName} (Copy)`,
        slideOrder: slides.length + 1
      };
      
      addSlide(newSlide);
      toast.success('Slide duplicated');
    }
  }, [slides, currentSlide, addSlide]);

  const handleDeleteSlide = useCallback(() => {
    if (slides.length > 1 && slides[currentSlide]) {
      removeSlide(slides[currentSlide].id);
      toast.success('Slide deleted');
    } else {
      toast.error('Cannot delete the last slide');
    }
  }, [slides, currentSlide, removeSlide]);

  const handleZoomChange = useCallback((zoom: number) => {
    setEditorState(prev => ({ ...prev, zoom }));
  }, []);

  const handleThemeSelect = useCallback(() => {
    toast.info('Theme selection functionality not yet implemented');
  }, []);

  const handleElementSelect = useCallback((element: ContentItem) => {
    setEditorState(prev => ({ 
      ...prev, 
      selectedElementId: element.id,
      selectedElement: element 
    }));
  }, []);

  const handleElementUpdate = useCallback((updates: Partial<ContentItem>) => {
    if (editorState.selectedElement && slides[currentSlide]) {
      const updatedElement = { ...editorState.selectedElement, ...updates };
      
      // Update the slide content
      // This is a simplified implementation - in reality, you'd need to 
      // recursively find and update the element in the content tree
      const updatedSlide = {
        ...slides[currentSlide],
        content: updatedElement
      };
      
      updateSlide(slides[currentSlide].id, updatedSlide);
      
      setEditorState(prev => ({ 
        ...prev, 
        selectedElement: updatedElement 
      }));
    }
  }, [editorState.selectedElement, slides, currentSlide, updateSlide]);

  const handleElementDelete = useCallback(() => {
    if (editorState.selectedElement) {
      // Implement element deletion
      console.log('Delete element:', editorState.selectedElement);
      
      setEditorState(prev => ({ 
        ...prev, 
        selectedElementId: null,
        selectedElement: null 
      }));
      
      toast.success('Element deleted');
    }
  }, [editorState.selectedElement]);

  const handleContentUpdate = useCallback((content: ContentItem) => {
    if (slides[currentSlide]) {
      const updatedSlide = {
        ...slides[currentSlide],
        content: content
      };
      
      updateSlide(slides[currentSlide].id, updatedSlide);
    }
  }, [slides, currentSlide, updateSlide]);

  const currentSlideData = slides[currentSlide];

  if (editorState.isPreviewMode) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="max-w-6xl w-full h-full flex items-center justify-center p-8">
          {currentSlideData && (
            <SlideCanvas
              slideId={currentSlideData.id}
              content={currentSlideData.content}
              isEditable={false}
              theme={currentTheme}
              className="bg-white shadow-2xl"
            />
          )}
        </div>
        
        {/* Preview controls */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setEditorState(prev => ({ ...prev, isPreviewMode: false }))}
          >
            <X className="w-4 h-4 mr-1" />
            Exit Preview
          </Button>
        </div>
        
        {/* Slide navigation */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/50 rounded-lg px-4 py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
            disabled={currentSlide === 0}
            className="text-white hover:text-black"
          >
            Previous
          </Button>
          <span className="text-white text-sm px-2">
            {currentSlide + 1} / {slides.length}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
            disabled={currentSlide === slides.length - 1}
            className="text-white hover:text-black"
          >
            Next
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* Toolbar */}
        <Toolbar
          onSave={handleSave}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onPreview={handlePreview}
          onExport={handleExport}
          onShare={handleShare}
          onAddSlide={handleAddSlide}
          onDuplicateSlide={handleDuplicateSlide}
          onDeleteSlide={handleDeleteSlide}
          onZoomChange={handleZoomChange}
          onThemeSelect={handleThemeSelect}
          canUndo={editorState.canUndo}
          canRedo={editorState.canRedo}
          isPreviewMode={editorState.isPreviewMode}
          currentZoom={editorState.zoom}
          isSaving={editorState.isSaving}
        />

        {/* Main editor area */}
        <div className="flex-1 flex">
          <ResizablePanelGroup direction="horizontal" className="flex-1">
            {/* Element Library */}
            {editorState.showElementLibrary && isEditable && (
              <>
                <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                  <ElementLibrary />
                </ResizablePanel>
                <ResizableHandle />
              </>
            )}

            {/* Main canvas area */}
            <ResizablePanel defaultSize={editorState.showElementLibrary && editorState.showPropertyPanel ? 60 : 80}>
              <div className="h-full flex flex-col bg-gray-100 dark:bg-gray-800">
                {/* Canvas controls */}
                <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-900 border-b">
                  <div className="flex items-center gap-2">
                    {isEditable && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditorState(prev => ({ 
                            ...prev, 
                            showElementLibrary: !prev.showElementLibrary 
                          }))}
                        >
                          <Menu className="w-4 h-4" />
                        </Button>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Elements
                        </span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isEditable && (
                      <>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Properties
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditorState(prev => ({ 
                            ...prev, 
                            showPropertyPanel: !prev.showPropertyPanel 
                          }))}
                        >
                          {editorState.showPropertyPanel ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Canvas */}
                <ScrollArea className="flex-1">
                  <div 
                    className="p-8 flex justify-center"
                    style={{ zoom: `${editorState.zoom}%` }}
                  >
                    {currentSlideData ? (
                      <SlideCanvas
                        slideId={currentSlideData.id}
                        content={currentSlideData.content}
                        isEditable={isEditable}
                        onContentUpdate={handleContentUpdate}
                        onElementSelect={handleElementSelect}
                        selectedElementId={editorState.selectedElementId || undefined}
                        theme={currentTheme}
                        className="shadow-lg max-w-4xl w-full"
                      />
                    ) : (
                      <div className="text-center text-gray-500 py-20">
                        <p>No slide selected</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </ResizablePanel>

            {/* Property Panel */}
            {editorState.showPropertyPanel && isEditable && (
              <>
                <ResizableHandle />
                <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                  <PropertyPanel
                    selectedElement={editorState.selectedElement}
                    onUpdate={handleElementUpdate}
                    onDelete={handleElementDelete}
                  />
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </div>
      </div>
    </DndProvider>
  );
};

export default EnhancedEditor;