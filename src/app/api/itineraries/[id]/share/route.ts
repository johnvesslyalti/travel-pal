import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface RouteParams {
  params: { id: string };
}

// POST /api/itineraries/[id]/share - Generate share link
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const itineraryId = params.id;

    // Verify ownership
    const existing = await prisma.itinerary.findFirst({
      where: {
        id: itineraryId,
        userId: session.user.id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Itinerary not found" },
        { status: 404 }
      );
    }

    // Generate share token if doesn't exist
    const shareToken = existing.shareToken || nanoid(12);

    // const updated = await prisma.itinerary.update({
    //   where: { id: itineraryId },
    //   data: {
    //     isPublic: true,
    //     shareToken,
    //     status: 'SHARED'
    //   }
    // })

    return NextResponse.json({
      shareUrl: `${process.env.NEXTAUTH_URL}/shared/${shareToken}`,
      shareToken,
    });
  } catch (error) {
    console.error("Error sharing itinerary:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/itineraries/[id]/share - Remove sharing
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const itineraryId = params.id;

    await prisma.itinerary.update({
      where: {
        id: itineraryId,
        userId: session.user.id,
      },
      data: {
        isPublic: false,
        shareToken: null,
      },
    });

    return NextResponse.json({ message: "Sharing disabled" });
  } catch (error) {
    console.error("Error removing share:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
