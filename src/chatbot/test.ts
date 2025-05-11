import { createConversationalChain } from "./handlers/llm";

async function testChatbot() {
  try {
    const { chain, memory } = await createConversationalChain();

    const result1 = await chain.invoke({
      chat_history: (await memory.loadMemoryVariables({})).chat_history || [],
      input: "What are good chest exercises?"
    });

    console.log("First response:", result1.answer);

    await memory.saveContext(
      { input: "What are good chest exercises?" },
      { output: result1.answer }
    );

    const result2 = await chain.invoke({
      chat_history: (await memory.loadMemoryVariables({})).chat_history || [],
      input: "Which ones are best for beginners?"
    });

    console.log("Second response:", result2.answer);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testChatbot();