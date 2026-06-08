import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#002B5B",
          deep: "#002B5B",
          royal: "#003F88",
          footer: "#001B3A",
        },
        gold: {
          DEFAULT: "#F4C300",
          soft: "#FFD84D",
        },
        grey: {
          light: "#F5F7FA",
          dark: "#2E2E2E",
        },
        alert: {
          red: "#D7263D",
          orange: "#FF8C42",
          green: "#2E7D32",
        },
      },
      animation: {
        marquee: "marquee 35s linear infinite",
        "pulse-dot": "pulseDot 2s ease-in-out infinite",
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(1.4)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #002B5B 0%, #003F88 100%)",
        "gold-gradient": "linear-gradient(90deg, #F4C300 0%, #FFD84D 100%)",
        "footer-gradient": "linear-gradient(180deg, #001B3A 0%, #000D1F 100%)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
