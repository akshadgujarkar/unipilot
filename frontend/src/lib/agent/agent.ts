import {
  GoogleGenAI,
  createPartFromFunctionResponse,
  createUserContent,
  type Content,
  type Part,
} from "@google/genai";
import { dispatchToolCall, type ExecutedToolCall } from "./dispatcher";
import { buildSystemPrompt, type AgentContext } from "./prompts";
import { AGENT_TOOLS } from "./tools";

export interface InputChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface RunAgentInput {
  messages: InputChatMessage[];
  context?: AgentContext;
}

export interface RunAgentOutput {
  reply: string;
  toolCalls: ExecutedToolCall[];
}

const DEFAULT_MODEL = "gemini-2.5-flash";
const MAX_TOOL_ITERATIONS = 5;
const MAX_TRANSIENT_RETRIES = 2;

function isTransientApiError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes('"code":503') ||
    msg.includes('"code":429') ||
    msg.includes("UNAVAILABLE") ||
    msg.includes("RESOURCE_EXHAUSTED")
  );
}

function formatGeminiError(err: unknown): Error {
  const raw = err instanceof Error ? err.message : String(err);
  try {
    const parsed = JSON.parse(raw) as {
      error?: { code?: number; message?: string; status?: string };
    };
    if (parsed?.error?.message) {
      const code = parsed.error.code ?? 500;
      return new Error(`Gemini API (${code}): ${parsed.error.message}`);
    }
  } catch {
    // Raw message is not JSON; fall through
  }
  return err instanceof Error ? err : new Error(raw);
}

async function generateWithRetry(
  ai: GoogleGenAI,
  params: Parameters<GoogleGenAI["models"]["generateContent"]>[0]
) {
  let lastError: unknown;
  for (let attempt = 0; attempt <= MAX_TRANSIENT_RETRIES; attempt++) {
    try {
      return await ai.models.generateContent(params);
    } catch (err) {
      lastError = err;
      if (!isTransientApiError(err) || attempt === MAX_TRANSIENT_RETRIES) {
        throw formatGeminiError(err);
      }
      const delayMs = 1000 * (attempt + 1);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw formatGeminiError(lastError);
}

/**
 * Executes a multi-turn Gemini tool-calling cycle on the server.
 */
export async function runAgent(input: RunAgentInput): Promise<RunAgentOutput> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    throw new Error(
      "GEMINI_API_KEY is not configured. Please add your key to frontend/.env.local and restart the Next.js server."
    );
  }

  const model = process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
  const ai = new GoogleGenAI({ apiKey, apiVersion: "v1beta" });
  const systemInstruction = buildSystemPrompt(input.context);

  const contents: Content[] = input.messages.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  const executedToolCalls: ExecutedToolCall[] = [];

  for (let step = 0; step < MAX_TOOL_ITERATIONS; step++) {
    const response = await generateWithRetry(ai, {
      model,
      contents,
      config: {
        systemInstruction,
        tools: [{ functionDeclarations: AGENT_TOOLS }],
      },
    });

    const functionCalls = response.functionCalls;

    if (!functionCalls || functionCalls.length === 0) {
      const replyText = response.text?.trim();
      return {
        reply:
          replyText && replyText.length > 0
            ? replyText
            : "I completed the check, but no response text was returned.",
        toolCalls: executedToolCalls,
      };
    }

    // Preserve the model's function call turn in the conversation history
    const modelContent = response.candidates?.[0]?.content;
    if (modelContent) {
      contents.push(modelContent);
    }

    // Execute every requested tool call and send structured responses back to Gemini
    const responseParts: Part[] = [];
    for (const call of functionCalls) {
      const toolName = call.name ?? "unknown";
      const toolArgs = (call.args ?? {}) as Record<string, unknown>;

      const executed = await dispatchToolCall(toolName, toolArgs, input.context);
      executedToolCalls.push(executed);

      const responsePayload: Record<string, unknown> = executed.success
        ? { output: executed.result }
        : { error: executed.result };

      responseParts.push(
        createPartFromFunctionResponse(
          call.id ?? "",
          toolName,
          responsePayload
        )
      );
    }

    contents.push(createUserContent(responseParts));
  }

  return {
    reply:
      "I reached the maximum tool-calling steps for this request. Please try rephrasing or narrowing your query.",
    toolCalls: executedToolCalls,
  };
}
