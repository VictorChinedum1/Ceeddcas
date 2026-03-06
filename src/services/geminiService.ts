import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface CarWashCompany {
  name: string;
  country: string;
  specialty: string;
  description: string;
}

export async function getTopCarWashCompanies(): Promise<CarWashCompany[]> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "List the top 5 car wash companies in the world by size/revenue. For each, provide: name, country of origin, their main specialty (e.g. express tunnel, full service), and a brief description of what makes them successful. Return as JSON.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            country: { type: Type.STRING },
            specialty: { type: Type.STRING },
            description: { type: Type.STRING },
          },
          required: ["name", "country", "specialty", "description"],
        },
      },
    },
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return [];
  }
}
