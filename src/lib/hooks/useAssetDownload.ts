"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Locale } from "@/i18n/config";

export type DownloadState = "idle" | "loading" | "forbidden" | "error";

/**
 * Asks the portal server for a download URL (signed and short-lived for private files) and opens it.
 * Guests are sent to the sign-in page for distributor-only material.
 * `view` opens the file in a new tab instead of saving it.
 */
export function useAssetDownload(assetId: number, locale: Locale, isLink: boolean) {
  const router = useRouter();
  const [state, setState] = useState<DownloadState>("idle");

  async function request(inline: boolean): Promise<string | null> {
    setState("loading");

    const response = await fetch(`/api/download/${assetId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inline }),
    }).catch(() => null);

    if (response?.status === 401) {
      router.push(`/${locale}/login`);
      return null;
    }
    if (response?.status === 403) {
      setState("forbidden");
      return null;
    }
    if (!response?.ok) {
      setState("error");
      return null;
    }

    const { url } = (await response.json()) as { url: string };
    setState("idle");
    return url;
  }

  async function start(): Promise<void> {
    const url = await request(false);
    if (url) {
      window.open(url, isLink ? "_blank" : "_self", "noopener,noreferrer");
    }
  }

  async function view(): Promise<void> {
    // The tab is opened during the click so the browser does not block it as a pop-up.
    const tab = window.open("", "_blank");
    const url = await request(true);

    if (!tab) {
      if (url) {
        window.location.assign(url);
      }
      return;
    }
    if (!url) {
      tab.close();
      return;
    }
    tab.opener = null;
    tab.location.href = url;
  }

  return { state, start, view };
}
