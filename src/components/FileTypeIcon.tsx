import type { ReactNode } from "react";

type Kind = "pdf" | "image" | "archive" | "sheet" | "doc" | "slides" | "video" | "cad" | "link" | "file";

const KIND_BY_EXTENSION: Record<string, Kind> = {
  PDF: "pdf",
  JPG: "image",
  JPEG: "image",
  PNG: "image",
  WEBP: "image",
  GIF: "image",
  SVG: "image",
  TIF: "image",
  TIFF: "image",
  ZIP: "archive",
  RAR: "archive",
  "7Z": "archive",
  XLS: "sheet",
  XLSX: "sheet",
  CSV: "sheet",
  DOC: "doc",
  DOCX: "doc",
  TXT: "doc",
  PPT: "slides",
  PPTX: "slides",
  KEY: "slides",
  MP4: "video",
  MOV: "video",
  RFA: "cad",
  RVT: "cad",
  DWG: "cad",
  DXF: "cad",
  IFC: "cad",
  STEP: "cad",
};

const STYLES: Record<Kind, string> = {
  pdf: "bg-red-50 text-red-600 ring-red-100",
  image: "bg-violet-50 text-violet-600 ring-violet-100",
  archive: "bg-amber-50 text-amber-600 ring-amber-100",
  sheet: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  doc: "bg-blue-50 text-blue-600 ring-blue-100",
  slides: "bg-orange-50 text-orange-600 ring-orange-100",
  video: "bg-pink-50 text-pink-600 ring-pink-100",
  cad: "bg-teal-50 text-teal-600 ring-teal-100",
  link: "bg-sky-50 text-sky-600 ring-sky-100",
  file: "bg-slate-100 text-slate-600 ring-slate-200",
};

const PAGE = "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5";

const ICONS: Record<Kind, ReactNode> = {
  pdf: (
    <>
      <path d={PAGE} />
      <path d="M8.5 13h7M8.5 16.5h4.5" />
    </>
  ),
  doc: (
    <>
      <path d={PAGE} />
      <path d="M8.5 12h7M8.5 15h7M8.5 18h4" />
    </>
  ),
  file: <path d={PAGE} />,
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="m21 15-5-5L6 20" />
    </>
  ),
  archive: (
    <>
      <path d={PAGE} />
      <path d="M10 5h1M10 8h1M10 11h1M9.5 14h2v3h-2z" />
    </>
  ),
  sheet: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M4 9h16M4 15h16M10 9v12" />
    </>
  ),
  slides: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M12 16v4M8 20h8M8 12l2.5-3 2 2 3-4" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m10 9 5 3-5 3z" />
    </>
  ),
  // Revit families and CAD drawings (BIM objects).
  cad: (
    <>
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
    </>
  ),
  link: (
    <path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" />
  ),
};

/** Upper-case extension of a file name ("manual.pdf" → "PDF"), or null. */
export function fileExtension(fileName: string | null): string | null {
  const extension = fileName?.includes(".") ? fileName.split(".").pop() : null;
  return extension ? extension.slice(0, 4).toUpperCase() : null;
}

/**
 * Colored icon for a file type (PDF, image, ZIP, spreadsheet…) or an external link,
 * with the extension as a small tag so documents can be told apart at a glance.
 */
export function FileTypeIcon({
  extension,
  isLink = false,
  size = "md",
}: {
  extension: string | null;
  isLink?: boolean;
  size?: "sm" | "md";
}) {
  const kind: Kind = extension ? (KIND_BY_EXTENSION[extension] ?? "file") : isLink ? "link" : "file";
  const tag = extension ?? (kind === "link" ? "URL" : null);
  const box = size === "sm" ? "h-9 w-9 rounded-lg" : "h-11 w-11 rounded-xl";

  return (
    <span aria-hidden className={`relative grid shrink-0 place-items-center ring-1 ${box} ${STYLES[kind]}`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={size === "sm" ? "h-[18px] w-[18px]" : "h-[22px] w-[22px]"}
      >
        {ICONS[kind]}
      </svg>
      {tag ? (
        <span className="absolute -bottom-1.5 -right-1.5 rounded-md bg-current px-1 py-px text-[8px] font-bold leading-3 tracking-wide">
          <span className="text-white">{tag}</span>
        </span>
      ) : null}
    </span>
  );
}
