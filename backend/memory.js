import MemoryClient from "mem0ai";
import dotenv from "dotenv";
dotenv.config();

export const memClient = new MemoryClient({
  apiKey: process.env.MEM0_API_KEY
});

// Add memory
export async function addMemory(messages, user_id) {
  await memClient.add(messages, { user_id });
}

// Search memory
export async function searchMemory(query, user_id) {
  const results = await memClient.search(query, {
    api_version: "v2",
    filters: { OR: [{ user_id }] }
  });

  return results.results?.map(r => r.memory).join("\n") || "";
}