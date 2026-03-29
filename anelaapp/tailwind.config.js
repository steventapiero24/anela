/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Futura', 'system-ui', 'sans-serif'],
        body: ['Futura', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: 'var(--color-primary)',
        'primary-light': 'var(--color-primary-light)',
        secondary: 'var(--color-secondary)',
        'secondary-light': 'var(--color-secondary-light)',
        accent: 'var(--color-accent)',
        'text-light': 'var(--color-text-light)',
        'text-dark': 'var(--color-text-dark)',
        'bg-default': 'var(--color-bg)',
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        glow: 'var(--shadow-glow)',
      },
    },
  },
  plugins: [],
};
