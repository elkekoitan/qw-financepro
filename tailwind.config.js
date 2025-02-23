/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4FD1C5',
          dark: '#319795',
          light: '#76E4F7'
        },
        secondary: {
          DEFAULT: '#38A169',
          dark: '#2F855A',
          light: '#68D391'
        },
        accent: {
          DEFAULT: '#00B5D8',
          dark: '#0987A0',
          light: '#76E4F7'
        },
        dark: {
          DEFAULT: '#0A1A1A',
          paper: '#112121',
          surface: '#1A2C2C'
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #4FD1C5 0%, #319795 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #76E4F7 0%, #4FD1C5 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0A1A1A 0%, #1A2C2C 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(26,44,44,0.9) 0%, rgba(17,33,33,0.8) 100%)',
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
} 