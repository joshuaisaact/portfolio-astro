#!/usr/bin/env python3

import requests
import json
import time
import os

API_KEY = os.environ.get("ANTHROPIC_API_KEY")
if not API_KEY:
    print("Error: ANTHROPIC_API_KEY environment variable not set")
    exit(1)

MODELS = [
    "claude-haiku-4-5-20251001",
    "claude-opus-4-6",
]

# Real-world coding tasks with varying complexity
CODING_TASKS = [
    {
        "name": "Fix unused variable",
        "complexity": "trivial",
        "prompt": """Fix this code - there's an unused variable:
```js
function sum(arr) {
  let total = 0;
  let unused = 5;
  for (let i = 0; i < arr.length; i++) {
    total += arr[i];
  }
  return total;
}
```
Just show the fixed function.""",
    },
    {
        "name": "Add error handling",
        "complexity": "simple",
        "prompt": """Add proper error handling to this function:
```js
function parseJSON(str) {
  return JSON.parse(str);
}
```
Handle the case where parsing fails.""",
    },
    {
        "name": "Refactor nested conditionals",
        "complexity": "simple",
        "prompt": """Refactor this code to be more readable:
```js
function processUser(user) {
  if (user) {
    if (user.active) {
      if (user.verified) {
        return user.email;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } else {
    return null;
  }
}
```""",
    },
    {
        "name": "Write unit tests",
        "complexity": "moderate",
        "prompt": """Write comprehensive Jest tests for this function:
```js
function calculateDiscount(price, quantity) {
  if (quantity >= 10) {
    return price * 0.9;
  } else if (quantity >= 5) {
    return price * 0.95;
  }
  return price;
}
```
Cover edge cases.""",
    },
    {
        "name": "Multi-file refactoring",
        "complexity": "complex",
        "prompt": """I have two related files that need refactoring. Here's UserService.js:
```js
class UserService {
  getUser(id) {
    // fetch from DB
  }
  validateUser(user) {
    // validation logic mixed with business logic
  }
}
```

And here's AuthService.js:
```js
class AuthService {
  authenticate(user) {
    // also does validation
    // also manages users
  }
}
```

Propose a refactoring to separate concerns properly.""",
    },
    {
        "name": "Debug subtle race condition",
        "complexity": "hard",
        "prompt": """There's a subtle bug in this code related to timing. What is it and how would you fix it?
```js
class TokenManager {
  async refreshToken() {
    const token = await fetch('/api/token');
    this.token = token.value;
  }

  async makeRequest(url) {
    if (this.isExpired()) {
      await this.refreshToken();
    }
    return fetch(url, { headers: { Authorization: this.token } });
  }
}
```
Consider what happens if multiple requests try to refresh at the same time.""",
    },
]


def evaluate_response(response_text, task_name):
    """Simple heuristic evaluation of response quality"""
    score = 0
    max_score = 5

    # Check if response addresses the task
    if "```" in response_text or "function" in response_text.lower():
        score += 1

    # Check for explanation
    if len(response_text) > 200:
        score += 1

    # Check for error handling
    if "error" in response_text.lower() or "catch" in response_text.lower():
        score += 1

    # Check for edge cases
    if "edge case" in response_text.lower() or "boundary" in response_text.lower():
        score += 1

    # Check for explanation of why
    if "because" in response_text.lower() or "reason" in response_text.lower():
        score += 1

    return score, max_score


def benchmark_coding_task(model, task):
    """Benchmark a model on a coding task"""
    url = "https://api.anthropic.com/v1/messages"
    headers = {
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
    }

    payload = {
        "model": model,
        "max_tokens": 800,
        "messages": [{"role": "user", "content": task["prompt"]}],
    }

    start_time = time.time()
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=120)
        total_time = (time.time() - start_time) * 1000

        if response.status_code == 200:
            data = response.json()
            response_text = data["content"][0]["text"]
            tokens = data.get("usage", {}).get("output_tokens", 0)

            # Simple quality scoring
            quality_score, max_quality = evaluate_response(response_text, task["name"])

            return {
                "success": True,
                "total_time": total_time,
                "tokens": tokens,
                "quality_score": quality_score,
                "max_quality": max_quality,
                "response_preview": response_text[:150],
            }
        else:
            return {
                "success": False,
                "error": f"Status {response.status_code}",
            }
    except Exception as e:
        return {"success": False, "error": str(e)}


def main():
    print("Claude Coding Task Benchmark: Haiku 4.5 vs Opus 4.6\n")
    print("=" * 100)
    print()

    results_by_complexity = {}

    for task in CODING_TASKS:
        complexity = task["complexity"]
        if complexity not in results_by_complexity:
            results_by_complexity[complexity] = []

        print(f"Task: {task['name']} ({complexity})")
        print(
            f"{'Model':<20} | {'Time (ms)':<12} | {'Quality':<10} | {'Tokens':<8}"
        )
        print("-" * 65)

        for model in MODELS:
            short_model = "-".join(model.split("-")[1:3]).upper()
            print(f"{short_model:<20} | ", end="", flush=True)

            result = benchmark_coding_task(model, task)

            if result["success"]:
                quality_str = f"{result['quality_score']}/{result['max_quality']}"
                print(
                    f"{result['total_time']:>10.0f} | {quality_str:>8} | {result['tokens']:>6}"
                )
                results_by_complexity[complexity].append(
                    {
                        "model": short_model,
                        "quality": result["quality_score"],
                        "time": result["total_time"],
                    }
                )
            else:
                print(f"ERROR: {result['error']}")

            time.sleep(1)

        print()

    # Summary
    print("=" * 100)
    print("\nSummary by Complexity:\n")

    for complexity in ["trivial", "simple", "moderate", "complex", "hard"]:
        if complexity not in results_by_complexity or not results_by_complexity[complexity]:
            continue

        print(f"{complexity.upper()}:")
        haiku_times = []
        opus_times = []
        haiku_quality = []
        opus_quality = []

        for result in results_by_complexity[complexity]:
            if "HAIKU" in result["model"]:
                haiku_times.append(result["time"])
                haiku_quality.append(result["quality"])
            else:
                opus_times.append(result["time"])
                opus_quality.append(result["quality"])

        if haiku_times and opus_times:
            avg_haiku_time = sum(haiku_times) / len(haiku_times)
            avg_opus_time = sum(opus_times) / len(opus_times)
            avg_haiku_quality = sum(haiku_quality) / len(haiku_quality) if haiku_quality else 0
            avg_opus_quality = sum(opus_quality) / len(opus_quality) if opus_quality else 0

            speedup = avg_opus_time / avg_haiku_time
            quality_diff = ((avg_opus_quality - avg_haiku_quality) / avg_opus_quality * 100) if avg_opus_quality > 0 else 0

            print(f"  Haiku: {avg_haiku_time:.0f}ms, Quality: {avg_haiku_quality:.1f}/5")
            print(f"  Opus:  {avg_opus_time:.0f}ms, Quality: {avg_opus_quality:.1f}/5")
            print(f"  Opus is {speedup:.1f}x slower, Quality gap: {quality_diff:.0f}%")
            print()


if __name__ == "__main__":
    main()
