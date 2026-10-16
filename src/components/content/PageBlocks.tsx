import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { ContentBlock, SiteSettings } from "@/lib/api/types";
import { Container } from "../Container";
import { ContactForm } from "./ContactForm";
import { ContactIcon, HighlightIcon } from "./Icons";
import { LiteYouTube } from "./LiteYouTube";

type Props = { locale: Locale; site: SiteSettings | null; t: Dictionary };

function SectionHeading({ children }: { children: string }) {
  return (
    <div className="text-center">
      <span className="mx-auto mb-4 block h-1 w-10 rounded-full bg-brand" />
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{children}</h2>
    </div>
  );
}

/** Renders the blocks of a content page in the order chosen in the admin. */
export function PageBlocks({
  blocks,
  locale,
  site,
  t,
  dense = false,
}: Props & { blocks: ContentBlock[]; dense?: boolean }) {
  return (
    <div className={`flex flex-col pb-16 ${dense ? "gap-8 sm:gap-10" : "gap-14 sm:gap-20"}`}>
      {blocks.map((block, index) => (
        <BlockView key={`${block.type}-${index}`} block={block} first={index === 0} locale={locale} site={site} t={t} />
      ))}
    </div>
  );
}

function BlockView({ block, first, locale, site, t }: Props & { block: ContentBlock; first: boolean }) {
  switch (block.type) {
    case "highlights":
      return (
        // As the first block, the cards overlap the bottom of the hero.
        <Container className={`relative z-10 ${first ? "-mt-32 sm:-mt-28" : ""}`}>
          {/* The 1px shadow fills the gaps as dividers, so an incomplete last row stays white. */}
          <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-surface shadow-xl shadow-ink/5 ring-1 ring-line sm:grid-cols-3 lg:grid-cols-5">
            {block.data.items.map((item) => (
              <li
                key={item.title}
                className="flex flex-col items-start gap-4 bg-surface p-6 shadow-[0_0_0_1px_var(--line)]"
              >
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand/10 text-brand">
                  <HighlightIcon name={item.icon} />
                </span>
                <span className="text-sm font-semibold leading-5 text-ink">{item.title}</span>
              </li>
            ))}
          </ul>
        </Container>
      );

    case "text_media": {
      const { heading, body, image, video_url: video, image_side: side } = block.data;

      return (
        <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className={side === "left" ? "lg:order-2" : ""}>
            {heading ? (
              <>
                <span className="mb-4 block h-1 w-10 rounded-full bg-brand" />
                <h2 className="mb-5 text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
              </>
            ) : null}
            {body ? (
              <div
                className="prose-portal text-[15px] leading-7 text-ink-muted [&_strong]:text-ink"
                // Rich text from the admin editor, sanitized by the API.
                dangerouslySetInnerHTML={{ __html: body }}
              />
            ) : null}
          </div>
          {image || video ? (
            <div className="aspect-[16/10] overflow-hidden rounded-3xl bg-surface-muted shadow-xl shadow-ink/10 ring-1 ring-ink/5">
              {video ? (
                <LiteYouTube url={video} image={image} label={heading ?? t.content.watchVideo} />
              ) : (
                <img src={image ?? ""} alt="" loading="lazy" className="h-full w-full object-cover" />
              )}
            </div>
          ) : null}
        </Container>
      );
    }

    case "cards_over_image":
      return (
        // Photo on one side and the cards as numbered statements on a solid panel, so the text never sits on the photo.
        <Container>
          <section className="grid overflow-hidden rounded-3xl bg-brand-accent text-white shadow-xl shadow-ink/10 lg:grid-cols-2">
            {block.data.background ? (
              <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[400px]">
                <img
                  src={block.data.background}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            ) : null}
            <div className="flex flex-col justify-center divide-y divide-white/10 px-6 py-2 sm:px-10 lg:px-14 lg:py-6">
              {block.data.cards.map((card, index) => (
                <article key={card.title} className="py-6">
                  <p className="text-sm font-semibold tabular-nums text-brand">{String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{card.title}</h3>
                  {card.text ? <p className="mt-3 text-[15px] leading-7 text-white/75">{card.text}</p> : null}
                </article>
              ))}
            </div>
          </section>
        </Container>
      );

    case "team":
      return (
        <Container>
          {block.data.heading ? <SectionHeading>{block.data.heading}</SectionHeading> : null}
          {/* Two columns on phones (an odd last member is centered), three on tablets, rows of five on desktop. */}
          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:flex lg:flex-wrap lg:justify-center lg:gap-y-10">
            {block.data.members.map((member) => (
              <li
                key={member.name}
                className="group max-sm:last:odd:col-span-2 max-sm:last:odd:w-[calc(50%-8px)] max-sm:last:odd:justify-self-center lg:w-[calc(20%-16px)]"
              >
                {/* Soft neutral backdrop with a light brand glow behind the cut-out photos. */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-b from-surface-sunken to-surface ring-1 ring-line sm:rounded-3xl">
                  <div className="absolute inset-x-4 bottom-0 top-1/4 rounded-full bg-brand/20 blur-2xl sm:inset-x-6 sm:blur-3xl" />
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      loading="lazy"
                      className="absolute inset-x-0 bottom-0 mx-auto h-[92%] w-auto object-contain object-bottom transition duration-500 group-hover:scale-[1.03]"
                    />
                  ) : null}
                </div>
                <p className="mt-3 text-sm font-semibold leading-5 text-ink sm:mt-4 sm:text-base">{member.name}</p>
                {member.role ? <p className="text-xs leading-5 text-ink-muted sm:text-sm">{member.role}</p> : null}
              </li>
            ))}
          </ul>
        </Container>
      );

    case "locations":
      return (
        <Container>
          {block.data.heading ? <SectionHeading>{block.data.heading}</SectionHeading> : null}
          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            {block.data.items.map((item) => (
              <li
                key={item.name}
                className="group relative aspect-[16/10] overflow-hidden rounded-3xl bg-surface-sunken"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                <span className="absolute bottom-5 left-5 inline-flex items-center gap-2 text-lg font-semibold text-white">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-white/15 ring-1 ring-white/30 backdrop-blur-md">
                    <ContactIcon name="address" />
                  </span>
                  {item.name}
                </span>
              </li>
            ))}
          </ul>
        </Container>
      );

    case "contact_form":
      // The company details already live in the footer, so the page is just the form (and the map below).
      return (
        <Container>
          <div className="rounded-2xl bg-surface p-5 shadow-xl shadow-ink/5 ring-1 ring-line sm:p-8">
            <ContactForm locale={locale} texts={block.data} t={t.contact} />
          </div>
        </Container>
      );

    case "map": {
      const address = block.data.address || site?.address;
      if (!address) {
        return null;
      }
      const query = encodeURIComponent(address);

      return (
        <Container>
          <div className="relative overflow-hidden rounded-2xl bg-surface-sunken shadow-xl shadow-ink/5 ring-1 ring-line">
            <iframe
              title={block.data.heading ?? address}
              src={`https://www.google.com/maps?q=${query}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-72 w-full border-0 sm:h-80"
            />
          </div>
        </Container>
      );
    }

    default:
      return null;
  }
}
