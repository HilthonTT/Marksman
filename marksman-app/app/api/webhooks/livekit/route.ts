import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { WebhookReceiver } from "livekit-server-sdk";
import { fetchMutation } from "convex/nextjs";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const receiver = new WebhookReceiver(
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
);

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headerPayload = headers();
    const authorization = headerPayload.get("Authorization");

    if (!authorization) {
      return new Response("No authorization header", { status: 400 });
    }

    const event = await receiver.receive(body, authorization);

    if (event.event === "track_published") {
      await fetchMutation(api.boards.updateAnynomous, {
        id: event.room?.name as Id<"boards">,
        activeRecording: true,
      });
    }

    if (event.event === "track_unpublished") {
      await fetchMutation(api.boards.updateAnynomous, {
        id: event.room?.name as Id<"boards">,
        activeRecording: false,
      });
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.log("[LIVEKIT_WEBHOOK]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
