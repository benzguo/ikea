import { FONT_MONO, FONT_SANS } from './lib/const';
export default {
  fonts: {
    mono: FONT_MONO,
    sans: FONT_SANS,
    body: FONT_SANS,
  },
  fontWeights: {
    body: 400,
    bold: 700,
  },
  fontSizes: [11, 13, 14, 16, 18, 28],
  lineHeights: {
    body: 1.5,
  },
  useLocalStorage: false,
  images: {
    avatar: {
      width: 30,
      height: 30,
      borderRadius: 99999,
    },
  },
  colors: {
    text: '#000',
    gray: '#718096',
    white: '#fff',
    offWhite: '#f7fafc',
    primary: '#000',
    lightGreen: '#f0fff4',
    lightRed: '#fff5f5',
    lightBlue: '#ebf8ff',
    lightTeal: '#e6fffa',
    lightOrange: '#fffaf0',
    background: '#fff',
    lightGray: '#edf2f7',
    modes: {
      light: {
        text: '#000',
        background: '#fff',
        lightGray: '#edf2f7',
      },
    },
  },
  buttons: {
    button_small: {
      px: 2,
      py: 1,
      color: 'text',
      border: 'solid 1px lightGray',
      borderWidth: 1,
      bg: 'transparent',
      fontSize: 0,
      cursor: 'pointer',
      '&:hover': {
        boxShadow: '0 0 16px rgba(0, 0, 0, 0.125)',
      },
    },
    button_med: {
      px: 2,
      py: 1,
      color: 'white',
      border: 'solid darkGray',
      borderWidth: 2,
      bg: 'black',
      fontSize: 2,
      cursor: 'pointer',
      '&:hover': {
        boxShadow: '0 0 16px rgba(0, 0, 0, 0.125)',
      },
    },
    button_emphasis: {
      py: 2,
      color: 'text',
      border: 'solid 1px lightGray',
      borderRadius: 12,
      bg: 'white',
      fontSize: 2,
      cursor: 'pointer',
      boxShadow: '0 0 4px rgba(0, 0, 0, 0.125)',
      '&:hover': {
        boxShadow: '0 0 16px rgba(0, 0, 0, 0.125)',
      },
    },
    button_emphasis_blue: {
      py: 2,
      color: 'white',
      borderRadius: 12,
      bg: '#0068DD',
      fontSize: 4,
      cursor: 'pointer',
      boxShadow: '0 0 4px rgba(0, 0, 0, 0.125)',
      '&:hover': {
        boxShadow: '0 0 16px rgba(0, 0, 0, 0.125)',
      },
    },
    button_emphasis_large: {
      py: 2,
      color: 'text',
      border: 'dotted 1px lightGray',
      borderRadius: 8,
      bg: 'white',
      fontSize: 3,
      fontFamily: 'mono',
      cursor: 'pointer',
      boxShadow: '0 0 4px rgba(0, 0, 0, 0.125)',
      '&:hover': {
        boxShadow: '0 0 16px rgba(0, 0, 0, 0.125)',
      },
    },
  },
  badges: {
    badge_outline: {
      fontWeight: 'normal',
      fontFamily: 'mono',
      fontSize: 2,
      color: 'primary',
      bg: 'transparent',
      boxShadow: 'inset 0 0 0 1px',
    },
  },
  cards: {
    block: {
      py: 0,
      px: 0,
      border: '1px solid',
      borderColor: 'lightGray',
      borderRadius: 8,
      bg: 'white',
    },
    card_dotted_gray: {
      p: 1,
      border: '1px dotted',
      borderColor: 'lightGray',
      borderRadius: 12,
      bg: 'lightGray',
    },
    card_dotted_green: {
      p: 3,
      border: '2px dotted',
      borderColor: 'yellow',
      borderRadius: 8,
      bg: 'transparent',
    },
    card_payment: {
      py: 2,
      px: 3,
      border: '1px solid',
      borderColor: 'lightGray',
      borderRadius: 8,
      bg: 'white',
    },
    card_payment_form: {
      p: 3,
      my: 2,
      bg: 'lightBlue',
      boxShadow: '0 0 8px rgba(0, 0, 0, 0.125)',
      // borderRadius: 12,
      border: '1px solid lightGray',
    },
  },
  forms: {
    checkbox: {
      color: 'black',
    },
    input: {
      // PaymentBlock amount input
      fontSize: 4,
      fontWeight: 'bold',
      bg: 'white',
      borderWidth: 0,
      textAlign: 'center',
      py: 1,
      border: '1px solid lightGray',
    },
    input_standard: {
      fontFamily: 'mono',
      fontSize: 1,
      bg: 'white',
      py: 2,
      border: '1px solid lightGray',
    },
    label: {
      fontSize: 1,
    },
    label_icon_button: {
      fontSize: 0,
      fontFamily: 'mono',
      color: 'text',
      cursor: 'pointer',
    },
  },
  alerts: {
    alert_error: {
      color: 'red',
      bg: 'lightRed',
    },
  },
  text: {
    text_xs: {
      fontSize: 0,
      fontFamily: 'mono',
    },
    text_sm: {
      fontSize: 1,
      fontFamily: 'mono',
    },
    text_md_mono: {
      fontSize: 3,
      fontFamily: 'mono',
    },
  },
  styles: {
    root: {
      fontFamily: 'body',
      lineHeight: 'body',
      fontWeight: 'body',
    },
  },
};
