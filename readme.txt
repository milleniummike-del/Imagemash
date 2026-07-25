==============================================================================
DUAL IMAGE FUSION STUDIO - EXHAUSTIVE AI PROMPT & API REFERENCE
==============================================================================

Application Overview:
Dual Image Fusion Studio deconstructs two user-uploaded source images (Image A and Image B) 
using Google Gemini 3.6 Flash, extracts their visual DNA (subjects, style, color palette, 
mood, textures), and formulates 5 distinct hybrid artwork concepts. It then generates 5 
brand new high-resolution images via Gemini 3.1 Flash Lite Image using multimodal inputs 
(Image A + Image B + synthesized prompt).

==============================================================================
1. STAGE 1: IMAGE DNA ANALYSIS & CONCEPT FORMULATION PROMPT
==============================================================================
Endpoint: POST /api/analyze
Model: gemini-3.6-flash
Input Payload:
- Part 1: Inline Base64 Data of Source Image A (mimeType: image/jpeg or image/png)
- Part 2: Inline Base64 Data of Source Image B (mimeType: image/jpeg or image/png)
- Part 3: Text Prompt (System Instruction & Task Specification)

------------------------------------------------------------------------------
System / Task Prompt String:
------------------------------------------------------------------------------
"""
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
"""

------------------------------------------------------------------------------
Structured JSON Output Schema (ResponseSchema):
------------------------------------------------------------------------------
{
  "type": "OBJECT",
  "properties": {
    "imageA_analysis": {
      "type": "OBJECT",
      "properties": {
        "title": { "type": "STRING", "description": "Descriptive title for Image A" },
        "subjects": { "type": "ARRAY", "items": { "type": "STRING" }, "description": "Main subjects in Image A" },
        "style": { "type": "STRING", "description": "Art style or visual medium of Image A" },
        "colorPalette": { "type": "ARRAY", "items": { "type": "STRING" }, "description": "4-5 hex color codes" },
        "mood": { "type": "STRING", "description": "Atmosphere and lighting of Image A" },
        "keyElements": { "type": "ARRAY", "items": { "type": "STRING" }, "description": "Distinct visual elements" }
      },
      "required": ["title", "subjects", "style", "colorPalette", "mood", "keyElements"]
    },
    "imageB_analysis": {
      "type": "OBJECT",
      "properties": {
        "title": { "type": "STRING", "description": "Descriptive title for Image B" },
        "subjects": { "type": "ARRAY", "items": { "type": "STRING" }, "description": "Main subjects in Image B" },
        "style": { "type": "STRING", "description": "Art style or visual medium of Image B" },
        "colorPalette": { "type": "ARRAY", "items": { "type": "STRING" }, "description": "4-5 hex color codes" },
        "mood": { "type": "STRING", "description": "Atmosphere and lighting of Image B" },
        "keyElements": { "type": "ARRAY", "items": { "type": "STRING" }, "description": "Distinct visual elements" }
      },
      "required": ["title", "subjects", "style", "colorPalette", "mood", "keyElements"]
    },
    "fusionConcepts": {
      "type": "ARRAY",
      "items": {
        "type": "OBJECT",
        "properties": {
          "id": { "type": "INTEGER", "description": "Concept ID from 1 to 5" },
          "title": { "type": "STRING", "description": "Catchy concept title" },
          "category": { "type": "STRING", "description": "Fusion technique category" },
          "ratio": { "type": "STRING", "description": "Blended influence ratio e.g. 60% Image A / 40% Image B" },
          "description": { "type": "STRING", "description": "Explanation of how elements from both images are merged" },
          "blendedElements": { "type": "ARRAY", "items": { "type": "STRING" }, "description": "List of specific merged tags/elements" },
          "prompt": { "type": "STRING", "description": "Detailed text prompt for AI image generation" }
        },
        "required": ["id", "title", "category", "ratio", "description", "blendedElements", "prompt"]
      }
    }
  },
  "required": ["imageA_analysis", "imageB_analysis", "fusionConcepts"]
}


==============================================================================
2. STAGE 2: MULTIMODAL IMAGE SYNTHESIS GENERATION PROMPT
==============================================================================
Endpoint: POST /api/generate-fusion
Model: gemini-3.1-flash-lite-image
Input Payload:
- Part 1: Inline Base64 Data of Source Image A
- Part 2: Inline Base64 Data of Source Image B
- Part 3: Text Prompt Wrapper

------------------------------------------------------------------------------
Image Generation Prompt Wrapper Template:
------------------------------------------------------------------------------
"""
Create a brand new high-resolution masterpiece artwork that seamlessly blends and mixes the visual elements, styles, subjects, textures, and concepts from the provided images according to this specification: {conceptPrompt}. Ensure high visual quality, harmonious composition, fine artistic detail, and clear conceptual representation of both source inspirations.
"""

Where {conceptPrompt} is dynamically generated by Gemini 3.6 Flash for each of the 5 concepts (or edited by the user in the Tweak Modal).


==============================================================================
3. THE 5 FUSION CONCEPT FORMULAS & ARCHETYPES
==============================================================================
1. Concept #1: Style & Medium Transfer
   - Formula: Extracts main subjects/figures from Image A and renders them in the artistic medium, brushwork, lighting, and surface texture of Image B.
   - Blend Ratio: ~70% Style B / 30% Subject A

2. Concept #2: Subject & Environment Hybrid
   - Formula: Transplants focal subjects and key motifs from Image B into the atmospheric landscape, lighting, and environmental physics of Image A.
   - Blend Ratio: ~50% World A / 50% Subject B

3. Concept #3: Palette & Atmosphere Mashup
   - Formula: Synthesizes a new scene where the color dynamics, volumetric fog, and specular lighting of both images collide into a unified canvas.
   - Blend Ratio: ~50% Palette A / 50% Palette B

4. Concept #4: Structural & Pattern Synthesis
   - Formula: Fuses the architectural frameworks, geometric alignments, or low-poly facets of Image A with the organic patterns and materials of Image B.
   - Blend Ratio: ~60% Geometry A / 40% Texture B

5. Concept #5: Avant-Garde Metamorphosis
   - Formula: Creates a dreamlike symbolic narrative where core motifs from Image A physically morph and transform into elements from Image B.
   - Blend Ratio: High-concept surreal synthesis


==============================================================================
4. QUICK CREATIVE PROMPT MODIFIERS (Interactive Tweak Modal)
------------------------------------------------------------------------------
In the interactive Tweak Modal, users can refine any prompt blueprint.
When a quick modifier button is clicked, it appends to the current prompt string:

  `newPrompt = currentPrompt + ". " + modifier`

Available Modifiers:
- "Add vivid bioluminescent lighting"
- "Enhance 3D volumetric depth & ambient fog"
- "Shift aesthetic 70% towards Image A"
- "Shift aesthetic 70% towards Image B"
- "Apply cinematic golden hour sunlight"
- "Render in dark fantasy oil painting texture"
- "Add surreal geometric kaleidoscope symmetry"


==============================================================================
5. CURATED SAMPLE PRESET PAIRS
==============================================================================
Preset 1: Neon Cyberpunk Metropolis & Monet Impressionist Water Lilies
- Description: Blends futuristic high-contrast neon cityscape aesthetics with classical impressionist flora and watery reflections.

Preset 2: Gothic Cathedral Arches & Bioluminescent Deep Sea Jellyfish
- Description: Combines intricate medieval stone arches and stained glass with glowing underwater jellyfish and abyssal luminescence.

Preset 3: Geometric Origami Sculpture & Dense Emerald Tropical Jungle
- Description: Fuses crisp low-poly geometric paper facets with lush, organic tropical rainforest foliage.

Preset 4: 1970s Vintage Golden Hour Portrait & Deep Cosmic Nebula Galaxy
- Description: Fuses warm analog 70s film grain and disco golden hour lighting with deep space galaxies and star clusters.
==============================================================================
