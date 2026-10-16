export type Brand = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  primary_color: string;
  accent_color: string;
  product_layout: "v1" | "v2";
  /** Colors of the product page v2, resolved by the API (brand overrides + defaults). */
  product_theme: ProductTheme;
};

export type ProductTheme = {
  hero_from: string;
  hero_to: string;
  description_background: string;
  specifications_background: string;
  accent: string;
  button: string;
};

export type Category = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
  products_total?: number;
  children?: Category[];
};

export type ProductCard = {
  id: number;
  slug: string;
  sku: string;
  model: string | null;
  capacity_btu: number | null;
  voltage: string | null;
  refrigerant: string | null;
  name: string;
  short_description: string | null;
  image_url: string | null;
  brand_slug?: string;
  category_slug?: string;
};

export type AssetType =
  | "spec_sheet"
  | "manual"
  | "brochure"
  | "catalog"
  | "submittal"
  | "certificate"
  | "image_pack"
  | "video"
  | "logo"
  | "presentation"
  | "other";

export type Asset = {
  id: number;
  brand_id: number;
  type: AssetType;
  title: string;
  description: string | null;
  language: "all" | "en" | "es";
  source: "file" | "link";
  visibility: "public" | "distributors";
  file_name: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  updated_at: string | null;
};

export type ProductDetail = {
  id: number;
  slug: string;
  sku: string;
  model: string | null;
  capacity_btu: number | null;
  voltage: string | null;
  refrigerant: string | null;
  name: string;
  short_description: string | null;
  description: string | null;
  brand: Brand;
  category: {
    slug: string;
    name: string;
    parent: { slug: string; name: string } | null;
  };
  images: { url: string; alt: string | null }[];
  spec_groups: {
    name: string | null;
    items: { label: string; value: string; unit: string | null }[];
  }[];
  features: { type: "highlight" | "key"; title: string; description: string | null; icon_url: string | null }[];
  accessories: ProductCard[];
  videos: { url: string; title: string | null }[];
  assets: Asset[];
};

export type BrandPage = {
  brand: Brand;
  categories: Category[];
  products_total: number;
  featured_products: ProductCard[];
  /** Catalogs offered for download in the brand header, set up on the brand in the admin. */
  catalogs: Asset[];
};

export type CategoryPage = {
  brand: Brand;
  category: Category;
  parent: { slug: string; name: string } | null;
  products: ProductCard[];
  facets: CategoryFacets;
  /** Catalogs offered for download in the category header, set up on the category in the admin. */
  catalogs: Asset[];
};

type FacetOption<T> = { value: T; count: number };

export type CategoryFacets = {
  type: FacetOption<string>[];
  capacity: FacetOption<number>[];
  voltage: FacetOption<string>[];
  refrigerant: FacetOption<string>[];
};

export const LISTING_SORTS = ["capacity_asc", "capacity_desc", "name_asc", "name_desc"] as const;

/** Filters of a category listing, as they travel in the URL (comma-separated lists). */
export type ListingQuery = {
  type?: string;
  capacity?: string;
  voltage?: string;
  refrigerant?: string;
  q?: string;
  sort?: (typeof LISTING_SORTS)[number];
};

export type PaginationMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  company_name: string | null;
  role: "admin" | "marketing" | "distributor";
  locale: "en" | "es";
  all_brands: boolean;
  brand_ids: number[];
};

export type SiteSettings = {
  company_name: string;
  legal_name: string | null;
  logo_url: string | null;
  logo_light_url: string | null;
  primary_color: string;
  accent_color: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  footer_phone: string | null;
  footer_email: string | null;
  sms_note: string | null;
  social_links: { network: string; url: string }[];
};

type Block<Type extends string, Data> = { type: Type; data: Data };

/** Page blocks as the API returns them: already in the requested language, with media URLs. */
export type ContentBlock =
  | Block<"highlights", { items: { icon: string; title: string }[] }>
  | Block<
      "text_media",
      {
        heading: string | null;
        body: string | null;
        image: string | null;
        video_url: string | null;
        image_side: "left" | "right" | null;
      }
    >
  | Block<"cards_over_image", { background: string | null; cards: { title: string; text: string | null }[] }>
  | Block<"team", { heading: string | null; members: { name: string; role: string | null; photo: string | null }[] }>
  | Block<"locations", { heading: string | null; items: { name: string; image: string | null }[] }>
  | Block<
      "contact_form",
      {
        info_heading: string | null;
        heading: string | null;
        intro: string | null;
        sms_consent: string | null;
        disclaimer: string | null;
        terms_url: string | null;
        privacy_url: string | null;
      }
    >
  | Block<"map", { heading: string | null; address: string | null }>;

export type ContentPage = {
  slug: string;
  title: string;
  subtitle: string | null;
  hero_image_url: string | null;
  blocks: ContentBlock[];
};

/** A category found by the catalog search. */
export type SearchCategory = {
  slug: string;
  name: string;
  /** Parent and grandparent names, to tell same-named categories apart. */
  path: string[];
  brand: { slug: string; name: string };
  image_url: string | null;
  products_total: number;
};
