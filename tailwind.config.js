/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Cormorant Garamond'", "serif"],
        mono: ["'Space Mono'", "monospace"],
        body: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        void: "#020617",
        abyss: "#050d1e",
        "blue-accent": "#3b82f6",
        "indigo-accent": "#6366f1",
        "glow-blue": "#60a5fa",
      },
    },
  },
  plugins: [],
}
