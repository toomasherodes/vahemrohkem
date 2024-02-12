/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/*.{html,js,tsx}"],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      boxShadow: {
        glow: '0 0 4px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
};
