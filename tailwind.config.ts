import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17211c",
        field: "#f6f7f2",
        moss: "#566b45",
        pine: "#244238",
        gold: "#c39a3c",
      },
      boxShadow: {
        soft: "0 14px 40px rgba(23, 33, 28, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
