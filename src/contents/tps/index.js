import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import styles from './style';
import {IconButton} from "@material-ui/core";
import {Create, Clear} from '@material-ui/icons';

import {FirestoreDB} from '../../FirebaseApp';
import AddTpsScreen from './add';

const tpsCollection = FirestoreDB.collection('tps');

class TpsScreen extends Component{
    state = {
        dataArr : []
    };

    componentDidMount(){
        this.mounted=true;
        this.getData();

    }

    componentWillReceiveProps(nextProps) {
        if(!!nextProps.location.state){
            this.getData();
        }
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    getData = () => {
        let data = [];
        tpsCollection.get().then((snapshot)=>{
            snapshot.forEach((doc)=>{
                data.push({
                    id:doc.id,
                    ...doc.data()
                });
            });
            if(this.mounted){
                this.setState({ dataArr:data});
            }
        })
        .catch(err=>{
            console.log(err)
        });
    };

    deleteData = (id) => {
        tpsCollection.doc(id).delete().then(()=>{
            console.log(id," DELETED");
            this.getData();
        }).catch(err=>{
           alert("Gagal menghapus data");
           console.log(err);
        });
    };

    render(){
        const {classes} = this.props;
        const {match} = this.props;
        const mappedData = this.state.dataArr.map((data,key)=>
            <tr key={key}>
                <td>{data.nomor}</td>
                <td>
                    <div className={classes.tableContentCell}>
                        <div />
                        <div>{`DAPIL ${data.dapil.dapil} - ${data.dapil.lokasi.kabupaten.name} - ${data.dapil.lokasi.kecamatan.name} - ${data.dapil.lokasi.kelurahan.name}`}</div>
                        <div>
                            <Link to={`${match.url}/edit/${data.id}`} style={{ textDecoration: 'none',color:'black' }}><IconButton color="inherit"><Create/></IconButton></Link>
                            <IconButton color="inherit" onClick={()=>this.deleteData(data.id)}><Clear/></IconButton>
                        </div>
                    </div>
                </td>
            </tr>
        );
        const renderData = ({props})=>(
            <div>
                <table border="1" style={{width:'60%'}}>
                  <thead>
                    <tr>
                      <th style={{width:'10%'}}>No TPS</th><th>Lokasi</th>
                    </tr>
                  </thead>
                  <tbody>
                      {mappedData}
                  </tbody>
                </table>
            </div>
        );

        return(
            <Switch> 
                <Route exact path={match.path} component={renderData}/>
                <Route exact path={`${match.path}/:type`} component={AddTpsScreen}/>
                <Route exact path={`${match.path}/:type/:id`} component={AddTpsScreen}/>
            </Switch>
        );
    }
}

TpsScreen.propTypes = {
    classes : PropTypes.object.isRequired
};

export default withStyles(styles,{ withTheme: true })(TpsScreen);