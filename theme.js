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
      fontFamily: 'mono',
      cursor: 'pointer',
      '&:hover': {
        boxShadow: '0 0 16px rgba(0, 0, 0, 0.125)',
      },
    },
    button_med: {
      px: 2,
      py: 1,
      color: 'text',
      border: 'solid 1px black',
      borderWidth: 1,
      bg: 'lightBlue',
      fontSize: 1,
      fontFamily: 'mono',
      cursor: 'pointer',
      '&:hover': {
        boxShadow: '0 0 16px rgba(0, 0, 0, 0.125)',
      },
    },
    button_emphasis: {
      py: 2,
      color: 'text',
      border: 'dotted 1px lightGray',
      borderRadius: 12,
      bg: 'white',
      fontSize: 3,
      fontFamily: 'mono',
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
      borderRadius: 8,
      bg: 'lightGray',
    },
    card_dotted_black: {
      p: 3,
      border: '1px dotted',
      borderColor: 'black',
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
      bg: 'white',
      boxShadow: '0 0 8px rgba(0, 0, 0, 0.125)',
      borderRadius: 12,
      border: '1px solid lightGray',
    },
  },
  forms: {
    checkbox: {
      color: 'black',
    },
    input: {
      // PaymentBlock amount input
      fontSize: 5,
      fontWeight: 'bold',
      bg: 'transparent',
      borderWidth: 0,
      textAlign: 'center',
      fontFamily: 'mono',
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
    input_payment_message: {
      fontFamily: 'mono',
      fontSize: 3,
      border: '1px solid lightGray',
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
