import React from "react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[84vh]">
      {/* <Header /> */}
      <main className="flex-grow flex flex-col justify-center items-center bg-blue-100">
        <h1 className="text-4xl font-bold mb-4">Welcome to the School Portal</h1>
        <p className="text-lg mb-8">Your gateway to all school resources and information.</p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Get Started</button>
      </main>
      {/* <Footer /> */}
    </div>
  );
}