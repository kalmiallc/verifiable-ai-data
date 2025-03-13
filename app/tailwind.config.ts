export const colors = {
  transparent: 'transparent',
  current: 'currentColor',

  black: '#000000',
  white: '#F5F5F5',

  // Status colors:
  statusGreen: '#5DCE46',
  statusYellow: '#FFBC74',
  statusBlue: {
    DEFAULT: '#5272FF',
    hover: '#3353DA',
  },
  statusRed: '#DE4941',

  // Charts colors:
  chartGreen: '#639266',
  chartBlue: '#4A61C9',
  chartRed: '#F95F85',
  chartYellow: '#F1B11B',

  primary: {
    bright: '#C56AC6',
    light: '#D88ADC',
    DEFAULT: '#B14AB3',
    dark: '#8A3A8D',
    hover: '#E159E4',
  },

  secondary: '#E7EDFF',

  chain: {
    // TODO: remove
    ethereum: '#6481E7',
    moonbeam: '#958FDC',
    bnb: '#F0B90B',
  },

  body: {
    light: '#A3AED0',
    DEFAULT: '#F5F5F5',
    dark: '#6A6B63',
  },

  grey: {
    lightest: '#80807F',
    lighter: '#3D3D3D',
    light: '#292929',
    DEFAULT: '#212120',
    dark: '#141414',
  },

  yellow: {
    light: '#f7fca1',
    DEFAULT: '#F9FF73',
    dark: '#FFDD00',
  },
  green: {
    light: '#3EDEDE',
    DEFAULT: '#028787',
  },
  blue: {
    light: '#A3AED0',
    bright: '#111C44',
    DEFAULT: '#0B1437',
    grey: '#323D4E',
  },
  purple: {
    lighter: '#EBD6FF',
    light: '#CAA0F1',
    DEFAULT: '#CB90FE',
    dark: '#B779F1',
  },

  bg: {
    light: '#1B254B',
    DEFAULT: '#141414',
    box: '#111C44',
  },
};

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  theme: {
    screens: {
      mobile: { max: '767px' },
      tablet: { max: '1023px' },
      xs: '500px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1440px',
      xxl: '1680px',
      hd: '1920px',
    },

    colors,

    fontFamily: {
      heading: ['Inter', 'serif'],
      sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    },

    container: {
      center: true,
      screens: {
        lx: '1320px',
      },
      padding: {
        DEFAULT: '1rem',
      },
    },

    extend: {
      backgroundImage: {
        gradientGreen: 'linear-gradient(180deg, #028787 0%, #3EDEDE 100%)',
        gradientPurple: 'linear-gradient(180deg, #B779F1 0%, #CAA0F1 100%)',
        gradientWhite:
          'linear-gradient(90deg, rgba(224, 225, 226, 0) 0%, #E0E1E2 49.52%, rgba(224, 225, 226, 0.15625) 99.04%)',

        gradientBlue: 'linear-gradient(180deg, #0A1A2F 0%, #192D59 100%)',
        gradientBorder: 'linear-gradient(180deg, #E3E3E3 0%, #00AEAE 100%)',
        gradientCard: 'linear-gradient(180deg, #192D59 0%, #1A2539 100%)',
        gradientCardDark: 'linear-gradient(180deg, rgba(25, 45, 89, 0.5) 0%, rgba(26, 37, 57, 0.5) 100%)',

        gradientBannerRed: 'linear-gradient(180deg, #F95F85 0%, #93384F 100%)',
        gradientBannerGreen: 'linear-gradient(180deg, #639266 0%, #1E2C1F 100%)',
        gradientBannerBlue: 'linear-gradient(180deg, #4A61C9 0%, #243063 100%)',
      },
      borderWidth: {
        1: '1px',
        3: '3px',
        4: '4px',
        5: '5px',
      },
      boxShadow: {
        black: '0px 2px 4px rgba(0, 0, 0, 0.12)',
        light: '0px 0px 4px rgba(240, 242, 218, 0.64)',
        card: '0px 4px 4px 0px #00000040',
      },
      gradientBorder: {
        gradientBorderBlue: 'linear-gradient(180deg, #E3E3E3 0%, #00AEAE 100%)',
        gradientWhite:
          'linear-gradient(90deg, rgba(224, 225, 226, 0) 0%, #E0E1E2 49.52%, rgba(224, 225, 226, 0.15625) 99.04%)',
      },
      gridTemplateColumns: {
        billing: 'repeat(auto-fill, minmax(23rem, 1fr))',
        cards: 'repeat(auto-fill, minmax(280px, 1fr))',
        services: 'repeat(auto-fit, minmax(280px, 1fr))',
        nft: 'repeat(auto-fill, minmax(220px, 1fr))',
        nftSmall: 'repeat(auto-fill, minmax(120px, 1fr))',
      },
      scale: {
        10: '0.1',
        20: '0.2',
        30: '0.3',
        40: '0.4',
        60: '0.6',
        70: '0.7',
        80: '0.8',
        90: '0.9',
      },
      zIndex: {
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
      },
    },
  },

  content: [
    `components/**/*.{vue,js}`,
    `layouts/**/*.vue`,
    `pages/**/*.vue`,
    `composables/**/*.{js,ts}`,
    `plugins/**/*.{js,ts}`,
    `App.{js,ts,vue}`,
    `app.{js,ts,vue}`,
  ],

  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
