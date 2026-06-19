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
        hero: ["clamp(2.9rem,9vw,6.75rem)", { lineHeight: "0.93", letterSpacing: "-0.035em", fontWeight: "600" }],
        display: ["clamp(3rem,7vw,5.5rem)", { lineHeight: "0.95", letterSpacing: "-0.035em", fontWeight: "600" }],
        h2: ["clamp(2rem,5vw,3.25rem)", { lineHeight: "1.04", letterSpacing: "-0.03em", fontWeight: "600" }],
        statement: ["clamp(2rem,5.5vw,3.6rem)", { lineHeight: "1.04", letterSpacing: "-0.032em", fontWeight: "600" }],
        stat: ["clamp(2rem,3.5vw,2.75rem)", { lineHeight: "1", letterSpacing: "-0.02em", fontWeight: "600" }],
      },
      colors: {
        // dark forged metal — warm near-black base, dual accent
        canvas: "#08070a", // page (warm near-black)
        paper: "#131017", // raised surfaces / cards (dark metal)
        mist: "#1b1820", // subtle fill
        line: "#2a2630", // borders / hairlines (warm-tinted)
        ink: {
          DEFAULT: "#f4efe9", // headings (warm white)
          700: "#cec3b8", // strong body
          500: "#9a8e80", // body / muted
          400: "#6f6356", // labels
          300: "#463f38", // faint
        },
        // FORGE — molten amber, the primary brand / "forge" accent
        forge: {
          DEFAULT: "#ff7a2f",
          600: "#e85f1a",
          500: "#ffb061",
          soft: "#20140c", // dark amber tint (chips / pills)
        },
        // BRAND — indigo, reserved for the data/AI compute moments
        brand: {
          DEFAULT: "#7c78f0",
          600: "#6c68e8",
          500: "#9d99ff",
          soft: "#1a1930",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.4)",
        "card-hover": "0 18px 50px -16px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,122,47,0.14)",
        brand: "inset 0 1px 0 rgba(255,255,255,0.16), 0 10px 30px -8px rgba(255,122,47,0.5)",
        forge: "inset 0 1px 0 rgba(255,255,255,0.18), 0 12px 40px -10px rgba(255,122,47,0.55)",
        glow: "0 0 40px -8px rgba(255,122,47,0.45)",
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
