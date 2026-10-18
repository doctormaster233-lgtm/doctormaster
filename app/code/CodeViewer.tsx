"use client";
/* eslint-disable react-hooks/set-state-in-effect -- effects sync history/iframe with navigation */

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Result = { url: string; status: number; frameBlocked: string | null; truncated: boolean; source: string };

const HOME = "https://www.doctormaster.uk";
const HIGHLIGHT_LIMIT = 400_000;

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Light HTML highlighter: comments, doctype, tags, attributes, strings.
function highlight(src: string) {
  if (src.length > HIGHLIGHT_LIMIT) return esc(src);
  return src.replace(/(<!--[\s\S]*?-->)|(<!doctype[^>]*>)|(<\/?)([a-zA-Z][\w:-]*)([^<>]*?)(\/?>)|([^<]+|<)/gi,
    (_m, com, doc, open, name, attrs, close, text) => {
      if (com) return `<span class="text-zinc-600">${esc(com)}</span>`;
      if (doc) return `<span class="text-zinc-500">${esc(doc)}</span>`;
      if (name) {
        const a = (attrs as string).replace(/([^\s=]+)(\s*=\s*)?("[^"]*"|'[^']*'|[^\s"'>]+)?/g,
          (_x: string, k: string, eq?: string, v?: string) =>
            `<span class="text-sky-300">${esc(k)}</span>${eq ? esc(eq) : ""}${v ? `<span class="text-amber-200">${esc(v)}</span>` : ""}`);
        return `<span class="text-zinc-500">${esc(open)}</span><span class="text-emerald-300">${name}</span>${a}<span class="text-zinc-500">${esc(close)}</span>`;
      }
      return `<span class="text-zinc-300">${esc(text)}</span>`;
    });
}

function Btn(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className="h-10 min-w-10 px-3 rounded-full border border-zinc-800 text-zinc-400 transition-colors hover:border-zinc-600 hover:text-white disabled:opacity-30 disabled:hover:border-zinc-800 disabled:hover:text-zinc-400"
    />
  );
}

export default function CodeViewer() {
  const [input, setInput] = useState(HOME);
  const [hist, setHist] = useState<{ list: string[]; i: number }>({ list: [], i: -1 });
  const [data, setData] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [frameKey, setFrameKey] = useState(0);
  const [split, setSplit] = useState(50);
  const [copied, setCopied] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const current = hist.list[hist.i];

  const load = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`/api/source?url=${encodeURIComponent(url)}`);
      const j = await r.json();
      if (!r.ok) throw new Error(j.error ?? "Couldn't load that page.");
      setData(j);
    } catch (e) {
      setData(null);
      setError(e instanceof Error ? e.message : "Couldn't load that page.");
    } finally {
      setLoading(false);
    }
  }, []);

  const go = (raw: string) => {
    const t = raw.trim();
    if (!t) return;
    const url = /^https?:\/\//i.test(t) ? t : `https://${t}`;
    setHist((h) => ({ list: [...h.list.slice(0, h.i + 1), url], i: h.i + 1 }));
  };

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("url");
    go(q || HOME);
  }, []);

  useEffect(() => {
    if (!current) return;
    setInput(current);
    setFrameKey((k) => k + 1);
    load(current);
    const u = new URL(window.location.href);
    u.searchParams.set("url", current);
    window.history.replaceState(null, "", u);
  }, [current, hist.i, load]);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!dragging.current || !wrapRef.current) return;
      const r = wrapRef.current.getBoundingClientRect();
      setSplit(Math.min(85, Math.max(15, ((e.clientX - r.left) / r.width) * 100)));
    };
    const up = () => { dragging.current = false; document.body.style.userSelect = ""; };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
  }, []);

  const html = useMemo(() => (data ? highlight(data.source) : ""), [data]);
  const lines = data ? data.source.split("\n").length : 0;

  const copyAll = async () => {
    if (!data) return;
    await navigator.clipboard.writeText(data.source);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-[1600px] px-6 py-12 sm:py-16">
        <header className="flex items-start justify-between gap-8">
          <div>
            <nav className="text-sm tracking-widest" aria-label="Site">
              <Link href="/" className="hover:opacity-80">
                <span className="text-white uppercase">DOCTOR MASTER</span>
                <span className="text-zinc-400"> — whovian coder</span>
              </Link>
            </nav>
            <h1 className="text-5xl font-light mt-12 mb-3">Code</h1>
            <p className="text-zinc-400 text-xl">See any web page next to its HTML source.</p>
          </div>
          <div role="img" aria-label="Doctor Master UK logo" className="w-18 h-18 sm:w-24 sm:h-24 text-white shrink-0 mt-2">
            <svg viewBox="0 0 64 64" className="block w-full h-full" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M8 8H56V56H8Z" strokeWidth="4" />
              <path d="M8 8L16 16M56 8L48 16M56 56L48 48M8 56L16 48M16 16H48V48H16Z" strokeWidth="3" />
              <path d="M32 23V41M27 28L32 23L37 28M27 36L32 41L37 36" strokeWidth="3.5" />
            </svg>
          </div>
        </header>

        <form
          className="mt-10 flex items-center gap-2"
          onSubmit={(e) => { e.preventDefault(); go(input); }}
        >
          <Btn aria-label="Back" title="Back" disabled={hist.i <= 0} onClick={() => setHist((h) => ({ ...h, i: h.i - 1 }))}>←</Btn>
          <Btn aria-label="Forward" title="Forward" disabled={hist.i >= hist.list.length - 1} onClick={() => setHist((h) => ({ ...h, i: h.i + 1 }))}>→</Btn>
          <Btn aria-label="Reload" title="Reload" disabled={!current} onClick={() => { setFrameKey((k) => k + 1); if (current) load(current); }}>↻</Btn>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            autoCapitalize="off"
            aria-label="Address"
            className="h-10 min-w-0 flex-1 rounded-full border border-zinc-800 bg-zinc-900/60 px-4 text-zinc-200 outline-none transition-colors focus:border-zinc-600"
          />
          <button type="submit" className="h-10 rounded-full border border-zinc-600 px-4 text-sm tracking-widest text-white transition-colors hover:bg-zinc-900">GO</button>
        </form>

        <div ref={wrapRef} className="mt-6 flex flex-col md:flex-row md:h-[calc(100vh-12rem)] md:min-h-[480px] gap-4 md:gap-0" style={{ ["--split" as string]: `${split}%` }}>
          <section className="relative h-[60vh] md:h-auto md:w-[var(--split)] overflow-hidden rounded-2xl border border-zinc-800 bg-white">
            {current && (
              <iframe key={frameKey} src={current} title="Page preview" className="h-full w-full" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" referrerPolicy="no-referrer" />
            )}
            {data?.frameBlocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 p-6 text-center">
                <div className="max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
                  <p className="text-lg">This site doesn&apos;t allow being shown inside other pages.</p>
                  <p className="text-zinc-400 mt-2 text-sm">It sent <code className="text-zinc-300">{data.frameBlocked}</code>. Its code is still on the right.</p>
                  <a href={current} target="_blank" rel="noreferrer" className="mt-4 inline-block text-zinc-400 underline underline-offset-4 hover:text-white">Open it in a new tab</a>
                </div>
              </div>
            )}
          </section>

          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize panels"
            onPointerDown={() => { dragging.current = true; document.body.style.userSelect = "none"; }}
            onDoubleClick={() => setSplit(50)}
            className="group hidden md:flex w-4 shrink-0 cursor-col-resize items-center justify-center"
          >
            <div className="h-12 w-1 rounded-full bg-zinc-800 transition-colors group-hover:bg-zinc-500" />
          </div>

          <section className="flex h-[70vh] md:h-auto min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60">
            <div className="flex items-center justify-between gap-4 border-b border-zinc-800 px-4 py-3">
              <p className="truncate text-xs tracking-widest text-zinc-400">
                {loading ? "LOADING…" : data ? `HTML SOURCE · ${lines.toLocaleString()} LINES${data.truncated ? " · TRUNCATED AT 2 MB" : ""}` : "HTML SOURCE"}
              </p>
              <button type="button" onClick={copyAll} disabled={!data} className="shrink-0 rounded-full border border-zinc-800 px-3 py-1 text-xs tracking-widest text-zinc-400 transition-colors hover:border-zinc-600 hover:text-white disabled:opacity-30">
                {copied ? "COPIED" : "COPY ALL"}
              </button>
            </div>
            {error ? (
              <p className="p-6 text-zinc-400">{error}</p>
            ) : (
              <pre className="flex-1 overflow-auto p-4 text-[13px] leading-relaxed font-mono whitespace-pre-wrap break-words select-text">
                <code dangerouslySetInnerHTML={{ __html: html }} />
              </pre>
            )}
          </section>
        </div>
        <p className="mt-4 text-zinc-500 text-xs">Source is fetched fresh from the server, as the site sends it (before scripts run). Links clicked inside the preview aren&apos;t tracked — use the address bar.</p>
      </div>
    </div>
  );
}
