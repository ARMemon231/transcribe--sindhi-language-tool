
import { GoogleGenAI, Type } from "@google/genai";
import { QuestionPaperContent } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async processImage(base64Image: string): Promise<QuestionPaperContent> {
    const prompt = `
      You are a specialized Sindhi Script Expert.
      Convert the image into a structured digital format. 

      SINDHI RECOGNITION RULES:
      1. Sindhi alphabet has 52 letters. Pay strict attention to dots.
      2. If it is handwritten poetry, transcribe it line by line exactly.
      3. If it is a printed paper, extract all header fields like School Name, Class, Subject, Marks.

      NUMBERING RULES:
      - Extract the question number or prefix if it exists (e.g., "1.", "Q1:", "الف").
      - Place this in the "number" field of the question object.

      STUDENT INFO DETECTION:
      - If the image looks like an official test paper, exam, or worksheet, set "showStudentInfo" to true.
      - If it is just poetry or notes, set "showStudentInfo" to false.

      EMPTY FIELD RULES:
      - If a field like "institutionName" or "examName" is NOT found in the image, return an empty string "" for that field.
      - DO NOT return "Unspecified", "N/A", or "Unknown". Use empty strings.

      OUTPUT: Return ONLY a valid JSON object.
    `;

    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image.split(',')[1] || base64Image
            }
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 16000 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            institutionName: { type: Type.STRING },
            examName: { type: Type.STRING },
            subject: { type: Type.STRING },
            classGrade: { type: Type.STRING },
            totalMarks: { type: Type.STRING },
            timeAllowed: { type: Type.STRING },
            showStudentInfo: { type: Type.BOOLEAN },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  instructions: { type: Type.STRING },
                  questions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        number: { type: Type.STRING, description: "The question number or prefix like '1.' or 'Q:'" },
                        text: { type: Type.STRING },
                        marks: { type: Type.STRING }
                      },
                      required: ["id", "text"]
                    }
                  }
                },
                required: ["title", "questions"]
              }
            }
          },
          required: ["institutionName", "examName", "subject", "sections"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("The AI returned an empty response.");

    try {
      const parsed = JSON.parse(text) as QuestionPaperContent;
      if (!parsed.sections) parsed.sections = [];
      return parsed;
    } catch (error) {
      console.error("OCR Parse Failure:", text);
      throw new Error("Failed to process the text structure. Please ensure the photo is clear.");
    }
  }
}

export const geminiService = new GeminiService();
