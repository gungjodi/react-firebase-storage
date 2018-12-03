import React from 'react';
import {Home,Place,AssignmentInd,AccountBalance,HowToVote} from '@material-ui/icons';

import DashboardScreen from './dashboard';
import PartaiScreen from './partai';
import CalegScreen from './caleg';
import TpsScreen from './tps';
import DapilScreen from './dapil';

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
        icon : <HowToVote />,
        path : '/dataTps',
        component :TpsScreen
    },
    {
        title : 'Data Daerah Pilihan (Dapil)',
        icon : <Place />,
        path : '/dataDapil',
        component :DapilScreen
    }
];

export default routes;