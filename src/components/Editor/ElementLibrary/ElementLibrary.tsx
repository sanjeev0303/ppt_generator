"use client";

import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Type,
  Image,
  Table,
  List,
  Quote,
  Code,
  BarChart3,
  Shapes,
  Video,
  FileText,
  Link,
  Calendar,
  Search,
  Plus
} from 'lucide-react';
import { ContentType, ContentItem } from '@/lib/type';
import { v4 as uuidv4 } from 'uuid';
import { useDrag } from 'react-dnd';

interface ElementItem {
  id: string;
  name: string;
  type: ContentType;
  icon: React.ReactNode;
  category: 'text' | 'media' | 'data' | 'layout' | 'interactive';
  description: string;
  defaultContent: ContentItem;
}

const elementLibrary: ElementItem[] = [
  // Text Elements
  {
    id: 'heading1',
    name: 'Heading 1',
    type: 'heading1',
    icon: <Type className="w-4 h-4" />,
    category: 'text',
    description: 'Large heading for main titles',
    defaultContent: {
      id: uuidv4(),
      type: 'heading1',
      name: 'Heading 1',
      content: 'Main Heading',
      className: 'text-3xl font-bold'
    }
  },
  {
    id: 'heading2',
    name: 'Heading 2',
    type: 'heading2',
    icon: <Type className="w-4 h-4" />,
    category: 'text',
    description: 'Medium heading for sections',
    defaultContent: {
      id: uuidv4(),
      type: 'heading2',
      name: 'Heading 2',
      content: 'Section Heading',
      className: 'text-2xl font-semibold'
    }
  },
  {
    id: 'paragraph',
    name: 'Paragraph',
    type: 'paragraph',
    icon: <FileText className="w-4 h-4" />,
    category: 'text',
    description: 'Body text paragraph',
    defaultContent: {
      id: uuidv4(),
      type: 'paragraph',
      name: 'Paragraph',
      content: 'Add your content here...',
      className: 'text-base'
    }
  },
  {
    id: 'bulletedList',
    name: 'Bullet List',
    type: 'bulletedList',
    icon: <List className="w-4 h-4" />,
    category: 'text',
    description: 'Bulleted list for key points',
    defaultContent: {
      id: uuidv4(),
      type: 'bulletedList',
      name: 'Bullet List',
      content: ['First point', 'Second point', 'Third point'],
      className: 'list-disc pl-4'
    }
  },
  {
    id: 'numberedList',
    name: 'Numbered List',
    type: 'numberedList',
    icon: <List className="w-4 h-4" />,
    category: 'text',
    description: 'Numbered list for ordered content',
    defaultContent: {
      id: uuidv4(),
      type: 'numberedList',
      name: 'Numbered List',
      content: ['First step', 'Second step', 'Third step'],
      className: 'list-decimal pl-4'
    }
  },
  {
    id: 'blockquote',
    name: 'Quote',
    type: 'blockquote',
    icon: <Quote className="w-4 h-4" />,
    category: 'text',
    description: 'Highlighted quote or callout',
    defaultContent: {
      id: uuidv4(),
      type: 'blockquote',
      name: 'Quote',
      content: 'Your quote text here...',
      className: 'border-l-4 border-blue-500 pl-4 italic'
    }
  },
  // Media Elements
  {
    id: 'image',
    name: 'Image',
    type: 'image',
    icon: <Image className="w-4 h-4" />,
    category: 'media',
    description: 'Add images and graphics',
    defaultContent: {
      id: uuidv4(),
      type: 'image',
      name: 'Image',
      content: 'https://via.placeholder.com/400x300',
      alt: 'Placeholder image',
      className: 'rounded-lg'
    }
  },
  {
    id: 'video',
    name: 'Video',
    type: 'image', // Using image type for now, can be extended
    icon: <Video className="w-4 h-4" />,
    category: 'media',
    description: 'Embed videos',
    defaultContent: {
      id: uuidv4(),
      type: 'image',
      name: 'Video',
      content: 'https://via.placeholder.com/400x300?text=Video',
      alt: 'Video placeholder',
      className: 'rounded-lg'
    }
  },
  // Data Elements
  {
    id: 'table',
    name: 'Table',
    type: 'table',
    icon: <Table className="w-4 h-4" />,
    category: 'data',
    description: 'Data tables and grids',
    defaultContent: {
      id: uuidv4(),
      type: 'table',
      name: 'Table',
      content: [
        ['Header 1', 'Header 2', 'Header 3'],
        ['Row 1, Col 1', 'Row 1, Col 2', 'Row 1, Col 3'],
        ['Row 2, Col 1', 'Row 2, Col 2', 'Row 2, Col 3']
      ],
      intialRows: 3,
      initialColumns: 3,
      className: 'border border-gray-300'
    }
  },
  {
    id: 'chart',
    name: 'Chart',
    type: 'image', // Using image type for now, can be extended for interactive charts
    icon: <BarChart3 className="w-4 h-4" />,
    category: 'data',
    description: 'Data visualization charts',
    defaultContent: {
      id: uuidv4(),
      type: 'image',
      name: 'Chart',
      content: 'https://via.placeholder.com/400x300?text=Chart',
      alt: 'Chart placeholder',
      className: 'rounded-lg'
    }
  },
  // Layout Elements
  {
    id: 'multiColumn',
    name: 'Multi Column',
    type: 'multiColumn',
    icon: <Shapes className="w-4 h-4" />,
    category: 'layout',
    description: 'Multi-column layout',
    defaultContent: {
      id: uuidv4(),
      type: 'multiColumn',
      name: 'Multi Column',
      content: [],
      columns: 2,
      className: 'grid grid-cols-2 gap-4'
    }
  },
  {
    id: 'divider',
    name: 'Divider',
    type: 'divider',
    icon: <FileText className="w-4 h-4" />,
    category: 'layout',
    description: 'Visual separator line',
    defaultContent: {
      id: uuidv4(),
      type: 'divider',
      name: 'Divider',
      content: '',
      className: 'border-t border-gray-300 my-4'
    }
  },
  // Interactive Elements
  {
    id: 'link',
    name: 'Link',
    type: 'link',
    icon: <Link className="w-4 h-4" />,
    category: 'interactive',
    description: 'Clickable links',
    defaultContent: {
      id: uuidv4(),
      type: 'link',
      name: 'Link',
      content: 'Link text',
      link: 'https://example.com',
      className: 'text-blue-500 underline hover:text-blue-700'
    }
  },
  {
    id: 'codeBlock',
    name: 'Code Block',
    type: 'codeBlock',
    icon: <Code className="w-4 h-4" />,
    category: 'interactive',
    description: 'Code snippets with syntax highlighting',
    defaultContent: {
      id: uuidv4(),
      type: 'codeBlock',
      name: 'Code Block',
      content: 'console.log("Hello, World!");',
      language: 'javascript',
      className: 'bg-gray-100 p-4 rounded font-mono text-sm'
    }
  }
];

interface DraggableElementProps {
  element: ElementItem;
  isSelected: boolean;
  onClick: () => void;
}

const DraggableElement: React.FC<DraggableElementProps> = ({ element, isSelected, onClick }) => {
  const [{ isDragging }, dragRef, drag] = useDrag({
    type: 'ELEMENT',
    item: { type: 'ELEMENT', elementType: element.type, defaultContent: element.defaultContent },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={dragRef as any}
      onClick={onClick}
      className={`
        p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md
        ${isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 hover:border-gray-300'}
        ${isDragging ? 'opacity-50' : ''}
      `}
    >
      <div className="flex items-center gap-2 mb-2">
        {element.icon}
        <span className="font-medium text-sm">{element.name}</span>
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400">{element.description}</p>
    </div>
  );
};

export const ElementLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All', count: elementLibrary.length },
    { id: 'text', name: 'Text', count: elementLibrary.filter(e => e.category === 'text').length },
    { id: 'media', name: 'Media', count: elementLibrary.filter(e => e.category === 'media').length },
    { id: 'data', name: 'Data', count: elementLibrary.filter(e => e.category === 'data').length },
    { id: 'layout', name: 'Layout', count: elementLibrary.filter(e => e.category === 'layout').length },
    { id: 'interactive', name: 'Interactive', count: elementLibrary.filter(e => e.category === 'interactive').length },
  ];

  const filteredElements = elementLibrary.filter(element => {
    const matchesSearch = element.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         element.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || element.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-80 h-full border-r bg-white dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Element Library</h2>
          <Button size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            Custom
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search elements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="p-4 border-b">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-3 gap-1">
            {categories.slice(0, 3).map(category => (
              <TabsTrigger key={category.id} value={category.id} className="text-xs">
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="flex gap-1 mt-2">
            {categories.slice(3).map(category => (
              <Badge
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className="cursor-pointer text-xs"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name} ({category.count})
              </Badge>
            ))}
          </div>
        </Tabs>
      </div>

      {/* Elements Grid */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {filteredElements.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No elements found</p>
              <p className="text-sm">Try adjusting your search or category filter</p>
            </div>
          ) : (
            filteredElements.map(element => (
              <DraggableElement
                key={element.id}
                element={element}
                isSelected={selectedElement === element.id}
                onClick={() => setSelectedElement(element.id)}
              />
            ))
          )}
        </div>
      </ScrollArea>

      {/* Element Details */}
      {selectedElement && (
        <div className="p-4 border-t bg-gray-50 dark:bg-gray-800">
          {(() => {
            const element = elementLibrary.find(e => e.id === selectedElement);
            if (!element) return null;
            
            return (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {element.icon}
                  <span className="font-medium">{element.name}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {element.description}
                </p>
                <Badge variant="outline" className="text-xs">
                  {element.category}
                </Badge>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default ElementLibrary;