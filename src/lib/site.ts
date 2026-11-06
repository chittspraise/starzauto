/** Business name shown across the site. Change it here only. */
export const SITE_NAME = "StarzAutoZW";

/** Office address, shown on the contact page and in the footer. */
export const OFFICE_ADDRESS = "Sam Nujoma, Harare, Zimbabwe";

/** Phone number for direct calls, as shown and as a tel: link. */
export const PHONE_DISPLAY = "+263 77 103 1288";
export const PHONE_LINK = "tel:+263771031288";

/** Contact email address. */
export const EMAIL = "nyenyedzip@gmail.com";

/** Social media pages, shown in the footer and on the contact page. */
export const INSTAGRAM_URL = "https://www.instagram.com/starzautozw/";
export const FACEBOOK_URL = "https://www.facebook.com/share/1FT9ATpv34/";

/** Office pin (latitude, longitude) — from the office's Google Maps link. */
const OFFICE_COORDS = "-17.7855,31.0414";

/** Opens the office location in Google Maps. */
export const OFFICE_MAP_URL = `https://www.google.com/maps/search/?api=1&query=${OFFICE_COORDS}`;

/** Embeddable map with a pin on the office (no API key needed). */
export const OFFICE_MAP_EMBED_URL = `https://maps.google.com/maps?q=${OFFICE_COORDS}&z=16&output=embed`;

/** Trading hours, shown on the contact page and in the footer. */
export const TRADING_HOURS: [days: string, hours: string][] = [
  ["Monday – Friday", "08:00 – 17:00"],
  ["Saturday", "08:00 – 13:00"],
  ["Sunday & Public Holidays", "Closed"],
];
