import readline from "readline";
import { chat } from "./chat.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  console.log("Chatbot ready! Type 'exit' to quit.");

  while (true) {
    const question = await new Promise(res => rl.question(">> ", res));
    if (question.toLowerCase() === "exit") {
      console.log("Bye!");
      rl.close();
      process.exit(0);
    }
    const answer = await chat(question, "user123");
    console.log("BOT:", answer);
  }
}

main();