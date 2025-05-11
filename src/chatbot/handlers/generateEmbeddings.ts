import * as dotenv from "dotenv";
import { splitDocs } from "./splitDocs";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";

dotenv.config();

export const generateEmbeddings = async (): Promise<number[][]> => {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY environment variable not set");
    }

    const chunks = await splitDocs();
    console.log(`✅ Loaded ${chunks.length} chunks`);


    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004", // 768 dimensions
      taskType: TaskType.RETRIEVAL_DOCUMENT,
      title: "Document title",
    });
    // const embedder = new HuggingFaceInferenceEmbeddings({
    //   apiKey: process.env.HUGGINGFACE_API_KEY,
    //   model: "sentence-transformers/all-mpnet-base-v2" 
    // });

    const BATCH_SIZE = 5;
    const allEmbeddings: number[][] = [];

    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batch = chunks.slice(i, i + BATCH_SIZE);
      console.log(`🔹 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}`);
      
      const batchEmbeddings = await embeddings.embedDocuments(batch);
      allEmbeddings.push(...batchEmbeddings);
    }

    console.log(`🎯 Generated ${allEmbeddings.length} embeddings`);
    return allEmbeddings;

  } catch (error) {
    console.error("❌ Failed to generate embeddings:", error);
    throw error;
  }
};