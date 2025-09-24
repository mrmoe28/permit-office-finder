"use client"

// Landing page component - this is what shows when you open the app
function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Find Permit Offices
            <span className="block text-blue-600">Fast & Easy</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            The ultimate platform for contractors, property owners, and developers to find building permit offices, track applications, and get directions.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <a 
              href="/sign-up"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-xl text-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Get Started Free
            </a>
            <a 
              href="/sign-in"
              className="bg-white hover:bg-gray-50 text-blue-600 font-bold py-4 px-12 rounded-xl text-xl border-2 border-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Everything You Need for Permit Management
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-8 rounded-2xl bg-blue-50 hover:bg-blue-100 transition-colors duration-300">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Smart Search</h3>
              <p className="text-blue-700 text-lg">
                Find permit offices by county, city, or exact address with our intelligent search system.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-green-50 hover:bg-green-100 transition-colors duration-300">
              <div className="text-6xl mb-6">📋</div>
              <h3 className="text-2xl font-bold text-green-900 mb-4">Track Applications</h3>
              <p className="text-green-700 text-lg">
                Monitor your permit application status in real-time with instant notifications.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-purple-50 hover:bg-purple-100 transition-colors duration-300">
              <div className="text-6xl mb-6">🗺️</div>
              <h3 className="text-2xl font-bold text-purple-900 mb-4">Get Directions</h3>
              <p className="text-purple-700 text-lg">
                Interactive maps with turn-by-turn directions to any permit office.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">10,000+</div>
              <div className="text-gray-300">Permit Offices</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">50,000+</div>
              <div className="text-gray-300">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">1M+</div>
              <div className="text-gray-300">Searches Performed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">99.9%</div>
              <div className="text-gray-300">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-blue-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of contractors and property owners who trust our platform for their permit needs.
          </p>
          <a 
            href="/sign-up"
            className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-4 px-12 rounded-xl text-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 inline-block"
          >
            Start Your Free Account
          </a>
        </div>
      </div>
    </div>
  )
}

// Main page component - always shows the landing page
export default function Home() {
  return <LandingPage />
}