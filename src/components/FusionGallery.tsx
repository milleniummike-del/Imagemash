import React, { useState } from 'react';
import { FusionConcept, GeneratedImageResult } from '../types';
import { ConceptCard } from './ConceptCard';
import { Download, Layers, Sparkles, X, ZoomIn, Copy, Check } from 'lucide-react';

interface FusionGalleryProps {
  concepts: FusionConcept[];
  results: Record<number, GeneratedImageResult>;
  onRegenerate: (conceptId: number, customPrompt?: string) => void;
  onOpenTweakModal: (concept: FusionConcept) => void;
  generatingIds: number[];
  imageAUrl?: string;
  imageBUrl?: string;
}

export const FusionGallery: React.FC<FusionGalleryProps> = ({
  concepts,
  results,
  onRegenerate,
  onOpenTweakModal,
  generatingIds,
  imageAUrl,
  imageBUrl,
}) => {
  const [lightbox, setLightbox] = useState<{
    isOpen: boolean;
    imageUrl: string;
    title: string;
    prompt: string;
  }>({
    isOpen: false,
    imageUrl: '',
    title: '',
    prompt: '',
  });

  const [promptCopied, setPromptCopied] = useState(false);

  const completedResults = (Object.values(results) as GeneratedImageResult[]).filter((r) => r.status === 'completed' && Boolean(r.imageUrl));

  const handleDownloadAll = () => {
    completedResults.forEach((res, idx) => {
      setTimeout(() => {
        const a = document.createElement('a');
        a.href = res.imageUrl;
        a.download = `Fusion-Image-${res.conceptId}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, idx * 300);
    });
  };

  const handleCopyLightboxPrompt = () => {
    navigator.clipboard.writeText(lightbox.prompt);
    setPromptCopied(true);
    setTimeout(() => setPromptCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Gallery Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span>5 Synthesized Fusion Artworks</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Each artwork blends visual concepts, color dynamics, and style from Source A & Source B.
          </p>
        </div>

        {completedResults.length > 0 && (
          <button
            onClick={handleDownloadAll}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg transition cursor-pointer self-start sm:self-auto"
          >
            <Download className="w-4 h-4" />
            <span>Download All ({completedResults.length}/5)</span>
          </button>
        )}
      </div>

      {/* Grid of 5 Concepts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {concepts.map((concept) => (
          <ConceptCard
            key={concept.id}
            concept={concept}
            result={results[concept.id]}
            onRegenerate={onRegenerate}
            onOpenLightbox={(imageUrl, title, prompt) =>
              setLightbox({ isOpen: true, imageUrl, title, prompt })
            }
            onOpenTweakModal={onOpenTweakModal}
            isGeneratingThis={generatingIds.includes(concept.id)}
          />
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightbox.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="relative max-w-5xl w-full bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col my-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white truncate">{lightbox.title}</h3>
              <button
                onClick={() => setLightbox({ ...lightbox, isOpen: false })}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body: Source comparisons + Large Image */}
            <div className="p-6 space-y-6">
              {/* Source vs Fusion visual pipeline */}
              {(imageAUrl || imageBUrl) && (
                <div className="flex items-center justify-center space-x-4 bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                  {imageAUrl && (
                    <div className="flex flex-col items-center">
                      <img
                        src={imageAUrl}
                        alt="Source A"
                        className="w-12 h-12 rounded-lg object-cover ring-2 ring-indigo-500"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-[10px] text-indigo-400 font-bold mt-1">Source A</span>
                    </div>
                  )}
                  <span className="text-slate-600 font-bold text-sm">+</span>
                  {imageBUrl && (
                    <div className="flex flex-col items-center">
                      <img
                        src={imageBUrl}
                        alt="Source B"
                        className="w-12 h-12 rounded-lg object-cover ring-2 ring-purple-500"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-[10px] text-purple-400 font-bold mt-1">Source B</span>
                    </div>
                  )}
                  <span className="text-slate-600 font-bold text-sm">=</span>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-indigo-500 to-pink-500 p-0.5">
                      <img
                        src={lightbox.imageUrl}
                        alt="Fusion"
                        className="w-full h-full rounded-[6px] object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold mt-1">Fused Artwork</span>
                  </div>
                </div>
              )}

              {/* Large Image View */}
              <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center max-h-[60vh]">
                <img
                  src={lightbox.imageUrl}
                  alt={lightbox.title}
                  className="max-h-[60vh] w-auto object-contain rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Prompt box */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-semibold">Generation Prompt Blueprint:</span>
                  <button
                    onClick={handleCopyLightboxPrompt}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 cursor-pointer"
                  >
                    {promptCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{promptCopied ? 'Copied' : 'Copy Prompt'}</span>
                  </button>
                </div>
                <p className="font-mono leading-relaxed text-slate-300 select-all">{lightbox.prompt}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 flex justify-end space-x-3 bg-slate-950">
              <a
                href={lightbox.imageUrl}
                download={`${lightbox.title.toLowerCase().replace(/\s+/g, '-')}.png`}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl shadow-lg transition flex items-center space-x-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Save High-Res Image</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
