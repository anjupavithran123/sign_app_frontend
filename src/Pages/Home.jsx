import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">

      {/* NAVBAR */}
      <header className="flex justify-between items-center px-8 py-5 shadow-sm">
        <h1 className="text-2xl font-bold text-indigo-600">
          eSignPro
        </h1>

        <div className="space-x-4">
          <Link
            to="/login"
            className="text-gray-600 hover:text-indigo-600 font-medium"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="text-center px-6 py-20 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Sign Documents Anytime, Anywhere
        </h2>

        <p className="max-w-2xl mx-auto text-lg text-indigo-100 mb-8">
          Upload, send, and securely sign documents online.
          Fast, simple, and legally compliant.
        </p>

        <Link
          to="/register"
          className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-gray-100 transition"
        >
          Start Signing Free
        </Link>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold text-center mb-12">
          Why Choose eSignPro?
        </h3>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-3">
              Secure & Encrypted
            </h4>
            <p className="text-gray-600">
              Your documents are protected with industry-grade encryption.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-3">
              Easy Workflow
            </h4>
            <p className="text-gray-600">
              Upload, assign signers, and track progress in real time.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-3">
              Cloud Storage
            </h4>
            <p className="text-gray-600">
              Access your signed documents from anywhere, anytime.
            </p>
          </div>

        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-indigo-600 text-white text-center py-16 px-6">
        <h3 className="text-3xl font-bold mb-4">
          Ready to simplify document signing?
        </h3>

        <Link
          to="/register"
          className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Create Free Account
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} eSignPro. All rights reserved.
      </footer>

    </div>
  );
}
