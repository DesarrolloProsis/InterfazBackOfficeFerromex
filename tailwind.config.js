module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
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
