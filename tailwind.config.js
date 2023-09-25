/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
}

module.exports = {
  // ... other configuration options
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Include JavaScript and TypeScript files
    "./public/index.html", // Include HTML file
  ],
};
