import React from "react";

// NOTE: Removed imports for Header and Footer as requested.

export default function About() {
  // Utility card component for consistent styling
  const InfoCard = ({ title, content }) => (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 border border-blue-100">
      <h2 className="text-2xl font-extrabold text-blue-700 mb-4 border-b pb-2 border-blue-100">
        {title}
      </h2>
      <div className="text-gray-700 space-y-3">{content}</div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-[84vh]">
      <main className="flex-grow flex flex-col items-center bg-gray-50 p-6 md:p-12">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 mb-3">
            Your Digital School Portal
          </h1>
          <p className="text-xl md:text-2xl text-gray-600">
            Simplifying every interaction between students, parents, and administration.
          </p>
        </div>

        {/* Benefits Section - 2 Columns */}
        <div className="w-full max-w-6xl mb-12">
          <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Key Benefits
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InfoCard 
              title="Instant Data Access & Security"
              content={
                <ul className="list-none space-y-3">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 text-lg">✅</span>
                    <p>
                      <span className="font-semibold text-gray-900">Real-Time Profile View:</span> Instantly access attendance, marks, fees, and personal details.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 text-lg">✅</span>
                    <p>
                      <span className="font-semibold text-gray-900">Secure & Private:</span> All personal information is encrypted and protected with advanced protocols.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 text-lg">✅</span>
                    <p>
                      <span className="font-semibold text-gray-900">Parental Monitoring:</span> Track your child’s progress and school updates easily from home.
                    </p>
                  </li>
                </ul>
              }
            />
            <InfoCard 
              title="Efficient Registration & Enrollment"
              content={
                <ul className="list-none space-y-3">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 text-lg">✅</span>
                    <p>
                      <span className="font-semibold text-gray-900">Quick Registration:</span> Complete the student registration process fully online, saving time and paper.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 text-lg">✅</span>
                    <p>
                      <span className="font-semibold text-gray-900">Official Document Generation:</span> Instantly generate and print **Student Profiles** and **ID Cards** with correct sizing and official data.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 text-lg">✅</span>
                    <p>
                      <span className="font-semibold text-gray-900">Admin Control:</span> Administrators can easily update, verify, and approve student information in one place.
                    </p>
                  </li>
                </ul>
              }
            />
          </div>
        </div>

        {/* Registration Steps Section - Vertical Flow */}
        <div className="w-full max-w-4xl pt-8">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Simple 4-Step Registration Process
          </h3>
          <div className="relative border-l-4 border-blue-300 space-y-12 ml-4">
            
            {/* Step 1 */}
            <div className="flex items-start relative pl-12">
              <div className="absolute w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center -left-5 top-0 shadow-md font-bold">1</div>
              <div>
                <h4 className="text-xl font-bold text-blue-700 mb-1">Access and Start</h4>
                <p className="text-gray-700">Navigate to the **Register** link on the main portal page and initiate the enrollment form.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start relative pl-12">
              <div className="absolute w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center -left-5 top-0 shadow-md font-bold">2</div>
              <div>
                <h4 className="text-xl font-bold text-blue-700 mb-1">Input Details & Documents</h4>
                <p className="text-gray-700">Carefully fill in all required fields (personal, address, parent details). You must upload the mandatory **Student Photo** and **Signature** images.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start relative pl-12">
              <div className="absolute w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center -left-5 top-0 shadow-md font-bold">3</div>
              <div>
                <h4 className="text-xl font-bold text-blue-700 mb-1">Submit for Approval</h4>
                <p className="text-gray-700">Review your form for accuracy and submit it. The school administration is instantly notified for verification.</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start relative pl-12">
              <div className="absolute w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center -left-5 top-0 shadow-md font-bold">4</div>
              <div>
                <h4 className="text-xl font-bold text-blue-700 mb-1">Confirmation & Access</h4>
                <p className="text-gray-700">Upon approval by an Admin, you will gain full access to the portal features, including your printable profile and ID card.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Call to Action */}
        <button onClick={() => window.location.href = '/register'} className="mt-16 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-3 px-10 rounded-full shadow-2xl transition transform hover:scale-105 hover:shadow-blue-400/50">
          Get Started Now
        </button>
      </main>
    </div>
  );
}
