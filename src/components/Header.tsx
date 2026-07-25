import React from 'react';
import { Sparkles, RefreshCw, Wand2, Layers, Image as ImageIcon } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  hasImages: boolean;
  isAnalyzing: boolean;
  isGeneratingAny: boolean;
  totalGenerated: number;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  hasImages,
  isAnalyzing,
  isGeneratingAny,
  totalGenerated,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand logo & title */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Layers className="h-5 w-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-tight">
                Dual Image Fusion Studio
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                <Sparkles className="w-3 h-3 mr-1 text-indigo-400" /> 5-Concept Synth
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Analyze 2 source images & generate 5 hybrid visual concepts
            </p>
          </div>
        </div>

        {/* Right action controls */}
        <div className="flex items-center space-x-3">
          {totalGenerated > 0 && (
            <div className="hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{totalGenerated}/5 Generated</span>
            </div>
          )}

          {hasImages && (
            <button
              onClick={onReset}
              disabled={isAnalyzing || isGeneratingAny}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition disabled:opacity-50 cursor-pointer"
              title="Start new fusion with fresh images"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing || isGeneratingAny ? 'animate-spin' : ''}`} />
              <span>Reset Studio</span>
            </button>
          )}

          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono">Gemini 3.6 AI</span>
          </div>
        </div>
      </div>
    </header>
  );
};
