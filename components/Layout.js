import React, { useContext, useState } from 'react';
import Head from 'next/head';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  ThemeProvider,
  createTheme,
  Switch,
  Badge,
  Button,
  Menu,
  MenuItem
} from '@material-ui/core';
import useStyles from '../utils/styles';
import Link from 'next/link';
import { Store } from '../utils/Store';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const Layout = ({children }) => {
   const router = useRouter();
  const classes = useStyles();
  const {state, dispatch} = useContext(Store);
  const {darkMode, cart, userInfo} = state;
  const theme = createTheme({
    typography: {
      h1: {
        fontSize: '1.6rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
    },
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1ce8b5'
        // '#4287f5',
      },
      secondary: {
        main: '#208080',
      },
    },
  });

   const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
    const newDarkMode = !darkMode;
    Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF');
  };

  const [anchorEl, setAnchorEl] = useState(null);
  
  const profileClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };

   const profileMenuCloseHandler = (e, redirect) => {
    setAnchorEl(null);
    if (redirect) {
      router.push(redirect);
    }
  };

   const logoutClickHandler = () => {
    setAnchorEl(null);
    dispatch({ type: 'USER_LOGOUT' });
    Cookies.remove('userInfo');
    Cookies.remove('cartItems');
    Cookies.remove('shippinhAddress');
    Cookies.remove('paymentMethod');
    router.push('/');
  };

  return (
        <div>
            <Head><title>ecommerce</title></Head>
              <ThemeProvider theme={theme}>
                  <AppBar position='static' className={classes.navbar}>
                <Toolbar>
                  <Link href="/">
                    <Typography className={classes.brand}>Ecommerce</Typography>
                  </Link>

                  <div className={classes.grow}>
                  </div>
                  <div>
                    <Switch checked={darkMode} onChange={darkModeChangeHandler}></Switch>
                    <Link href="/cart">
                      {cart.cartItems.length > 0 ? <Badge color="primary" badgeContent={cart.cartItems.length}>Cart</Badge>
                     : "Cart"}
                    </Link>
                   {userInfo ? (
                <>
                  <Button
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={profileClickHandler}
                    className={classes.navbarButton}
                  >
                    {userInfo.name}
                  </Button>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={profileMenuCloseHandler}
                  >
                    <MenuItem
                      onClick={(e) => profileMenuCloseHandler(e, '/profile')}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem
                      onClick={(e) =>
                        profileMenuCloseHandler(e, '/order-history')
                      }
                    >
                      Order History
                    </MenuItem>
                    {userInfo.isAdmin && (
                      <MenuItem
                        onClick={(e) =>
                          profileMenuCloseHandler(e, '/admin/dashboard')
                        }
                      >
                        Admin Dashboard
                      </MenuItem>
                    )}
                    <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                  <Link href="/login" passHref>
                    <Typography component="span" className={classes.navbarButton}>Login</Typography>
                  </Link>
              )}
                    </div>
                </Toolbar>
            </AppBar>
             <Container className={classes.main}>{children}</Container>
            </ThemeProvider>

             <footer className={classes.footer}>
                <Typography>
                    All rights reserved
                    </Typography>
                </footer>
        </div>
    )
}


export default Layout;