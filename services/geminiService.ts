import { GoogleGenAI, Type } from "@google/genai";
import { WordPair } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTranslations = async (englishWords: string[]): Promise<WordPair[]> => {
  if (englishWords.length === 0) return [];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Translate the following English words to Chinese (Simplified) for a children's learning game. Keep translations simple and concise (max 2-4 characters if possible).
      Words: ${englishWords.join(", ")}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              english: { type: Type.STRING },
              chinese: { type: Type.STRING }
            },
            required: ["english", "chinese"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as WordPair[];
    }
    return [];
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
};

export const generateGridWords = async (inputWords: string[]): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `I have a list of input words: ${JSON.stringify(inputWords)}. 
      I need a list of exactly 9 English words for a 3x3 grid game.
      1. Include all the input words provided.
      2. If there are fewer than 9 input words, generate random easy A1-level vocabulary words (e.g., animals, colors, fruits) to fill the remaining spots until there are exactly 9 words.
      3. If there are more than 9 input words, select 9 random ones from the input list.
      4. Return ONLY a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as string[];
    }
    return inputWords.slice(0, 9);
  } catch (error) {
    console.error("Gemini API Error (Grid):", error);
    // Fallback: just return input or fill with generic words locally if needed
    const fillers = ["Apple", "Cat", "Sun", "Dog", "Blue", "Fish", "Tree", "Book", "Moon"];
    const combined = [...inputWords, ...fillers];
    return combined.slice(0, 9);
  }
};