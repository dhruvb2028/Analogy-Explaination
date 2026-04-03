import { GoogleGenAI, Type } from "@google/genai";
import { AnalogyRequest, AnalogyResponse } from "./types";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export async function generateAnalogy(request: AnalogyRequest): Promise<AnalogyResponse> {
  const prompt = `
    Concept: ${request.concept}
    Audience Level: ${request.audienceLevel}
    Preferred Domain: ${request.domain || "Any everyday domain"}

    Follow these steps STRICTLY to generate a high-quality analogy:
    1. Decompose the Concept (Components, Relationships, Processes).
    2. Select Analogy Domain.
    3. Map Components (1-to-1 mapping).
    4. Generate Analogy Story (Simple, engaging, no jargon).
    5. Explain the Mapping.
    6. Identify Limitations (Where it breaks).
    7. Generate 2 Alternative Analogies (Shorter).

    Return the result in JSON format matching the schema provided.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          concept: { type: Type.STRING },
          decomposition: {
            type: Type.OBJECT,
            properties: {
              components: { type: Type.ARRAY, items: { type: Type.STRING } },
              relationships: { type: Type.ARRAY, items: { type: Type.STRING } },
              processes: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["components", "relationships", "processes"],
          },
          mainAnalogy: {
            type: Type.OBJECT,
            properties: {
              domain: { type: Type.STRING },
              story: { type: Type.STRING },
              mapping: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    from: { type: Type.STRING },
                    to: { type: Type.STRING },
                  },
                  required: ["from", "to"],
                },
              },
            },
            required: ["domain", "story", "mapping"],
          },
          explanation: { type: Type.STRING },
          limitations: { type: Type.ARRAY, items: { type: Type.STRING } },
          alternatives: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                domain: { type: Type.STRING },
                explanation: { type: Type.STRING },
              },
              required: ["domain", "explanation"],
            },
          },
        },
        required: ["concept", "decomposition", "mainAnalogy", "explanation", "limitations", "alternatives"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as AnalogyResponse;
}
