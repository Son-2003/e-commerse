/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        gallisia: ["Gallisia Design Script", "sans-serif"], // Thêm font mới vào đây
      },
      keyframes: {
        topToBottom: {
          "0%": { transform: "translateY(-100%)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
      },
      animation: {
        topToBottom: "topToBottom 1s ease-in-out",
      },
    },
  },
  plugins: [],
};
