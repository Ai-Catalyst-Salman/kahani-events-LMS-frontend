/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        kahani: {
          cream: "#FBF7F0",
          primary: "#8C345C",
          "primary-dark": "#6b2646",
          "primary-light": "#a8456f",
          secondary: "#1E544A",
          "secondary-dark": "#164038",
          "secondary-light": "#27695d",
          accent1: "#CE9FA6",
          accent2: "#CD9556",
          accent3: "#C77F2A",
          "accent3-dark": "#a06820",
          text: "#2C1B1E",
          "text-muted": "#6B5558",
          border: "#E8DDD5",
          "card-bg": "#FFFFFF",
        },
      },
      fontFamily: {
        heading: ['"Bona Nova SC"', "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "kahani-gradient":
          "linear-gradient(135deg, #8C345C 0%, #1E544A 100%)",
        "kahani-hero":
          "linear-gradient(135deg, rgba(140,52,92,0.92) 0%, rgba(30,84,74,0.88) 100%)",
      },
      boxShadow: {
        "kahani-sm": "0 2px 8px rgba(140,52,92,0.08)",
        "kahani-md": "0 4px 20px rgba(140,52,92,0.12)",
        "kahani-lg": "0 8px 40px rgba(140,52,92,0.18)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};
