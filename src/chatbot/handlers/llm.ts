import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { BufferMemory } from "langchain/memory";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { createRetrievalChain } from "langchain/chains/retrieval";
import * as dotenv from "dotenv";
import { TaskType } from "@google/generative-ai";

dotenv.config();

// Configuration constants
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX || "fitsync";
const PINECONE_TEXT_KEY = "text";
const GEMINI_MODEL_NAME = "gemini-1.5-pro";
const EMBEDDING_MODEL = "text-embedding-004";

// Initialize Google Generative AI chat model
const createChatModel = () => {
  return new ChatGoogleGenerativeAI({
    model: GEMINI_MODEL_NAME,
    maxOutputTokens: 2048,
    temperature: 0.7,
    apiKey: process.env.GOOGLE_API_KEY,
  });
};

// Initialize Pinecone with retry logic
const initializePinecone = async () => {
  try {
    if (!process.env.PINECONE_API_KEY) {
      throw new Error("PINECONE_API_KEY is not set in environment variables");
    }

    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    // Verify connection to Pinecone
    try {
      await pinecone.listIndexes();
      console.log("✅ Successfully connected to Pinecone");
    } catch (error) {
      console.error("❌ Failed to connect to Pinecone:", error);
      throw new Error("Failed to connect to Pinecone. Check your API key and network connection.");
    }

    return pinecone;
  } catch (error) {
    console.error("Error initializing Pinecone:", error);
    throw error;
  }
};

// Initialize Pinecone retriever with proper error handling
const initializePineconeRetriever = async () => {
  try {
    const pinecone = await initializePinecone();
    const index = pinecone.Index(PINECONE_INDEX_NAME);

    // Check if index exists
    try {
      const stats = await index.describeIndexStats();
      console.log(`✅ Index stats: ${JSON.stringify(stats)}`);
    } catch (error) {
      console.error("❌ Index not found or inaccessible:", error);
      throw new Error(`Index ${PINECONE_INDEX_NAME} not found. Please create it first.`);
    }

    const vectorStore = await PineconeStore.fromExistingIndex(
      new GoogleGenerativeAIEmbeddings({
        model: EMBEDDING_MODEL,
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        apiKey: process.env.GOOGLE_API_KEY,
      }),
      {
        pineconeIndex: index,
        textKey: PINECONE_TEXT_KEY,
        namespace: "default", // Using default namespace
      }
    );

    return vectorStore.asRetriever({
      k: 5,
      filter: {},
    });
  } catch (error) {
    console.error("Error initializing Pinecone retriever:", error);
    throw error;
  }
};

// Create conversational chain
export const createConversationalChain = async () => {
  try {
    console.log("Initializing conversational chain...");
    const retriever = await initializePineconeRetriever();
    const llm = createChatModel();

    // Contextualize question based on chat history
    const contextualizeQSystemPrompt = `
      You are a fitness assistant. Given a chat history and the latest user question
      which might reference context in the chat history,
      formulate a standalone question which can be understood
      without the chat history. Do NOT answer the question,
      just reformulate it if needed and otherwise return it as is.`;
    
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
      You are a fitness assistant for question-answering tasks.
      Use the following pieces of retrieved context to answer the
      question. If you don't know the answer, just say that you
      don't know. Keep the answer concise and accurate.
      \n\n
      {context}`;
    
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

    return {
      chain: ragChain,
      memory
    };
  } catch (error) {
    console.error("Error creating conversational chain:", error);
    throw new Error(`Failed to create conversational chain: ${error instanceof Error ? error.message : String(error)}`);
  }
};

