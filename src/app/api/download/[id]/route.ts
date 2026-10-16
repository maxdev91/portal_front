import type { NextRequest } from "next/server";
import { ApiError, apiRequest } from "@/lib/api/client";
import { getSessionToken } from "@/lib/session";

/**
 * Proxies a download request to the API with the session token from the httpOnly cookie,
 * and returns the URL the browser should open (a short-lived signed URL or an external link).
 * `{ inline: true }` asks for a URL that opens the file in the browser instead of saving it.
 */
export async function POST(request: NextRequest, context: RouteContext<"/api/download/[id]">) {
  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as { inline?: unknown } | null;
  const inline = body?.inline === true;

  if (!/^\d+$/.test(id)) {
    return Response.json({ message: "not_found" }, { status: 404 });
  }

  try {
    const response = await apiRequest<{ data: { url: string } }>(`assets/${id}/download`, {
      method: "POST",
      token: await getSessionToken(),
      body: inline ? { inline: true } : undefined,
    });

    if (!response) {
      return Response.json({ message: "not_found" }, { status: 404 });
    }

    return Response.json({ url: response.data.url });
  } catch (error) {
    if (error instanceof ApiError && [401, 403, 429].includes(error.status)) {
      return Response.json({ message: error.code }, { status: error.status });
    }
    throw error;
  }
}
