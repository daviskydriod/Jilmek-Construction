/**
 * Analytics (C6) — opt-in via environment variables, so nothing loads and no
 * cookies are set until JILMEK actually supplies IDs.
 *
 *   VITE_GA4_ID=G-XXXXXXXXXX
 *   VITE_META_PIXEL_ID=1234567890
 *
 * Leave either blank and that provider is simply skipped.
 */
const GA4_ID = import.meta.env.VITE_GA4_ID ?? "";
const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID ?? "";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue?: unknown[] };
  }
}

let started = false;

export function initAnalytics() {
  if (started || typeof window === "undefined") return;
  started = true;

  if (GA4_ID) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer!.push(args);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA4_ID, { send_page_view: false });
  }

  if (PIXEL_ID) {
    /* eslint-disable */
    (function (f: any, b: Document, e: string, v: string) {
      if (f.fbq) return;
      const n: any = (f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      });
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      const t = b.createElement(e) as HTMLScriptElement;
      t.async = true;
      t.src = v;
      b.getElementsByTagName("head")[0].appendChild(t);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    /* eslint-enable */
    window.fbq?.("init", PIXEL_ID);
  }
}

export function trackPageView(path: string) {
  if (GA4_ID) window.gtag?.("event", "page_view", { page_path: path });
  if (PIXEL_ID) window.fbq?.("track", "PageView");
}

/** Conversion events worth watching for a lead-gen site. */
export function trackEvent(name: "enquiry_submit" | "whatsapp_click" | "phone_click", params?: Record<string, unknown>) {
  if (GA4_ID) window.gtag?.("event", name, params);
  if (PIXEL_ID && name === "enquiry_submit") window.fbq?.("track", "Lead");
  if (PIXEL_ID && name !== "enquiry_submit") window.fbq?.("trackCustom", name, params);
}
