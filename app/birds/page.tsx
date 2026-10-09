import type { Metadata } from "next";
import Link from "next/link";
import BirdsPlayer, { type Video } from "./BirdsPlayer";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Birds — Doctor Master",
  description: "Latest videos from my YouTube channel.",
};

// Add more channels here; videos are merged and sorted newest first.
const CHANNELS = [
  { id: "UCiYWMJDwhh_nzah8vEkgxVQ", name: "doctormaster233", url: "https://www.youtube.com/@doctormaster" },
];

function decode(s: string) {
  return s
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

async function fetchChannel(ch: (typeof CHANNELS)[number]): Promise<Video[]> {
  const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${ch.id}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`Feed ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].flatMap(([, e]) => {
    const id = e.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
    if (!id) return [];
    return [{
      id,
      title: decode(e.match(/<title>([^<]*)<\/title>/)?.[1] ?? "Untitled"),
      published: e.match(/<published>([^<]+)<\/published>/)?.[1] ?? "",
      thumbnail: e.match(/<media:thumbnail url="([^"]+)"/)?.[1] ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      channel: ch.name,
    }];
  });
}

export default async function BirdsPage() {
  const results = await Promise.allSettled(CHANNELS.map(fetchChannel));
  const videos = results
    .flatMap((r) => (r.status === "fulfilled" ? r.value : []))
    .sort((a, b) => b.published.localeCompare(a.published));

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-2xl mx-auto px-6 py-24">
        <header className="mb-12 text-sm tracking-widest">
          <Link href="/" className="hover:opacity-80">
            <span className="text-white uppercase">DOCTOR MASTER</span>
            <span className="text-zinc-400"> — whovian coder</span>
          </Link>
        </header>
        <h1 className="text-5xl font-light mb-3">Birds</h1>
        <p className="text-zinc-400 text-xl mb-12">Latest videos from my YouTube channel.</p>
        {videos.length > 0 ? (
          <BirdsPlayer videos={videos} />
        ) : (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 text-zinc-400">
            Videos couldn&apos;t be loaded right now.{" "}
            <a href={CHANNELS[0].url} className="underline underline-offset-4 hover:text-white">
              Watch on YouTube
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
