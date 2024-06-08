/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'light-gray': '#f2f5f8',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [{
      mytheme: {
        "primary": "5CC90C",  
        "secondary": "#3B3F3F",  
        "accent": "#FFD900",  
        "neutral": "5CC90C",  
        "base-100": "#ffffff", 
      },
    }],
  },
}
