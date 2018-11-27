import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import {Drawer,AppBar,Toolbar,List,CssBaseline,Typography,Divider,IconButton,ListItem,ListItemIcon,ListItemText} from '@material-ui/core';
import {Menu,Home,ChevronLeft,ChevronRight,Inbox,Mail,AssignmentInd} from '@material-ui/icons';
 
import styles from './AppStyle';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import HomeScreen from './HomeScreen';
import CalegScreen from './CalegScreen';

const routes = [
    {
        title : 'Dashboard',
        icon : <Home />,
        path : '/',
        exact : true,
        component: ()=><HomeScreen />
    },
    {
        title : 'Data Caleg',
        icon : <AssignmentInd />,
        path : '/dataCaleg',
        component : ()=><CalegScreen />
    },
    {
        title : 'Data TPS',
        icon : <Mail />,
        path : '/dataTps',
        component : ()=><h2>Data TPS</h2>
    }
];

class App extends React.Component {
  state = {
    open: false,
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, theme } = this.props;

    const drawer = (
        <div>
            <div className={classes.toolbar}>
                <IconButton onClick={this.handleDrawerClose}>
                    {theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
                </IconButton>
            </div>
            <Divider />
            <List>
                {routes.map((menuItem,index) => (
                    <Link to={menuItem.path} key={index}>
                        <ListItem button>
                            <ListItemIcon>{menuItem.icon}</ListItemIcon>
                            <ListItemText primary={menuItem.title} />
                        </ListItem>
                    </Link>
                ))}
            </List>
        </div>
    );

    return (
      <Router>
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={classNames(classes.appBar, {
                    [classes.appBarShift]: this.state.open,
                })}
            >
                <Toolbar disableGutters={!this.state.open}>
                    <IconButton
                        color="inherit"
                        aria-label="Open drawer"
                        onClick={this.handleDrawerOpen}
                        className={classNames(classes.menuButton, {
                            [classes.hide]: this.state.open,
                        })}
                    >
                        <Menu />
                    </IconButton>
                    <Typography variant="h6" color="inherit" noWrap>
                        QC
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                className={classNames(classes.drawer, {
                    [classes.drawerOpen]: this.state.open,
                    [classes.drawerClose]: !this.state.open,
                })}
                classes={{
                    paper: classNames({
                    [classes.drawerOpen]: this.state.open,
                    [classes.drawerClose]: !this.state.open,
                    }),
                }}
                open={this.state.open}
            >
                {drawer}
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <div>
                    {routes.map((route,index)=>(
                        <Route 
                            key={index}
                            path={route.path}
                            exact={route.exact}
                            component={route.component}
                        />
                    ))}
                </div>
            </main>
        </div>
      </Router>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(App);
