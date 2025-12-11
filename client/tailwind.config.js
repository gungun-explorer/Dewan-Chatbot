/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f5f7ff",
          100: "#ebf0ff",
          500: "#667eea",
          600: "#5a67d8",
          700: "#764ba2",
        },
      },
      fontFamily: {
        sans: ["Space Grotesk", "Manrope", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
