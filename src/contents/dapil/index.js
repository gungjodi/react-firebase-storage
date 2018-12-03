import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import styles from './style';
import {IconButton} from "@material-ui/core";
import {Create, Clear} from '@material-ui/icons';

import {FirestoreDB} from '../../FirebaseApp';
import AddDapilScreen from './add';

const dapilCollection = FirestoreDB.collection('dapil');

class DapilScreen extends Component{
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
        dapilCollection.orderBy("dapil").get().then((snapshot)=>{
            snapshot.forEach((doc)=>{
                data.push({
                    id:doc.id,
                    dapil:doc.data().dapil,
                    ...doc.data().lokasi
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
        dapilCollection.doc(id).delete().then(()=>{
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
                <td>{data.dapil}</td>
                <td>
                    <div className={classes.tableContentCell}>
                        <div />
                        <div>{`${data.kabupaten.name} - ${data.kecamatan.name}`}</div>
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
                      <th style={{width:'20%'}}>Daerah Pilihan</th><th>Lokasi</th>
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
                <Route exact path={`${match.path}/:type`} component={AddDapilScreen}/>
                <Route exact path={`${match.path}/:type/:id`} component={AddDapilScreen}/>
            </Switch>
        );
    }
}

DapilScreen.propTypes = {
    classes : PropTypes.object.isRequired
};

export default withStyles(styles,{ withTheme: true })(DapilScreen);