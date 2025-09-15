/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Dynamic viewport units 지원 (모바일 브라우저 호환)
      height: {
        dvh: '100dvh',
        svh: '100svh',
        lvh: '100lvh',
      },
      minHeight: {
        dvh: '100dvh',
        svh: '100svh',
        lvh: '100lvh',
      },
      maxHeight: {
        dvh: '100dvh',
        svh: '100svh',
        lvh: '100lvh',
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      //  ++++++++++++++++++++++++++++
      
      backgroundImage: {
        grid:
          'repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 120px), repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 120px)',
        aurora:
          'linear-gradient(120deg, rgba(124,58,237,.35), rgba(34,211,238,.35), rgba(16,185,129,.35))',
      },
      boxShadow: {
        'soft-2xl': '0 10px 40px rgba(0,0,0,.25)',
      },
      keyframes: {
        float: {
          '0%': { transform:'translate3d(0,0,0) rotate(0)' },
          '50%': { transform:'translate3d(4px,-6px,0) rotate(-6deg)' },
          '100%': { transform:'translate3d(0,0,0) rotate(0)' },
        },
        gridpan: { '0%': { backgroundPosition:'0 0' }, '100%': { backgroundPosition:'200% 0' } },
        aurora: {
          '0%': { backgroundPosition:'0% 50%' },
          '50%': { backgroundPosition:'100% 50%' },
          '100%': { backgroundPosition:'0% 50%' },
        },
        shine: { '0%': { transform:'translateX(-100%)' }, '100%': { transform:'translateX(200%)' } },
        fadeup: { '0%': { opacity:'0', transform:'translateY(12px)' }, '100%': { opacity:'1', transform:'translateY(0)' } },
      },
      animation: {
        'float-slow': 'float 9s ease-in-out infinite',
        'float-mid': 'float 6s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        aurora: 'aurora 30s ease-in-out infinite',
        gridpan: 'gridpan 18s linear infinite',
        shine: 'shine 1.8s cubic-bezier(.2,.7,.3,1) forwards',
        fadeup: 'fadeup .6s cubic-bezier(.2,.8,.2,1) both',
      },
    },
  },
  plugins: [],
};
