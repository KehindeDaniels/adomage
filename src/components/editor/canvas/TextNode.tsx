// src/components/editor/canvas/TextNode.tsx
'use client';

import React from 'react';
import { Text as KText } from 'react-konva';
import type { TextLayer } from '@/types/editor';

type Props = {
  layer: TextLayer;
  scale: number;                 
  selected: boolean;
  onSelect: (id: string) => void;
};

const TextNode: React.FC<Props> = ({ layer, scale, onSelect }) => {
  const x = layer.x * scale;
  const y = layer.y * scale;
  const width = layer.width ? layer.width * scale : undefined;

  return (
    <KText
      x={x}
      y={y}
      width={width}
      text={layer.text}
      fontFamily={layer.fontFamily}
      fontSize={layer.fontSize * scale}
      fontStyle={layer.fontWeight === 'bold' ? 'bold' : 'normal'}
      fill={layer.fill}
      opacity={layer.opacity}
      align={layer.align}
      rotation={layer.rotation}
      onClick={() => onSelect(layer.id)}
      onTap={() => onSelect(layer.id)}
      listening
      shadowForStrokeEnabled={false}
      perfectDrawEnabled={false}
      strokeEnabled={false}
    />
  );
};

export default TextNode;
