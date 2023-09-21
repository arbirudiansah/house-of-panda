module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF3392",
        secondary: "#3E3E65",
        sidebar: "#212B36",
        dashboard: "#F8FAFC",
        outer: "#E7E7E7",
        success: '#42937E',
        danger: '#A21616',
        warning: '#FF9300',
      },
      boxShadow: {
        'menu': '0 0px 8px rgba(0, 0, 0, 0.2)',
        'th': '0 0px 1px rgba(0, 0, 0, 0.9)',
        'team': '0 1px 6px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require('@tailwindcss/typography'),
    require('tailwindcss-textshadow'),
  ],
}


