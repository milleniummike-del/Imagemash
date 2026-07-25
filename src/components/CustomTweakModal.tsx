import React, { useState } from 'react';
import { FusionConcept } from '../types';
import { X, Sliders, RefreshCw, Sparkles } from 'lucide-react';

interface CustomTweakModalProps {
  concept: FusionConcept | null;
  onClose: () => void;
  onRegenerateWithTweak: (conceptId: number, customPrompt: string) => void;
}

export const CustomTweakModal: React.FC<CustomTweakModalProps> = ({
  concept,
  onClose,
  onRegenerateWithTweak,
}) => {
  if (!concept) return null;

  const [promptText, setPromptText] = useState(concept.prompt);
  const [addedModifier, setAddedModifier] = useState('');

  const quickModifiers = [
    'Add vivid bioluminescent lighting',
    'Enhance 3D volumetric depth & ambient fog',
    'Shift aesthetic 70% towards Image A',
    'Shift aesthetic 70% towards Image B',
    'Apply cinematic golden hour sunlight',
    'Render in dark fantasy oil painting texture',
    'Add surreal geometric kaleidoscope symmetry',
  ];

  const handleApplyModifier = (mod: string) => {
    setPromptText((prev) => `${prev}. ${mod}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;
    onRegenerateWithTweak(concept.id, promptText);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Tweak Concept #{concept.id}: {concept.title}
              </h3>
              <p className="text-xs text-slate-400">Refine the AI prompt blueprint for custom re-synthesis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Prompt Blueprint
            </label>
            <textarea
              rows={5}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500 transition resize-none"
              placeholder="Refine prompt..."
            />
          </div>

          {/* Quick Modifier Chips */}
          <div>
            <span className="block text-[11px] font-semibold text-slate-400 mb-2 flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-400" /> Quick Creative Modifiers (1-Click Add):
            </span>
            <div className="flex flex-wrap gap-2">
              {quickModifiers.map((mod, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleApplyModifier(mod)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] transition cursor-pointer"
                >
                  + {mod}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg transition flex items-center space-x-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Re-Synthesize Concept</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
