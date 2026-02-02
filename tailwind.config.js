/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}", 
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#020617',
        foreground: '#f8fafc',
        card: '#1e293b',
        primary: '#3b82f6',
        secondary: '#334155',
        muted: '#0f172a',
        'muted-foreground': '#94a3b8',
        accent: '#0ea5e9',
        destructive: '#ef4444',
        border: '#1e293b',
        chart: {
          1: '#22c55e',
          2: '#eab308',
          3: '#ef4444',
          4: '#a855f7',
          5: '#3b82f6',
        },
      },
    },
  },
  plugins: [],
}
