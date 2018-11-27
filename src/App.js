import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import {Drawer,AppBar,Toolbar,List,CssBaseline,Typography,Divider,IconButton,ListItem,ListItemIcon,ListItemText,Tooltip} from '@material-ui/core';
import {Menu,ChevronLeft,ChevronRight,Add} from '@material-ui/icons';
import { BrowserRouter as Router, Route, NavLink} from 'react-router-dom';

import AppStyles from './AppStyle';
import routes from './routes';

const MenuBar = ({route}) => {
  return(
    (route.path !== "/" ? <Tooltip title={"Add "+route.title}><IconButton color="inherit"><Add/></IconButton></Tooltip>:null)
  )
}

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
    const { classes, theme} = this.props;

    const ListItemLink = ({ to,icon,title,activeOnlyWhenExact , ...rest }) => (
      <Route
        path={to}
        exact={activeOnlyWhenExact}
        children={({ match }) => (
          <NavLink to={to} {...rest}>
            <ListItem button selected={match ? true : false}>  
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={title} />
            </ListItem>
          </NavLink>
        )}
      />
    );

    const drawerContent = (
        <div>
            <div className={classes.toolbar}>
                <IconButton onClick={this.handleDrawerClose}>
                    {theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
                </IconButton>
            </div>
            <Divider />
            <List>
                {routes.map((menuItem,index) => (
                    <ListItemLink to={menuItem.path} icon={menuItem.icon} title={menuItem.title} key={index} activeOnlyWhenExact={true}/>
                ))}
            </List>
        </div>
    );
    
    const appBar = (
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
                      component={()=>(
                        <div className={classes.rootAppBar}>
                          <Typography variant="h6" color="inherit" className={classes.grow}>
                            {route.title}
                          </Typography>
                          <MenuBar route={route}/>
                        </div>
                      )}
                  />
                ))
              }
          </Toolbar>
      </AppBar>
    );

    const drawerWrapper =(
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
        {drawerContent}
      </Drawer>
    );

    return (
      <Router>
        <div className={classes.root}>
            <CssBaseline />
            {appBar}
            {drawerWrapper}
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

export default withStyles(AppStyles, { withTheme: true })(App);
