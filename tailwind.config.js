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
        '67': '19rem',
        '69': '29rem',
        '70': '30rem',
        '71': '31rem',
        '72': '32rem',
        '73': '33rem',
        '74': '34rem',
        '75': '35rem',
        '76': '36rem',
        '77': '37rem',
        '78': '38rem',
        '79': '39rem',
        '80': '40rem',
      }
    },
  },
  variants: {
    extend: {
      backgroundColor: ['checked'],
    },
  },
  plugins: [],
}
