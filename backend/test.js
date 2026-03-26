import { addFact, queryFacts } from "./graph.js";

async function test() {
  await addFact("User", "likes", "cricket");
  const facts = await queryFacts("User");
  console.log(facts);
}

test();