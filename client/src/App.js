import React, { Component, Fragment } from "react";
import "./assets/css/destyle.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./services/session/store";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import theme from "./services/theme/theme";
import { Main, Login, Admin } from "./pages";

const GlobalStyle = createGlobalStyle`
:root {
    --size-xxs: ${theme.size.xxs};
    --size-xs: ${theme.size.xs};
    --size-s: ${theme.size.s};
    --size-m: ${theme.size.m};
    --size-l: ${theme.size.l};
    --size-xl: ${theme.size.xl};
    --size-base: ${theme.size.base};
    --size-base-fixed: ${theme.size.base};
    --size-button: 2.5rem;


    @media (max-width: ${theme.breakpoint.tabletLandscape}) {
      --size-button: 3rem;
    } 

    @media (max-width: ${theme.breakpoint.tabletPortrait}) {
      --size-xs: ${theme.sizeMobile.xs};
      --size-s: ${theme.sizeMobile.s};
      --size-m: ${theme.sizeMobile.m};
      --size-l: ${theme.sizeMobile.l};
      --size-xl: ${theme.sizeMobile.xl};
      --size-base: ${theme.sizeMobile.base};
    } 
  }

  html, body, #root {
    height: 100%;
  }


  html {
    font-size: 16px;
    scroll-behavior: smooth;

    @media (max-width: ${theme.breakpoint.tabletPortrait}) {
      ${"" /* font-size: 13px; */}
    }

    @media (min-width: ${theme.breakpoint.tabletLandscape}) {
      font-size: 16px;
    }

    @media (min-width: ${theme.breakpoint.desktopM}) {
      font-size: 13px;
    }
    
    @media (min-width: ${theme.breakpoint.desktopL}) {
      font-size: 15px;
    }

    @media (min-width: ${theme.breakpoint.desktopXL}) {
      font-size: 16px;
    }
    
    @media (min-width: ${theme.breakpoint.desktopXXL}) {
    font-size: 21px;
    } 
    
  }

  body {
    color: ${theme.color.dark};
    font-family: ${theme.font.sansSerif};
    font-size: 16px;
    background-color: ${theme.color.light};

   @media (max-width: ${theme.breakpoint.tabletPortrait}) {
      ${"" /* font-size: 15px; */}
    }

    @media (min-width: ${theme.breakpoint.tabletLandscape}) {
      font-size: 16px;
    } 
    
    @media (min-width: ${theme.breakpoint.desktopM}) {
      font-size: 15px;
    }

    @media (min-width: ${theme.breakpoint.desktopL}) {
      font-size: 16px;
    }

    @media (min-width: ${theme.breakpoint.desktopXL}) {
      font-size: 16px;
    }
    
    @media (min-width: ${theme.breakpoint.desktopXXL}) {
      font-size: 24px;
    }
  }

  a img {outline : none;}
  img {border : 0;}
  a {outline : none; cursor: pointer;}

  #hidden {
    display: none;
  }
`;

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router>
            <Fragment>
              <GlobalStyle />

              <Switch>
                <Router path="/" exact>
                  <h1>f</h1>
                </Router>

                <Route path="/admin">
                  <Admin />
                </Route>

                <Route path="/login">
                  <Login />
                </Route>

                <Route render={() => <h1>Not found</h1>} />
              </Switch>
            </Fragment>
          </Router>
        </ThemeProvider>
      </Provider>
    );
  }
}

export default App;
