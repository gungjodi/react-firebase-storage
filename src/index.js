import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import App from './appSkeleton/App';
import registerServiceWorker from './registerServiceWorker';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import deepOrange from '@material-ui/core/colors/deepOrange';
import {FirebaseContextProvider} from './FirebaseContext';

const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#fff176',
      },
      secondary: deepOrange,
    },
    typography: {
        useNextVariants: true,
    },
    overrides:{
        MuiGridList:{
            root:{
                display:''
            }
        }
    }
});

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
          <FirebaseContextProvider>
              <App/>
          </FirebaseContextProvider>
      </BrowserRouter>
    </MuiThemeProvider>
    , 
    document.getElementById('root')
);
registerServiceWorker();
