"use client";

import React, { useState, useRef, useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { ContentItem, ContentType } from '@/lib/type';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Edit3,
  Move,
  Copy,
  Trash2,
  MoreHorizontal,
  MousePointer,
  Type,
  Image as ImageIcon,
  Table,
  Code
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

interface SlideCanvasProps {
  slideId: string;
  content: ContentItem;
  isEditable?: boolean;
  onContentUpdate?: (content: ContentItem) => void;
  onElementSelect?: (element: ContentItem) => void;
  selectedElementId?: string;
  className?: string;
  theme?: {
    backgroundColor?: string;
    fontColor?: string;
    accentColor?: string;
  };
}

interface ElementOverlayProps {
  element: ContentItem;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  position: { x: number; y: number; width: number; height: number };
}

const ElementOverlay: React.FC<ElementOverlayProps> = ({
  element,
  isSelected,
  isHovered,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  position
}) => {
  if (!isSelected && !isHovered) return null;

  const getElementIcon = (type: ContentType) => {
    switch (type) {
      case 'text':
      case 'paragraph':
      case 'heading1':
      case 'heading2':
      case 'heading3':
        return <Type className="w-3 h-3" />;
      case 'image':
        return <ImageIcon className="w-3 h-3" />;
      case 'table':
        return <Table className="w-3 h-3" />;
      case 'codeBlock':
        return <Code className="w-3 h-3" />;
      default:
        return <MousePointer className="w-3 h-3" />;
    }
  };

  return (
    <div
      className={`absolute pointer-events-none z-10 ${
        isSelected ? 'border-2 border-blue-500' : 'border border-blue-300'
      }`}
      style={{
        left: position.x,
        top: position.y,
        width: position.width,
        height: position.height,
      }}
    >
      {/* Selection handles */}
      {isSelected && (
        <>
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 border border-white rounded-full"></div>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 border border-white rounded-full"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 border border-white rounded-full"></div>
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 border border-white rounded-full"></div>
        </>
      )}

      {/* Toolbar */}
      {(isSelected || isHovered) && (
        <div className="absolute -top-8 left-0 pointer-events-auto">
          <div className="flex items-center gap-1 bg-white dark:bg-gray-800 border rounded-md shadow-lg px-2 py-1">
            <Badge variant="outline" className="text-xs h-5 px-1">
              {getElementIcon(element.type)}
              <span className="ml-1">{element.type}</span>
            </Badge>
            
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={onEdit}
              >
                <Edit3 className="w-3 h-3" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                  >
                    <MoreHorizontal className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-32">
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit3 className="w-3 h-3 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onDuplicate}>
                    <Copy className="w-3 h-3 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onDelete} className="text-red-600">
                    <Trash2 className="w-3 h-3 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ContentRenderer: React.FC<{
  content: ContentItem;
  isEditable: boolean;
  onSelect?: () => void;
  isSelected?: boolean;
  isHovered?: boolean;
  onHover?: (hover: boolean) => void;
  onContentChange?: (content: string | string[] | string[][]) => void;
}> = ({ 
  content, 
  isEditable, 
  onSelect, 
  isSelected = false, 
  isHovered = false,
  onHover,
  onContentChange 
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (isEditable) {
      e.stopPropagation();
      onSelect?.();
    }
  }, [isEditable, onSelect]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    if (isEditable) {
      e.stopPropagation();
      setIsEditing(true);
    }
  }, [isEditable]);

  const handleContentBlur = useCallback((e: React.FocusEvent) => {
    setIsEditing(false);
    if (onContentChange) {
      const target = e.target as HTMLElement;
      onContentChange(target.textContent || '');
    }
  }, [onContentChange]);

  const renderContent = () => {
    const baseClassName = `${content.className || ''} ${
      isEditable ? 'cursor-pointer' : ''
    } ${isSelected ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`;

    switch (content.type) {
      case 'heading1':
        return (
          <h1
            className={`text-3xl font-bold ${baseClassName}`}
            contentEditable={isEditing}
            onBlur={handleContentBlur}
            suppressContentEditableWarning
          >
            {content.content as string}
          </h1>
        );

      case 'heading2':
        return (
          <h2
            className={`text-2xl font-semibold ${baseClassName}`}
            contentEditable={isEditing}
            onBlur={handleContentBlur}
            suppressContentEditableWarning
          >
            {content.content as string}
          </h2>
        );

      case 'heading3':
        return (
          <h3
            className={`text-xl font-medium ${baseClassName}`}
            contentEditable={isEditing}
            onBlur={handleContentBlur}
            suppressContentEditableWarning
          >
            {content.content as string}
          </h3>
        );

      case 'paragraph':
      case 'text':
        return (
          <p
            className={`text-base ${baseClassName}`}
            contentEditable={isEditing}
            onBlur={handleContentBlur}
            suppressContentEditableWarning
          >
            {content.content as string}
          </p>
        );

      case 'bulletedList':
        return (
          <ul className={`list-disc pl-6 ${baseClassName}`}>
            {(content.content as string[]).map((item, index) => (
              <li key={index} className="mb-1">
                {item}
              </li>
            ))}
          </ul>
        );

      case 'numberedList':
        return (
          <ol className={`list-decimal pl-6 ${baseClassName}`}>
            {(content.content as string[]).map((item, index) => (
              <li key={index} className="mb-1">
                {item}
              </li>
            ))}
          </ol>
        );

      case 'blockquote':
        return (
          <blockquote
            className={`border-l-4 border-blue-500 pl-4 italic ${baseClassName}`}
            contentEditable={isEditing}
            onBlur={handleContentBlur}
            suppressContentEditableWarning
          >
            {content.content as string}
          </blockquote>
        );

      case 'image':
        return (
          <div className={`relative ${baseClassName}`}>
            <img
              src={content.content as string}
              alt={content.alt || ''}
              className="max-w-full h-auto rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
              }}
            />
          </div>
        );

      case 'table':
        const tableData = content.content as string[][];
        return (
          <div className={`overflow-x-auto ${baseClassName}`}>
            <table className="min-w-full border border-gray-300">
              <tbody>
                {tableData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="border border-gray-300 px-4 py-2"
                        contentEditable={isEditing}
                        suppressContentEditableWarning
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'codeBlock':
        return (
          <pre
            className={`bg-gray-100 dark:bg-gray-800 p-4 rounded font-mono text-sm overflow-x-auto ${baseClassName}`}
            contentEditable={isEditing}
            onBlur={handleContentBlur}
            suppressContentEditableWarning
          >
            <code>{content.content as string}</code>
          </pre>
        );

      case 'link':
        return (
          <a
            href={content.link || '#'}
            className={`text-blue-500 underline hover:text-blue-700 ${baseClassName}`}
            target="_blank"
            rel="noopener noreferrer"
            contentEditable={isEditing}
            onBlur={handleContentBlur}
            suppressContentEditableWarning
          >
            {content.content as string}
          </a>
        );

      case 'divider':
        return <hr className={`border-t border-gray-300 my-4 ${baseClassName}`} />;

      case 'multiColumn':
        return (
          <div className={`grid gap-4 ${baseClassName}`} style={{
            gridTemplateColumns: `repeat(${content.columns || 2}, 1fr)`
          }}>
            {(content.content as ContentItem[]).map((item, index) => (
              <ContentRenderer
                key={item.id || index}
                content={item}
                isEditable={isEditable}
              />
            ))}
          </div>
        );

      default:
        return (
          <div
            className={`p-4 border border-dashed border-gray-300 rounded ${baseClassName}`}
            contentEditable={isEditing}
            onBlur={handleContentBlur}
            suppressContentEditableWarning
          >
            {content.content as string}
          </div>
        );
    }
  };

  return (
    <div
      ref={elementRef}
      className="relative"
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
    >
      {renderContent()}
    </div>
  );
};

export const SlideCanvas: React.FC<SlideCanvasProps> = ({
  slideId,
  content,
  isEditable = false,
  onContentUpdate,
  onElementSelect,
  selectedElementId,
  className = '',
  theme = {}
}) => {
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [{ isOver }, dropRef] = useDrop({
    accept: ['ELEMENT'],
    drop: (item: any, monitor) => {
      if (!isEditable || !onContentUpdate) return;

      const offset = monitor.getClientOffset();
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      
      if (offset && canvasRect) {
        const x = offset.x - canvasRect.left;
        const y = offset.y - canvasRect.top;
        
        // Handle dropped element
        if (item.type === 'ELEMENT') {
          const newElement: ContentItem = {
            ...item.defaultContent,
            id: uuidv4(),
          };
          
          // For now, append to content - in a real implementation,
          // you'd position it based on x, y coordinates
          console.log(`Dropped element at (${x}, ${y}):`, newElement);
          
          // This is a simplified implementation - extend based on your needs
          onContentUpdate?.(newElement);
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleElementSelect = useCallback((element: ContentItem) => {
    onElementSelect?.(element);
  }, [onElementSelect]);

  const handleElementEdit = useCallback((element: ContentItem) => {
    console.log('Edit element:', element);
    // Implement inline editing
  }, []);

  const handleElementDelete = useCallback((elementId: string) => {
    console.log('Delete element:', elementId);
    // Implement element deletion
  }, []);

  const handleElementDuplicate = useCallback((element: ContentItem) => {
    console.log('Duplicate element:', element);
    // Implement element duplication
  }, []);

  const renderContentWithSelection = (contentItem: ContentItem): React.ReactNode => {
    const isSelected = selectedElementId === contentItem.id;
    const isHovered = hoveredElementId === contentItem.id;

    return (
      <div key={contentItem.id} className="relative">
        <ContentRenderer
          content={contentItem}
          isEditable={isEditable}
          onSelect={() => handleElementSelect(contentItem)}
          isSelected={isSelected}
          isHovered={isHovered}
          onHover={(hover) => setHoveredElementId(hover ? contentItem.id : null)}
        />
        
        {isEditable && (isSelected || isHovered) && (
          <ElementOverlay
            element={contentItem}
            isSelected={isSelected}
            isHovered={isHovered}
            onSelect={() => handleElementSelect(contentItem)}
            onEdit={() => handleElementEdit(contentItem)}
            onDelete={() => handleElementDelete(contentItem.id)}
            onDuplicate={() => handleElementDuplicate(contentItem)}
            position={{ x: 0, y: 0, width: 100, height: 100 }} // Calculate actual position
          />
        )}
      </div>
    );
  };

  return (
    <div
      ref={(node) => {
        dropRef(node);
        canvasRef.current = node;
      }}
      className={`
        relative min-h-[500px] w-full p-8 rounded-lg border-2 
        ${isOver ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/10' : 'border-gray-200'}
        ${isEditable ? 'cursor-auto' : ''}
        ${className}
      `}
      style={{
        backgroundColor: theme.backgroundColor || '#ffffff',
        color: theme.fontColor || '#000000',
      }}
    >
      {/* Drop zone indicator */}
      {isEditable && isOver && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
            Drop element here
          </div>
        </div>
      )}

      {/* Content rendering */}
      <div className="relative z-0">
        {Array.isArray(content.content) ? (
          content.content.map((item) => 
            typeof item === 'object' ? renderContentWithSelection(item as ContentItem) : (
              <div key={Math.random()}>{item}</div>
            )
          )
        ) : (
          renderContentWithSelection(content)
        )}
      </div>

      {/* Empty state */}
      {(!content.content || 
        (Array.isArray(content.content) && content.content.length === 0)) && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <MousePointer className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Empty Slide</p>
            <p className="text-sm">
              {isEditable ? 'Drag elements from the library to get started' : 'No content to display'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlideCanvas;