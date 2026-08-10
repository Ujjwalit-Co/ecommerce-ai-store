import { auth } from "@clerk/nextjs/server";
import {
  createAgentUIStreamResponse,
  createUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
} from "ai";
import { createShoppingAgent } from "@/lib/ai/shopping-agent";

export async function POST(request: Request) {
  const { messages }: { messages: UIMessage[] } = await request.json();
  const { userId } = await auth();

  if (!process.env.GROQ_API_KEY) {
    const text =
      "The AI shopping assistant isn't set up yet. Add `GROQ_API_KEY` to your .env.local to enable it.";
    const messageId = crypto.randomUUID();
    const stream = createUIMessageStream({
      execute: ({ writer }) => {
        writer.write({ type: "text-start", id: messageId });
        writer.write({ type: "text-delta", id: messageId, delta: text });
        writer.write({ type: "text-end", id: messageId });
      },
    });
    return createUIMessageStreamResponse({ stream });
  }

  const agent = createShoppingAgent({ userId });
  return createAgentUIStreamResponse({ agent, uiMessages: messages });
}
