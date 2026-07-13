/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Semantic design tokens (light editorial theme)
        brand: {
          DEFAULT: "#6C63FF",
          600: "#5a51f0",
          700: "#4a42d4",
          50: "#F1F0FE",
        },
        brand2: "#4F8CFF",
        ink: "#1D2433",
        muted: "#667085",
        line: "#E7EAF0",
        canvas: "#F8F9FB",
        surface: "#FFFFFF",
        success: "#16A34A",
        warning: "#F59E0B",
        danger: "#DC2626",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
        "4xl": "2rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,0.04), 0 4px 16px rgba(16,24,40,0.06)",
        soft: "0 8px 30px rgba(16,24,40,0.08)",
        lift: "0 12px 40px rgba(16,24,40,0.12)",
      },
      maxWidth: {
        reading: "44rem",
      },
    },
  },
  plugins: [],
};
