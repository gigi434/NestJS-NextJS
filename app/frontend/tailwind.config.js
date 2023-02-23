/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
  // MantineUIとTailwindCSSのリセットCSSが競合してボタンコンポーネントのbackground-colorにtransparentが設定される
  // これを解決するためにTailwindCCのResetCSSを無効化する
  corePlugins: {
    preflight: false,
  },
}
