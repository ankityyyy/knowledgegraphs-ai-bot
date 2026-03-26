import { memClient } from "./memory.js"; // your Mem0 module
import dotenv from "dotenv";

dotenv.config();

async function testMem0() {
  const user_id = "user123";

  // 1️⃣ Add memory
  await memClient.add(
    [
      { role: "user", content: "Hi, I like cricket and coding." },
      { role: "assistant", content: "Great! I will remember that." }
    ],
    { user_id }
  );
  console.log("Memory added ✅");

  // 2️⃣ Search memory
  const query = "What does user like?";
  const results = await memClient.search(query, {
    api_version: "v2",
    filters: { OR: [{ user_id }] }
  });

  console.log("Search results:");
  results.results?.forEach((r, idx) => {
    console.log(idx + 1, r.memory);
  });
}

testMem0();