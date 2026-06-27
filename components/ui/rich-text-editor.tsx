'use client';

import type { Content } from '@tiptap/react';

import { MinimalTiptapEditor } from '@/components/ui/minimal-tiptap';
import { cn } from '@/lib/utils';

export interface RichTextEditorProps {
  id?: string;
  value?: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  disabled?: boolean;
  className?: string;
  'aria-invalid'?: boolean;
}

export function RichTextEditor({
  value = '',
  onChange,
  placeholder,
  minHeight = '200px',
  disabled = false,
  className,
  'aria-invalid': ariaInvalid
}: RichTextEditorProps) {
  const handleChange = (content: Content) => {
    onChange(typeof content === 'string' ? content : '');
  };

  return (
    <div className="w-full" style={{ minHeight }}>
      <MinimalTiptapEditor
        value={value}
        onChange={handleChange}
        output="html"
        placeholder={placeholder}
        editable={!disabled}
        className={cn(
          'h-full',
          ariaInvalid && 'border-destructive ring-destructive/20',
          disabled && 'pointer-events-none opacity-60',
          className
        )}
        editorContentClassName="min-h-[inherit] p-4"
      />
    </div>
  );
}
