import { ThemeProvider, Styled } from 'theme-ui';
import theme from '../theme';
import '../styles.css';
import React from 'react';

const App = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={theme}>
      <Styled.root>
        <Component {...pageProps} />
      </Styled.root>
    </ThemeProvider>
  );
};
export default App;
