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
        jitter: {
          '0%': {
            transform: 'translate(0, 0) rotate(0deg)',
          },
          '10%': {
            transform: 'translate(-0.5px, 0.5px) rotate(-0.5deg)',
          },
          '20%': {
            transform: 'translate(0.5px, -0.5px) rotate(0.5deg)',
          },
          '30%': {
            transform: 'translate(-0.5px, 0) rotate(0deg)',
          },
          '40%': {
            transform: 'translate(0.5px, 0.5px) rotate(0.5deg)',
          },
          '50%': {
            transform: 'translate(0, -0.5px) rotate(-0.5deg)',
          },
          '60%': {
            transform: 'translate(-0.5px, 0.5px) rotate(0deg)',
          },
          '70%': {
            transform: 'translate(0.5px, 0.5px) rotate(0.5deg)',
          },
          '80%': {
            transform: 'translate(-0.5px, -0.5px) rotate(-0.5deg)',
          },
          '90%': {
            transform: 'translate(0.5px, 0.5px) rotate(0deg)',
          },
          '100%': {
            transform: 'translate(0, 0) rotate(0deg)',
          },
        },
      },
      animation: {
        blink: 'blink 1s steps(1) infinite',
        float: 'float 2s ease-in-out infinite',
        jitter: 'jitter 1s infinite ease-in-out', // Smooth and subtle jitter
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
