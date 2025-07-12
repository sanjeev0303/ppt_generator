"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Save,
  Undo,
  Redo,
  Play,
  Download,
  Share2,
  Plus,
  Copy,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize,
  Eye,
  Settings,
  Palette,
  FileText,
  Image,
  ChevronDown,
  Users,
  Cloud,
  History
} from 'lucide-react';
import { useSlideStore } from '@/store/useSlideStore';

interface ToolbarProps {
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onPreview?: () => void;
  onExport?: (format: 'pptx' | 'pdf' | 'png') => void;
  onShare?: () => void;
  onAddSlide?: () => void;
  onDuplicateSlide?: () => void;
  onDeleteSlide?: () => void;
  onZoomChange?: (zoom: number) => void;
  onThemeSelect?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  isPreviewMode?: boolean;
  currentZoom?: number;
  isSaving?: boolean;
  isCollaborating?: boolean;
  collaborators?: Array<{ name: string; avatar?: string; color: string }>;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onSave,
  onUndo,
  onRedo,
  onPreview,
  onExport,
  onShare,
  onAddSlide,
  onDuplicateSlide,
  onDeleteSlide,
  onZoomChange,
  onThemeSelect,
  canUndo = false,
  canRedo = false,
  isPreviewMode = false,
  currentZoom = 100,
  isSaving = false,
  isCollaborating = false,
  collaborators = []
}) => {
  const { slides, currentSlide, project } = useSlideStore();
  const [lastSaved, setLastSaved] = useState<Date>(new Date());

  const zoomLevels = [50, 75, 100, 125, 150, 200];

  const handleSave = () => {
    onSave?.();
    setLastSaved(new Date());
  };

  const renderCollaborators = () => {
    if (!isCollaborating || collaborators.length === 0) return null;

    return (
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {collaborators.slice(0, 3).map((collaborator, index) => (
            <div
              key={index}
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white border-2 border-white"
              style={{ backgroundColor: collaborator.color }}
              title={collaborator.name}
            >
              {collaborator.avatar ? (
                <img
                  src={collaborator.avatar}
                  alt={collaborator.name}
                  className="w-full h-full rounded-full"
                />
              ) : (
                collaborator.name.charAt(0).toUpperCase()
              )}
            </div>
          ))}
          {collaborators.length > 3 && (
            <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-xs font-medium text-white border-2 border-white">
              +{collaborators.length - 3}
            </div>
          )}
        </div>
        <Badge variant="outline" className="text-xs">
          <Users className="w-3 h-3 mr-1" />
          {collaborators.length + 1} online
        </Badge>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Left section - File operations */}
          <div className="flex items-center gap-2">
            {/* Project name */}
            <div className="flex items-center gap-2 mr-4">
              <Input
                value={project?.title || 'Untitled Presentation'}
                className="text-lg font-semibold border-none shadow-none px-0 h-auto bg-transparent"
                readOnly={!project}
              />
              {isSaving && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Cloud className="w-4 h-4 animate-pulse" />
                  Saving...
                </div>
              )}
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Save */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  <Save className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save (Ctrl+S)</p>
              </TooltipContent>
            </Tooltip>

            {/* Undo/Redo */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onUndo}
                  disabled={!canUndo}
                >
                  <Undo className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Undo (Ctrl+Z)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRedo}
                  disabled={!canRedo}
                >
                  <Redo className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Redo (Ctrl+Y)</p>
              </TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6" />

            {/* Slide operations */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onAddSlide}>
                  <Plus className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add slide</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onDuplicateSlide}>
                  <Copy className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Duplicate slide</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDeleteSlide}
                  disabled={slides.length <= 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete slide</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Center section - Slide counter and navigation */}
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-sm">
              Slide {currentSlide + 1} of {slides.length}
            </Badge>

            {/* Theme selector */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onThemeSelect}>
                  <Palette className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Change theme</p>
              </TooltipContent>
            </Tooltip>

            {/* Zoom controls */}
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const currentIndex = zoomLevels.indexOf(currentZoom);
                      if (currentIndex > 0) {
                        onZoomChange?.(zoomLevels[currentIndex - 1]);
                      }
                    }}
                    disabled={currentZoom <= zoomLevels[0]}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom out</p>
                </TooltipContent>
              </Tooltip>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="min-w-[80px]">
                    {currentZoom}%
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {zoomLevels.map((zoom) => (
                    <DropdownMenuItem
                      key={zoom}
                      onClick={() => onZoomChange?.(zoom)}
                      className={currentZoom === zoom ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                    >
                      {zoom}%
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onZoomChange?.(100)}>
                    Fit to width
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const currentIndex = zoomLevels.indexOf(currentZoom);
                      if (currentIndex < zoomLevels.length - 1) {
                        onZoomChange?.(zoomLevels[currentIndex + 1]);
                      }
                    }}
                    disabled={currentZoom >= zoomLevels[zoomLevels.length - 1]}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom in</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Right section - Preview, export, share */}
          <div className="flex items-center gap-2">
            {/* Collaborators */}
            {renderCollaborators()}

            {collaborators.length > 0 && <Separator orientation="vertical" className="h-6" />}

            {/* Last saved */}
            <div className="text-sm text-gray-500 mr-2">
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-1">
                    <History className="w-3 h-3" />
                    Saved {lastSaved.toLocaleTimeString()}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Last saved: {lastSaved.toLocaleString()}</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Preview */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isPreviewMode ? "default" : "ghost"}
                  size="sm"
                  onClick={onPreview}
                >
                  {isPreviewMode ? <Eye className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isPreviewMode ? 'Exit preview' : 'Preview (F5)'}</p>
              </TooltipContent>
            </Tooltip>

            {/* Export */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                  <ChevronDown className="w-3 h-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Export as</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onExport?.('pptx')}>
                  <FileText className="w-4 h-4 mr-2" />
                  PowerPoint (.pptx)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport?.('pdf')}>
                  <FileText className="w-4 h-4 mr-2" />
                  PDF (.pdf)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport?.('png')}>
                  <Image className="w-4 h-4 mr-2" />
                  Images (.png)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Share */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="default" size="sm" onClick={onShare}>
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share presentation</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Toolbar;