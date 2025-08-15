"use client";

import { Button } from "@/components/ui/button";
import { Undo2, Upload, Download, RotateCcw } from "lucide-react";

type Props = {
  onUpload: () => void;
  onExport: () => void;
  onUndo: () => void;
  onReset: () => void;
  canUndo?: boolean;
};

export function CanvasToolbar({ onUpload, onExport, onUndo, onReset, canUndo }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={onUpload} aria-label="Upload">
          <Upload className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onExport} aria-label="Export">
          <Download className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onUndo} disabled={!canUndo} aria-label="Undo">
          <Undo2 className="h-4 w-4" />
        </Button>
      </div>

      <Button variant="outline" onClick={onReset}>
        <RotateCcw className="h-4 w-4 mr-2" />
        Reset
      </Button>
    </div>
  );
}
