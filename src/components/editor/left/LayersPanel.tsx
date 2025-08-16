// src/components/editor/left/LayersPanel.tsx
'use client';

import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import UploadController from '../UploadController';
import { shortFileLabel } from '@/lib/format';
import { useImageMeta } from '@/store/editorStore';

type LayersPanelProps = {
  hasImage: boolean;
  name?: string;
  onReplace: (file: File) => void;
};

const LayersPanel: React.FC<LayersPanelProps> = ({ hasImage, onReplace }) => {

const meta = useImageMeta();
const display = shortFileLabel(meta?.name, { maxBase: 10 });
  return (
    <div className="space-y-3">
      {/* Replace / Upload CTA */}
<UploadController
  variant="card"
  label={hasImage ? 'Click to Replace background png' : 'Upload background PNG'}
  onSelect={onReplace}
  accept="image/png"
  className="w-full"
/>

      {/* Background name */}

<div className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2">
  <ImageIcon className="h-5 w-5 opacity-80" />
  <div className="min-w-0">
    <div className="text-sm font-medium">Background image</div>
    <div
      className="truncate text-xs text-muted-foreground"
      title={meta?.name ?? undefined}       
    >
      {hasImage ? display : 'No image selected'}
    </div>
  </div>
</div>
    </div>
  );
};

export default LayersPanel;
