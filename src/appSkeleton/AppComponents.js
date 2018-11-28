import {Drawer,AppBar,Toolbar,List,CssBaseline,Typography,Divider,IconButton,ListItem,ListItemIcon,ListItemText,Tooltip} from '@material-ui/core';

export const ListItemLink = ({ to,icon,title,activeOnlyWhenExact , ...rest }) => (
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