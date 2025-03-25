import type { Config } from 'tailwindcss';
import lineClamp from '@tailwindcss/line-clamp';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        republican: {
          light: '#FECACA', // red-200
          DEFAULT: '#EF4444', // red-500
          dark: '#B91C1C', // red-700
        },
        democrat: {
          light: '#BFDBFE', // blue-200
          DEFAULT: '#3B82F6', // blue-500
          dark: '#1D4ED8', // blue-700
        },
      },
    },
  },
  plugins: [lineClamp],
};

export default config;
