/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    fontFamily: {
      sans: ['Josefin Sans', 'system-ui', 'sans-serif']
    }
  },
  darkMode: 'selector',
  plugins: [require('@tailwindcss/typography')],
  corePlugins: {
    preflight: true,
  },
};
