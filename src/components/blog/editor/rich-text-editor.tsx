'use client';

import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { EditorToolbar } from './editor-toolbar';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  /** Current HTML content (controlled) */
  value: string;
  /** Called with updated HTML every time the editor content changes */
  onChange: (html: string) => void;
  /** Optional additional className for the wrapper */
  className?: string;
  /** Whether the editor is in read-only mode */
  readOnly?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  className,
  readOnly = false,
}: RichTextEditorProps) {
  const editor = useEditor({
    editable: !readOnly,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: { languageClassPrefix: 'language-' },
      }),
      ImageExtension.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({ placeholder: 'Start writing your post...' }),
      Underline,
    ],
    content: value,
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-gray dark:prose-invert max-w-none',
          'min-h-[400px] px-5 py-4 outline-none',
          'focus:outline-none'
        ),
      },
    },
  });

  // Sync external value changes (e.g. when editing an existing post)
  useEffect(() => {
    if (!editor) return;
    const currentHTML = editor.getHTML();
    if (value !== currentHTML) {
      editor.commands.setContent(value, false);
    }
  }, [editor, value]);

  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900',
        className
      )}
    >
      {!readOnly && <EditorToolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}
