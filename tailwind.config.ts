import { Breakpoint, BreakpointValue } from "./app/features/media/config";

import flowbite from "flowbite-react/tailwind";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", flowbite.content()],
  theme: {
    extend: {
      colors: {
        darkBackground: 'rgb(2,4,32)',
        primary: '#008080'
      }
    },
    screens: {
      [Breakpoint.XS]: `${BreakpointValue.XS}px`,
      [Breakpoint.SM]: `${BreakpointValue.SM}px`,
      [Breakpoint.MD]: `${BreakpointValue.MD}px`,
      [Breakpoint.LG]: `${BreakpointValue.LG}px`,
      [Breakpoint.XL]: `${BreakpointValue.XL}px`,
      [Breakpoint["2XL"]]: `${BreakpointValue["2XL"]}px`,
    },
    fontFamily: {
      sans: ['Josefin Sans', 'system-ui', 'sans-serif']
    }
  },
  darkMode: 'selector',
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    flowbite.plugin()
  ],
  corePlugins: {
    preflight: true,
  },
};
