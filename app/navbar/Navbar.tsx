"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faCartShopping, faPhone, faBars, faXmark } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Add shadow on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);
  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 border-b border-gray-200 transition-all duration-300 ${
        scrolled ? "bg-white/90 shadow-md backdrop-blur" : "bg-white/70 backdrop-blur"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-blue-600 tracking-tight">
            Royal Computer
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-gray-800 hover:text-blue-600 font-medium">
            <FontAwesomeIcon icon={faHouse} className="w-4 h-4" />
            Home
          </Link>
          <Link href="/shop" className="flex items-center gap-2 text-gray-800 hover:text-blue-600 font-medium">
            <FontAwesomeIcon icon={faCartShopping} className="w-4 h-4" />
            Shop
          </Link>
          <Link href="#contact" className="flex items-center gap-2 text-gray-800 hover:text-blue-600 font-medium">
            <FontAwesomeIcon icon={faPhone} className="w-4 h-4" />
            Contact
          </Link>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-gray-800 hover:text-blue-600 focus:outline-none transition"
        >
          <FontAwesomeIcon icon={isOpen ? faXmark : faBars} className="w-6 h-6" />
        </button>
      </div>
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 border-t-gray-200 border-t-2 w-[60%] bg-white  shadow-lg l md:hidden "
        >
          <div className="px-6 py-5 flex flex-col space-y-4">
            <Link
              href="/"
              className="flex items-center gap-3 text-gray-800 hover:text-blue-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              <FontAwesomeIcon icon={faHouse} className="w-4 h-4" />
              Home
            </Link>
            <Link
              href="/shop"
              className="flex items-center gap-3 text-gray-800 hover:text-blue-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              <FontAwesomeIcon icon={faCartShopping} className="w-4 h-4" />
              Shop
            </Link>
            <Link
              href="#contact"
              className="flex items-center gap-3 text-gray-800 hover:text-blue-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              <FontAwesomeIcon icon={faPhone} className="w-4 h-4" />
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
