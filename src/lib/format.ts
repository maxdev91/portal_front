export function formatFileSize(bytes: number | null, locale: string): string | null {
  if (!bytes) {
    return null;
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }

  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: unit === 0 ? 0 : 1 }).format(value)} ${units[unit]}`;
}

export function formatCapacity(btu: number, locale: string): string {
  return `${new Intl.NumberFormat(locale).format(btu)} BTU`;
}

/** YouTube id from a watch/share URL, for privacy-friendly embeds. */
export function youTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  return match ? match[1] : null;
}
