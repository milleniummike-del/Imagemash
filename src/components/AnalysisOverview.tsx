import React, { useState } from 'react';
import { AnalysisResponse } from '../types';
import { Eye, Palette, Sparkles, Sliders, ChevronDown, ChevronUp, Layers, Tag } from 'lucide-react';

interface AnalysisOverviewProps {
  analysis: AnalysisResponse;
  imageADataUrl?: string;
  imageBDataUrl?: string;
}

export const AnalysisOverview: React.FC<AnalysisOverviewProps> = ({
  analysis,
  imageADataUrl,
  imageBDataUrl,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const { imageA_analysis, imageB_analysis, fusionConcepts } = analysis;

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
      {/* Accordion header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 bg-slate-900/90 hover:bg-slate-800/60 flex items-center justify-between border-b border-slate-800 transition cursor-pointer text-left"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Gemini Image DNA & Synthesis Report</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-semibold">
                Deconstructed
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Comparative analysis of visual features and 5 blended conceptual strategies
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-slate-400">
          <span className="text-xs font-medium text-slate-400">
            {isExpanded ? 'Hide Details' : 'Show Details'}
          </span>
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Side by side visual DNA breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image A Analysis */}
            <div className="bg-slate-950/70 rounded-xl border border-indigo-900/30 p-5 space-y-4">
              <div className="flex items-center space-x-3 border-b border-slate-800/80 pb-3">
                {imageADataUrl && (
                  <img
                    src={imageADataUrl}
                    alt="Image A"
                    className="w-10 h-10 rounded-lg object-cover ring-2 ring-indigo-500/50"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400">
                    Source A Visual DNA
                  </span>
                  <h4 className="text-sm font-bold text-white truncate">
                    {imageA_analysis.title || 'Source Image A'}
                  </h4>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block mb-1">Style & Medium:</span>
                  <p className="text-slate-200 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                    {imageA_analysis.style}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block mb-1">Mood & Atmosphere:</span>
                  <p className="text-slate-200 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                    {imageA_analysis.mood}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block mb-1.5 flex items-center">
                    <Palette className="w-3.5 h-3.5 mr-1 text-indigo-400" /> Color Palette:
                  </span>
                  <div className="flex items-center space-x-2">
                    {imageA_analysis.colorPalette.map((color, i) => (
                      <div key={i} className="flex flex-col items-center group">
                        <div
                          className="w-7 h-7 rounded-lg border border-white/10 shadow-inner transition group-hover:scale-110"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-[9px] font-mono text-slate-500 mt-1">{color}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block mb-1.5">Key Subjects & Motifs:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {imageA_analysis.subjects.concat(imageA_analysis.keyElements).slice(0, 6).map((item, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[11px]">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Image B Analysis */}
            <div className="bg-slate-950/70 rounded-xl border border-purple-900/30 p-5 space-y-4">
              <div className="flex items-center space-x-3 border-b border-slate-800/80 pb-3">
                {imageBDataUrl && (
                  <img
                    src={imageBDataUrl}
                    alt="Image B"
                    className="w-10 h-10 rounded-lg object-cover ring-2 ring-purple-500/50"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400">
                    Source B Visual DNA
                  </span>
                  <h4 className="text-sm font-bold text-white truncate">
                    {imageB_analysis.title || 'Source Image B'}
                  </h4>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block mb-1">Style & Medium:</span>
                  <p className="text-slate-200 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                    {imageB_analysis.style}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block mb-1">Mood & Atmosphere:</span>
                  <p className="text-slate-200 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                    {imageB_analysis.mood}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block mb-1.5 flex items-center">
                    <Palette className="w-3.5 h-3.5 mr-1 text-purple-400" /> Color Palette:
                  </span>
                  <div className="flex items-center space-x-2">
                    {imageB_analysis.colorPalette.map((color, i) => (
                      <div key={i} className="flex flex-col items-center group">
                        <div
                          className="w-7 h-7 rounded-lg border border-white/10 shadow-inner transition group-hover:scale-110"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-[9px] font-mono text-slate-500 mt-1">{color}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block mb-1.5">Key Subjects & Motifs:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {imageB_analysis.subjects.concat(imageB_analysis.keyElements).slice(0, 6).map((item, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[11px]">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Synthesis Blueprint Bar */}
          <div className="bg-slate-950/90 rounded-xl p-4 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-amber-400" /> 5 Synthesized Fusion Archetypes
              </h4>
              <span className="text-[11px] text-slate-500">100% Unique Blend Prompts</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
              {fusionConcepts.map((c) => (
                <div key={c.id} className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-[10px] font-bold text-indigo-400">Concept #{c.id}</div>
                  <div className="font-semibold text-white truncate text-[11px] mt-0.5">{c.title}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{c.ratio}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
