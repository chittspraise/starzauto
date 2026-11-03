import "server-only";

/** Dealer's WhatsApp number as digits only (country code, no + or spaces), or null if not set. */
export function whatsappNumber(): string | null {
  const digits = (process.env.WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
  return digits.length >= 8 ? digits : null;
}

/** wa.me link that opens a chat with the dealer, pre-filled with `text`. */
export function whatsappLink(text: string): string | null {
  const number = whatsappNumber();
  return number ? `https://wa.me/${number}?text=${encodeURIComponent(text)}` : null;
}

/**
 * Sends `text` to the dealer's own WhatsApp via CallMeBot (https://www.callmebot.com).
 * Best effort: never throws — the enquiry is already saved in the database.
 */
export async function notifyDealer(text: string): Promise<void> {
  const number = whatsappNumber();
  const apiKey = process.env.CALLMEBOT_API_KEY;
  if (!number || !apiKey) return;

  const url = new URL("https://api.callmebot.com/whatsapp.php");
  url.searchParams.set("phone", number);
  url.searchParams.set("text", text);
  url.searchParams.set("apikey", apiKey);

  try {
    const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(15_000) });
    const body = await res.text();
    if (!res.ok || /error|invalid|not active/i.test(body)) {
      console.error(`WhatsApp notification failed (${res.status}): ${body.slice(0, 200)}`);
    }
  } catch (error) {
    console.error("WhatsApp notification failed:", error);
  }
}
