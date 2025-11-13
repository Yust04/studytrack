/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#004890",   // синій
          accent:  "#F9C908",   // жовтий
          black:   "#000000",
          white:   "#FFFFFF",
        },
      },
      boxShadow: {
        card: "0 8px 24px rgba(0,0,0,0.08)",
      },
      borderRadius: {
        xl: "14px",
        "2xl": "20px",
      },
    },
  },
  plugins: [],
};
