/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'brutal': {
          'black': '#0a0a0a',
          'white': '#f5f5f0',
          'accent': '#00ff41',
          'error': '#ff0040',
          'disabled': '#666666',
        }
      },
      fontFamily: {
        'display': ['Space Grotesk', 'sans-serif'],
        'sans': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px rgba(0,0,0,1)',
        'brutal-lg': '8px 8px 0px 0px rgba(0,0,0,1)',
        'brutal-xl': '12px 12px 0px 0px rgba(0,0,0,1)',
        'brutal-accent': '4px 4px 0px 0px rgba(0,255,65,1)',
        'brutal-accent-lg': '8px 8px 0px 0px rgba(0,255,65,1)',
        'brutal-accent-xl': '12px 12px 0px 0px rgba(0,255,65,1)',
        'brutal-error': '4px 4px 0px 0px rgba(255,0,64,1)',
      },
      animation: {
        'slide': 'slide 1s ease-in-out infinite',
      },
      keyframes: {
        slide: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
};
