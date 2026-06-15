/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        // clean, light, professional — one restrained accent
        paper: "#ffffff", // page
        mist: "#f6f7f9", // alternating section / subtle fill
        line: "#e6e8ec", // borders / dividers
        ink: {
          DEFAULT: "#0c0d10", // headings
          700: "#383b42", // strong body
          500: "#5c606a", // body
          400: "#898d97", // muted / labels
        },
        brand: {
          DEFAULT: "#4f46e5", // the one accent (indigo)
          600: "#4338ca",
          500: "#6366f1",
          soft: "#eef1ff", // tinted backgrounds
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(12,13,16,0.04), 0 1px 3px rgba(12,13,16,0.06)",
        "card-hover": "0 8px 30px -8px rgba(12,13,16,0.12)",
        brand: "0 8px 24px -8px rgba(79,70,229,0.35)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};
