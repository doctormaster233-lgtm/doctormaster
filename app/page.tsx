export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-2xl mx-auto px-6 py-24">
        <div className="mb-16 flex flex-col-reverse sm:flex-row sm:items-start sm:justify-between gap-8">
          <div>
            <h1 className="text-5xl font-light mb-3">Hi, I&apos;m learning to build.</h1>
            <p className="text-zinc-400 text-xl">
              I&apos;m teaching myself how to code and building things from scratch. This site is part of that journey.
            </p>
          </div>
          <div
            role="img"
            aria-label="Doctor Master UK logo"
            className="w-40 h-40 rounded-full bg-zinc-900 border border-zinc-800 text-white grid place-items-center shrink-0 sm:ml-6"
          >
            <svg
              viewBox="0 0 64 64"
              className="w-20 h-20"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M8 8H56V56H8Z" strokeWidth="4" />
              <path d="M8 8L16 16M56 8L48 16M56 56L48 48M8 56L16 48M16 16H48V48H16Z" strokeWidth="3" />
              <path d="M32 23V41M27 28L32 23L37 28M27 36L32 41L37 36" strokeWidth="3.5" />
            </svg>
          </div>
        </div>

        <div className="space-y-12">
          <div>
            <h2 className="text-zinc-400 text-sm tracking-widest mb-4">CURRENTLY BUILDING</h2>
            <p className="text-lg">A clean, minimalist storytelling site</p>
          </div>

          <div>
            <h2 className="text-zinc-400 text-sm tracking-widest mb-4">CURRENTLY LEARNING</h2>
            <p className="text-lg">Next.js, TypeScript, and Tailwind</p>
          </div>

          <div>
            <h2 className="text-zinc-400 text-sm tracking-widest mb-4">THINGS I&apos;VE BUILT</h2>
            <a
              href="/translator"
              className="group block rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 transition-colors hover:border-zinc-600 hover:bg-zinc-900"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg">Chinese ↔ English Translator</p>
                  <p className="text-zinc-400 mt-1">
                    Type pinyin, see the tones, and hear it read aloud.
                  </p>
                </div>
                <span
                  aria-hidden="true"
                  className="text-zinc-400 text-xl transition-colors group-hover:text-white"
                >
                  →
                </span>
              </div>
              <ul className="mt-5 flex flex-wrap gap-2 text-xs tracking-widest text-zinc-400">
                <li className="rounded-full border border-zinc-800 px-3 py-1">PINYIN</li>
                <li className="rounded-full border border-zinc-800 px-3 py-1">VOICE</li>
                <li className="rounded-full border border-zinc-800 px-3 py-1">READ-ALOUD</li>
              </ul>
            </a>
          </div>

          <div className="pt-8 space-y-4">
            <p className="text-zinc-400">
              Looking for mentorship, feedback, or small freelance opportunities while I learn.
            </p>
            <p className="text-zinc-400">
              I am a web developer, artist and artificial intelligence enthusiast. I presently live in Charlottetown, Prince Edward Island, Canada. I am willing to relocate.
            </p>
            <p className="text-zinc-400">
              <a href="mailto:doctormaster233@gmail.com" className="underline underline-offset-4 hover:text-white">
                Email me
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
