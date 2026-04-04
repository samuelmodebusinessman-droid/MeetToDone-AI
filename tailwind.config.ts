import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        beige: "#FAF4EB",
        cream: "#FFF8F0",
        teal: "#0F766E",
        "teal-dark": "#134E4A",
        navy: "#134E4A",
        amber: "#F59E0B",
        "amber-light": "#FBBF24",
        "amber-dark": "#D97706",
        pink: "#FB7185",
        "pink-light": "#FDA4AF",
      },
      borderRadius: {
        bento: "28px",
        "2xl": "20px",
        "3xl": "24px",
        "4xl": "32px",
      },
      boxShadow: {
        soft: "0 4px 20px rgba(15, 118, 110, 0.08)",
        glow: "0 8px 30px rgba(245, 158, 11, 0.25)",
        float: "0 12px 40px rgba(15, 118, 110, 0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
