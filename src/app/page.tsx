import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-500">Slapex</h1>
          <Link
            href="/auth/login"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl text-center">
          <h2 className="text-5xl font-bold mb-4 leading-tight">
            Slap Back Into{" "}
            <span className="text-purple-500">Discipline</span>
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Real-time accountability for traders. 
            Stop boredom trading before it happens, not after.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/auth/login"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-semibold text-lg transition"
            >
              Start Trading Better
            </Link>
            <Link
              href="#how-it-works"
              className="border border-gray-700 hover:border-gray-500 text-white px-8 py-3 rounded-xl font-semibold text-lg transition"
            >
              How It Works
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-16 text-center">
            <div>
              <p className="text-3xl font-bold text-purple-400">30-50%</p>
              <p className="text-gray-500 text-sm mt-1">Less Overtrading</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-400">Real-time</p>
              <p className="text-gray-500 text-sm mt-1">Intervention</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-400">AI-Powered</p>
              <p className="text-gray-500 text-sm mt-1">Trading Coach</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-4 text-center text-gray-600 text-sm">
        © 2026 Slapex. All rights reserved.
      </footer>
    </div>
  );
}
