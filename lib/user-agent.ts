export type UAInfo = { device: string; browser: string; os: string };

/**
 * Coarse, dependency-free User-Agent parsing (server-only). Reduces the UA to
 * device class / browser / os for analytics — no fingerprinting, no PII.
 */
export function parseUserAgent(ua: string | null | undefined): UAInfo {
  const s = ua ?? "";

  let device = "desktop";
  if (/\bTablet\b|\biPad\b|Android(?!.*Mobile)/i.test(s)) device = "tablet";
  else if (/Mobile|iPhone|iPod|Windows Phone/i.test(s)) device = "mobile";

  let os = "unknown";
  if (/Windows NT/i.test(s)) os = "Windows";
  else if (/iPhone|iPad|iPod/i.test(s)) os = "iOS";
  else if (/Mac OS X/i.test(s)) os = "macOS";
  else if (/Android/i.test(s)) os = "Android";
  else if (/Linux/i.test(s)) os = "Linux";

  let browser = "unknown";
  if (/Edg\//i.test(s)) browser = "Edge";
  else if (/OPR\/|Opera/i.test(s)) browser = "Opera";
  else if (/Firefox\//i.test(s)) browser = "Firefox";
  else if (/Chrome\//i.test(s)) browser = "Chrome";
  else if (/Safari\//i.test(s)) browser = "Safari";

  return { device, browser, os };
}
