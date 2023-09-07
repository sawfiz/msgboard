/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.ejs"],
  // darkMode: 'media', // darkMode depend on system setting
  darkMode: 'class',  // allows the dark mode toggle switch to work
  mode: "jit",
  theme: {
    extend: {},
  },
  plugins: [],
}

