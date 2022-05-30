module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens:{
      'sm': {'min': '320px', 'max': '765px'},
      'md': {'min': '766px', 'max': '1023px'},
      'lg': {'min': '1024px', 'max': '1279px'},
      'xl': {'min': '1280px', 'max':'2040px'},
      '4k': {'min': '2040px', 'max':'3840px'},
      'laptop': {'min': '768px', 'max':'1366px'}
    },
    color: {
      
    },
    fontFamily: {
      titulo: ['IBM Plex Sans'],
      boton: ['Montserrat'],
    },
    extend: {
      spacing:{
        '39': '9.2rem',
        '65': '15rem',
        '66': '20rem',
        '69': '29rem',
        '89': '40rem',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
