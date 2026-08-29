import type { ArtProfile } from "@/content/types";
import { asset } from "@/lib/asset";

const LABEL: Record<ArtProfile["platform"], string> = {
  instagram: "Instagram",
  youtube: "YouTube",
};

/** An account shown as a whole, for platforms with no feed worth embedding. */
export function ProfileCard({ profile }: { profile: ArtProfile }) {
  return (
    <a
      href={profile.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 border border-line bg-room p-3 transition hover:border-accent"
    >
      {profile.poster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={asset(profile.poster)}
          alt=""
          width={72}
          height={72}
          loading="lazy"
          decoding="async"
          className="shrink-0 object-cover"
          style={{ width: 72, height: 72 }}
        />
      ) : null}
      <span className="min-w-0">
        <span className="pixel block text-sm text-fg group-hover:text-accent">
          {LABEL[profile.platform]}
        </span>
        <span className="block text-sm text-muted">{profile.handle}</span>
        {profile.blurb ? (
          <span className="mt-1 block text-xs text-muted">{profile.blurb}</span>
        ) : null}
      </span>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
