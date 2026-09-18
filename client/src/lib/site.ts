export const SITE = {
  name: "JILMEK Roofing & Construction Ltd",
  shortName: "JILMEK",
  tagline: "Everything About Construction.",
  /** Update this to the real production domain before launch (used for SEO tags). */
  url: import.meta.env.VITE_SITE_URL ?? "https://jilmek.com",
  city: "Techiman",
  region: "Bono East Region",
  country: "Ghana",
  coverage: "All 16 regions of Ghana and beyond",
};

export const PHONES = ["0545788758", "0240992159", "0506968852", "0352197847"];

/**
 * WhatsApp click-to-chat number, international format, digits only.
 * OPEN QUESTION for JILMEK: confirm which number is on WhatsApp Business.
 * Defaults to the primary line (0545788758 -> 233545788758).
 */
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER ?? "233545788758";

export const whatsappLink = (message?: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}${
    message ? `?text=${encodeURIComponent(message)}` : ""
  }`;

export const DEFAULT_WHATSAPP_MESSAGE =
  "Hello JILMEK, I'd like to ask about a roofing / construction project.";
