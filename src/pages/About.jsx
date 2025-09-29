import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function About() {
  return (
    <div className="flex flex-col min-h-[84vh]">

      <main className="flex-grow flex flex-col justify-center items-center bg-blue-100">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-lg mb-8">Learn more about our school and its mission.</p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Contact Us</button>
      </main>

    </div>
  );
}