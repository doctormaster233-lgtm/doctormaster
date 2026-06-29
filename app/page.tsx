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
        </div>
      </div>
    </div>
  );
}
