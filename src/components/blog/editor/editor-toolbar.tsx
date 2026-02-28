'use client';

import { useRef, useCallback } from 'react';
import type { Editor } from '@tiptap/react';
import {
  Bold, Italic, Underline, Strikethrough,
  List, ListOrdered, Quote, Code, Code2,
  Heading1, Heading2, Heading3,
  Image, Undo2, Redo2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { apiClient } from '@/lib/api/client';
import { cn } from '@/lib/utils';

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  label: string;
  icon: React.ReactNode;
}

function ToolbarButton({ onClick, isActive, disabled, label, icon }: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClick}
          disabled={disabled}
          aria-label={label}
          aria-pressed={isActive}
          className={cn(
            'h-8 w-8 rounded',
            isActive && 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white'
          )}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p className="text-xs">{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

function Divider() {
  return <div className="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-700" />;
}

interface EditorToolbarProps {
  editor: Editor | null;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;

      try {
        const formData = new FormData();
        formData.append('file', file);

        const { data } = await apiClient.post<{ success: boolean; url: string }>(
          '/blog/upload-image',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        if (data.success && data.url) {
          editor.chain().focus().setImage({ src: data.url }).run();
        }
      } catch (err) {
        console.error('[EditorToolbar] Image upload failed:', err);
      } finally {
        // Reset input so the same file can be re-selected
        if (imageInputRef.current) imageInputRef.current.value = '';
      }
    },
    [editor]
  );

  if (!editor) return null;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-wrap items-center gap-0.5 rounded-t-lg border border-b-0 border-gray-200 bg-gray-50 px-2 py-1.5 dark:border-gray-700 dark:bg-gray-800/50">
        {/* Headings */}
        <ToolbarButton
          label="Heading 1"
          icon={<Heading1 className="h-4 w-4" />}
          isActive={editor.isActive('heading', { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        />
        <ToolbarButton
          label="Heading 2"
          icon={<Heading2 className="h-4 w-4" />}
          isActive={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        />
        <ToolbarButton
          label="Heading 3"
          icon={<Heading3 className="h-4 w-4" />}
          isActive={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        />

        <Divider />

        {/* Text formatting */}
        <ToolbarButton
          label="Bold"
          icon={<Bold className="h-4 w-4" />}
          isActive={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          label="Italic"
          icon={<Italic className="h-4 w-4" />}
          isActive={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          label="Underline"
          icon={<Underline className="h-4 w-4" />}
          isActive={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        />
        <ToolbarButton
          label="Strikethrough"
          icon={<Strikethrough className="h-4 w-4" />}
          isActive={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        />

        <Divider />

        {/* Lists */}
        <ToolbarButton
          label="Bullet List"
          icon={<List className="h-4 w-4" />}
          isActive={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          label="Ordered List"
          icon={<ListOrdered className="h-4 w-4" />}
          isActive={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />

        <Divider />

        {/* Block elements */}
        <ToolbarButton
          label="Blockquote"
          icon={<Quote className="h-4 w-4" />}
          isActive={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />
        <ToolbarButton
          label="Inline Code"
          icon={<Code className="h-4 w-4" />}
          isActive={editor.isActive('code')}
          onClick={() => editor.chain().focus().toggleCode().run()}
        />
        <ToolbarButton
          label="Code Block"
          icon={<Code2 className="h-4 w-4" />}
          isActive={editor.isActive('codeBlock')}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        />

        <Divider />

        {/* Image */}
        <ToolbarButton
          label="Insert Image"
          icon={<Image className="h-4 w-4" />}
          onClick={() => imageInputRef.current?.click()}
        />
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
          aria-hidden
        />

        <Divider />

        {/* History */}
        <ToolbarButton
          label="Undo"
          icon={<Undo2 className="h-4 w-4" />}
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        />
        <ToolbarButton
          label="Redo"
          icon={<Redo2 className="h-4 w-4" />}
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        />
      </div>
    </TooltipProvider>
  );
}
