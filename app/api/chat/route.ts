import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are a warm, curious intake specialist for Streamline Workshop,
a small custom solutions business run by a foster dad and daughter team.
Your job is to have a short friendly conversation with a small business
owner to understand what is slowing their business down.

Ask one question at a time. Never ask multiple questions in one message.

Start by introducing yourself briefly and warmly, then ask their name
and what kind of business they run. Then dig gently into their biggest
operational frustrations: What takes too long? What do they wish happened
automatically? What software drives them crazy? What do they do manually
that they wish they didn't have to?

Keep the conversation to 6-8 exchanges maximum. Be conversational and
human, not clinical or formal. Show genuine curiosity about their business.

When you have a clear picture of their core pain point, wrap up warmly,
thank them by name, and let them know that Scott will review their
conversation and reach out personally within 48 hours.

Do not make promises about specific solutions or pricing during the
conversation.

End your final message with exactly this phrase on its own line:
CONVERSATION_COMPLETE`;

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const messages: Message[] = body.messages || [];

    // Build Anthropic message list
    // If no messages, the assistant will send the greeting unprompted via a user seed
    const anthropicMessages =
      messages.length === 0
        ? [{ role: "user" as const, content: "Hello" }]
        : messages.map((m) => ({
            role: m.role,
            content: m.content,
          }));

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: anthropicMessages,
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}
