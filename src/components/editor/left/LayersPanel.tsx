// src/components/editor/left/LayersPanel.tsx
'use client';

import React from 'react';
import { Image as ImageIcon, Plus, Trash2, Pencil } from 'lucide-react';
import UploadController from '../UploadController';
import { shortFileLabel } from '@/lib/format';
import {
  useImageMeta,
  useTextLayers,
  useSelectedId,
  useEditorActions,
} from '@/store/editorStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type LayersPanelProps = {
  hasImage: boolean;
  onReplace: (file: File) => void;
};

const LayersPanel: React.FC<LayersPanelProps> = ({ hasImage, onReplace }) => {
  const meta = useImageMeta();
  const bgLabel = shortFileLabel(meta?.name, { maxBase: 10 });

  const layers = useTextLayers();
  const selectedId = useSelectedId();
  const { addTextLayer, selectTextLayer, updateTextProps, deleteTextLayer } = useEditorActions();

  // simple local edit toggle per id
  const [editingId, setEditingId] = React.useState<string | null>(null);

  return (
    <div className="space-y-4">
      {/* Upload/Replace background */}
      <UploadController
        variant="card"
        label={hasImage ? 'Click to Replace background png' : 'Upload background PNG'}
        onSelect={onReplace}
        accept="image/png"
        className="w-full"
      />

      {/* Background meta */}
      <div className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2">
        <ImageIcon className="h-5 w-5 opacity-80" />
        <div className="min-w-0">
          <div className="text-sm font-medium">Background image</div>
          <div className="truncate text-xs text-muted-foreground" title={meta?.name ?? undefined}>
            {hasImage ? bgLabel : 'No image selected'}
          </div>
        </div>
      </div>

      {/* Text layers header + add */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Text layers</h3>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => addTextLayer()}
          disabled={!hasImage}
          className="gap-1"
        >
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>

      {/* List */}
      <div className="space-y-2">
        {layers.map((l, idx) => {
          const active = l.id === selectedId;
          const isEditing = editingId === l.id;

          return (
            <div
              key={l.id}
              className={cn(
                'rounded-lg border p-2',
                active ? 'bg-secondary/40 border-border' : 'hover:bg-secondary/30'
              )}
              onClick={() => selectTextLayer(l.id)}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">
                    {`Text layer ${idx + 1}`}
                  </div>
                  {!isEditing ? (
                    <div className="text-xs text-muted-foreground truncate">
                      {l.text || '(empty)'}
                    </div>
                  ) : null}
                </div>

                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingId(isEditing ? null : l.id)}
                    aria-label="Edit text"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTextLayer(l.id)}
                    aria-label="Delete layer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* inline editor */}
              {isEditing && (
                <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                  <Input
                    value={l.text}
                    onChange={(e) => updateTextProps(l.id, { text: e.target.value })}
                    placeholder="Type text…"
                  />
                </div>
              )}
            </div>
          );
        })}
        {layers.length === 0 && (
          <div className="text-xs text-muted-foreground">No text layers yet.</div>
        )}
      </div>
    </div>
  );
};

export default LayersPanel;
