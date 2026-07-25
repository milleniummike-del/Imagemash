import React, { useState } from 'react';
import { FusionConcept, GeneratedImageResult } from '../types';
import { Sparkles, Download, RefreshCw, ZoomIn, Copy, Check, MessageSquare, AlertCircle, Layers, Sliders } from 'lucide-react';

interface ConceptCardProps {
  concept: FusionConcept;
  result?: GeneratedImageResult;
  onRegenerate: (conceptId: number, customPrompt?: string) => void;
  onOpenLightbox: (imageUrl: string, title: string, prompt: string) => void;
  onOpenTweakModal: (concept: FusionConcept) => void;
  isGeneratingThis: boolean;
}

export const ConceptCard: React.FC<ConceptCardProps> = ({
  concept,
  result,
  onRegenerate,
  onOpenLightbox,
  onOpenTweakModal,
  isGeneratingThis,
}) => {
  const [copied, setCopied] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const isCompleted = result?.status === 'completed' && Boolean(result.imageUrl);
  const isError = result?.status === 'error';

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(concept.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result?.imageUrl) return;
    const a = document.createElement('a');
    a.href = result.imageUrl;
    a.download = `Fusion-Concept-${concept.id}-${concept.title.toLowerCase().replace(/\s+/g, '-')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between group hover:border-slate-700 transition">
      {/* Concept Header */}
      <div className="p-5 border-b border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-extrabold text-xs flex items-center justify-center shadow-md">
              #{concept.id}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold">
              {concept.category}
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-bold font-mono">
            {concept.ratio}
          </span>
        </div>

        <div>
          <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition line-clamp-1">
            {concept.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {concept.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {concept.blendedElements.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800/80 text-[10px]"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Image Container Area */}
      <div className="relative bg-slate-950 aspect-square flex items-center justify-center overflow-hidden group/img">
        {isGeneratingThis ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-slate-950/90">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
              <Sparkles className="w-5 h-5 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-bold text-indigo-300">Generating Fusion #{concept.id}...</p>
              <p className="text-[11px] text-slate-500 mt-1">Applying multimodal image blending</p>
            </div>
          </div>
        ) : isCompleted && result?.imageUrl ? (
          <>
            <img
              src={result.imageUrl}
              alt={concept.title}
              className="w-full h-full object-cover transition duration-500 group-hover/img:scale-105"
              referrerPolicy="no-referrer"
            />
            {/* Hover overlay actions */}
            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover/img:opacity-100 transition duration-300 flex items-center justify-center space-x-3 p-4">
              <button
                onClick={() => onOpenLightbox(result.imageUrl, concept.title, concept.prompt)}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-600 shadow-xl transition transform hover:scale-110 active:scale-95 cursor-pointer"
                title="Expand Fullscreen"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={handleDownload}
                className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-xl transition transform hover:scale-110 active:scale-95 cursor-pointer"
                title="Download PNG"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : isError ? (
          <div className="p-6 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
            <div>
              <p className="text-xs font-semibold text-rose-300">Generation Failed</p>
              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">
                {result?.error || 'Unable to generate this concept.'}
              </p>
            </div>
            <button
              onClick={() => onRegenerate(concept.id)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-lg border border-slate-700 transition cursor-pointer"
            >
              Retry Concept
            </button>
          </div>
        ) : (
          <div className="p-6 text-center space-y-2 text-slate-600">
            <Layers className="w-8 h-8 mx-auto" />
            <p className="text-xs">Ready for synthesis</p>
          </div>
        )}
      </div>

      {/* Footer controls & prompt drawer */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-3">
        {/* Toggle prompt button */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <button
            onClick={() => setShowPrompt(!showPrompt)}
            className="flex items-center space-x-1 hover:text-indigo-300 transition cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{showPrompt ? 'Hide Prompt' : 'View Prompt'}</span>
          </button>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => onOpenTweakModal(concept)}
              disabled={isGeneratingThis}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 text-[11px] font-medium transition cursor-pointer disabled:opacity-50 flex items-center space-x-1"
              title="Refine prompt & tweak generation"
            >
              <Sliders className="w-3 h-3 mr-1 text-purple-400" />
              <span>Tweak</span>
            </button>

            <button
              onClick={() => onRegenerate(concept.id)}
              disabled={isGeneratingThis}
              className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition cursor-pointer disabled:opacity-50"
              title="Regenerate image"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingThis ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Collapsible Prompt Preview */}
        {showPrompt && (
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-[11px] text-slate-300 space-y-2">
            <p className="font-mono leading-relaxed line-clamp-4 select-all text-slate-300">
              {concept.prompt}
            </p>
            <div className="flex justify-end pt-1">
              <button
                onClick={handleCopyPrompt}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied!' : 'Copy Prompt'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
