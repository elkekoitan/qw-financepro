/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          dark: 'var(--color-primary-dark)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          dark: 'var(--color-secondary-dark)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          dark: 'var(--color-accent-dark)',
        },
        dark: {
          DEFAULT: 'var(--color-dark)',
          paper: 'var(--color-dark-paper)',
          surface: 'var(--color-dark-surface)',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
        'gradient-secondary': 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-secondary-dark) 100%)',
        'gradient-dark': 'linear-gradient(180deg, var(--color-dark) 0%, var(--color-dark-surface) 100%)',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
} 