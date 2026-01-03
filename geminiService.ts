
import { GoogleGenAI, Type } from "@google/genai";
import { RecognitionResult } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const PEST_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    pestFound: { type: Type.BOOLEAN },
    confidence: { type: Type.NUMBER },
    pest: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        scientificName: { type: Type.STRING },
        category: { type: Type.STRING },
        characteristics: { type: Type.ARRAY, items: { type: Type.STRING } },
        anatomy: { type: Type.STRING },
        habits: { type: Type.STRING },
        controlMethods: { type: Type.ARRAY, items: { type: Type.STRING } },
        healthRisks: { type: Type.STRING },
      },
      required: ["name", "scientificName", "category", "characteristics", "anatomy", "habits", "controlMethods", "healthRisks"]
    },
    message: { type: Type.STRING }
  },
  required: ["pestFound", "confidence"]
};

export const analyzePestImage = async (base64Image: string): Promise<RecognitionResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            { text: "Identifique a praga urbana nesta imagem (pode ser inseto, aracnídeo como aranhas, roedor ou ave como pombos). Forneça um dossiê completo em Português do Brasil: Nome comum, Nome científico, Categoria, Características físicas, Anatomia detalhada, Hábitos, Métodos de controle e Riscos à saúde. Use o Google Search para garantir precisão profissional." },
            { inlineData: { mimeType: "image/jpeg", data: base64Image } }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: PEST_RESPONSE_SCHEMA as any,
        tools: [{ googleSearch: {} }]
      }
    });

    const result = JSON.parse(response.text || '{}') as RecognitionResult;
    
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      result.sources = chunks
        .filter(c => c.web)
        .map(c => ({ uri: c.web!.uri, title: c.web!.title }));
    }

    return result;
  } catch (error) {
    console.error("Erro na análise da imagem:", error);
    throw error;
  }
};

export const getPestDetailsByName = async (name: string): Promise<RecognitionResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Gere um dossiê técnico completo sobre a praga urbana: ${name}. Inclua anatomia, hábitos e controle detalhado. Se for uma aranha ou pombo, detalhe riscos específicos de picadas ou zoonoses.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: PEST_RESPONSE_SCHEMA as any,
        tools: [{ googleSearch: {} }]
      }
    });

    const result = JSON.parse(response.text || '{}') as RecognitionResult;
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      result.sources = chunks
        .filter(c => c.web)
        .map(c => ({ uri: c.web!.uri, title: c.web!.title }));
    }
    return result;
  } catch (error) {
    console.error("Erro ao buscar detalhes da praga:", error);
    throw error;
  }
};
