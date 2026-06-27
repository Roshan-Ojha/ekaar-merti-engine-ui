import * as React from 'react';
import { CaretDownIcon } from '@radix-ui/react-icons';
import type { Editor } from '@tiptap/react';
import { TableIcon } from 'lucide-react';

import { ToolbarButton } from '../toolbar-button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface SectionSixProps {
  editor: Editor;
}

export const SectionSix: React.FC<SectionSixProps> = ({ editor }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ToolbarButton tooltip="Table" aria-label="Table">
          <TableIcon className="size-5" />
          <CaretDownIcon className="size-5" />
        </ToolbarButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
          Insert 3×3 table
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={!editor.can().addRowAfter()}
          onClick={() => editor.chain().focus().addRowAfter().run()}>
          Add row below
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={!editor.can().addColumnAfter()}
          onClick={() => editor.chain().focus().addColumnAfter().run()}>
          Add column right
        </DropdownMenuItem>
        <DropdownMenuItem disabled={!editor.can().deleteRow()} onClick={() => editor.chain().focus().deleteRow().run()}>
          Delete row
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={!editor.can().deleteColumn()}
          onClick={() => editor.chain().focus().deleteColumn().run()}>
          Delete column
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={!editor.can().deleteTable()}
          onClick={() => editor.chain().focus().deleteTable().run()}>
          Delete table
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

SectionSix.displayName = 'SectionSix';
