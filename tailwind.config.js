/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        // Data-world palette — deep space + electric data accents
        void: {
          950: "#04050a",
          900: "#070912",
          850: "#0a0d1a",
          800: "#0e1222",
          700: "#151a30",
        },
        data: {
          cyan: "#22d3ee",
          sky: "#38bdf8",
          indigo: "#6366f1",
          violet: "#a78bfa",
          magenta: "#e879f9",
        },
      },
      boxShadow: {
        glow: "0 0 24px -2px rgba(34,211,238,0.45)",
        "glow-lg": "0 0 60px -4px rgba(99,102,241,0.5)",
        "glow-violet": "0 0 28px -2px rgba(167,139,250,0.5)",
        node: "0 0 0 1px rgba(34,211,238,0.25), 0 8px 40px -8px rgba(34,211,238,0.35)",
      },
      backgroundImage: {
        "data-grid":
          "linear-gradient(rgba(34,211,238,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.06) 1px, transparent 1px)",
        "radial-fade":
          "radial-gradient(ellipse 80% 70% at 50% -10%, rgba(99,102,241,0.25), rgba(4,5,10,0) 70%)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "float-slow": {
          "0%,100%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-18px) translateX(8px)" },
        },
        pulseGlow: {
          "0%,100%": { opacity: "0.4", filter: "brightness(1)" },
          "50%": { opacity: "1", filter: "brightness(1.4)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(900%)" },
        },
        gridpan: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "40px 40px" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        spinSlow: { to: { transform: "rotate(360deg)" } },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float-slow 9s ease-in-out infinite",
        pulseGlow: "pulseGlow 3s ease-in-out infinite",
        scan: "scan 6s linear infinite",
        gridpan: "gridpan 8s linear infinite",
        shimmer: "shimmer 3s linear infinite",
        "spin-slow": "spinSlow 22s linear infinite",
        "spin-slower": "spinSlow 40s linear infinite",
      },
    },
  },
  plugins: [],
};
