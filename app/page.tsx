export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-2xl mx-auto px-6 py-24">
        <div className="mb-16">
          <h1 className="text-5xl font-light mb-3">Hi, I'm learning to build.</h1>
          <p className="text-zinc-400 text-xl">
            I'm teaching myself how to code and building things from scratch. I don't particularly know what I am doing. *Grok made by Xai* helped me build this website thus far. I am learning as I go. I created this page to be a storytelling website. I am very much inspired by Doctor Who. That's in the United Kingdom, isn't it? I'm in Charlottetown, Prince Edward Island, Canada. Apparently my name is Sharon Epic Armando. I called this website Doctor Master UK because... well nevermind. I'll explain later.
          </p>
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
        </div>
      </div>
    </div>
  );
}
