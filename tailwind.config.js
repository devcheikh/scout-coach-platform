/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        scout: {
          dark: "#0B0E14",     // Elegant Black/Navy
          surface: "#151B25",  // Slate Dark
          gold: "#D4AF37",     // FIFA Agent Gold
          blue: "#1E40AF",     // Royal Blue
          silver: "#94A3B8",   // Metallic Silver
          text: "#F8FAFC",     // Pure White
          paper: "#FFFFFF",    // Explicit White for cards
        },
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')",
      },
    },
  },
  plugins: [],
};