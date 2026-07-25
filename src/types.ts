export interface ImageAnalysis {
  title: string;
  subjects: string[];
  style: string;
  colorPalette: string[];
  mood: string;
  keyElements: string[];
}

export interface FusionConcept {
  id: number;
  title: string;
  category: string;
  ratio: string;
  description: string;
  blendedElements: string[];
  prompt: string;
}

export interface AnalysisResponse {
  imageA_analysis: ImageAnalysis;
  imageB_analysis: ImageAnalysis;
  fusionConcepts: FusionConcept[];
}

export interface GeneratedImageResult {
  conceptId: number;
  imageUrl: string;
  status: 'pending' | 'generating' | 'completed' | 'error';
  error?: string;
  promptUsed: string;
  timestamp: string;
}

export interface ImageUploadData {
  dataUrl: string; // base64 data URL e.g. data:image/jpeg;base64,...
  mimeType: string;
  base64Data: string;
  name: string;
  width?: number;
  height?: number;
}

export interface PresetPair {
  id: string;
  name: string;
  description: string;
  imageA: {
    title: string;
    url: string;
  };
  imageB: {
    title: string;
    url: string;
  };
}
