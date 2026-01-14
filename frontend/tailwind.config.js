/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],  /*apply tailwindcss for all index.html files, src files. */
  theme: {
    extend: {
      textColor: {
        textOne: "#1c1c1c",     /*Dark Grey-Black for primary text*/
        textTwo: "#4d4d4d",     /*Medium Grey for secondary text*/
      },
      backgroundColor: {
        bgOne: "#f0f0f0",       /*Light Grey for main backgrounds*/
        bgTwo: "#e0e0e0",       /*Slightly Grey for secondary backgrounds*/
        bgThree: "#b3b3b3",     /*Medium Grey for accents or cards*/
        bgFour: "#333333",      /*Dark Grey for headers or footers*/
        bgFive: "#000000",       /*Pure Black for high-contrast elemets*/
      },
      animation: {
        "scale-pulse": "scalePulse 2s infinite ease-in-out",
      },
      keyframes: {
        scalePulse: {
          "0%, 100%": { transform: "scale(1)"},
          "50%": { transform: "scale(1.2)"},
        },
      },
    },
  },
  plugins: [],
};

