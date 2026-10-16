import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { CATALOG_TAG } from "@/lib/api/catalog";

/** Called by the API after catalog changes. Marks cached catalog pages stale; they refresh on the next visit. */
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return Response.json({ message: "unauthorized" }, { status: 401 });
  }

  revalidateTag(CATALOG_TAG, "max");

  return Response.json({ revalidated: true });
}
