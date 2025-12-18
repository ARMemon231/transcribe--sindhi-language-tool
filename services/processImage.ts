import { GoogleGenAI, Type } from "@google/genai";

export const handler = async (event: any) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    const { base64Image } = JSON.parse(event.body || "{}");

    if (!base64Image) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Image is required" }),
      };
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY, // ✅ SERVER ONLY
    });

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
- If a field like "institutionName" or "examName" is NOT found, return an empty string "".
- DO NOT return "Unspecified", "N/A", or "Unknown".

OUTPUT:
Return ONLY valid JSON.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.includes(",")
                ? base64Image.split(",")[1]
                : base64Image,
            },
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
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
                        number: { type: Type.STRING },
                        text: { type: Type.STRING },
                        marks: { type: Type.STRING },
                      },
                      required: ["id", "text"],
                    },
                  },
                },
                required: ["title", "questions"],
              },
            },
          },
          required: ["institutionName", "examName", "subject", "sections"],
        },
      },
    });

    return {
      statusCode: 200,
      body: response.text || "{}",
    };
  } catch (error: any) {
    console.error("Gemini OCR Error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to process image",
        details: error.message,
      }),
    };
  }
};
