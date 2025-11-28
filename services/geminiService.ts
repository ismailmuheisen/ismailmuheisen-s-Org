import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, ContentType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the response schema for structured output
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    isAiGenerated: {
      type: Type.BOOLEAN,
      description: "True if the content is likely AI-generated, false otherwise.",
    },
    confidenceScore: {
      type: Type.NUMBER,
      description: "A score from 0 to 100 indicating confidence in the verdict. Higher means more likely to be AI.",
    },
    verdict: {
      type: Type.STRING,
      description: "A short Arabic phrase summarizing the result (e.g., 'محتوى مولد بالذكاء الاصطناعي', 'محتوى حقيقي').",
    },
    reasoning: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 3-5 clear reasons in Arabic explaining the analysis.",
    },
    technicalIndicators: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of technical artifacts found (e.g., 'Lack of semantic depth', 'Visual artifacts in shadows'). In Arabic.",
    },
  },
  required: ["isAiGenerated", "confidenceScore", "verdict", "reasoning", "technicalIndicators"],
};

export const analyzeContent = async (
  type: ContentType,
  data: string, // Text string or Base64 string
  mimeType?: string
): Promise<AnalysisResult> => {
  
  const modelName = 'gemini-3-pro-preview'; // Using Pro for complex reasoning

  let prompt = "";
  let parts: any[] = [];

  const systemInstruction = `
    أنت خبير جنائي رقمي متخصص في كشف التزييف العميق والمحتوى المولد بالذكاء الاصطناعي.
    مهمتك هي تحليل المدخلات بدقة متناهية لتحديد ما إذا كانت حقيقية (من صنع الإنسان) أو مولدة بواسطة الذكاء الاصطناعي.
    
    معايير التحليل:
    1. النصوص: ابحث عن التكرار، قلة المشاعر، الهياكل النحوية المثالية بشكل غير طبيعي، ونقص العمق الدلالي.
    2. الصور: ابحث عن تشوهات في الأطراف (الأصابع)، الإضاءة غير المتسقة، النصوص غير المفهومة في الخلفية، والملمس الناعم جداً للبشرة.
    3. الفيديو: ابحث عن وميض زمني (Temporal flickering)، حركة غير طبيعية للعين أو الشفاه، وعدم تناسق الصوت مع الصورة.
    4. الصوت: ابحث عن نبرة صوت روبوتية (Robotic Timbre)، غياب أنماط التنفس الطبيعية، تقطعات في الكلام (Speech artifacts)، أو هدوء تام غير طبيعي في الخلفية (Digital Silence). تحقق من التجويد العاطفي المسطح.

    يجب أن تكون تحليلاتك صارمة ودقيقة. قدم تقريرك باللغة العربية.
  `;

  if (type === ContentType.TEXT) {
    prompt = `قم بتحليل النص التالي بدقة. هل هو مكتوب بواسطة بشر أم ذكاء اصطناعي؟\n\nالنص:\n${data}`;
    parts = [{ text: prompt }];
  } else if (type === ContentType.IMAGE) {
    prompt = "قم بتحليل هذه الصورة. هل هي صورة فوتوغرافية حقيقية أم مولدة بالذكاء الاصطناعي؟ ابحث عن أدق التفاصيل.";
    parts = [
      { text: prompt },
      {
        inlineData: {
          mimeType: mimeType || 'image/png',
          data: data,
        },
      },
    ];
  } else if (type === ContentType.VIDEO) {
    prompt = "قم بتحليل هذا المقطع القصير. هل هو فيديو حقيقي أم تزييف عميق (Deepfake)؟ ركز على تعابير الوجه والفيزياء.";
     parts = [
      { text: prompt },
      {
        inlineData: {
          mimeType: mimeType || 'video/mp4',
          data: data,
        },
      },
    ];
  } else if (type === ContentType.AUDIO) {
    prompt = "قم بتحليل هذا الملف الصوتي. هل هو تسجيل بشري حقيقي أم صوت مولد بالذكاء الاصطناعي (Voice Cloning/TTS)؟ استمع للتنفس ونبرة الصوت والشوائب الرقمية.";
    parts = [
      { text: prompt },
      {
        inlineData: {
          mimeType: mimeType || 'audio/mp3',
          data: data,
        },
      },
    ];
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        thinkingConfig: { thinkingBudget: 2048 } // Use thinking for deeper analysis
      },
    });

    if (response.text) {
      const result = JSON.parse(response.text) as AnalysisResult;
      // Add timestamp manually since API doesn't return it in our schema
      return {
        ...result,
        analyzedAt: new Date().toISOString(),
      };
    } else {
      throw new Error("لم يتم استلام أي بيانات من النموذج");
    }
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("حدث خطأ أثناء تحليل المحتوى. يرجى المحاولة مرة أخرى.");
  }
};