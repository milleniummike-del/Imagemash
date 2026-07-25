import React, { useRef } from 'react';
import { Upload, ArrowRightLeft, Trash2, Image as ImageIcon, Sparkles, Layers, CheckCircle2 } from 'lucide-react';
import { ImageUploadData, PresetPair } from '../types';
import { PRESET_PAIRS } from '../data/presets';

interface ImageUploaderProps {
  imageA: ImageUploadData | null;
  imageB: ImageUploadData | null;
  onSelectImageA: (data: ImageUploadData | null) => void;
  onSelectImageB: (data: ImageUploadData | null) => void;
  onSwapImages: () => void;
  onAnalyzeAndGenerate: () => void;
  isAnalyzing: boolean;
  isGenerating: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageA,
  imageB,
  onSelectImageA,
  onSelectImageB,
  onSwapImages,
  onAnalyzeAndGenerate,
  isAnalyzing,
  isGenerating,
}) => {
  const fileInputARef = useRef<HTMLInputElement>(null);
  const fileInputBRef = useRef<HTMLInputElement>(null);

  // Helper to convert file to ImageUploadData
  const processFile = (file: File, callback: (data: ImageUploadData) => void) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        callback({
          dataUrl,
          mimeType: file.type || 'image/jpeg',
          base64Data: dataUrl,
          name: file.name,
          width: img.width,
          height: img.height,
        });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Helper to load image from URL (preset)
  const loadPreset = async (preset: PresetPair) => {
    try {
      const fetchAsData = async (url: string, name: string): Promise<ImageUploadData> => {
        const res = await fetch(url);
        const blob = await res.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const dataUrl = reader.result as string;
            const img = new Image();
            img.onload = () => {
              resolve({
                dataUrl,
                mimeType: blob.type || 'image/jpeg',
                base64Data: dataUrl,
                name,
                width: img.width,
                height: img.height,
              });
            };
            img.onerror = reject;
            img.src = dataUrl;
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      };

      const [dataA, dataB] = await Promise.all([
        fetchAsData(preset.imageA.url, preset.imageA.title),
        fetchAsData(preset.imageB.url, preset.imageB.title),
      ]);

      onSelectImageA(dataA);
      onSelectImageB(dataB);
    } catch (err) {
      console.error('Failed to load preset pair:', err);
    }
  };

  const isReady = Boolean(imageA && imageB);

  return (
    <div className="space-y-6">
      {/* Upper Title banner */}
      <div className="text-center max-w-2xl mx-auto py-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Select Two Source Images
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Upload any 2 images or pick a curated preset pair. Gemini will deconstruct both images and synthesize <strong className="text-indigo-400">5 distinct new visual fusions</strong>.
        </p>
      </div>

      {/* Dual Upload Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {/* Swap Button in center for desktop */}
        {imageA && imageB && (
          <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <button
              onClick={onSwapImages}
              disabled={isAnalyzing || isGenerating}
              className="p-3 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-full border border-slate-700 shadow-2xl transition hover:scale-110 active:scale-95 disabled:opacity-50 cursor-pointer"
              title="Swap Image A and Image B"
            >
              <ArrowRightLeft className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Image A Dropzone */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col justify-between relative group hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center border border-indigo-500/30">
                A
              </span>
              <span className="text-sm font-semibold text-slate-200">
                Source Image 1 (Primary Base)
              </span>
            </div>
            {imageA && (
              <button
                onClick={() => onSelectImageA(null)}
                className="text-slate-500 hover:text-rose-400 p-1 rounded transition cursor-pointer"
                title="Remove Image 1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {imageA ? (
            <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video sm:aspect-[4/3] flex items-center justify-center group">
              <img
                src={imageA.dataUrl}
                alt={imageA.name}
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-3 p-4">
                <button
                  onClick={() => fileInputARef.current?.click()}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white rounded-lg border border-slate-600 transition cursor-pointer"
                >
                  Change Image
                </button>
              </div>
              <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 bg-slate-950/80 backdrop-blur rounded-lg border border-slate-800 text-[11px] text-slate-300 truncate flex justify-between items-center">
                <span className="truncate">{imageA.name}</span>
                {imageA.width && imageA.height && (
                  <span className="text-slate-500 ml-2 shrink-0">{imageA.width}×{imageA.height}</span>
                )}
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputARef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) {
                  processFile(e.dataTransfer.files[0], onSelectImageA);
                }
              }}
              className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-500/5 rounded-xl aspect-video sm:aspect-[4/3] flex flex-col items-center justify-center p-6 text-center cursor-pointer transition group"
            >
              <div className="w-12 h-12 rounded-full bg-slate-800/80 group-hover:bg-indigo-500/20 flex items-center justify-center mb-3 text-slate-400 group-hover:text-indigo-400 transition">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-300 group-hover:text-white">
                Upload Image A
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Drag & drop or click to browse (PNG, JPG, WEBP)
              </p>
            </div>
          )}

          <input
            ref={fileInputARef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                processFile(e.target.files[0], onSelectImageA);
              }
            }}
          />
        </div>

        {/* Image B Dropzone */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col justify-between relative group hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 text-xs font-bold flex items-center justify-center border border-purple-500/30">
                B
              </span>
              <span className="text-sm font-semibold text-slate-200">
                Source Image 2 (Secondary Accent)
              </span>
            </div>
            {imageB && (
              <button
                onClick={() => onSelectImageB(null)}
                className="text-slate-500 hover:text-rose-400 p-1 rounded transition cursor-pointer"
                title="Remove Image 2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {imageB ? (
            <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video sm:aspect-[4/3] flex items-center justify-center group">
              <img
                src={imageB.dataUrl}
                alt={imageB.name}
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-3 p-4">
                <button
                  onClick={() => fileInputBRef.current?.click()}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white rounded-lg border border-slate-600 transition cursor-pointer"
                >
                  Change Image
                </button>
              </div>
              <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 bg-slate-950/80 backdrop-blur rounded-lg border border-slate-800 text-[11px] text-slate-300 truncate flex justify-between items-center">
                <span className="truncate">{imageB.name}</span>
                {imageB.width && imageB.height && (
                  <span className="text-slate-500 ml-2 shrink-0">{imageB.width}×{imageB.height}</span>
                )}
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputBRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) {
                  processFile(e.dataTransfer.files[0], onSelectImageB);
                }
              }}
              className="border-2 border-dashed border-slate-800 hover:border-purple-500/50 hover:bg-purple-500/5 rounded-xl aspect-video sm:aspect-[4/3] flex flex-col items-center justify-center p-6 text-center cursor-pointer transition group"
            >
              <div className="w-12 h-12 rounded-full bg-slate-800/80 group-hover:bg-purple-500/20 flex items-center justify-center mb-3 text-slate-400 group-hover:text-purple-400 transition">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-300 group-hover:text-white">
                Upload Image B
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Drag & drop or click to browse (PNG, JPG, WEBP)
              </p>
            </div>
          )}

          <input
            ref={fileInputBRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                processFile(e.target.files[0], onSelectImageB);
              }
            }}
          />
        </div>
      </div>

      {/* Preset Pairs Tray */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Or Try Curated Sample Image Pairs
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">1-Click Instant Load</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_PAIRS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => loadPreset(preset)}
              disabled={isAnalyzing || isGenerating}
              className="group text-left p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800/80 hover:border-indigo-500/40 transition flex items-center space-x-3 cursor-pointer disabled:opacity-50"
            >
              <div className="flex -space-x-2 overflow-hidden shrink-0">
                <img
                  src={preset.imageA.url}
                  alt={preset.imageA.title}
                  className="inline-block h-10 w-10 rounded-lg object-cover ring-2 ring-slate-900"
                  referrerPolicy="no-referrer"
                />
                <img
                  src={preset.imageB.url}
                  alt={preset.imageB.title}
                  className="inline-block h-10 w-10 rounded-lg object-cover ring-2 ring-slate-900"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-200 group-hover:text-indigo-300 truncate">
                  {preset.name}
                </p>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">
                  {preset.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Action Trigger Button */}
      <div className="pt-2 text-center">
        <button
          onClick={onAnalyzeAndGenerate}
          disabled={!isReady || isAnalyzing || isGenerating}
          className="w-full sm:w-auto min-w-[320px] px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold text-base shadow-2xl shadow-purple-600/30 border border-purple-400/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center justify-center space-x-3 mx-auto"
        >
          {isAnalyzing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing Image DNA with Gemini...</span>
            </>
          ) : isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Synthesizing 5 New Images...</span>
            </>
          ) : (
            <>
              <Layers className="w-5 h-5 text-purple-200" />
              <span>Analyze & Generate 5 Fusion Concepts</span>
            </>
          )}
        </button>
        {!isReady && (
          <p className="text-xs text-slate-500 mt-2">
            Please select or upload 2 images to enable fusion synthesis.
          </p>
        )}
      </div>
    </div>
  );
};
