import { auth, clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { User } from "@/types";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const fetchedUser = await clerkClient.users.getUser(params.userId);
    if (!fetchedUser) {
      return new NextResponse("Not found", { status: 404 });
    }

    const response: User = {
      id: fetchedUser.id,
      username: fetchedUser.username as string,
      firstName: fetchedUser.firstName as string,
      lastName: fetchedUser.lastName as string,
      imageUrl: fetchedUser.imageUrl,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.log("[USER_ID_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
