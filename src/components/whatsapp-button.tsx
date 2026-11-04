import { whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./whatsapp-icon";

/** "Chat on WhatsApp" button with a pre-filled message. Renders nothing if WHATSAPP_NUMBER isn't set. */
export function WhatsAppButton({ message, label = "Chat on WhatsApp" }: { message: string; label?: string }) {
  const href = whatsappLink(message);
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 font-semibold text-white transition hover:bg-[#1ebe5b]"
    >
      <WhatsAppIcon />
      {label}
    </a>
  );
}
