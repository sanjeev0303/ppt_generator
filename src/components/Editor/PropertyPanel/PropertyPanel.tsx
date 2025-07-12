"use client";

import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Type,
  Palette,
  Layout,
  Settings,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  Link,
  Image,
  Trash2
} from 'lucide-react';
import { ContentItem, ContentType } from '@/lib/type';
import { useSlideStore } from '@/store/useSlideStore';

interface PropertyPanelProps {
  selectedElement: ContentItem | null;
  onUpdate: (updates: Partial<ContentItem>) => void;
  onDelete: () => void;
}

interface TextProperties {
  fontSize: number;
  fontWeight: 'normal' | 'bold' | 'light' | 'medium' | 'semibold';
  fontStyle: 'normal' | 'italic';
  textAlign: 'left' | 'center' | 'right' | 'justify';
  color: string;
  backgroundColor: string;
  textDecoration: 'none' | 'underline' | 'line-through';
}

interface LayoutProperties {
  width: string;
  height: string;
  padding: number;
  margin: number;
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
}

interface ImageProperties {
  width: string;
  height: string;
  alt: string;
  borderRadius: number;
  opacity: number;
}

const FontSizePresets = [
  { label: 'Small', value: 12 },
  { label: 'Normal', value: 16 },
  { label: 'Large', value: 20 },
  { label: 'XL', value: 24 },
  { label: 'XXL', value: 32 },
  { label: 'XXXL', value: 48 }
];

const ColorPresets = [
  '#000000', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB', '#F3F4F6',
  '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E',
  '#10B981', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1', '#8B5CF6',
  '#A855F7', '#D946EF', '#EC4899', '#F43F5E'
];

export const PropertyPanel: React.FC<PropertyPanelProps> = ({ 
  selectedElement, 
  onUpdate, 
  onDelete 
}) => {
  const [activeTab, setActiveTab] = useState('content');
  
  if (!selectedElement) {
    return (
      <div className="w-80 h-full border-l bg-white dark:bg-gray-900 flex flex-col items-center justify-center">
        <div className="text-center text-gray-500 p-8">
          <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No Element Selected</h3>
          <p className="text-sm">Select an element to edit its properties</p>
        </div>
      </div>
    );
  }

  const getTextProperties = (): TextProperties => {
    // Parse className to extract text properties
    const className = selectedElement.className || '';
    return {
      fontSize: 16,
      fontWeight: className.includes('font-bold') ? 'bold' : 
                 className.includes('font-light') ? 'light' :
                 className.includes('font-medium') ? 'medium' :
                 className.includes('font-semibold') ? 'semibold' : 'normal',
      fontStyle: className.includes('italic') ? 'italic' : 'normal',
      textAlign: className.includes('text-center') ? 'center' :
                className.includes('text-right') ? 'right' :
                className.includes('text-justify') ? 'justify' : 'left',
      color: '#000000',
      backgroundColor: 'transparent',
      textDecoration: className.includes('underline') ? 'underline' :
                     className.includes('line-through') ? 'line-through' : 'none'
    };
  };

  const getLayoutProperties = (): LayoutProperties => {
    return {
      width: 'auto',
      height: 'auto',
      padding: 0,
      margin: 0,
      borderRadius: 0,
      borderWidth: 0,
      borderColor: '#000000'
    };
  };

  const getImageProperties = (): ImageProperties => {
    return {
      width: 'auto',
      height: 'auto',
      alt: selectedElement.alt || '',
      borderRadius: 0,
      opacity: 100
    };
  };

  const updateTextProperty = (property: keyof TextProperties, value: any) => {
    const currentClassName = selectedElement.className || '';
    let newClassName = currentClassName;

    // Update className based on property changes
    switch (property) {
      case 'fontWeight':
        newClassName = newClassName.replace(/font-(normal|bold|light|medium|semibold)/g, '');
        if (value !== 'normal') {
          newClassName += ` font-${value}`;
        }
        break;
      case 'fontStyle':
        newClassName = newClassName.replace(/italic/g, '');
        if (value === 'italic') {
          newClassName += ' italic';
        }
        break;
      case 'textAlign':
        newClassName = newClassName.replace(/text-(left|center|right|justify)/g, '');
        if (value !== 'left') {
          newClassName += ` text-${value}`;
        }
        break;
      case 'textDecoration':
        newClassName = newClassName.replace(/(underline|line-through)/g, '');
        if (value !== 'none') {
          newClassName += ` ${value}`;
        }
        break;
    }

    onUpdate({ className: newClassName.trim() });
  };

  const renderContentTab = () => {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="content">Content</Label>
          {selectedElement.type === 'image' ? (
            <div className="space-y-2">
              <Input
                id="content"
                value={selectedElement.content as string || ''}
                onChange={(e) => onUpdate({ content: e.target.value })}
                placeholder="Image URL"
              />
              <Input
                value={selectedElement.alt || ''}
                onChange={(e) => onUpdate({ alt: e.target.value })}
                placeholder="Alt text"
              />
            </div>
          ) : Array.isArray(selectedElement.content) ? (
            <Textarea
              id="content"
              value={(selectedElement.content as string[]).join('\n')}
              onChange={(e) => onUpdate({ content: e.target.value.split('\n') })}
              rows={4}
              placeholder="Enter list items (one per line)"
            />
          ) : (
            <Textarea
              id="content"
              value={selectedElement.content as string || ''}
              onChange={(e) => onUpdate({ content: e.target.value })}
              rows={4}
              placeholder="Enter your content here..."
            />
          )}
        </div>

        {selectedElement.type === 'link' && (
          <div>
            <Label htmlFor="link">Link URL</Label>
            <Input
              id="link"
              value={selectedElement.link || ''}
              onChange={(e) => onUpdate({ link: e.target.value })}
              placeholder="https://example.com"
            />
          </div>
        )}

        {selectedElement.type === 'codeBlock' && (
          <div>
            <Label htmlFor="language">Language</Label>
            <Select
              value={selectedElement.language || 'javascript'}
              onValueChange={(value) => onUpdate({ language: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
                <SelectItem value="css">CSS</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    );
  };

  const renderStyleTab = () => {
    const textProps = getTextProperties();
    
    return (
      <div className="space-y-4">
        {/* Typography */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Type className="w-4 h-4" />
            Typography
          </h4>
          
          <div className="space-y-3">
            {/* Font Size */}
            <div>
              <Label className="text-xs">Font Size</Label>
              <div className="flex gap-1 mt-1">
                {FontSizePresets.map(preset => (
                  <Button
                    key={preset.value}
                    variant="outline"
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => updateTextProperty('fontSize', preset.value)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Text Style */}
            <div>
              <Label className="text-xs">Style</Label>
              <div className="flex gap-1 mt-1">
                <Button
                  variant={textProps.fontWeight === 'bold' ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => updateTextProperty('fontWeight', 
                    textProps.fontWeight === 'bold' ? 'normal' : 'bold')}
                >
                  <Bold className="w-4 h-4" />
                </Button>
                <Button
                  variant={textProps.fontStyle === 'italic' ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => updateTextProperty('fontStyle', 
                    textProps.fontStyle === 'italic' ? 'normal' : 'italic')}
                >
                  <Italic className="w-4 h-4" />
                </Button>
                <Button
                  variant={textProps.textDecoration === 'underline' ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => updateTextProperty('textDecoration', 
                    textProps.textDecoration === 'underline' ? 'none' : 'underline')}
                >
                  <Underline className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Text Alignment */}
            <div>
              <Label className="text-xs">Alignment</Label>
              <div className="flex gap-1 mt-1">
                <Button
                  variant={textProps.textAlign === 'left' ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => updateTextProperty('textAlign', 'left')}
                >
                  <AlignLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant={textProps.textAlign === 'center' ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => updateTextProperty('textAlign', 'center')}
                >
                  <AlignCenter className="w-4 h-4" />
                </Button>
                <Button
                  variant={textProps.textAlign === 'right' ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => updateTextProperty('textAlign', 'right')}
                >
                  <AlignRight className="w-4 h-4" />
                </Button>
                <Button
                  variant={textProps.textAlign === 'justify' ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => updateTextProperty('textAlign', 'justify')}
                >
                  <AlignJustify className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Colors */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Colors
          </h4>
          
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Text Color</Label>
              <div className="grid grid-cols-6 gap-1 mt-1">
                {ColorPresets.map(color => (
                  <div
                    key={color}
                    className="w-6 h-6 rounded border cursor-pointer hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => updateTextProperty('color', color)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderLayoutTab = () => {
    const layoutProps = getLayoutProperties();
    
    return (
      <div className="space-y-4">
        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
          <Layout className="w-4 h-4" />
          Layout & Spacing
        </h4>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Width</Label>
              <Input
                value={layoutProps.width}
                onChange={(e) => {/* Handle width change */}}
                placeholder="auto"
                className="h-8"
              />
            </div>
            <div>
              <Label className="text-xs">Height</Label>
              <Input
                value={layoutProps.height}
                onChange={(e) => {/* Handle height change */}}
                placeholder="auto"
                className="h-8"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs">Padding</Label>
            <Slider
              value={[layoutProps.padding]}
              onValueChange={(value) => {/* Handle padding change */}}
              max={50}
              step={1}
              className="mt-2"
            />
            <div className="text-xs text-gray-500 mt-1">{layoutProps.padding}px</div>
          </div>

          <div>
            <Label className="text-xs">Border Radius</Label>
            <Slider
              value={[layoutProps.borderRadius]}
              onValueChange={(value) => {/* Handle border radius change */}}
              max={50}
              step={1}
              className="mt-2"
            />
            <div className="text-xs text-gray-500 mt-1">{layoutProps.borderRadius}px</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-80 h-full border-l bg-white dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Properties</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {selectedElement.type}
          </Badge>
          <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {selectedElement.name}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
          <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
          <TabsTrigger value="style" className="text-xs">Style</TabsTrigger>
          <TabsTrigger value="layout" className="text-xs">Layout</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <div className="p-4">
            <TabsContent value="content" className="mt-0">
              {renderContentTab()}
            </TabsContent>
            
            <TabsContent value="style" className="mt-0">
              {renderStyleTab()}
            </TabsContent>
            
            <TabsContent value="layout" className="mt-0">
              {renderLayoutTab()}
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default PropertyPanel;