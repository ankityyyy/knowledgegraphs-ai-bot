import OpenAI from "openai";
import { addMemory, searchMemory } from "./memory.js";
import { addFact, queryFacts } from "./graph.js";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function extractFacts(text) {
  const prompt = `
Extract facts in JSON format from the text below. 
Example: [{"subject": "User", "relation": "likes", "object": "cricket"}]

Text: ${text}
`;

  const res = await client.chat.completions.create({
    model: "gpt-4.1",
    messages: [{ role: "user", content: prompt }]
  });

  try {
    return JSON.parse(res.choices[0].message.content);
  } catch {
    return [];
  }
}

export async function chat(userMessage, user_id = "user123") {
  // 1️⃣ Search memory
  const memories = await searchMemory(userMessage, user_id);

  // 2️⃣ Extract facts and add to Neo4j
  const facts = await extractFacts(userMessage);
  for (let f of facts) {
    await addFact(f.subject, f.relation, f.object);
  }

  // 3️⃣ Query facts for context
  const graphFacts = await queryFacts("User");

  // 4️⃣ Compose LLM prompt
  const prompt = `
MEMORY:
${memories}

GRAPH FACTS:
${JSON.stringify(graphFacts)}

Answer the following question:
${userMessage}
`;

  const result = await client.chat.completions.create({
    model: "gpt-4.1",
    messages: [{ role: "user", content: prompt }]
  });

  const reply = result.choices[0].message.content;

  // 5️⃣ Save conversation to Mem0
  await addMemory(
    [
      { role: "user", content: userMessage },
      { role: "assistant", content: reply }
    ],
    user_id
  );

  return reply;
}