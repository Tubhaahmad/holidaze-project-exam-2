import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-16">
      {/* header */}
      <div className="mb-12">
        <p className="mb-2 text-sm font-medium text-coral">About us</p>
        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          Welcome to Holidaze
        </h1>
        <p className="max-w-2xl text-lg text-gray-500">
          Holidaze is a modern accommodation booking platform connecting
          travellers with unique venues around the world.
        </p>
      </div>

      {/* mission */}
      <div className="mb-12 rounded-xl border border-gray-200 bg-white p-8">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Our mission</h2>
        <p className="leading-relaxed text-gray-500">
          We believe that every trip should be memorable. Our mission is to make
          it easy for travellers to find and book unique, hand-picked venues and
          for hosts to share their spaces with the world. Whether you are
          looking for a cozy cabin, a city apartment or a luxury villa, Holidaze
          has something for everyone.
        </p>
      </div>

      {/* values */}
      <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-2 font-semibold text-gray-900">Unique venues</h3>
          <p className="text-sm text-gray-500">
            Every venue on Holidaze is hand-picked to ensure quality and
            uniqueness.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-2 font-semibold text-gray-900">Secure booking</h3>
          <p className="text-sm text-gray-500">
            Book with confidence. Your data and payments are always protected.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-2 font-semibold text-gray-900">24/7 support</h3>
          <p className="text-sm text-gray-500">
            Our team is always available to help you with any questions or
            issues.
          </p>
        </div>
      </div>
    </div>
  );
}
