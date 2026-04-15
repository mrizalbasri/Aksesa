module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff5600',
        secondary: '#7b7b78',
        success: '#2c6415',
        warning: '#f59e0b',
        danger: '#c41c1c',
        cream: '#faf9f6',
        'off-black': '#111111',
        oat: '#dedbd6',
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
