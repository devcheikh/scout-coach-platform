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
          dark: "#0F172A",     // Slate 900
          surface: "#1E293B",  // Slate 800
          neon: "#38BDF8",     // Sky 400
          accent: "#818CF8",   // Indigo 400
          success: "#34D399",  // Emerald 400
          text: "#F1F5F9",     // Slate 100
          muted: "#94A3B8",    // Slate 400
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