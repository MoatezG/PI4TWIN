"use client";
import { useState } from "react";
import {Link} from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="flex flex-col justify-center px-6 bg-white shadow-[0px_4px_44px_rgba(0,0,0,0.08)] max-md:px-5">
      <div className="flex justify-between items-center w-full">
        <div className="flex gap-1 items-center">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/9608e51125036e00b54b726246b7d0a3e97104af121c03f7f0c8f2688fe72328?placeholderIfAbsent=true&apiKey=3f5214a6ea9f4f1683a0e4ee385ff9c5"
            className="object-contain w-[216px]"
            alt="Company Logo"
          />
        </div>
        <button
          className="md:hidden text-zinc-800 bg-lime-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? "Close" : "Menu"}
        </button>
        <div className="hidden md:flex gap-6 items-center text-base font-medium text-zinc-800">
          <a href="#" className="p-2" onClick={(e) => { e.preventDefault(); window.location.reload(); }}>Home</a>
          <a href="#categories" className="p-2">Categories</a>
          <a href="#about-us" className="p-2">About Us</a>
          <a href="#blog" className="p-2">Blog</a>
          <a href="#newsletter" className="p-2">Newsletter</a>
        </div>
        <div className="hidden md:flex items-center text-base font-bold text-white">
        <Link
            to="/auth/sign-in"
            className="gap-2.5 self-stretch px-6 py-3.5 my-auto bg-lime-600 rounded-lg min-h-12 max-md:px-5"
          >
            Manage your Stock Now
          </Link>
        </div>
      </div>
      {isMenuOpen && (
        <div className="flex flex-col items-center mt-4 md:hidden">
          <a href="#" className="p-2 text-zinc-800" onClick={(e) => { e.preventDefault(); window.location.reload(); }}>Home</a>
          <a href="#categories" className="p-2 text-zinc-800">Categories</a>
          <a href="#about-us" className="p-2 text-zinc-800">About Us</a>
          <a href="#blog" className="p-2 text-zinc-800">Blog</a>
          <a href="#newsletter" className="p-2 text-zinc-800">Newsletter</a>
          <Link
            to="/auth/sign-in"
            className="gap-2.5 self-stretch px-6 py-3.5 my-auto bg-lime-600 rounded-lg min-h-12 max-md:px-5"
          >
            Manage your Stock Now
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
