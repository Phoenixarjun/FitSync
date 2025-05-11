import { NextResponse } from 'next/server';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { BufferMemory } from "langchain/memory";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { TaskType } from "@google/generative-ai";

export const dynamic = 'force-dynamic'; 

// Configuration constants
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX || "fitsync";
const PINECONE_TEXT_KEY = "text";
const GEMINI_MODEL_NAME = "gemini-1.5-pro";
const EMBEDDING_MODEL = "text-embedding-004";

async function initializeChatbot() {
  // Initialize Google Generative AI chat model
  const llm = new ChatGoogleGenerativeAI({
    model: GEMINI_MODEL_NAME,
    maxOutputTokens: 2048,
    temperature: 0.5,
    apiKey: process.env.GOOGLE_API_KEY,
  });

  // Initialize Pinecone
  if (!process.env.PINECONE_API_KEY) {
    throw new Error("PINECONE_API_KEY is not set");
  }

  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });

  // Verify Pinecone connection
  await pinecone.listIndexes();

  const index = pinecone.Index(PINECONE_INDEX_NAME);
  await index.describeIndexStats();

  // Initialize vector store
  const vectorStore = await PineconeStore.fromExistingIndex(
    new GoogleGenerativeAIEmbeddings({
      model: EMBEDDING_MODEL,
      taskType: TaskType.RETRIEVAL_DOCUMENT,
      apiKey: process.env.GOOGLE_API_KEY,
    }),
    {
      pineconeIndex: index,
      textKey: PINECONE_TEXT_KEY,
      namespace: "default",
    }
  );

  const retriever = vectorStore.asRetriever({ k: 5 });

  // Contextualize question based on chat history
  const contextualizeQSystemPrompt = `
    You are an expert fitness and nutrition assistant. When given a chat history and new question:
    1. Reformulate the question to be standalone if needed
    2. NEVER say "this information isn't in the documents"
    3. Always provide the best possible answer using your extensive knowledge`;
  
  const contextualizeQPrompt = ChatPromptTemplate.fromMessages([
    ["system", contextualizeQSystemPrompt],
    new MessagesPlaceholder("chat_history"),
    ["human", "{input}"],
  ]);

  const historyAwareRetriever = await createHistoryAwareRetriever({
    llm,
    retriever,
    rephrasePrompt: contextualizeQPrompt,
  });

  // Answer question with context
const qaSystemPrompt = `
**Role**: World-class Fitness Coach & Nutritionist  
**Response Format Rules**:

1. **Structure Responses Clearly**:
   - Use markdown-like formatting with **bold** for sections
   - Separate points with newlines
   - Use bullet points (•) for lists

2. **Diet/Nutrition Responses**:
**Meal Plan**  
• Breakfast: [food] (Protein: Xg, Carbs: Yg)  
• Snack: [food]  
• Lunch: [food]  
*Note: Adjust based on your [weight/needs]*

3. **Exercise Responses**:
**Exercise Form**  
👍 Correct: [description]  
👎 Avoid: [common mistake]  
**Progression**: [how to advance]

4. **Always Include**:  
*For personalized advice, consult a certified professional.*

**Current Context**:  
{context}

**User Question**:  
{input}

**Your Response**:`;


  const qaPrompt = ChatPromptTemplate.fromMessages([
    ["system", qaSystemPrompt],
    new MessagesPlaceholder("chat_history"),
    ["human", "{input}"],
  ]);

  const questionAnswerChain = await createStuffDocumentsChain({
    llm,
    prompt: qaPrompt,
  });

  const ragChain = await createRetrievalChain({
    retriever: historyAwareRetriever,
    combineDocsChain: questionAnswerChain,
  });

  // Create memory for chat history
  const memory = new BufferMemory({
    memoryKey: "chat_history",
    returnMessages: true,
  });

  return { chain: ragChain, memory };
}

export async function POST(req: Request) {
  try {
    console.log("Initializing chatbot components...");
    const { chain, memory } = await initializeChatbot();
    
    const { input } = await req.json();
    if (!input || typeof input !== 'string') {
      throw new Error('Invalid input format');
    }

    console.log("Loading chat history...");
    const chatHistory = (await memory.loadMemoryVariables({})).chat_history || [];

    console.log("Processing user query...");
    const result = await chain.invoke({
      chat_history: chatHistory,
      input
    });

    console.log("Saving context...");
    await memory.saveContext(
      { input },
      { output: result.answer }
    );

    return NextResponse.json({ 
      answer: result.answer,
      success: true
    });

  } catch (error) {
    console.error("Chatbot error:", error);
    
    let status = 500;
    let errorMessage = "Internal server error";
    
    if (error instanceof Error) {
      if (error.message.includes("PINECONE_API_KEY")) {
        status = 401;
        errorMessage = "Pinecone authentication failed";
      } else if (error.message.includes("GOOGLE_API_KEY")) {
        status = 401;
        errorMessage = "Google API authentication failed";
      } else if (error.message.includes("index")) {
        status = 404;
        errorMessage = "Pinecone index not found";
      }
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        success: false,
        details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
      },
      { status }
    );
  }
}