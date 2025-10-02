import React from "react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[84vh] bg-gray-50 font-sans">
      
      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 md:p-12 text-center bg-gradient-to-br from-blue-50 to-blue-200">
        <div className="max-w-4xl mx-auto py-16">
          <h1 className="text-5xl md:text-7xl font-extrabold text-blue-800 tracking-tight mb-4 animate-fadeInDown">
            Welcome to Springdale Academy
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-10 font-light animate-fadeIn">
            Nurturing knowledge, inspiring futures. Your gateway to resources and information.
          </p>
          <button onClick={() => window.location.href = '/register'} className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-3 px-10 rounded-full shadow-xl transition transform hover:scale-105 hover:shadow-blue-400/50 text-lg animate-fadeInUp">
            Get Started
          </button>
        </div>
      </main>

      {/* --- Section Divider --- */}
      
      {/* School Vision and Overview */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Our School Section */}
          <div className="lg:col-span-1 border-r border-gray-200 pr-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="text-blue-500 text-4xl mr-3">🏫</span>Our School
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Springdale Academy has been a cornerstone of academic excellence for over two decades. We are dedicated to providing a balanced education that encourages critical thinking, creativity, and ethical responsibility in every student.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our modern campus and experienced faculty create an environment where every student can achieve their personal best.
            </p>
          </div>

          {/* Vision Section */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="text-blue-500 text-4xl mr-3">✨</span>Our Vision & Mission
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-blue-50 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-blue-700 mb-2">Vision</h3>
                <p className="text-gray-700">
                  To be a premier educational institution recognized globally for academic rigor, innovation in teaching, and commitment to holistic student development.
                </p>
              </div>
              <div className="p-6 bg-cyan-50 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-cyan-700 mb-2">Mission</h3>
                <p className="text-gray-700">
                  To empower students with the skills, knowledge, and moral compass necessary to succeed as leaders and contributing members of society in the 21st century.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section Divider --- */}

      {/* Contact Section */}
      <section className="py-12 px-6 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Contact & Location
          </h2>
          <div className="flex flex-wrap justify-center gap-8 text-lg text-gray-700">
            <div className="flex items-center">
              <span className="text-blue-500 mr-2">📞</span> (555) 123-4567
            </div>
            <div className="flex items-center">
              <span className="text-blue-500 mr-2">📧</span> info@springdaleacademy.edu
            </div>
            <div className="flex items-center">
              <span className="text-blue-500 mr-2">📍</span> 456 Education Lane, Metropolis, 10001
            </div>
          </div>
          <button onClick={() => window.location.href = '/register'} className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition">
            Send an Inquiry
          </button>
        </div>
      </section>
    </div>
  );
}
