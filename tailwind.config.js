/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode:"class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        'about-background': "url('https://images.pexels.com/photos/316466/pexels-photo-316466.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
      },
      colors:{
        primary:"#0f0"
      }
    },
  },
  plugins: [],
}


