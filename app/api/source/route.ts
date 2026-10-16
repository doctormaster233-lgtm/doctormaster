import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB
const TIMEOUT_MS = 8000;
const MAX_REDIRECTS = 5;

function isPrivate(ip: string): boolean {
  if (ip.startsWith("::ffff:")) ip = ip.slice(7);
  if (isIP(ip) === 4) {
    const [a, b] = ip.split(".").map(Number);
    return (
      a === 0 || a === 10 || a === 127 || a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 192 && b === 0) ||
      (a === 198 && (b === 18 || b === 19) && process.env.CODE_ALLOW_198_18 !== "1") // local sandbox testing only
    );
  }
  const v = ip.toLowerCase();
  return v === "::" || v === "::1" || v.startsWith("fc") || v.startsWith("fd") ||
    v.startsWith("fe8") || v.startsWith("fe9") || v.startsWith("fea") || v.startsWith("feb") || v.startsWith("ff");
}

async function assertPublic(u: URL) {
  if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error("Only http and https URLs are allowed.");
  if (u.username || u.password) throw new Error("URLs with credentials are not allowed.");
  if (u.port && !["80", "443"].includes(u.port)) throw new Error("Only standard ports are allowed.");
  const host = u.hostname.replace(/^\[|\]$/g, "");
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal"))
    throw new Error("That address isn't public.");
  const addrs = isIP(host) ? [{ address: host }] : await lookup(host, { all: true });
  if (!addrs.length || addrs.some((a) => isPrivate(a.address))) throw new Error("That address isn't public.");
}

function frameBlocked(h: Headers): string | null {
  const xfo = h.get("x-frame-options");
  if (xfo && /deny|sameorigin/i.test(xfo)) return `X-Frame-Options: ${xfo}`;
  const csp = h.get("content-security-policy");
  const fa = csp?.match(/frame-ancestors([^;]*)/i)?.[1].trim();
  if (fa !== undefined && !/(^|\s)\*(\s|$)/.test(fa)) return `CSP frame-ancestors ${fa || "(none)"}`;
  return null;
}

export async function GET(req: Request) {
  const raw = new URL(req.url).searchParams.get("url") ?? "";
  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return Response.json({ error: "That doesn't look like a URL." }, { status: 400 });
  }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    let res: Response | null = null;
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      await assertPublic(url);
      res = await fetch(url, {
        redirect: "manual",
        signal: ctrl.signal,
        headers: { "user-agent": "Mozilla/5.0 (compatible; DoctorMasterCode/1.0; +https://www.doctormaster.uk/code)", accept: "text/html,*/*;q=0.8" },
        cache: "no-store",
      });
      const loc = res.headers.get("location");
      if (res.status >= 300 && res.status < 400 && loc) {
        url = new URL(loc, url);
        continue;
      }
      break;
    }
    if (!res || (res.status >= 300 && res.status < 400)) throw new Error("Too many redirects.");

    const reader = res.body?.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0, truncated = false;
    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) { truncated = true; chunks.push(value.slice(0, value.byteLength - (size - MAX_BYTES))); await reader.cancel(); break; }
      chunks.push(value);
    }
    const source = new TextDecoder().decode(Buffer.concat(chunks));
    return Response.json({
      url: url.toString(), status: res.status,
      contentType: res.headers.get("content-type"),
      frameBlocked: frameBlocked(res.headers), truncated, source,
    });
  } catch (e) {
    const msg = ctrl.signal.aborted ? "The site took too long to respond." : e instanceof Error ? e.message : "Fetch failed.";
    return Response.json({ error: msg }, { status: 502 });
  } finally {
    clearTimeout(timer);
  }
}
