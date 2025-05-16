import { NextResponse, NextRequest } from 'next/server';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { TaskType } from "@google/generative-ai";

export const dynamic = 'force-dynamic';

const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX || "fitsync";
const PINECONE_TEXT_KEY = "text";
const GEMINI_MODEL_NAME = "gemini-1.5-pro";
const EMBEDDING_MODEL = "text-embedding-004";

interface UserData {
  name: string;
  age: number;
  sex: string;
  weight: number;
  height: number;
  bmi: number;
}

interface RequestBody {
  userData: UserData;
  preferences: {
    native: string;
    cuisine: string;
  };
}

async function generateDietPlan(body: RequestBody) {
  const { userData, preferences } = body;

  const maintenanceCalories = Math.round(userData.weight * 2.2 * 14);
  const proteinIntake = Math.round(userData.weight * 1.5);

  let weightCategory = '';
  if (userData.bmi < 18.5) weightCategory = 'underweight';
  else if (userData.bmi < 25) weightCategory = 'normal weight';
  else if (userData.bmi < 30) weightCategory = 'overweight';
  else weightCategory = 'obese';

  const dietPrompt = `Create a personalized 7-day diet plan with these details:

USER PROFILE:
- Name: ${userData.name}
- Age: ${userData.age}
- Gender: ${userData.sex}
- Weight: ${userData.weight} kg
- Height: ${userData.height} cm
- BMI: ${userData.bmi} (${weightCategory})
- Native Region: ${preferences.native}
- Preferred Cuisine: ${preferences.cuisine}

NUTRITIONAL TARGETS:
- Daily calories: ~${maintenanceCalories} kcal
- Protein: ${proteinIntake}g/day

REQUIREMENTS:
- 6 meals/day (breakfast, snack, lunch, snack, dinner, bedtime)
- Include meal times and calorie counts
- Focus on ${preferences.cuisine} cuisine from ${preferences.native}
- ${userData.sex === 'male' ? 'Muscle maintenance' : 'Balanced nutrition'} focus
- Weekly variety
- Hydration reminders
- Vegetarian protein options

FORMAT:
Return ONLY a valid JSON array with 7 days of meal plans. Example:
[{
  "day": "Monday",
  "meals": [{
    "time": "8:00 AM",
    "name": "Meal name",
    "calories": 400,
    "description": "Optional details"
  }]
}]`;

  const llm = new ChatGoogleGenerativeAI({
    model: GEMINI_MODEL_NAME,
    temperature: 0.3,
    apiKey: process.env.GOOGLE_API_KEY,
  });

  // First try Pinecone retrieval
  if (process.env.PINECONE_API_KEY) {
    try {
      const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
      const index = pinecone.Index(PINECONE_INDEX_NAME);

      const embeddings = new GoogleGenerativeAIEmbeddings({
        model: EMBEDDING_MODEL,
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        apiKey: process.env.GOOGLE_API_KEY,
      });

      const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
        pineconeIndex: index,
        textKey: PINECONE_TEXT_KEY,
        namespace: "default",
      });

      const retriever = vectorStore.asRetriever({ k: 5 });

      const qaPrompt = ChatPromptTemplate.fromMessages([
        [
          "system",
          "You are a certified nutritionist. Use the retrieved diet plans as reference, but create a NEW personalized plan. Return ONLY valid JSON."
        ],
        ["human", dietPrompt]
      ]);

      const combineDocsChain = await createStuffDocumentsChain({
        llm,
        prompt: qaPrompt,
      });

      const chain = await createRetrievalChain({
        retriever,
        combineDocsChain,
      });

      const result = await chain.invoke({ input: dietPrompt });

      let parsedResult;
      try {
        parsedResult = typeof result.answer === 'string'
          ? JSON.parse(result.answer.replace(/^```json|```$/g, '').trim())
          : result.answer;

        if (!Array.isArray(parsedResult)) {
          throw new Error("Response was not an array");
        }

        return parsedResult;
      } catch (parseError) {
        console.error("Failed to parse Pinecone response:", parseError);
        throw new Error("Failed to parse diet plan response");
      }
    } catch (pineconeError) {
      console.error("Pinecone retrieval failed:", pineconeError);
    }
  }

  // Fallback to direct generation
  try {
    const result = await llm.invoke([
      ["system", "You are a certified nutritionist. Return ONLY valid JSON."],
      ["human", dietPrompt]
    ]);

    const content = typeof result.content === 'string'
      ? result.content
      : JSON.stringify(result.content);

    const cleaned = content.trim().replace(/^```json\s*|\s*```$/g, '');
    const parsed = JSON.parse(cleaned);

    if (!Array.isArray(parsed)) {
      throw new Error("Generated plan is not an array");
    }

    return parsed;
  } catch (genError) {
    console.error("Direct generation failed:", genError);
    throw new Error("Failed to generate diet plan");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();

    if (!body.userData?.weight || !body.userData?.height) {
      throw new Error('Weight and height are required');
    }
    if (!body.preferences?.native || !body.preferences?.cuisine) {
      throw new Error('Native region and cuisine preferences are required');
    }

    if (!body.userData.bmi) {
      const heightInMeters = body.userData.height / 100;
      body.userData.bmi = parseFloat((body.userData.weight / (heightInMeters * heightInMeters)).toFixed(1));
    }

    const dietPlan = await generateDietPlan(body);
    return NextResponse.json({ success: true, dietPlan });

  } catch (error) {
    const err = error as Error;
    console.error("Diet generation error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message,
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
      },
      { status: 500 }
    );
  }
}
