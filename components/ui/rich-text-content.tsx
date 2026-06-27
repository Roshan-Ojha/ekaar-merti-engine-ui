'use client';

import '@/components/ui/minimal-tiptap/styles/index.css';

import { cn } from '@/lib/utils';

export interface RichTextContentProps {
  html: string;
  className?: string;
}

export function RichTextContent({ html, className }: RichTextContentProps) {
  if (!html.trim()) {
    return <p className="text-muted-foreground text-sm italic">No content.</p>;
  }

  return (
    <div
      className={cn('minimal-tiptap-editor ProseMirror p-4', className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
