'use client';

import { useEffect, useRef } from 'react';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import { useViewportBox } from '@/hooks/useViewportBox';
import { useDisplay, useEditorActions, useHasImage, useImageMeta } from '@/store/editorStore';
import UploadController from '../UploadController';
import FileDropTarget from './FileDropTarget'; // keep this if you added it

const VIEWPORT_MAX_HEIGHT = 480;

const CanvasStage: React.FC = () => {
  const hasImage = useHasImage();
  const image = useImageMeta();
  const display = useDisplay();
  const { setImageFromFile, setDisplayByContainer } = useEditorActions();

  // 1-liner: dataURL -> HTMLImageElement
  const [htmlImage] = useImage(image?.src || '', 'anonymous');

  // Fixed-height viewport the Stage must fit into
  const viewportRef = useRef<HTMLDivElement>(null);

  // Important: pass 'hasImage' so the hook re-inits when we switch from empty -> canvas
  const { width: boxW, height: boxH } = useViewportBox(viewportRef, hasImage);

  // Whenever the viewport size changes, ask the store to fit the image into it.
// Recompute when viewport size changes
// before the effect:
const imgSrc = image?.src;

useEffect(() => {
  if (!boxW || !boxH) return;
  if (!imgSrc) return;           // ← no direct "image" reference
  setDisplayByContainer(boxW, boxH);
}, [boxW, boxH, imgSrc, setDisplayByContainer]);   // ← no 'image' in deps

  return (
    <div className="relative flex w-full items-center justify-center">
   <div
  className="relative w-full max-w-[980px] rounded-2xl bg-muted/20 border border-border/60 p-4 overflow-hidden"
  style={{ minHeight: 520 }}
>
        {!hasImage ? (
          <UploadController
            variant="card"
            onSelect={setImageFromFile}
            description="Drag & drop or click. Only PNG files are accepted."
            className="h-[380px]"
          />
        ) : (
          // If you added FileDropTarget, keep it — it enables drop over the Stage
          <FileDropTarget
            onFile={setImageFromFile}
            accept="image/png"
            className="w-full"
            overlayText="Drop PNG to replace background"
          >
            <div
              ref={viewportRef}
              className="flex w-full items-center justify-center"
              style={{ height: VIEWPORT_MAX_HEIGHT }}
            >
              {!htmlImage || !display.width || !display.height ? (
                <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                  Preparing canvas…
                </div>
              ) : (
                <Stage
                  width={display.width}
                  height={display.height}
                  className="rounded-xl shadow-md bg-transparent"
                >
                  <Layer listening={false}>
                    <KonvaImage
                      image={htmlImage}
                      width={display.width}
                      height={display.height}
                    />
                  </Layer>
                  {/* TODO: GuideLayer + TextLayer go here */}
                </Stage>
              )}
            </div>
          </FileDropTarget>
        )}
      </div>
    </div>
  );
};

export default CanvasStage;
