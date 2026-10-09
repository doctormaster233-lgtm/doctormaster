"use client";
import { useState } from "react";

export type Video = { id: string; title: string; published: string; thumbnail: string; channel: string };

const fmt = (d: string) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }) : "";

export default function BirdsPlayer({ videos }: { videos: Video[] }) {
  const [current, setCurrent] = useState(videos[0]);
  return (
    <div>
      <h2 className="text-zinc-400 text-sm tracking-widest mb-4">NOW PLAYING</h2>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden mb-12">
        <div className="aspect-video bg-black">
          <iframe
            key={current.id}
            className="w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${current.id}?rel=0`}
            title={current.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="p-5">
          <p className="text-lg">{current.title}</p>
          <p className="text-zinc-400 text-sm mt-1">{fmt(current.published)}</p>
        </div>
      </div>
      <h2 className="text-zinc-400 text-sm tracking-widest mb-4">ALL VIDEOS</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {videos.map((v) => (
          <li key={v.id}>
            <button
              type="button"
              onClick={() => { setCurrent(v); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              aria-pressed={v.id === current.id}
              className={`group w-full text-left rounded-2xl border bg-zinc-900/60 overflow-hidden transition-colors hover:border-zinc-600 hover:bg-zinc-900 ${v.id === current.id ? "border-zinc-500" : "border-zinc-800"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.thumbnail} alt="" loading="lazy" className="w-full aspect-video object-cover" />
              <div className="p-4">
                <p className="line-clamp-2">{v.title}</p>
                <p className="text-zinc-400 text-sm mt-1">{fmt(v.published)}</p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
