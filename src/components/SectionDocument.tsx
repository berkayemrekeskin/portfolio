import { LazyEmbed } from "@/components/ui/LazyEmbed";
import { ProfileCard } from "@/components/ui/ProfileCard";
import type { Section } from "@/content/types";
import { isSectionEmpty } from "@/content/types";
import { asset } from "@/lib/asset";

/**
 * Renders one section as a plain semantic document.
 *
 * Deliberately shared by the modal bodies and the /text page so the two can
 * never disagree. No client hooks, no interactivity — anything interactive
 * wraps this rather than living inside it.
 */
export function SectionDocument({
  section,
  headingLevel = 2,
  showTitle = true,
}: {
  section: Section;
  headingLevel?: 2 | 3;
  /** Off inside a modal, where the dialog's own title bar already names it. */
  showTitle?: boolean;
}) {
  const H = headingLevel === 2 ? "h2" : "h3";
  const Sub = headingLevel === 2 ? "h3" : "h4";

  return (
    <section
      {...(showTitle
        ? { "aria-labelledby": `section-${section.id}` }
        : { "aria-label": section.title })}
      className="space-y-6"
    >
      {showTitle || section.intro ? (
        <header className="space-y-2">
          {showTitle ? (
            <H id={`section-${section.id}`} className="pixel text-xl text-fg">
              {section.title}
            </H>
          ) : null}
          {section.intro ? <p className="text-muted">{section.intro}</p> : null}
        </header>
      ) : null}

      {isSectionEmpty(section) ? (
        <p className="text-muted italic">Nothing here yet.</p>
      ) : (
        <Body section={section} Sub={Sub} />
      )}
    </section>
  );
}

function Body({
  section,
  Sub,
}: {
  section: Section;
  Sub: "h3" | "h4";
}) {
  switch (section.kind) {
    case "about":
      return (
        <div className="space-y-4">
          {section.body.map((paragraph, i) => (
            <p key={i} className="leading-relaxed">
              {paragraph}
            </p>
          ))}
          <SocialList socials={section.socials} />
        </div>
      );

    case "experience":
      return (
        <div className="space-y-8">
          <ol className="space-y-8">
            {section.roles.map((role) => (
              <li key={`${role.company}-${role.start}`} className="space-y-2">
                <Sub className="pixel text-base">
                  {role.title} — {role.company}
                </Sub>
                <p className="text-sm text-muted">
                  <time>{role.start}</time> to{" "}
                  {role.end === "present" ? "present" : <time>{role.end}</time>}
                  {role.location ? ` · ${role.location}` : null}
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  {role.bullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
                <TechList tech={role.tech} />
              </li>
            ))}
          </ol>
          {section.cv.sizeKb > 0 ? (
            <p>
              <a className="text-accent underline" href={asset(section.cv.href)} download>
                {section.cv.label}
              </a>{" "}
              <span className="text-muted text-sm">({section.cv.sizeKb} KB)</span>
            </p>
          ) : null}
          <SocialList socials={section.socials} />
        </div>
      );

    case "projects":
      return (
        <ul className="space-y-8">
          {section.items.map((project) => (
            <li key={project.slug} className="space-y-2">
              <Sub className="pixel text-base">
                {project.name}
                {project.year ? (
                  <span className="text-muted"> · {project.year}</span>
                ) : null}
              </Sub>
              <p>{project.blurb}</p>
              <TechList tech={project.tech} />
              <p className="flex gap-4 text-sm">
                {project.repo ? (
                  <a className="text-accent underline" href={project.repo}>
                    Source
                  </a>
                ) : null}
                {project.demo ? (
                  <a className="text-accent underline" href={project.demo}>
                    Live demo
                  </a>
                ) : null}
              </p>
            </li>
          ))}
        </ul>
      );

    case "achievements":
      return (
        <ul className="space-y-6">
          {section.items.map((item) => (
            <li key={`${item.title}-${item.date}`} className="space-y-1">
              <Sub className="pixel text-base">{item.title}</Sub>
              <p className="text-sm text-muted">
                {item.issuer} · <time>{item.date}</time> · {item.kind}
              </p>
              {item.credentialUrl ? (
                <a className="text-accent text-sm underline" href={item.credentialUrl}>
                  View credential
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      );

    case "gallery":
      return (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {section.items.map((photo) => (
            <li key={photo.src} className="space-y-1">
              {/* Not next/image: static export, and these are already sized. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset(photo.src)}
                width={photo.w}
                height={photo.h}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
                className="h-auto w-full border border-line"
              />
              {photo.caption ? (
                <p className="text-xs text-muted">{photo.caption}</p>
              ) : null}
            </li>
          ))}
        </ul>
      );

    case "embeds":
      return (
        <div className="space-y-8">
          {section.profiles.length > 0 ? (
            <ul className="grid gap-3 sm:grid-cols-2">
              {section.profiles.map((profile) => (
                <li key={profile.platform}>
                  <ProfileCard profile={profile} />
                </li>
              ))}
            </ul>
          ) : null}

          {section.items.length > 0 ? (
            <div className="space-y-3">
              <Sub className="pixel text-base">Latest videos</Sub>
              <ul className="grid gap-4 sm:grid-cols-2">
                {section.items.map((embed) => (
                  <li key={`${embed.provider}-${embed.id}`}>
                    <LazyEmbed embed={embed} />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      );

    default: {
      const _exhaustive: never = section;
      return _exhaustive;
    }
  }
}

function TechList({ tech }: { tech: string[] }) {
  if (tech.length === 0) return null;
  return (
    <p className="text-sm text-muted">
      <span className="sr-only">Technologies: </span>
      {tech.join(" · ")}
    </p>
  );
}

function SocialList({
  socials,
}: {
  socials: { platform: string; url: string; handle: string }[];
}) {
  if (socials.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-4">
      {socials.map((social) => (
        <li key={social.platform}>
          <a className="text-accent underline" href={social.url}>
            {social.platform}
            {social.handle ? (
              <span className="text-muted"> ({social.handle})</span>
            ) : null}
          </a>
        </li>
      ))}
    </ul>
  );
}
