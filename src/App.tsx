import React, { useState } from 'react';
import { ImageUploadData, AnalysisResponse, GeneratedImageResult, FusionConcept } from './types';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisOverview } from './components/AnalysisOverview';
import { FusionGallery } from './components/FusionGallery';
import { CustomTweakModal } from './components/CustomTweakModal';
import { AlertCircle, Sparkles, RefreshCw, Wand2 } from 'lucide-react';

export default function App() {
  const [imageA, setImageA] = useState<ImageUploadData | null>(null);
  const [imageB, setImageB] = useState<ImageUploadData | null>(null);

  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [results, setResults] = useState<Record<number, GeneratedImageResult>>({});

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatingIds, setGeneratingIds] = useState<number[]>([]);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [tweakConcept, setTweakConcept] = useState<FusionConcept | null>(null);

  // Swap Image A and Image B
  const handleSwapImages = () => {
    const temp = imageA;
    setImageA(imageB);
    setImageB(temp);
  };

  // Reset Studio
  const handleReset = () => {
    setImageA(null);
    setImageB(null);
    setAnalysis(null);
    setResults({});
    setErrorMsg(null);
  };

  // Generate image for a single concept
  const generateSingleConcept = async (concept: FusionConcept, customPrompt?: string) => {
    if (!imageA || !imageB) return;

    setGeneratingIds((prev) => [...prev, concept.id]);

    // Update status to pending/generating
    setResults((prev) => ({
      ...prev,
      [concept.id]: {
        conceptId: concept.id,
        imageUrl: '',
        status: 'generating',
        promptUsed: customPrompt || concept.prompt,
        timestamp: new Date().toISOString(),
      },
    }));

    try {
      const res = await fetch('/api/generate-fusion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageA,
          imageB,
          prompt: customPrompt || concept.prompt,
          conceptId: concept.id,
          aspectRatio: '1:1',
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to generate image.');
      }

      setResults((prev) => ({
        ...prev,
        [concept.id]: {
          conceptId: concept.id,
          imageUrl: data.imageUrl,
          status: 'completed',
          promptUsed: customPrompt || concept.prompt,
          timestamp: data.timestamp || new Date().toISOString(),
        },
      }));
    } catch (err: any) {
      console.error(`Error generating concept #${concept.id}:`, err);
      setResults((prev) => ({
        ...prev,
        [concept.id]: {
          conceptId: concept.id,
          imageUrl: '',
          status: 'error',
          error: err?.message || 'Generation error',
          promptUsed: customPrompt || concept.prompt,
          timestamp: new Date().toISOString(),
        },
      }));
    } finally {
      setGeneratingIds((prev) => prev.filter((id) => id !== concept.id));
    }
  };

  // Main flow: Analyze 2 images -> extract 5 concepts -> generate all 5 images
  const handleAnalyzeAndGenerate = async () => {
    if (!imageA || !imageB) return;

    setIsAnalyzing(true);
    setErrorMsg(null);
    setAnalysis(null);
    setResults({});

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageA,
          imageB,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to analyze images.');
      }

      setAnalysis(data);
      setIsAnalyzing(false);

      // Trigger generation for all 5 concepts progressively
      if (data.fusionConcepts && Array.isArray(data.fusionConcepts)) {
        // Run generation for all concepts
        data.fusionConcepts.forEach((concept: FusionConcept) => {
          generateSingleConcept(concept);
        });
      }
    } catch (err: any) {
      console.error('Error in handleAnalyzeAndGenerate:', err);
      setErrorMsg(err?.message || 'Failed to analyze images with Gemini.');
      setIsAnalyzing(false);
    }
  };

  const handleRegenerateConcept = (conceptId: number, customPrompt?: string) => {
    if (!analysis) return;
    const concept = analysis.fusionConcepts.find((c) => c.id === conceptId);
    if (concept) {
      generateSingleConcept(concept, customPrompt);
    }
  };

  const completedCount = (Object.values(results) as GeneratedImageResult[]).filter(
    (r) => r.status === 'completed' && Boolean(r.imageUrl)
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <Header
        onReset={handleReset}
        hasImages={Boolean(imageA || imageB)}
        isAnalyzing={isAnalyzing}
        isGeneratingAny={generatingIds.length > 0}
        totalGenerated={completedCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Error Banner */}
        {errorMsg && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-between text-xs text-rose-300">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-rose-400 hover:text-rose-200 underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Step 1: Upload & Image Selection */}
        <ImageUploader
          imageA={imageA}
          imageB={imageB}
          onSelectImageA={setImageA}
          onSelectImageB={setImageB}
          onSwapImages={handleSwapImages}
          onAnalyzeAndGenerate={handleAnalyzeAndGenerate}
          isAnalyzing={isAnalyzing}
          isGenerating={generatingIds.length > 0}
        />

        {/* Step 2: Gemini Analysis Overview */}
        {analysis && (
          <AnalysisOverview
            analysis={analysis}
            imageADataUrl={imageA?.dataUrl}
            imageBDataUrl={imageB?.dataUrl}
          />
        )}

        {/* Step 3: 5 Generated Concept Artworks Gallery */}
        {analysis && (
          <FusionGallery
            concepts={analysis.fusionConcepts}
            results={results}
            onRegenerate={handleRegenerateConcept}
            onOpenTweakModal={(concept) => setTweakConcept(concept)}
            generatingIds={generatingIds}
            imageAUrl={imageA?.dataUrl}
            imageBUrl={imageB?.dataUrl}
          />
        )}
      </main>

      {/* Tweak Prompt Modal */}
      <CustomTweakModal
        concept={tweakConcept}
        onClose={() => setTweakConcept(null)}
        onRegenerateWithTweak={(id, customPrompt) =>
          handleRegenerateConcept(id, customPrompt)
        }
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Dual Image Fusion Studio • Powered by Google Gemini 3.6 & Multimodal Imagen Synthesis</p>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>Server-side API proxying</span>
            <span>•</span>
            <span>5-Concept Synthesis</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
