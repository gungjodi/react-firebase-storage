import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import styles from './style';
import {IconButton,Grid,GridList,GridListTile} from "@material-ui/core";
import {Create, Clear} from '@material-ui/icons';

import {FirestoreDB} from '../../FirebaseApp';
import AddCalegScreen from './add';
import DataTable from './DataTable';

const calegBadungCollection = FirestoreDB.collection('dataCalegDprdBadung');
const calegBaliCollection = FirestoreDB.collection('dataCalegDprdBali');
const calegRiCollection= FirestoreDB.collection('dataCalegDprRi');


class CalegScreen extends Component{
    state = {
        dataCalegBadung : [],
        dataCalegBali : [],
        dataCalegRi : []
    };

    componentDidMount(){
        this.mounted=true;
        this.getDataCaleg();
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    componentWillReceiveProps(nextProps) {
        if(!!nextProps.location.state){
            this.getDataCaleg();
        }
    }

    getDataCaleg = () => {
        let dataBadung = [];
        calegBadungCollection.orderBy("idCaleg", "asc").get()
            .then((caleg)=>{
                caleg.forEach((doc)=>{
                    dataBadung.push({
                        id:doc.id,
                        ...doc.data()
                    });
                });
                if(this.mounted){
                    this.setState({ dataCalegBadung:dataBadung});
                }
            })
            .catch(err=>{
                console.log(err)
            });

        let dataBali = [];
        calegBaliCollection.orderBy("idCaleg", "asc").get()
            .then((caleg)=>{
                caleg.forEach((doc)=>{
                    dataBali.push({
                        id:doc.id,
                        ...doc.data()
                    });
                });
                if(this.mounted){
                    this.setState({ dataCalegBali:dataBali});
                }
            })
            .catch(err=>{
                console.log(err)
            });

        let dataRi = [];
        calegRiCollection.orderBy("idCaleg", "asc").get()
            .then((caleg)=>{
                caleg.forEach((doc)=>{
                    dataRi.push({
                        id:doc.id,
                        ...doc.data()
                    });
                });
                if(this.mounted){
                    this.setState({ dataCalegRi:dataRi});
                }
            })
            .catch(err=>{
                console.log(err)
            });
    };

    deleteData = (id) => {
        calegBadungCollection.doc(id).delete().then(()=>{
            console.log(id," DELETED");
            this.getDataCaleg();
        }).catch(err=>{
            alert("Gagal menghapus data");
            console.log(err);
        });
    };

    render(){
        const {classes,match} = this.props;

        const renderDataCaleg = ({match})=>(
            <Grid
                container
                direction="row"
                spacing={16}
            >
                <Grid item xs>
                    <GridList style={{height: window.innerHeight-120}}>
                        <DataTable match={match} data={this.state.dataCalegBadung} title="Data Caleg DPRD Badung"/>
                    </GridList>

                </Grid>
                <Grid item xs>
                    <GridList style={{height: window.innerHeight-120}}>
                        <DataTable match={match} data={this.state.dataCalegBali} title="Data Caleg DPRD Bali"/>
                    </GridList>
                </Grid>
                <Grid item xs>
                    <GridList style={{height: window.innerHeight-120}}>
                        <DataTable match={match} data={this.state.dataCalegRi} title="Data Caleg DPRD RI"/>
                    </GridList>
                </Grid>

            </Grid>
        );

        return(
            <Switch>
                <Route exact path={match.path} component={renderDataCaleg}/>
                <Route exact path={`${match.path}/:type`} component={AddCalegScreen}/>
                <Route exact path={`${match.path}/:type/:id`} component={AddCalegScreen}/>
            </Switch>
        );
    }
}
CalegScreen.propTypes = {
    classes : PropTypes.object.isRequired
};

export default withStyles(styles,{ withTheme: true })(CalegScreen);