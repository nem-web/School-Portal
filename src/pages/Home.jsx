import React from "react";
import { Link } from "react-router-dom";

// Mock Data
const HOSTEL_STRENGTH = [
  { id: 1, className: "Class 8", strength: 12 },
  { id: 2, className: "Class 9", strength: 18 },
  { id: 3, className: "Class 10", strength: 25 },
  { id: 4, className: "Class 11", strength: 30 },
  { id: 5, className: "Class 12", strength: 28 },
];

// Placeholder Cloudinary Images
const IMAGES = [
  "https://res.cloudinary.com/dlhauofrz/image/upload/v1759077818/cld-sample-5.jpg",
  "https://res.cloudinary.com/dlhauofrz/image/upload/v1759077819/main-sample.png",
  "https://res.cloudinary.com/dlhauofrz/image/upload/v1759077818/cld-sample-3.jpg",
  "https://res.cloudinary.com/dlhauofrz/image/upload/v1759077817/cld-sample.jpg",
];

export default function Home() {
  // Calculation for total
  const totalStudents = HOSTEL_STRENGTH.reduce((sum, item) => sum + item.strength, 0);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans pb-24 lg:pb-0">
      
      {/* ---------------- CSS for Scrolling Animation ---------------- */}
      <style>{`
        @keyframes scroll-strip {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); } 
        }
        .animate-scroll-strip {
          animation: scroll-strip 40s linear infinite; /* Slowed down for elegance */
          width: 200%;
          display: flex;
        }
      `}</style>

      {/* ---------------- HERO SECTION ---------------- */}
      <div className="relative h-[40vh] overflow-hidden bg-slate-900 rounded-b-[2.5rem] shadow-2xl z-10">
        
        {/* Infinite Scrolling Background */}
        <div className="absolute inset-0 flex items-center opacity-60">
           <div className="animate-scroll-strip">
             {[...IMAGES, ...IMAGES].map((img, idx) => (
               <div key={`img-${idx}`} className="w-full h-full flex-shrink-0 px-0.5">
                 <img src={img} className="w-full h-full object-cover" alt="Hostel View" />
               </div>
             ))}
           </div>
        </div>

        {/* Gradient Overlay & Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent">
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-4 shadow-lg">
            <span className="text-white text-xs font-bold tracking-widest uppercase">
              Admin Portal
            </span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
            Springdale Hostel
          </h1>
          <p className="text-slate-200 text-sm max-w-[200px] mb-6 font-light leading-relaxed">
            Manage attendance and resident details with ease.
          </p>
          
          {/* Main Action Button */}
          <Link 
            to="/login" 
            className="group relative inline-flex items-center justify-center px-8 py-3 bg-white text-indigo-700 font-bold rounded-xl shadow-xl transition-all duration-200 active:scale-95 hover:shadow-2xl"
          >
            <span>Manage Residents</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>

      {/* ---------------- DATA TABLE CARD ---------------- */}
      <section className="flex-grow px-5 -mt-8 z-20">
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          
          {/* Card Header */}
          <div className="px-6 py-5 border-b border-slate-100 bg-white flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Occupancy</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Live resident count</p>
            </div>
            <div className="bg-indigo-50 text-indigo-700 p-2 rounded-lg">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                 <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
               </svg>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    S.No
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Class Category
                  </th>
                  <th className="px-5 py-3 text-right text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Residents
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {HOSTEL_STRENGTH.map((row, index) => (
                  <tr key={row.id} className="group hover:bg-slate-50 transition-colors duration-150">
                    <td className="px-5 py-4 whitespace-nowrap text-xs font-semibold text-slate-400 group-hover:text-indigo-500">
                      {(index + 1).toString().padStart(2, '0')}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">
                        {row.className}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold group-hover:bg-indigo-100 transition-colors">
                        {row.strength}
                      </span>
                    </td>
                  </tr>
                ))}
                
                {/* Total Row (Styled as a Summary Footer) */}
                <tr className="bg-slate-800 text-white">
                  <td className="px-5 py-4 text-xs font-medium text-slate-400">
                    --
                  </td>
                  <td className="px-5 py-4 text-sm font-bold tracking-wide uppercase">
                    Total Strength
                  </td>
                  <td className="px-5 py-4 text-right text-lg font-bold text-white">
                    {totalStudents}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
}