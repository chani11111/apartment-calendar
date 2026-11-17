// הפלטה מ-SPEC.md (Warm Minimalist). צבעי הסטטוסים מוגדרים ב-src/lib/status.js
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAF8F5',
        line: '#E7E2DA',
        sage: { DEFAULT: '#384B3E', dark: '#2E3D33' },
        ink: '#2C302E',
        muted: '#6B706C',
        faint: '#B9B5AD',
        clay: { DEFAULT: '#944230', light: '#FBEAE5' },
      },
      fontFamily: { sans: ['Heebo', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
