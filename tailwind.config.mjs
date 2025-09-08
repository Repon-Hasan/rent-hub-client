/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
};

export default config;
