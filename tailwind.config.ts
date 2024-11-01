import type { Config } from "tailwindcss";

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './data/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        blink: {
          '50%': { opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-0.25rem)' },
        },
      },
      animation: {
        blink: 'blink 1s steps(1) infinite',
        float: 'float 2s ease-in-out infinite',
      },
      colors: {
        header: '#FF5733', // Customize as needed
        subheader: '#FFC300', // Customize as needed
      },
      fontFamily: {
        header: ['"Anonymous Pro"', 'Courier', 'monospace'],
        body: ['"Courier"', 'monospace'],
      },
      borderWidth: {
        DEFAULT: '1px',
      },
      borderColor: {
        DEFAULT: '#FFFFFF',
      },
    },
  },
  plugins: [],
} satisfies Config;
