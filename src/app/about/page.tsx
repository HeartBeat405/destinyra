export default function AboutPage() {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-8 glow-text">
            About Destinyra ✨
          </h1>
  
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl space-y-6">
            <p className="text-gray-300 leading-8">
              Destinyra is a modern numerology web
              application designed to help users
              discover their Life Path Number,
              Master Number, personality traits,
              love energy, and spiritual destiny.
            </p>
  
            <p className="text-gray-300 leading-8">
              Built using Next.js, TypeScript, and
              Tailwind CSS, Destinyra combines
              spiritual insight with modern UI/UX
              design to create a unique and
              interactive self-discovery experience.
            </p>
  
            <p className="text-gray-300 leading-8">
              This platform is created for
              entertainment, inspiration, and
              personal exploration purposes.
            </p>
  
            <div className="pt-6 border-t border-white/10">
              <p className="text-purple-300">
                ✦ destinyra.vercel.app
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }