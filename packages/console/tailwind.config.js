/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        netcrab: {
          ink: '#020617',
          surface: '#0b1220',
          crab: '#fb7185',
          aqua: '#22d3ee', // Keep for backward compatibility
          shell: '#22d3ee', // Alias for aqua
          text: '#e5e7eb',
          muted: '#9ca3af',
          card: '#1f2937',
          border: '#1f2933',
        },
        // Keep existing colors for backward compatibility
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#102a43',
        },
        sand: {
          50: '#faf9f7',
          100: '#f5f3f0',
          200: '#e8e4dd',
          300: '#d4ccc0',
          400: '#b8a99a',
          500: '#9d8b7a',
          600: '#7d6f61',
          700: '#5d5349',
          800: '#3d3630',
          900: '#1d1a17',
        },
        coral: {
          50: '#fff5f3',
          100: '#ffe8e3',
          200: '#ffd1c7',
          300: '#ffb0a1',
          400: '#ff8470',
          500: '#ff5c42',
          600: '#ed3a1f',
          700: '#c82d15',
          800: '#a52816',
          900: '#882718',
        },
      },
    },
  },
  plugins: [],
};

