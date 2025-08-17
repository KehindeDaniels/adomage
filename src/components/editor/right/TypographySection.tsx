'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useFontLoader } from '@/hooks/useFontLoader';
import { useEditorActions, useSelectedId, useTextLayers } from '@/store/editorStore';

// Some handy, popular families (user can also type any Google Font name)
const COMMON_FONTS = [
  'Inter',
  'Roboto',
  'Montserrat',
  'Poppins',
  'Lato',
  'Open Sans',
  'Oswald',
  'Playfair Display',
  'Source Sans 3',
  'Nunito',
];

const WEIGHTS: Array<{ label: string; value: string }> = [
  { label: '100', value: '100' },
  { label: '200', value: '200' },
  { label: '300', value: '300' },
  { label: 'Regular (400)', value: '400' },
  { label: '500', value: '500' },
  { label: '600', value: '600' },
  { label: 'Bold (700)', value: '700' },
  { label: '800', value: '800' },
  { label: '900', value: '900' },
];

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const findSelectedLayer = (layers: ReturnType<typeof useTextLayers>, id: string | null) =>
  layers.find((l) => l.id === id);

const parseWeight = (value: string | number | undefined) => {
  if (typeof value === 'number') return String(value);
  if (!value) return '400';
  return value === 'bold' ? '700' : value === 'normal' ? '400' : value;
};

const toNum = (v: string, fallback: number) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const TypographySection: React.FC = () => {
  const selectedId = useSelectedId();
  const layers = useTextLayers();
  const { updateTextProps } = useEditorActions();

  const layer = findSelectedLayer(layers, selectedId ?? null);

  // Load current family (and a couple of common weights)

  const family = layer?.fontFamily;
  const weightStr = layer ? parseWeight(layer.fontWeight) : "400";
  const status = useFontLoader(family, [400, 700, Number(weightStr)]);

  // Empty state (nothing selected)
  if (!layer) {
    return (
      <div className="rounded-lg border bg-card p-3">
        <div className="text-sm font-medium mb-1">Typography</div>
        <div className="text-xs text-muted-foreground">
          Select a text layer to edit its font.
        </div>
      </div>
    );
  }

  const onChangeFamily = (family: string) => {
    updateTextProps(layer.id, { fontFamily: family });
  };

  const onCommitFamilyInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    if (val) onChangeFamily(val);
  };

  const onChangeSizeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = clamp(toNum(e.target.value, layer.fontSize), 4, 1000);
    updateTextProps(layer.id, { fontSize: next });
  };

  const onChangeSizeSlider = (vals: number[]) => {
    const next = clamp(vals[0] ?? layer.fontSize, 4, 1000);
    updateTextProps(layer.id, { fontSize: next });
  };

  const onChangeWeight = (val: string) => {
    // store as numeric 100..900 to keep it precise
    const n = toNum(val, 400);
    updateTextProps(layer.id, { fontWeight: n });
  };

  return (
    <div className="rounded-lg border bg-card p-3 space-y-3">
      <div className="text-sm font-medium">Typography</div>

      {/* Font Family */}
      <div className="grid gap-2">
        <Label htmlFor="fontFamily">Font family</Label>
        <div className="flex gap-2">
          <Select onValueChange={onChangeFamily} value={layer.fontFamily}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Choose family" />
            </SelectTrigger>
            <SelectContent>
              {COMMON_FONTS.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Free text (any Google font name) */}
          <Input
            id="fontFamily"
            placeholder="Or type a Google Font…"
            defaultValue={layer.fontFamily}
            onBlur={onCommitFamilyInput}
            className="w-full"
          />
        </div>
        {status === "loading" && (
          <div className="text-[11px] text-muted-foreground">Loading font…</div>
        )}
        {status === "inactive" && (
          <div className="text-[11px] text-destructive">
            Couldn’t load that font family.
          </div>
        )}
      </div>

      {/* Font Size (original px) */}
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="fontSize">Font size (px)</Label>
          <Input
            id="fontSize"
            type="number"
            inputMode="numeric"
            className="w-24 h-8"
            value={layer.fontSize}
            onChange={onChangeSizeInput}
            min={4}
            max={1000}
          />
        </div>
        <Slider
          value={[clamp(layer.fontSize, 4, 1000)]}
          min={4}
          max={200}
          step={1}
          onValueChange={onChangeSizeSlider}
        />
      </div>

      {/* Weight */}
      <div className="grid gap-2">
        <Label htmlFor="fontWeight">Font weight</Label>
        <Select onValueChange={onChangeWeight} value={weightStr}>
          <SelectTrigger id="fontWeight">
            <SelectValue placeholder="Weight" />
          </SelectTrigger>
          <SelectContent>
            {WEIGHTS.map((w) => (
              <SelectItem key={w.value} value={w.value}>
                {w.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TypographySection;
