/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2EA3F2",
        "primary-dark": "#1F6FB2",
        dark: "#2F343A",
        "dark-card": "#23282E",
        muted: "#6B7280",
      },
    },
  },
  plugins: [],
}