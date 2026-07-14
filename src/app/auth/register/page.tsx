import { signup } from './actions'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md border border-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-500 mb-1">Slapex</h1>
          <p className="text-gray-400">Create your account</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Full Name</label>
            <input
              name="name"
              type="text"
              placeholder="John Doe"
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:outline-none transition"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Email</label>
            <input
              name="email"
              type="email"
              placeholder="trader@example.com"
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:outline-none transition"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Min. 8 characters"
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:outline-none transition"
              required
              minLength={8}
            />
          </div>

          <button
            formAction={signup}
            className="w-full p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
          >
            Create Account
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/auth/login" className="text-purple-400 hover:text-purple-300">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
