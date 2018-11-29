import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import './index.css';
import App from './appSkeleton/App';
import registerServiceWorker from './registerServiceWorker';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import deepOrange from '@material-ui/core/colors/deepOrange';

const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#fff176',
      },
      secondary: deepOrange,
    },
});

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
      <BrowserRouter><App/></BrowserRouter>
    </MuiThemeProvider>
    , 
    document.getElementById('root')
);
registerServiceWorker();
