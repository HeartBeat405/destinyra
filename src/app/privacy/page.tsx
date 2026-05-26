export default function PrivacyPage() {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-8 glow-text">
            Privacy Policy 🔒
          </h1>
  
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl space-y-6">
            <p className="text-gray-300 leading-8">
              Destinyra respects your privacy and
              does not store personal numerology
              results or sensitive personal data.
            </p>
  
            <p className="text-gray-300 leading-8">
              Some anonymous analytics data may be
              collected to improve website
              performance, user experience, and
              feature quality.
            </p>
  
            <p className="text-gray-300 leading-8">
              Third-party services such as Google
              Analytics or Google AdSense may use
              cookies to personalize content and
              analyze traffic.
            </p>
  
            <p className="text-gray-300 leading-8">
              By using Destinyra, you agree to this
              privacy policy and the use of cookies
              for analytics and advertising
              purposes.
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