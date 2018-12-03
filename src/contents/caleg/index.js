import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import styles from './style';
import {IconButton} from "@material-ui/core";
import {Create, Clear} from '@material-ui/icons';

import {FirestoreDB} from '../../FirebaseApp';
import AddCalegScreen from './add';

const calegCollection = FirestoreDB.collection('caleg');

class CalegScreen extends Component{
    state = {
        dataCaleg : []
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
        let data = [];
        calegCollection.orderBy("noUrut", "asc").get().then((caleg)=>{
            caleg.forEach((doc)=>{
                data.push({
                    id:doc.id,
                    ...doc.data()
                });
            });
            if(this.mounted){
                this.setState({ dataCaleg:data});
            }
        })
        .catch(err=>{
            console.log(err)
        });
    };

    deleteData = (id) => {
        calegCollection.doc(id).delete().then(()=>{
            console.log(id," DELETED");
            this.getDataCaleg();
        }).catch(err=>{
            alert("Gagal menghapus data");
            console.log(err);
        });
    };

    render(){
        const {classes,match} = this.props;
        const mappedDataCaleg = this.state.dataCaleg.map((data,key)=>
            <tr key={key}>
                <td>{data.noUrut}</td><td>{data.nama}</td>
                <td>
                    <div className={classes.tableContentCell}>
                        <div />
                        <div>{data.partai.nama}</div>
                        <div>
                            <Link to={`${match.url}/edit/${data.id}`} style={{ textDecoration: 'none',color:'black' }}><IconButton color="inherit"><Create/></IconButton></Link>
                            <IconButton color="inherit" onClick={()=>this.deleteData(data.id)}><Clear/></IconButton>
                        </div>
                    </div>
                </td>
            </tr>
        );
        const renderDataCaleg = ({props})=>(
            <div>
                <table border="1" style={{width:'75%'}}>
                  <thead>
                    <tr>
                      <th style={{width:'10%'}}>No Urut</th><th>Nama</th><th>Partai</th>
                    </tr>
                  </thead>
                  <tbody>
                      {mappedDataCaleg}
                  </tbody>
                </table>
            </div>
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