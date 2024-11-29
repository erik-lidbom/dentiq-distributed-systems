/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dentiq: {
          muted: {
            lightest: '#F9F9F9',
            lighter: '#F5F5F5',
            light: '#E0E0E0',
            semiLight: '#BDBDBD',
            default: '#9E9E9E',
            dark: '#A9A9A9',
            darker: '#7A7A7A',
            darkest: '#505050',
          },
          background: {
            light: '#FFFFFF',
            secondary: '#46BCEC',
            primary: '#1565C0',
            selected: '#46BCEC40',
            beige: '#F7F6F2'
          },
          button: {
            primary: '#1565C0',
            secondary: '#46BCEC',
            light: '#FFFFFF',
          },
          text: {
            light: '#FFFFFF',
            dark: '#000000',
            secondary: '#46BCEC',
            primary: '#1565C0',
          },
          border: {
            selected: '#46BCECCC',
            shadowStrenghter: '#83838333',
          },
        },
      },
      boxShadow: {
        dentiq: {
          light: '0 0 4px rgba(0, 0, 0, 0.03)',
          default: '0 0 8px rgba(0, 0, 0, 0.08)',
          dark: '0 0 16px rgba(0, 0, 0, 0.13)',
        },
      },
      fontSize: {
        'dentiq-h1': ['32px', { lineHeight: '40px', fontWeight: '700' }],
        'dentiq-h2': ['28px', { lineHeight: '36px', fontWeight: '600' }],
        'dentiq-h3': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'dentiq-h4': ['20px', { lineHeight: '28px', fontWeight: '500' }],
        'dentiq-body-large': ['18px', { lineHeight: '26px', fontWeight: '400' }],
        'dentiq-body': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'dentiq-body-small': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'dentiq-caption': ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'dentiq-caption-small': ['10px', { lineHeight: '14px', fontWeight: '400' }],
      },
      fontFamily: {
        archivoBlack: ['Archivo Black', 'sans-serif'],
        archivo: ['Archivo', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
