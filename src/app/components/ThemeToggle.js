'use client';

import { useState, useEffect } from "react";
import { Sun, Moon } from 'lucide-react'; 

const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("light");

  // On mount, set mounted to true and read the theme from localStorage
  useEffect(() => {
    setMounted(true);
    setTheme(localStorage.getItem("theme") || "light");
  }, []);

  // Update the theme attribute on the HTML element
  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  if (!mounted) {
    // Return a placeholder to prevent layout shift
    return <div className="w-10 h-10 p-2" />;
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="p-2 transition-colors duration-200 rounded-full hover:bg-transparent focus:outline-none"
    >
      {theme === "light" ? (
        <Sun className="w-5 h-5 text-yellow-500 stroke-current" />
      ) : (
        <Moon className="w-5 h-5 text-gray-400 stroke-current" />
      )}
    </button>
  );
};

export default ThemeToggle;