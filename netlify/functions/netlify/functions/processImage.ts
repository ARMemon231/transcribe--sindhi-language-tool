import { GoogleGenAI } from "@google/genai";
export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const base64Image = body.base64Image;

    if (!base64Image) {
      return {
        statusCode: 400,
        body: "Image missing",
      };
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { text: "Convert this Sindhi paper into structured JSON." },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
        ],
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ result: response.text }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: e.message,
    };
  }
};
