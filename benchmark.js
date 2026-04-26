#!/usr/bin/env node

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const models = [
  "claude-haiku-4-5-20251001",
  "claude-sonnet-4-6",
  "claude-opus-4-6",
];

// Test tasks of varying complexity
const tasks = [
  {
    name: "Simple linting fix",
    prompt:
      "Fix the JavaScript code to remove unused variables:\n```js\nfunction calculateSum(arr) {\n  let total = 0;\n  let unused = 5;\n  for (let i = 0; i < arr.length; i++) {\n    total += arr[i];\n  }\n  return total;\n}\n```",
  },
  {
    name: "Write a test",
    prompt:
      "Write a Jest test for this function that validates it correctly sums an array:\n```js\nfunction calculateSum(arr) {\n  let total = 0;\n  for (let i = 0; i < arr.length; i++) {\n    total += arr[i];\n  }\n  return total;\n}\n```",
  },
  {
    name: "Code review",
    prompt:
      "Review this code for potential bugs:\n```js\nclass UserManager {\n  constructor() {\n    this.users = [];\n  }\n  \n  addUser(user) {\n    if (user.email && user.name) {\n      this.users.push(user);\n      return true;\n    }\n    return false;\n  }\n  \n  getUserByEmail(email) {\n    return this.users.find(u => u.email === email);\n  }\n}\n```",
  },
];

async function benchmarkModel(model, task) {
  let firstTokenTime = null;
  let totalTime = null;
  let tokens = 0;

  const startTime = Date.now();

  try {
    const stream = await client.messages.stream({
      model,
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: task.prompt,
        },
      ],
    });

    let firstTokenReceived = false;

    for await (const chunk of stream) {
      if (!firstTokenReceived && chunk.type === "content_block_delta") {
        firstTokenTime = Date.now() - startTime;
        firstTokenReceived = true;
      }

      if (chunk.type === "content_block_delta") {
        tokens++;
      }
    }

    totalTime = Date.now() - startTime;

    return {
      success: true,
      firstTokenTime,
      totalTime,
      tokens,
      tokensPerSecond: (tokens / totalTime) * 1000,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

async function main() {
  console.log("Claude Model Latency Benchmark\n");
  console.log("Testing response times across Haiku, Sonnet, and Opus\n");
  console.log("=" + "=".repeat(79) + "\n");

  for (const task of tasks) {
    console.log(`Task: ${task.name}\n`);
    console.log(
      `${"Model".padEnd(30)} | ${"TTFT (ms)".padEnd(12)} | ${"Total (ms)".padEnd(12)} | ${"Tokens".padEnd(8)} | ${"Tokens/sec".padEnd(12)}`
    );
    console.log("-" + "-".repeat(78));

    const results = [];

    for (const model of models) {
      const shortModel = model.split("-").slice(1, 3).join("-").toUpperCase();
      process.stdout.write(`${shortModel.padEnd(30)} | `);

      const result = await benchmarkModel(model, task);

      if (result.success) {
        console.log(
          `${result.firstTokenTime?.toString().padEnd(12) || "N/A".padEnd(12)} | ${result.totalTime.toString().padEnd(12)} | ${result.tokens.toString().padEnd(8)} | ${result.tokensPerSecond.toFixed(1).padEnd(12)}`
        );
        results.push({ model: shortModel, ...result });
      } else {
        console.log(`ERROR: ${result.error}`);
      }

      // Add small delay between requests to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log("\n");
  }
}

main().catch(console.error);
