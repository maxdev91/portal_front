/** Absolute URL on the public origin (request.url is the container's internal address behind a proxy). */
export function publicUrl(path: string): URL {
  return new URL(path, process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3100");
}
