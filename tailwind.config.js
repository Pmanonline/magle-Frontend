// tailwind.config.js  (Tailwind CSS v3)
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#B5E41A",
          light: "#E8F8C8",
          dark: "#96C200",
        },
        brand: {
          DEFAULT: "#2D7A4F",
          light: "#3D9E67",
          dark: "#1E5435",
        },
        surface: "#F5F0EB",
        ink: {
          DEFAULT: "#1A1A1A",
          muted: "#6B7280",
          faint: "#9CA3AF",
        },
      },
      fontFamily: {
        sans: ["'DM Sans'", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.35s ease both",
      },
    },
  },
  plugins: [],
};
