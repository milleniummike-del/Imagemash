import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload limits for base64 images
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Helper to initialize Gemini SDK lazily
  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // API 1: Analyze 2 images and generate 5 fusion concepts
  app.post('/api/analyze', async (req, res) => {
    try {
      const { imageA, imageB } = req.body;

      if (!imageA?.base64Data || !imageB?.base64Data) {
        return res.status(400).json({ error: 'Both Image A and Image B are required.' });
      }

      const ai = getAiClient();

      const cleanBase64A = imageA.base64Data.replace(/^data:image\/\w+;base64,/, '');
      const cleanBase64B = imageB.base64Data.replace(/^data:image\/\w+;base64,/, '');

      const mimeTypeA = imageA.mimeType || 'image/jpeg';
      const mimeTypeB = imageB.mimeType || 'image/jpeg';

      const prompt = `
You are an expert AI Art Director and Visual Analyst specializing in generative composition and visual synthesis.
Analyze the two provided images:
- Image 1 (Image A)
- Image 2 (Image B)

Your task:
1. Provide a detailed analysis of Image A and Image B individually:
   - Identify primary subjects/objects
   - Art style, technique, medium, or texture
   - Dominant color palette (provide 4-5 hex colors per image)
   - Mood & lighting atmosphere
   - Key visual elements and motifs

2. Synthesize exactly 5 NEW, DISTINCT, highly creative FUSION CONCEPTS that mix elements, ideas, and visual concepts from BOTH images.
   Each of the 5 concepts MUST offer a unique blending formula/ratio (e.g., Style Transfer, Subject Hybrid, World Collision, Architectural Mashup, Surreal Metamorphosis):
   - Concept 1: Focus on Style & Medium Transfer (e.g. Subject from A rendered in technique/medium of B)
   - Concept 2: Subject & Environment Fusion (e.g. Main elements of B placed into the world/climate of A)
   - Concept 3: Palette & Atmosphere Mashup (e.g. Lighting and color dynamics of both images synthesized into a new landscape)
   - Concept 4: Structural & Pattern Synthesis (e.g. Merging geometry, textures, and architectural motifs of A and B)
   - Concept 5: High-Concept Avant-Garde Hybrid (e.g. Dreamlike conceptual metamorphosis combining core symbolic themes)

For EACH of the 5 concepts, formulate a detailed, vivid, highly-descriptive prompt for an AI Image Generator (Imagen/Gemini image model) that explicitly references how elements from both images are merged into one masterpiece.

Output your response strictly as JSON conforming to the schema.
`;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          imageA_analysis: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: 'Descriptive title for Image A' },
              subjects: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Main subjects in Image A' },
              style: { type: Type.STRING, description: 'Art style or visual medium of Image A' },
              colorPalette: { type: Type.ARRAY, items: { type: Type.STRING }, description: '4-5 hex color codes' },
              mood: { type: Type.STRING, description: 'Atmosphere and lighting of Image A' },
              keyElements: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Distinct visual elements' },
            },
            required: ['title', 'subjects', 'style', 'colorPalette', 'mood', 'keyElements'],
          },
          imageB_analysis: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: 'Descriptive title for Image B' },
              subjects: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Main subjects in Image B' },
              style: { type: Type.STRING, description: 'Art style or visual medium of Image B' },
              colorPalette: { type: Type.ARRAY, items: { type: Type.STRING }, description: '4-5 hex color codes' },
              mood: { type: Type.STRING, description: 'Atmosphere and lighting of Image B' },
              keyElements: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Distinct visual elements' },
            },
            required: ['title', 'subjects', 'style', 'colorPalette', 'mood', 'keyElements'],
          },
          fusionConcepts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER, description: 'Concept ID from 1 to 5' },
                title: { type: Type.STRING, description: 'Catchy concept title' },
                category: { type: Type.STRING, description: 'Fusion technique category e.g. Style Transfer, World Hybrid, etc.' },
                ratio: { type: Type.STRING, description: 'Blended influence ratio e.g. 60% Image A / 40% Image B' },
                description: { type: Type.STRING, description: 'Explanation of how elements from both images are merged' },
                blendedElements: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'List of specific merged tags/elements' },
                prompt: { type: Type.STRING, description: 'Detailed text prompt for AI image generation' },
              },
              required: ['id', 'title', 'category', 'ratio', 'description', 'blendedElements', 'prompt'],
            },
          },
        },
        required: ['imageA_analysis', 'imageB_analysis', 'fusionConcepts'],
      };

      const geminiRes = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeTypeA,
                data: cleanBase64A,
              },
            },
            {
              inlineData: {
                mimeType: mimeTypeB,
                data: cleanBase64B,
              },
            },
            { text: prompt },
          ],
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema,
          temperature: 0.7,
        },
      });

      const resultText = geminiRes.text;
      if (!resultText) {
        throw new Error('Empty response received from Gemini analysis.');
      }

      const parsedData = JSON.parse(resultText);
      return res.json(parsedData);
    } catch (error: any) {
      console.error('Error in /api/analyze:', error);
      return res.status(500).json({ error: error?.message || 'Failed to analyze images.' });
    }
  });

  // API 2: Generate a single fusion image using multimodal input (Image A + Image B + prompt)
  app.post('/api/generate-fusion', async (req, res) => {
    try {
      const { imageA, imageB, prompt, conceptId, aspectRatio = '1:1' } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required.' });
      }

      const ai = getAiClient();

      const parts: any[] = [];

      // Include Image A and Image B as inlineData if provided
      if (imageA?.base64Data) {
        const cleanBase64A = imageA.base64Data.replace(/^data:image\/\w+;base64,/, '');
        parts.push({
          inlineData: {
            mimeType: imageA.mimeType || 'image/jpeg',
            data: cleanBase64A,
          },
        });
      }

      if (imageB?.base64Data) {
        const cleanBase64B = imageB.base64Data.replace(/^data:image\/\w+;base64,/, '');
        parts.push({
          inlineData: {
            mimeType: imageB.mimeType || 'image/jpeg',
            data: cleanBase64B,
          },
        });
      }

      // Enhanced prompt requesting seamless visual synthesis
      const fullPrompt = `Create a brand new high-resolution masterpiece artwork that seamlessly blends and mixes the visual elements, styles, subjects, textures, and concepts from the provided images according to this specification: ${prompt}. Ensure high visual quality, harmonious composition, fine artistic detail, and clear conceptual representation of both source inspirations.`;

      parts.push({ text: fullPrompt });

      // Call gemini-3.1-flash-lite-image
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: { parts },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any,
          },
        },
      });

      let generatedImageUrl: string | null = null;

      const candidates = response.candidates;
      if (candidates && candidates.length > 0 && candidates[0].content?.parts) {
        for (const part of candidates[0].content.parts) {
          if (part.inlineData) {
            const base64Str = part.inlineData.data;
            const mime = part.inlineData.mimeType || 'image/png';
            generatedImageUrl = `data:${mime};base64,${base64Str}`;
            break;
          }
        }
      }

      if (!generatedImageUrl) {
        throw new Error('No image was returned by the generation model.');
      }

      return res.json({
        conceptId,
        imageUrl: generatedImageUrl,
        promptUsed: prompt,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('Error in /api/generate-fusion:', error);
      return res.status(500).json({
        conceptId: req.body.conceptId,
        error: error?.message || 'Image generation failed.',
      });
    }
  });

  // Vite middleware for dev
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
