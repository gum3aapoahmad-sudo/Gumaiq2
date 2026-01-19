
import { GoogleGenAI, Type, Modality } from "@google/genai";

// Standard client for most tasks
const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateMarketingIdea(serviceName: string) {
  const ai = getClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `بصفتك خبير تسويق رقمي، قم بإنشاء فكرة إعلان قصيرة وجذابة لخدمة "${serviceName}" في سوريا. ركز على الجودة العالية والدفع عبر شام كاش.`,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING, description: "عنوان جذاب للإعلان" },
            body: { type: Type.STRING, description: "نص الإعلان المقترح" },
            cta: { type: Type.STRING, description: "عبارة الحث على اتخاذ إجراء" }
          },
          required: ["headline", "body", "cta"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Marketing Idea Error:", error);
    return null;
  }
}

export async function editImagePrompt(base64Image: string, mimeType: string, prompt: string) {
  const ai = getClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: mimeType } },
          { text: prompt }
        ]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
  } catch (error) {
    console.error("Image Edit Error:", error);
    return null;
  }
}

export async function generateAdvancedImage(prompt: string, size: "1K" | "2K" | "4K", aspectRatio: string) {
  const ai = getClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
          imageSize: size as any
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
  } catch (error) {
    console.error("Advanced Image Gen Error:", error);
    return null;
  }
}

export async function groundedSearch(query: string) {
  const ai = getClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: { tools: [{ googleSearch: {} }] },
    });
    return {
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Search Grounding Error:", error);
    return { text: "حدث خطأ أثناء البحث.", sources: [] };
  }
}

export async function generateVideo(prompt: string, aspectRatio: '16:9' | '9:16') {
  const ai = getClient();
  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Video Generation Error:", error);
    return null;
  }
}

export async function generalChat(message: string, history: any[] = []) {
  const ai = getClient();
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: { systemInstruction: "أنت المساعد الذكي لشركة حلبي للخدمات الرقمية، بإدارة جمعة محيميد. أجب بأسلوب لبق واحترافي وباللغة العربية." }
    });
    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Chat Error:", error);
    return "عذراً، لم أستطع الرد حالياً.";
  }
}
