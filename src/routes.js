import React from 'react';
import {Home,Mail,AssignmentInd} from '@material-ui/icons';

import HomeScreen from './HomeScreen';
import CalegScreen from './CalegScreen';
import TpsScreen from './TpsScreen';

const routes = [
    {
        title : 'Dashboard',
        icon : <Home />,
        path : '/',
        exact : true,
        component: ()=><HomeScreen />,
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
        component : ()=><TpsScreen/>
    }
];

export default routes;