export default function LandingPage({ onCustomerMode, onStaffMode }) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#ccb06a" }}>
      <div className="max-w-2xl mx-auto text-center">
        {/* Header */}
        <div className="mb-12">
          <div className="text-7xl mb-4">🍽️</div>
          <h1 className="text-5xl font-bold text-stone-800 mb-2 font-serif">Restaurant Menu</h1>
          <p className="text-stone-600 text-lg">Order delicious food with ease</p>
        </div>

        {/* Two Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Option */}
          <button
            onClick={onCustomerMode}
            className="group bg-gradient-to-br from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 border-2 border-stone-700 rounded-xl p-8 shadow-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-2"
          >
            <div className="text-6xl mb-4">📱</div>
            <h2 className="text-3xl font-bold text-stone-800 mb-3">Customer</h2>
            <p className="text-stone-600 mb-4">Scan QR code and browse our menu</p>
            <div className="inline-block bg-amber-600 group-hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-semibold transition-all">
              Scan QR Code →
            </div>
          </button>

          {/* Staff Option */}
          <button
            onClick={onStaffMode}
            className="group bg-gradient-to-br from-stone-50 to-stone-100 hover:from-stone-100 hover:to-stone-200 border-2 border-stone-700 rounded-xl p-8 shadow-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-2"
          >
            <div className="text-6xl mb-4">👨‍🍳</div>
            <h2 className="text-3xl font-bold text-stone-800 mb-3">Staff/Admin</h2>
            <p className="text-stone-600 mb-4">Login to manage orders and menu</p>
            <div className="inline-block bg-stone-800 group-hover:bg-stone-900 text-amber-50 px-6 py-2 rounded-lg font-semibold transition-all">
              Login →
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-stone-500 text-sm">
          <p>🔒 Staff login is secure and password-protected</p>
        </div>
      </div>
    </div>
  );
}
