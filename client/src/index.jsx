import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/styles';
import App from './App';
import defaultTheme from './defaultTheme';


ReactDOM.render(
    <ThemeProvider theme={defaultTheme}>
        <App />
    </ThemeProvider>, document.getElementById('root'),
);
