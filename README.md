# Dual Image Fusion Studio

An AI-powered multimodal visual synthesis application built with React, Vite, Express, and Google Gemini API (`@google/genai`).

## Features

- **Dual Image Upload**: Upload any two images or select from 4 curated sample preset pairs (Cyberpunk Waterlilies, Gothic Bioluminescence, Origami Jungle, Vintage Cosmic).
- **Gemini Visual DNA Analysis**: Server-side multimodal analysis via `gemini-3.6-flash` deconstructs both source images:
  - Identifies subjects, artistic mediums, textures, lighting, and mood.
  - Extracts 4-5 hex code color palettes for each source image.
  - Formulates a synthesis strategy mapping visual DNA into 5 distinct creative archetypes.
- **5-Concept Image Generation**: Generates 5 new synthesized artworks using `gemini-3.1-flash-lite-image` multimodal blending:
  1. **Concept 1: Style & Medium Transfer** (e.g. Subject from A in brushwork of B)
  2. **Concept 2: Subject & Environment Hybrid** (e.g. Elements of B in climate/world of A)
  3. **Concept 3: Palette & Atmosphere Mashup** (e.g. Lighting and color dynamics synthesized)
  4. **Concept 4: Structural & Pattern Synthesis** (e.g. Merging geometry and architectural motifs)
  5. **Concept 5: Avant-Garde Metamorphosis** (e.g. Symbolic conceptual hybrid)
- **Interactive Studio Controls**:
  - Swap, clear, or replace source images.
  - Lightbox modal with zoom and prompt blueprint inspector.
  - Individual concept tweak & re-synthesis modal with 1-click creative modifiers.
  - Single and batch PNG downloads for generated fusion artworks.

## Technical Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Express.js server (`server.ts`) with Vite dev middleware
- **AI SDK**: `@google/genai` (Gemini 3.6 Flash for analysis, Gemini 3.1 Flash Lite Image for multimodal synthesis)
- **Architecture**: Full-stack API proxying keeping API keys server-side

## Documentation & Prompt Details

Detailed documentation on the exact system prompts, Gemini 3.6 Flash analysis schemas, Gemini 3.1 Flash Lite Image multimodal parameters, and fusion archetype formulas can be found in [`readme.txt`](./readme.txt).

## Running Locally

1. Set `GEMINI_API_KEY` in environment variables or `.env`.
2. Run `npm run dev` to start the server at `http://localhost:3000`.
3. Run `npm run build` to build static assets and compile server with esbuild.
