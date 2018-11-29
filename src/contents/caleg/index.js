import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import {FirestoreDB} from '../../FirebaseApp';
import AddCalegScreen from './add';

const calegCollection = FirestoreDB.collection('caleg');

class CalegScreen extends Component{
    state = {
        dataCaleg : []
    }

    componentDidMount(){
        this.mounted=true;
        this.getDataCaleg();
    }

    componentWillUnmount(){
        this.mounted = false;
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
    }

    render(){
        if(!!this.props.location.state){
            if(!!this.props.location.state.reRender){
                if(this.props.location.state.reRender){
                    this.getDataCaleg();
                }
            }
        }
        const {match} = this.props;
        const mappedDataCaleg = this.state.dataCaleg.map((data,key)=>
            <tr key={key}>
                <td>{data.noUrut}</td><td>{data.nama}</td>
            </tr>
        );
        const renderDataCaleg = ({props})=>(
            <div>
                <h2>Data Caleg</h2>
                <table border="1" style={{width:'75%'}}>
                  <thead>
                    <tr>
                      <th style={{width:'20%'}}>No Urut</th><th>Nama</th>
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
                <Route exact path={match.url} render={renderDataCaleg}/>
                <Route path={`${match.url}/add`} render={props=><AddCalegScreen {...props} index={match.url}/>}/>
            </Switch>
        );
    }
}

export {AddCalegScreen} from './add';
export default CalegScreen;