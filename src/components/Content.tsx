"use client";

import dynamic from "next/dynamic";
const EditorCanvas = dynamic(() => import("@/components/EditorCanvas"), { ssr: false });

// import ImagePicker from "@/components/ImagePicker";
import { useEditor } from "@/store/editor";

export default function Content() {
  const addText = useEditor((s) => s.addText);
  const undo = useEditor((s) => s.undo);
  const redo = useEditor((s) => s.redo);
  const reset = useEditor((s) => s.reset);
  const past = useEditor((s) => s.past.length);
  const future = useEditor((s) => s.future.length);

  return (
    <main className="h-dvh grid grid-cols-[260px_1fr_320px]">
      {/* Left: Layers / Image picker */}
      <aside className="border-r p-3 space-y-3">
        <h2 className="font-medium">Layers</h2>
        <ImagePicker />
        {/* TODO: list/select/reorder/delete text layers here */}
      </aside>

      {/* Center: Canvas */}
      <section className="relative">
        <EditorCanvas />
      </section>

      {/* Right: Toolbar */}
      <aside className="border-l p-3 space-y-3">
        <div className="flex items-center gap-2">
          <button onClick={addText} className="border px-2 py-1 rounded">Add Text</button>
          <button onClick={undo} disabled={!past} className="border px-2 py-1 rounded disabled:opacity-40">Undo</button>
          <button onClick={redo} disabled={!future} className="border px-2 py-1 rounded disabled:opacity-40">Redo</button>
          <span className="text-xs opacity-70">Step {past + 1} / {past + 1 + future}</span>
        </div>
        <button onClick={reset} className="border px-2 py-1 rounded">Reset</button>
        {/* TODO: style controls + export */}
      </aside>
    </main>
  );
}
