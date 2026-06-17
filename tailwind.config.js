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
        display: ["clamp(3rem,7vw,5.5rem)", { lineHeight: "0.95", letterSpacing: "-0.035em", fontWeight: "600" }],
        h2: ["clamp(1.75rem,3vw,2.5rem)", { lineHeight: "1.05", letterSpacing: "-0.025em", fontWeight: "600" }],
        stat: ["clamp(2rem,3.5vw,2.75rem)", { lineHeight: "1", letterSpacing: "-0.02em", fontWeight: "600" }],
      },
      colors: {
        // cinematic dark — deep, refined, one glowing accent
        canvas: "#08090e", // page (near-black, faint blue)
        paper: "#101219", // raised surfaces / cards
        mist: "#171a23", // subtle fill
        line: "#262a36", // borders / hairlines
        ink: {
          DEFAULT: "#f3f4f8", // headings
          700: "#c6cad6", // strong body
          500: "#9094a3", // body / muted
          400: "#666b7a", // labels
          300: "#474b58", // faint
        },
        brand: {
          DEFAULT: "#7c78f0", // glowing indigo (brighter for dark)
          600: "#6c68e8",
          500: "#9d99ff",
          soft: "#1a1930", // dark indigo tint (chips / pills)
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.4)",
        "card-hover": "0 18px 50px -16px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,120,240,0.12)",
        brand: "inset 0 1px 0 rgba(255,255,255,0.16), 0 10px 30px -8px rgba(124,120,240,0.5)",
        glow: "0 0 40px -8px rgba(124,120,240,0.45)",
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
