/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Geist", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        display: ["clamp(3rem,7vw,5.25rem)", { lineHeight: "0.95", letterSpacing: "-0.035em", fontWeight: "600" }],
        h2: ["clamp(1.75rem,3vw,2.5rem)", { lineHeight: "1.05", letterSpacing: "-0.025em", fontWeight: "600" }],
        stat: ["clamp(2rem,3.5vw,2.75rem)", { lineHeight: "1", letterSpacing: "-0.02em", fontWeight: "600" }],
      },
      colors: {
        // warm-paper editorial system — one bespoke indigo accent
        canvas: "#fbfaf9", // page (warm off-white, never pure white)
        paper: "#ffffff", // raised cards
        mist: "#f4f2ef", // warm wash / small fills
        line: "#ece9e4", // warm hairline
        ink: {
          DEFAULT: "#1a1714", // headings (warm charcoal)
          700: "#3a352f", // strong body
          500: "#6b645b", // body / muted
          400: "#9a938a", // labels
          300: "#c4bdb3", // faint index numerals
        },
        brand: {
          DEFAULT: "#4b47d6", // bespoke indigo-violet
          600: "#3e3abf", // hover
          500: "#6c68e8", // light
          soft: "#efeefb", // tint
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(26,23,20,0.03)",
        "card-hover": "0 10px 34px -12px rgba(26,23,20,0.14)",
        brand: "inset 0 1px 0 rgba(255,255,255,0.18), 0 8px 24px -8px rgba(75,71,214,0.40)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        draw: {
          from: { strokeDashoffset: "1" },
          to: { strokeDashoffset: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both",
        draw: "draw 1.2s cubic-bezier(0.22,1,0.36,1) forwards",
      },
    },
  },
  plugins: [],
};
