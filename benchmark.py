#!/usr/bin/env python3

import requests
import json
import time
import os
from datetime import datetime

API_KEY = os.environ.get("ANTHROPIC_API_KEY")
if not API_KEY:
    print("Error: ANTHROPIC_API_KEY environment variable not set")
    exit(1)

MODELS = [
    "claude-haiku-4-5-20251001",
    "claude-sonnet-4-6",
    "claude-opus-4-6",
]

TASKS = [
    {
        "name": "Simple linting fix",
        "prompt": """Fix the JavaScript code to remove unused variables:
```js
function calculateSum(arr) {
  let total = 0;
  let unused = 5;
  for (let i = 0; i < arr.length; i++) {
    total += arr[i];
  }
  return total;
}
```
Keep it brief.""",
    },
    {
        "name": "Write a test",
        "prompt": """Write a Jest test for this function that validates it correctly sums an array:
```js
function calculateSum(arr) {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    total += arr[i];
  }
  return total;
}
```
Keep it brief.""",
    },
    {
        "name": "Code review",
        "prompt": """Review this code for potential bugs:
```js
class UserManager {
  constructor() {
    this.users = [];
  }

  addUser(user) {
    if (user.email && user.name) {
      this.users.push(user);
      return true;
    }
    return false;
  }

  getUserByEmail(email) {
    return this.users.find(u => u.email === email);
  }
}
```
Keep it brief.""",
    },
]


def benchmark_model(model, task):
    """Benchmark a model on a task"""
    url = "https://api.anthropic.com/v1/messages"
    headers = {
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
    }

    payload = {
        "model": model,
        "max_tokens": 500,
        "messages": [{"role": "user", "content": task["prompt"]}],
    }

    start_time = time.time()
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=120)
        total_time = (time.time() - start_time) * 1000  # Convert to ms

        if response.status_code == 200:
            data = response.json()
            tokens = data.get("usage", {}).get("output_tokens", 0)
            tokens_per_second = (tokens / (total_time / 1000)) if total_time > 0 else 0

            return {
                "success": True,
                "total_time": total_time,
                "tokens": tokens,
                "tokens_per_second": tokens_per_second,
            }
        else:
            return {
                "success": False,
                "error": f"Status {response.status_code}: {response.text[:100]}",
            }
    except Exception as e:
        return {"success": False, "error": str(e)}


def main():
    print("Claude Model Latency Benchmark")
    print("Testing response times across Haiku, Sonnet, and Opus\n")
    print("=" * 80)
    print()

    for task in TASKS:
        print(f"Task: {task['name']}\n")
        print(
            f"{'Model':<20} | {'Total (ms)':<12} | {'Tokens':<8} | {'Tokens/sec':<12}"
        )
        print("-" * 80)

        for model in MODELS:
            short_model = "-".join(model.split("-")[1:3]).upper()
            print(f"{short_model:<20} | ", end="", flush=True)

            result = benchmark_model(model, task)

            if result["success"]:
                print(
                    f"{result['total_time']:>10.0f} | {result['tokens']:>6} | {result['tokens_per_second']:>10.1f}"
                )
            else:
                print(f"ERROR: {result['error']}")

            # Small delay between requests
            time.sleep(1)

        print()


if __name__ == "__main__":
    main()
