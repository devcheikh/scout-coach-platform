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
          dark: "#050A14",     // Deep Rich Black/Blue
          surface: "#0F172A",  // Slate 900
          neon: "#22D3EE",     // Cyan 400 (Electric Blue)
          accent: "#8B5CF6",   // Violet 500
          success: "#10B981",  // Emerald 500
          text: "#F8FAFC",     // Slate 50
          muted: "#64748B",    // Slate 500
          // Add transparency variants if needed, or use tailwind's opacity modifiers
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