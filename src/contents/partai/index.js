import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import styles from './style';
import {IconButton,LinearProgress} from "@material-ui/core";
import {Create, Clear} from '@material-ui/icons';

import {FirestoreDB} from '../../FirebaseApp';
import AddPartaiScreen from './add';

const partaiCollection = FirestoreDB.collection('partai');
const calegCollection = FirestoreDB.collection('caleg');

class PartaiScreen extends Component{
    state = {
        dataArr : [],
        loading : false
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
        this.setState({loading:true});
        let data = [];
        partaiCollection.get().then((snapshot)=>{
            snapshot.forEach((doc)=>{
                data.push({
                    id:doc.id,
                    ...doc.data()
                });
            });
            if(this.mounted){
                this.setState({ dataArr:data});
                this.setState({loading:false});
            }
        })
        .catch(err=>{
            this.setState({loading:false});
            console.log(err)
        });
    };

    deleteData = (id) => {
        partaiCollection.doc(id).delete().then(()=>{
            calegCollection.where('partai.id','==',id).get().then(caleg=>{
                caleg.forEach(doc=>{
                    calegCollection.doc(doc.id).update({partai:{id:'',nama:''}})
                })
            }).catch(err=>console.log(err));
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
                <td>{key+1}</td>
                <td>
                    <div className={classes.tableContentCell}>
                        <div />
                        <div>{data.nama}</div>
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
                {
                    this.state.loading?
                        <LinearProgress/>:
                        <table border="1" style={{width:'60%'}}>
                            <thead>
                            <tr>
                                <th style={{width:'10%'}}>No</th><th>Nama Partai</th>
                            </tr>
                            </thead>
                            <tbody>
                            {mappedData}
                            </tbody>
                        </table>
                }
            </div>
        );

        return(
            <Switch> 
                <Route exact path={match.path} component={renderData}/>
                <Route exact path={`${match.path}/:type`} component={AddPartaiScreen}/>
                <Route exact path={`${match.path}/:type/:id`} component={AddPartaiScreen}/>
            </Switch>
        );
    }
}

PartaiScreen.propTypes = {
    classes : PropTypes.object.isRequired
};

export default withStyles(styles,{ withTheme: true })(PartaiScreen);