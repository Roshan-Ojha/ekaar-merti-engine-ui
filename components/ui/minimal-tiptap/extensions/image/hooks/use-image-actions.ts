import { useCallback } from 'react';
import type { Node } from '@tiptap/pm/model';
import type { Editor } from '@tiptap/react';

import { isUrl } from '../../../utils';

interface UseImageActionsProps {
  editor: Editor;
  node: Node;
  src: string;
  onViewClick: (value: boolean) => void;
}

export type ImageActionHandlers = {
  onView?: () => void;
  onDownload?: () => void;
  onCopy?: () => void;
  onCopyLink?: () => void;
  onRemoveImg?: () => void;
};

export const useImageActions = ({ editor, node, src, onViewClick }: UseImageActionsProps) => {
  const isLink = isUrl(src);
  const attrs = node.attrs as { src: string; alt?: string };

  const onView = useCallback(() => {
    onViewClick(true);
  }, [onViewClick]);

  const onDownload = useCallback(() => {
    editor.commands.downloadImage({ src: attrs.src, alt: attrs.alt });
  }, [editor.commands, attrs.alt, attrs.src]);

  const onCopy = useCallback(() => {
    editor.commands.copyImage({ src: attrs.src });
  }, [editor.commands, attrs.src]);

  const onCopyLink = useCallback(() => {
    editor.commands.copyLink({ src: attrs.src });
  }, [editor.commands, attrs.src]);

  const onRemoveImg = useCallback(() => {
    editor.commands.command(({ tr, dispatch }) => {
      const { selection } = tr;
      const nodeAtSelection = tr.doc.nodeAt(selection.from);

      if (nodeAtSelection?.type.name === 'image') {
        if (dispatch) {
          tr.deleteSelection();

          return true;
        }
      }

      return false;
    });
  }, [editor.commands]);

  return { isLink, onView, onDownload, onCopy, onCopyLink, onRemoveImg };
};
