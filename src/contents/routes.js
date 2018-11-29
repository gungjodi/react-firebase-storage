import React from 'react';
import {Home,Mail,AssignmentInd,AccountBalance} from '@material-ui/icons';

import DashboardScreen from './dashboard';
import PartaiScreen from './partai';
import CalegScreen from './caleg';
import TpsScreen from './tps';

const routes = [
    {
        title : 'Dashboard',
        icon : <Home />,
        path : '/',
        exact : true,
        component:DashboardScreen,
    },
    {
        title : 'Data Partai',
        icon : <AccountBalance />,
        path : '/dataPartai',
        component : PartaiScreen,
    },
    {
        title : 'Data Caleg',
        icon : <AssignmentInd />,
        path : '/dataCaleg',
        component : CalegScreen,
    },
    {
        title : 'Data TPS',
        icon : <Mail />,
        path : '/dataTps',
        component :TpsScreen
    }
];

export default routes;