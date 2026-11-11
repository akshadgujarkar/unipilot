import { NextResponse } from "next/server";
import { isAddress } from "viem";
import { z } from "zod";
import { runAgent } from "@/lib/agent/agent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const AgentRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(4000),
      })
    )
    .min(1, "At least one message is required")
    .max(50, "Too many messages in conversation history"),
  walletAddress: z
    .string()
    .refine((val) => isAddress(val), {
      message: "walletAddress must be a valid EVM address",
    })
    .optional(),
  chainId: z.number().int().positive().optional(),
});

export async function POST(req: Request) {
  try {
    const rawBody: unknown = await req.json();
    const parsed = AgentRequestSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request payload",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const result = await runAgent({
      messages: parsed.data.messages,
      context: {
        walletAddress: parsed.data.walletAddress,
        chainId: parsed.data.chainId,
      },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal agent execution error";

    const isUnavailable =
      message.includes("GEMINI_API_KEY") ||
      message.includes("Gemini API (503)");
    const isRateLimited = message.includes("Gemini API (429)");

    return NextResponse.json(
      { error: message },
      { status: isRateLimited ? 429 : isUnavailable ? 503 : 500 }
    );
  }
}

