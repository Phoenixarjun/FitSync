import * as dotenv from "dotenv";
import { generateEmbeddings } from "./generateEmbeddings";
import { splitDocs } from "./splitDocs";
import { Pinecone } from "@pinecone-database/pinecone";

dotenv.config();

const saveEmbeddingsToPinecone = async () => {
  try {
    const texts = await splitDocs(); 
    const embeddings = await generateEmbeddings(); 

    if (texts.length !== embeddings.length) {
      throw new Error("Text and embedding count mismatch");
    }

    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });

    const index = pinecone.index(process.env.PINECONE_INDEX!);

    const vectors = embeddings.map((embedding, i) => ({
      id: `chunk-${i}`,
      values: embedding,
      metadata: {
        text: texts[i],
        source: "gemini-generated",
      },
    }));

    console.log(`🚀 Uploading ${vectors.length} vectors to Pinecone...`);

    await index.namespace(process.env.PINECONE_NAMESPACE || "default").upsert(vectors);

    console.log("✅ Successfully saved embeddings to Pinecone");
  } catch (error) {
    console.error("❌ Error saving to Pinecone:", error);
  }
};

saveEmbeddingsToPinecone();
