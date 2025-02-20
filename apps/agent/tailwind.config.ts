module.exports = {
  presets: [require("@workspace/tailwind-config/tailwind")],
  content: [
    "./node_modules/@workspace/ui/src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
};
