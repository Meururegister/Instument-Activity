
import { GoogleGenAI, Type } from "@google/genai";
import { BorrowRecord, Instrument } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIInsights = async (history: BorrowRecord[], instruments: Instrument[]) => {
  const prompt = `
    Analyze the following music instrument borrowing history and current inventory:
    History: ${JSON.stringify(history.slice(-20))}
    Inventory: ${JSON.stringify(instruments)}
    
    Please provide a brief summary in Thai including:
    1. Most popular instrument types.
    2. Maintenance recommendations.
    3. Peak usage times.
    4. General efficiency suggestions.
    
    Format as JSON with keys: 'summary', 'popularTypes', 'recommendations'.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            popularTypes: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["summary", "popularTypes", "recommendations"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return {
      summary: "ไม่สามารถดึงข้อมูลสรุปจาก AI ได้ในขณะนี้",
      popularTypes: [],
      recommendations: ["ตรวจสอบความสะอาดสม่ำเสมอ", "เช็คสภาพสายเครื่องดนตรี"]
    };
  }
};
