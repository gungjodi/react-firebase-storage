import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import {Drawer,AppBar,Toolbar,List,CssBaseline,Typography,Divider,IconButton,ListItem,ListItemIcon,ListItemText,Tooltip} from '@material-ui/core';
import {Menu,ChevronLeft,ChevronRight,Add} from '@material-ui/icons';
import { Route, Switch, Link } from 'react-router-dom';

import AppStyles from './AppStyle';
import routes from '../contents/routes';

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
    const {classes,theme} = this.props;

    const MenuBar = ({title,match,location}) => 
    (
        match.url!=="/" ? 
        <Tooltip title={"Add "+title}>
          <Link to={`${match.url}/add`} style={{ textDecoration: 'none',color:'black' }}>
            <IconButton color="inherit"><Add/></IconButton>
          </Link>
        </Tooltip>:null
    );

    const ListItemLink = ({ menuItem , ...rest }) => (
      <Route
        path={menuItem.path}
        exact
        children={({ match }) => (
          <Link to={menuItem.path} {...rest}>
            <ListItem button selected={!!match}>
              <ListItemIcon>{menuItem.icon}</ListItemIcon>
              <ListItemText primary={menuItem.title} />
            </ListItem>
          </Link>
        )}
      />
    );
    
    const appBar = ({match}) => (
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
                {
                  routes.map((route,index)=>(
                    <Route 
                        key={index}
                        path={route.path}
                        exact={route.exact}
                        render={props=>(
                          <div className={classes.rootAppBar}>
                            <Typography variant="h6" color="inherit" className={classes.grow}>
                              {route.title}
                            </Typography>
                            <MenuBar title={route.title} {...props} />
                          </div>
                        )}
                    />
                  ))
                }
            </Toolbar>
        </AppBar>
    );

    const drawerWrapper = ({match})=>(
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
        <div className={classes.toolbar}>
            <IconButton onClick={this.handleDrawerClose}>
                {theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
            </IconButton>
        </div>
        <Divider />
        <List>
            {routes.map((menuItem,index) => (
                <ListItemLink menuItem={menuItem} key={index}/>
            ))}
        </List>
      </Drawer>
    );

    return (
      <div className={classes.root}>
          <CssBaseline />
          <Route component={appBar}/>
          <Route component={drawerWrapper}/>
          <main className={classes.content}>
              <div className={classes.toolbar} />
              <Switch>
                  {routes.map((route,index)=>(
                      <Route 
                          key={index}
                          path={route.path}
                          exact={route.exact}
                          component={route.component}
                      />
                  ))}
              </Switch>
          </main>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(AppStyles, { withTheme: true })(App);
