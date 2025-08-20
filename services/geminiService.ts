import { GoogleGenAI, Chat } from "@google/genai";
import { ChatMessage } from '../types';

// IMPORTANT: This service assumes the API_KEY is set in the environment.
// Do not add any UI for managing the API key.
let ai: GoogleGenAI | null = null;
let chat: Chat | null = null;
try {
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
} catch (error) {
  console.error("Failed to initialize GoogleGenAI. API key might be missing.", error);
}

const initializeChat = () => {
  if (ai && !chat) {
     chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: 'You are a helpful AI assistant for a web development project dashboard. You are an expert in Node.js, Vite, Vue, ShadCN, and vanilla JS. Be concise and professional.',
      },
    });
  }
}

export const getStreamingChatResponse = async function* (history: ChatMessage[], newMessage: string) {
  if (!ai) {
    yield "Gemini API not initialized. Please check your API key.";
    return;
  }
  
  initializeChat();

  if (!chat) {
    yield "Chat session could not be started.";
    return;
  }
  
  // This is a simplified history conversion. A real implementation might need more robust mapping.
  // For this example, we just send the latest message.
  try {
    const stream = await chat.sendMessageStream({ message: newMessage });
    for await (const chunk of stream) {
      yield chunk.text;
    }
  } catch(error) {
    console.error("Error getting streaming response from Gemini:", error);
    yield "Sorry, I encountered an error. Please try again.";
  }
};


// A simple mocked version for demonstration if the API is not available.
export const getMockedChatResponse = async (prompt: string): Promise<string> => {
  console.log("Using mocked Gemini response for prompt:", prompt);
  await new Promise(resolve => setTimeout(resolve, 1500));
  const responses: { [key: string]: string } = {
    "hello": "Hello! How can I assist you with your web projects today?",
    "what is the status of my projects?": "The 'E-commerce Frontend' build passed all tests and is ready for deployment. The 'API Gateway' is currently running integration tests.",
    "can you scaffold a new project?": "I can help with that. What framework should the new project use? Vite with Vue, a vanilla Node.js server, or perhaps something with ShadCN for the UI?",
  };
  return responses[prompt.toLowerCase()] || "As a dev assistant, I can help you check build statuses, manage repositories, or analyze deployment logs.";
};