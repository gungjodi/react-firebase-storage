import React from 'react';
import {Home,Mail,AssignmentInd} from '@material-ui/icons';

import DashboardScreen from './dashboard';
import CalegScreen from './caleg';
import TpsScreen from './tps';

const routes = [
    {
        title : 'Dashboard',
        icon : <Home />,
        path : '/',
        exact : true,
        component: props=><DashboardScreen {...props}/>,
    },
    {
        title : 'Data Caleg',
        icon : <AssignmentInd />,
        path : '/dataCaleg',
        component : props=><CalegScreen {...props}/>,
    },
    {
        title : 'Data TPS',
        icon : <Mail />,
        path : '/dataTps',
        component : props=><TpsScreen {...props}/>
    }
];

export default routes;