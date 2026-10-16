import "server-only";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "portal_session";

const THIRTY_DAYS = 60 * 60 * 24 * 30;

/** Reads the API session token. Must run at request time (inside Suspense, a route handler or a server action). */
export async function getSessionToken(): Promise<string | null> {
  return (await cookies()).get(SESSION_COOKIE)?.value ?? null;
}

export async function setSessionToken(token: string): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.SESSION_COOKIE_SECURE === "true",
    sameSite: "lax",
    path: "/",
    maxAge: THIRTY_DAYS,
  });
}

export async function clearSessionToken(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}
