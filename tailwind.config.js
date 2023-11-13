/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  // media:跟随系统（win10在个性化-颜色-选择默认应用模式  中修改）   class:手动通过事件改变
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        gray: {
          white: '#ffffff',
          mainbg: '#323233',
          headerbg : '#444346',
          link: '#1661d5',
          sidebarbg: '#44484a',
        },
      }
    }
  },
  plugins: [],
  variants: {
    extend: {
      textOpacity: ['dark']
    }
  },
}
