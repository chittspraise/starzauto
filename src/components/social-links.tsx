import { FACEBOOK_URL, INSTAGRAM_URL, SITE_NAME } from "@/lib/site";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
      <path d="M14 8h3V4h-3c-2.76 0-5 2.24-5 5v2H7v4h2v9h4v-9h3l1-4h-4V9c0-.55.45-1 1-1z" />
    </svg>
  );
}

const LINKS = [
  { href: INSTAGRAM_URL, label: "Instagram", Icon: InstagramIcon, hover: "hover:bg-[#E1306C]" },
  { href: FACEBOOK_URL, label: "Facebook", Icon: FacebookIcon, hover: "hover:bg-[#1877F2]" },
];

/** Round Instagram and Facebook buttons. `tone` matches a dark or light background. */
export function SocialLinks({ tone = "dark", className = "" }: { tone?: "dark" | "light"; className?: string }) {
  const base =
    tone === "dark"
      ? "bg-neutral-800 text-white"
      : "bg-neutral-100 text-neutral-800 hover:text-white";
  return (
    <div className={`flex gap-3 ${className}`}>
      {LINKS.map(({ href, label, Icon, hover }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${SITE_NAME} on ${label}`}
          title={label}
          className={`flex size-10 items-center justify-center rounded-full transition ${base} ${hover}`}
        >
          <Icon />
        </a>
      ))}
    </div>
  );
}
