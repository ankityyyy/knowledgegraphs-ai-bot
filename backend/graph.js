import neo4j from "neo4j-driver";
import dotenv from "dotenv";
dotenv.config();

// Use NEO4J_URI from Aura
const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

const session = driver.session({ database: process.env.NEO4J_DATABASE || "neo4j" });

// Add fact
export async function addFact(subject, relation, object) {
  await session.run(
    `MERGE (s:Entity {name: $subject})
     MERGE (o:Entity {name: $object})
     MERGE (s)-[:RELATION {type: $relation}]->(o)`,
    { subject, relation, object }
  );
}

// Query facts
export async function queryFacts(subject) {
  const result = await session.run(
    `MATCH (s:Entity {name: $subject})-[r:RELATION]->(o)
     RETURN o.name AS object, r.type AS relation`,
    { subject }
  );
  return result.records.map(r => ({
    object: r.get("object"),
    relation: r.get("relation")
  }));
}